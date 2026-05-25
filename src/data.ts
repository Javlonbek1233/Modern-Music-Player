import { Track, Artist, Playlist } from './types';

export const TRACKS: Track[] = [
  {
    id: 't1',
    title: 'Neon Horizon',
    artist: 'Vector Core',
    artistId: 'a2',
    album: 'Fading Outlines',
    duration: 372, // 6:12
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=400&auto=format&fit=crop',
    genre: 'Synthwave',
    plays: 145203
  },
  {
    id: 't2',
    title: 'Golden Hour Wind',
    artist: 'Aura Whisper',
    artistId: 'a3',
    album: 'Serene Sunday',
    duration: 423, // 7:03
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop',
    genre: 'Lofi Chill',
    plays: 382901
  },
  {
    id: 't3',
    title: 'Cosmic Drift',
    artist: 'Luna Eclipse',
    artistId: 'a1',
    album: 'Nebula Sounds',
    duration: 302, // 5:02
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=400&auto=format&fit=crop',
    genre: 'Ambient',
    plays: 91402
  },
  {
    id: 't4',
    title: 'Cyberpunk Awakening',
    artist: 'Vector Core',
    artistId: 'a2',
    album: 'Fading Outlines',
    duration: 318, // 5:18
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop',
    genre: 'Cyber-Beats',
    plays: 283100
  },
  {
    id: 't5',
    title: 'Vaporwave Echoes',
    artist: 'Echo Drift',
    artistId: 'a4',
    album: 'Retro-Holograms',
    duration: 412, // 6:52
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
    genre: 'Vaporwave',
    plays: 184510
  },
  {
    id: 't6',
    title: 'Deep Sea Current',
    artist: 'Soma Cloud',
    artistId: 'a5',
    album: 'Oceanic Submarine',
    duration: 362, // 6:02
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400&auto=format&fit=crop',
    genre: 'Deep Chill',
    plays: 121840
  },
  // Adding synthesis mode tracks so users can play synthesizers locally!
  {
    id: 't7',
    title: '[Synth Engine] Ambient Pad',
    artist: 'Luna Eclipse',
    artistId: 'a1',
    album: 'Live Generative Sound',
    duration: 9999, // infinite
    src: 'synth:ambient',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop',
    genre: 'Generative Ambient',
    plays: 777777,
  },
  {
    id: 't8',
    title: '[Synth Engine] Lofi Arpeggiator',
    artist: 'Aura Whisper',
    artistId: 'a3',
    album: 'Live Generative Sound',
    duration: 9999, // infinite
    src: 'synth:lofi',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop',
    genre: 'Generative Lofi',
    plays: 888888,
  }
];

export const ARTISTS: Artist[] = [
  {
    id: 'a1',
    name: 'Luna Eclipse',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    bio: 'Luna Eclipse crafts multi-layered space soundscapes that fuse planetary acoustics with lush synthesizers.',
    followers: 43210,
    popularTracks: ['t3', 't7'],
    albums: ['Nebula Sounds', 'Live Generative Sound'],
    isFollowed: false
  },
  {
    id: 'a2',
    name: 'Vector Core',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Vector Core brings back retro neon dreams with heavy analog synths, pulsating electric basslines, and digital driving rhythms.',
    followers: 92450,
    popularTracks: ['t1', 't4'],
    albums: ['Fading Outlines'],
    isFollowed: true
  },
  {
    id: 'a3',
    name: 'Aura Whisper',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    bio: 'The queen of bedroom lofi piano. Combining smooth rain sounds, filtered cassettes, and deep calming jazz progressions.',
    followers: 125300,
    popularTracks: ['t2', 't8'],
    albums: ['Serene Sunday', 'Live Generative Sound'],
    isFollowed: false
  },
  {
    id: 'a4',
    name: 'Echo Drift',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    bio: 'Pioneering custom modular synthesize tracks, blending glitch glitches, ambient loops, and nostalgic tape delays.',
    followers: 34102,
    popularTracks: ['t5'],
    albums: ['Retro-Holograms'],
    isFollowed: false
  },
  {
    id: 'a5',
    name: 'Soma Cloud',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop',
    bio: 'Deep marine chords, coastal melodies, and sub-aquatic ambient structures optimized for diving and focusing.',
    followers: 51042,
    popularTracks: ['t6'],
    albums: ['Oceanic Submarine'],
    isFollowed: false
  }
];

export const PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Late Night Focus',
    description: 'Perfect synth and ambient background textures to keep your focus sharp and your mind calm.',
    coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=400&auto=format&fit=crop',
    tracks: ['t1', 't2', 't3', 't6'],
    isCustom: false
  },
  {
    id: 'p2',
    name: 'Generative Synth Vibes',
    description: 'Dynamic procedurally synthesized compositions streaming directly from the web audio synth engine.',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop',
    tracks: ['t7', 't8'],
    isCustom: false
  },
  {
    id: 'p3',
    name: 'Retro Revival Drive',
    description: 'High octane aesthetic bass lines and computer chip arpeggios for cybernetic visual trips.',
    coverUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=400&auto=format&fit=crop',
    tracks: ['t1', 't4', 't5'],
    isCustom: false
  }
];

export const INITIAL_USER_PROFILE = {
  name: 'Alex Mercer',
  avatar: '🪐',
  email: 'alex.mercer@studiostream.io',
  accentColor: '#3b82f6', // Tailwind blue-500
  premium: true,
  joinedDate: '2026-01-20',
  stats: {
    listeningTime: 1240, // minutes
    topGenre: 'Lofi Chill',
    totalTracksPlayed: 84
  }
};
