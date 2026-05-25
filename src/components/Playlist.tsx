import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAudio } from '../context/AudioContext';
import { ListMusic, Play, Trash2, ShieldAlert, Sparkles, Disc, Music } from 'lucide-react';
import { TRACKS } from '../data';
import { Track } from '../types';

export const Playlist: React.FC = () => {
  const { 
    playlists, playTrack, currentTrack, isPlaying, removeFromPlaylist, userProfile 
  } = useAudio();

  const [selectedPlId, setSelectedPlId] = useState<string>(playlists[0]?.id || '');

  // Active Playlist
  const activePl = playlists.find(p => p.id === selectedPlId) || playlists[0];

  if (!activePl) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono text-xs">
        No active playlists created. Go to the Library to configure one.
      </div>
    );
  }

  // Get matching Track objects
  const playlistTracks = activePl.tracks
    .map(tid => TRACKS.find(t => t.id === tid))
    .filter((t): t is Track => !!t);

  const handlePlayPlaylist = () => {
    if (playlistTracks.length > 0) {
      playTrack(playlistTracks[0], playlistTracks);
    }
  };

  const formatDuration = (secs: number) => {
    if (secs === 9999) return '∞';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="p-4 md:p-8 flex flex-col lg:flex-row gap-8"
    >
      {/* 1. Left Playlist Selector Segment Shelf */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-3">
        <h3 className="text-xs font-mono font-bold tracking-widest text-[#555555] uppercase pb-2 border-b border-white/5">
          Your Channels ({playlists.length})
        </h3>
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide select-none">
          {playlists.map((pl) => {
            const isActive = pl.id === selectedPlId;
            return (
              <button
                key={pl.id}
                onClick={() => setSelectedPlId(pl.id)}
                className={`flex gap-3 items-center px-4 py-3 rounded-2xl w-full text-left transition-all shrink-0 lg:shrink cursor-pointer border ${
                  isActive 
                    ? 'text-white shadow-md font-bold' 
                    : 'text-slate-400 bg-white/5 border-transparent hover:text-white hover:bg-white/10'
                }`}
                style={isActive ? { 
                  backgroundColor: `${userProfile.accentColor}10`,
                  borderColor: `${userProfile.accentColor}30`
                } : undefined}
                title={pl.name}
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow border border-white/5">
                  <img src={pl.coverUrl} alt={pl.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs truncate">{pl.name}</h4>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">{pl.tracks.length} tracks</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Right Playlist Contents details view */}
      <div className="flex-1 bg-white/5 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
        
        {/* Ambient Gradient glow matching color accent of selected profile */}
        <div 
          className="absolute right-0 top-0 w-80 h-80 rounded-full blur-[100px] opacity-10 -z-10 pointer-events-none"
          style={{ backgroundColor: userProfile.accentColor }}
        />

        {/* Header Header Info Panel card */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center text-center sm:text-left">
          <div className="w-36 h-36 rounded-3xl overflow-hidden shrink-0 border border-white/5 shadow-2xl">
            <img 
              src={activePl.coverUrl} 
              alt={activePl.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-3 flex-1 min-w-0">
            <span className="text-[10px] font-mono bg-[#050505]/40 px-2.5 py-1 rounded-full border border-white/5 tracking-widest text-[#888888] uppercase">
              {activePl.isCustom ? 'Custom Playlist' : 'Curated Stream'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{activePl.name}</h2>
            
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-xl">
              {activePl.description || "Stream standard lo-fi tracks and procedural synthesizer arpeggiators directly."}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
              <button
                onClick={handlePlayPlaylist}
                disabled={playlistTracks.length === 0}
                className="py-3 px-5.5 rounded-full text-slate-950 font-bold text-xs tracking-wider flex items-center gap-2.5 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-transform shadow-lg"
                style={{ backgroundColor: userProfile.accentColor }}
              >
                <Play className="w-4 h-4 fill-slate-950" />
                PLAY STREAMLIST
              </button>
              <span className="text-xs font-mono text-slate-500">
                Total duration: {playlistTracks.reduce((acc, t) => acc + (t.duration === 9999 ? 0 : t.duration), 0) / 60 ? `${Math.floor(playlistTracks.reduce((acc, t) => acc + (t.duration === 9999 ? 0 : t.duration), 0) / 60)} mins` : 'Infinite stream'}
              </span>
            </div>
          </div>
        </div>

        {/* Tracks listed segment */}
        <div className="space-y-1.5 pt-4 border-t border-white/5">
          <h4 className="text-[11px] font-mono font-bold tracking-widest text-[#555555] uppercase pb-2 mb-2">
            Songs Index
          </h4>

          {playlistTracks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0a0a0a]/40 border border-white/5 max-w-md mx-auto space-y-4">
              <ShieldAlert className="w-8 h-8 mx-auto text-[#444444]" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400">This channel list is empty</p>
                <p className="text-[10px] text-slate-500 font-mono">Head back to the Library and click the 'More Options' context menu to add soundwaves.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {playlistTracks.map((track, i) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div 
                    key={track.id}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:bg-white/5 hover:border-white/5 group transition-all relative"
                    style={isCurrent ? { backgroundColor: 'rgba(255, 255, 255, 0.03)' } : undefined}
                  >
                    <div 
                      onClick={() => playTrack(track, playlistTracks)}
                      className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="text-xs font-mono text-slate-600 w-5.5 text-center group-hover:text-slate-400">
                        {isCurrent && isPlaying ? (
                          <div className="flex justify-center items-end gap-0.5 h-3 w-4 mx-auto">
                            <span className="w-0.5 bg-indigo-400 animate-bounce h-2" style={{ animationDelay: '0s', animationDuration: '0.6s' }} />
                            <span className="w-0.5 bg-indigo-400 animate-bounce h-3" style={{ animationDelay: '0.15s', animationDuration: '0.4s' }} />
                            <span className="w-0.5 bg-indigo-400 animate-bounce h-1.5" style={{ animationDelay: '0.3s', animationDuration: '0.5s' }} />
                          </div>
                        ) : i + 1}
                      </span>
                      <img 
                        src={track.coverUrl} 
                        alt={track.title} 
                        className="w-9 h-9 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h5 className={`text-xs font-semibold truncate ${isCurrent ? 'text-indigo-400' : 'text-slate-200 group-hover:text-white'}`}>
                          {track.title}
                        </h5>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {track.src.startsWith('synth:') && (
                        <div className="flex items-center gap-1 scale-90 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/15 rounded text-[9px] font-mono text-indigo-400">
                          <Sparkles className="w-3 h-3" />
                          SYNTH
                        </div>
                      )}
                      
                      <span className="text-[11px] font-mono text-slate-500">
                        {formatDuration(track.duration)}
                      </span>

                      {/* Custom playlist delete capability */}
                      {activePl.isCustom ? (
                        <button 
                          onClick={() => removeFromPlaylist(activePl.id, track.id)}
                          className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Remove Track"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        // Hide play overlay trigger
                        <div 
                          onClick={() => playTrack(track, playlistTracks)}
                          className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/5 cursor-pointer shadow"
                        >
                          <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
