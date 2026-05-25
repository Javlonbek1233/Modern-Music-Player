export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  duration: number; // in seconds
  src: string;      // mp3 source URL or "synth:ambient", "synth:lofi", "synth:cyber"
  coverUrl: string;
  genre: string;
  plays: number;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  popularTracks: string[]; // Track IDs
  albums: string[];        // Album names
  isFollowed: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: string[]; // Track IDs
  isCustom: boolean;
}

export interface HistoryItem {
  trackId: string;
  playedAt: string; // ISO String
}

export interface UserStats {
  listeningTime: number; // in minutes
  topGenre: string;
  totalTracksPlayed: number;
}

export interface UserProfile {
  name: string;
  avatar: string; // image url or emoji
  email: string;
  accentColor: string; // Hex or tailwind class
  premium: boolean;
  joinedDate: string;
  stats: UserStats;
}
