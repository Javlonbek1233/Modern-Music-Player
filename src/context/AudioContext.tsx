import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, Artist, Playlist, UserProfile, HistoryItem } from '../types';
import { TRACKS, ARTISTS, PLAYLISTS, INITIAL_USER_PROFILE } from '../data';

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  isShuffle: boolean;
  isRepeat: 'none' | 'all' | 'one';
  playlists: Playlist[];
  artists: Artist[];
  userProfile: UserProfile;
  currentPlaybackTime: number;
  seek: (seconds: number) => void;
  playTrack: (track: Track, customQueue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (vol: number) => void;
  setIsMuted: (muted: boolean) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToPlaylist: (playlistId: string, trackId: string) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  createPlaylist: (name: string, description: string) => string;
  deletePlaylist: (playlistId: string) => void;
  toggleFollowArtist: (artistId: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  analyzerValues: number[]; // real or simulated synthesizer frequencies for visualizer
  isSynthPlaying: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or Defaults
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const cached = localStorage.getItem('sonic_playlists');
    return cached ? JSON.parse(cached) : PLAYLISTS;
  });

  const [artists, setArtists] = useState<Artist[]>(() => {
    const cached = localStorage.getItem('sonic_artists');
    return cached ? JSON.parse(cached) : ARTISTS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('sonic_user_profile');
    return cached ? JSON.parse(cached) : INITIAL_USER_PROFILE;
  });

  // Track state
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>(TRACKS);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMutedState] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState<'none' | 'all' | 'one'>('none');
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);

  // Frequency array for canvas animation
  const [analyzerValues, setAnalyzerValues] = useState<number[]>(new Array(64).fill(0));

  // Native Audio references
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Web Audio Synth Engine Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<AudioNode[]>([]);
  const synthIntervalRef = useRef<any>(null);

  // Sync playlists, artists, profile to localStorage
  useEffect(() => {
    localStorage.setItem('sonic_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('sonic_artists', JSON.stringify(artists));
  }, [artists]);

  useEffect(() => {
    localStorage.setItem('sonic_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Handle HTML Audio elements
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Update volume and mute on HTML audio elements
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Clean synthesizers on unmount
  useEffect(() => {
    return () => {
      stopSynthesizer();
    };
  }, []);

  // Visualizer Frame Updater Loop
  useEffect(() => {
    let animationFrameId: number;

    const updateVisualizer = () => {
      if (isPlaying) {
        setAnalyzerValues((prev) => {
          const next = [...prev];
          // Dynamically compute wave frequencies
          for (let i = 0; i < next.length; i++) {
            let target = 0;
            if (isSynthPlaying) {
              // Pulse synthesizer speeds
              const cycleSpeed = Date.now() * 0.003;
              target = Math.abs(Math.sin(cycleSpeed + i * 0.15)) * 140;
              target += Math.cos(cycleSpeed * 1.5 + i * 0.45) * 40;
              target = Math.max(15, target);
            } else {
              // Real standard audio simulator values when playing
              const wavePulse = Date.now() * 0.002;
              target = Math.abs(Math.sin(wavePulse + i * 0.25)) * 110;
              target += Math.sin(wavePulse * 3.3 + i * 0.6) * 35;
              // Fade down high frequencies like a real filter
              const damping = Math.max(0.1, 1 - (i / next.length) * 0.7);
              target *= damping;
              target = Math.max(10, target);
            }

            // Smoothing filter
            next[i] = next[i] + (target - next[i]) * 0.22;
          }
          return next;
        });
      } else {
        // Slow decay visual values off-play
        setAnalyzerValues((prev) => {
          const next = prev.map((v) => Math.max(0, v * 0.82));
          return next.every(v => v < 0.1) ? new Array(64).fill(0) : next;
        });
      }
      animationFrameId = requestAnimationFrame(updateVisualizer);
    };

    animationFrameId = requestAnimationFrame(updateVisualizer);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, isSynthPlaying]);

  // Initialize Web Audio Context context lazily
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }
    // Resume if suspended (browser security restriction state autofix)
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Web Audio Synth implementation
  const playSynthesizer = (type: 'ambient' | 'lofi') => {
    stopSynthesizer();
    const ctx = getAudioContext();
    if (!ctx) return;

    setIsSynthPlaying(true);
    setDuration(9999); // Infinite stream representation

    // Custom Master low-pass filter
    const masterFilter = ctx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(type === 'ambient' ? 450 : 800, ctx.currentTime);
    masterFilter.Q.setValueAtTime(1.5, ctx.currentTime);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.25, ctx.currentTime);

    masterFilter.connect(masterGain);
    masterGain.connect(ctx.destination);
    synthNodesRef.current.push(masterFilter, masterGain);

    if (type === 'ambient') {
      // 1. Long deep chord backing pads
      const lowNotes = [65.41, 98.00, 130.81, 196.00]; // C2, G2, C3, G3
      lowNotes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Warm volume swelling LFO style
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime);

        osc.connect(gainNode);
        gainNode.connect(masterFilter);
        osc.start();

        synthNodesRef.current.push(osc, gainNode);
      });

      // 2. High wandering sparkling pentatonic crystal notes interval timer
      const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C4 -> E5
      let step = 0;
      synthIntervalRef.current = setInterval(() => {
        if (ctx.state === 'suspended') return;
        step++;
        
        // Randomly pick active beat trigger
        if (Math.random() > 0.3) {
          const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(freq, ctx.currentTime);
          
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.8);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

          oscNode.connect(gainNode);
          gainNode.connect(masterFilter);
          oscNode.start();
          
          oscNode.stop(ctx.currentTime + 4.0);
        }
      }, 1500);

    } else {
      // LOFI synthetic beat loop
      let index = 0;
      const chords = [
        [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
        [146.83, 174.61, 220.00, 261.63]  // Dm7 (D3, F3, A3, C4)
      ];

      synthIntervalRef.current = setInterval(() => {
        if (ctx.state === 'suspended') return;
        const chordIndex = Math.floor(index / 8) % chords.length;
        const currentChord = chords[chordIndex];

        // Soft filtered analog sub beat kicks every 4 beats
        if (index % 4 === 0) {
          const kickOsc = ctx.createOscillator();
          const kickGain = ctx.createGain();
          kickOsc.type = 'sine';
          kickOsc.frequency.setValueAtTime(120, ctx.currentTime);
          kickOsc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.15);
          
          kickGain.gain.setValueAtTime(0.3, ctx.currentTime);
          kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

          kickOsc.connect(kickGain);
          kickGain.connect(masterGain);
          kickOsc.start();
          kickOsc.stop(ctx.currentTime + 0.35);
        }

        // Soft white noise synth snare on index 2 and 6
        if (index % 4 === 2) {
          const snareOsc = ctx.createOscillator();
          const snareGain = ctx.createGain();
          snareOsc.type = 'triangle';
          snareOsc.frequency.setValueAtTime(220, ctx.currentTime);
          
          snareGain.gain.setValueAtTime(0.1, ctx.currentTime);
          snareGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

          snareOsc.connect(snareGain);
          snareGain.connect(masterGain);
          snareOsc.start();
          snareOsc.stop(ctx.currentTime + 0.15);
        }

        // Trigger lofi arpeggiator notes
        const activeNote = currentChord[index % currentChord.length];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(activeNote, ctx.currentTime);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

        osc.connect(gain);
        gain.connect(masterFilter);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);

        index++;
      }, 350);
    }
  };

  const stopSynthesizer = () => {
    setIsSynthPlaying(false);
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    // Stop all oscillators
    synthNodesRef.current.forEach((n: any) => {
      try {
        if (typeof n.stop === 'function') n.stop();
        if (typeof n.disconnect === 'function') n.disconnect();
      } catch (err) {}
    });
    synthNodesRef.current = [];
  };

  // Play controls
  const playTrack = (track: Track, customQueue?: Track[]) => {
    // Stop any physical or synthesized playing nodes
    stopSynthesizer();
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Set playing queue if specified
    if (customQueue && customQueue.length > 0) {
      setQueue(customQueue);
    }

    setCurrentTrack(track);
    setProgress(0);

    if (track.src.startsWith('synth:')) {
      const type = track.src.split(':')[1] as 'ambient' | 'lofi';
      playSynthesizer(type);
      setIsPlaying(true);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.src;
        audioRef.current.load();
        
        // Solve browser user interaction play block
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.warn('Audio play prevented', error);
              setIsPlaying(false);
            });
        }
      }
    }

    // Add play log to profiles
    setUserProfile((prevProfile) => {
      const playedCount = prevProfile.stats.totalTracksPlayed + 1;
      const totalTime = prevProfile.stats.listeningTime + Math.floor((track.duration > 300 ? 5 : 3));
      return {
        ...prevProfile,
        stats: {
          ...prevProfile.stats,
          totalTracksPlayed: playedCount,
          listeningTime: totalTime
        }
      };
    });
  };

  const togglePlay = () => {
    if (!currentTrack) {
      // Play first track of queue if empty
      if (queue.length > 0) {
        playTrack(queue[0]);
      }
      return;
    }

    if (isPlaying) {
      if (isSynthPlaying) {
        stopSynthesizer();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (currentTrack.src.startsWith('synth:')) {
        const type = currentTrack.src.split(':')[1] as 'ambient' | 'lofi';
        playSynthesizer(type);
      } else if (audioRef.current) {
        audioRef.current.play().catch(err => console.error(err));
      }
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) return;
    
    // Repeat behavior overrides next track if set to repeating 'one'
    if (isRepeat === 'one' && currentTrack) {
      playTrack(currentTrack);
      return;
    }

    const currentIndex = currentTrack ? queue.findIndex((t) => t.id === currentTrack.id) : -1;
    let nextIndex = 0;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (isRepeat === 'all') {
          nextIndex = 0;
        } else {
          // Finished playlist, end stream
          setIsPlaying(false);
          setProgress(0);
          return;
        }
      }
    }

    playTrack(queue[nextIndex]);
  };

  const prevTrack = () => {
    if (queue.length === 0) return;

    const currentIndex = currentTrack ? queue.findIndex((t) => t.id === currentTrack.id) : -1;
    let prevIndex = queue.length - 1;

    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        if (isRepeat === 'all') {
          prevIndex = queue.length - 1;
        } else {
          prevIndex = 0; // Stick to starting song
        }
      }
    }

    playTrack(queue[prevIndex]);
  };

  const seek = (seconds: number) => {
    if (isSynthPlaying) return; // Infinite synthesizers cannot seek
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setProgress(seconds);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    // Update active synthesizer volumes
    if (isSynthPlaying && audioCtxRef.current) {
      stopSynthesizer();
      const type = currentTrack?.src.split(':')[1] as 'ambient' | 'lofi';
      playSynthesizer(type);
    }
  };

  const setIsMuted = (muted: boolean) => {
    setIsMutedState(muted);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    setIsRepeat((prev) => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  };

  // Playlist handlers
  const addToPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((pl) => {
        if (pl.id === playlistId && !pl.tracks.includes(trackId)) {
          return { ...pl, tracks: [...pl.tracks, trackId] };
        }
        return pl;
      })
    );
  };

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, tracks: pl.tracks.filter((tid) => tid !== trackId) };
        }
        return pl;
      })
    );
  };

  const createPlaylist = (name: string, description: string) => {
    const id = 'custom_' + Date.now();
    const newPl: Playlist = {
      id,
      name,
      description,
      coverUrl: 'https://images.unsplash.com/photo-1487180142328-054b783fc471?q=80&w=400&auto=format&fit=crop',
      tracks: [],
      isCustom: true
    };
    setPlaylists((prev) => [...prev, newPl]);
    return id;
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
  };

  // Artist handlers
  const toggleFollowArtist = (artistId: string) => {
    setArtists((prevArtists) =>
      prevArtists.map((artist) => {
        if (artist.id === artistId) {
          const updatedFollow = !artist.isFollowed;
          // Dynamically scale followers
          return {
            ...artist,
            isFollowed: updatedFollow,
            followers: artist.followers + (updatedFollow ? 1 : -1)
          };
        }
        return artist;
      })
    );
  };

  // Profile update handler
  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTrack,
        queue,
        volume,
        isMuted,
        progress,
        duration,
        isShuffle,
        isRepeat,
        playlists,
        artists,
        userProfile,
        currentPlaybackTime: progress,
        seek,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        setVolume,
        setIsMuted,
        toggleShuffle,
        toggleRepeat,
        addToPlaylist,
        removeFromPlaylist,
        createPlaylist,
        deletePlaylist,
        toggleFollowArtist,
        updateProfile,
        analyzerValues,
        isSynthPlaying
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
