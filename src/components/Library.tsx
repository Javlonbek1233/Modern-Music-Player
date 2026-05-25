import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Search, ArrowUpDown, Plus, MoreVertical, 
  Trash2, ListMusic, Headset, Volume2, Sparkles, Folder 
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { TRACKS } from '../data';
import { Track } from '../types';

export const Library: React.FC = () => {
  const { 
    playTrack, currentTrack, isPlaying, playlists, 
    addToPlaylist, removeFromPlaylist, createPlaylist, 
    deletePlaylist, userProfile 
  } = useAudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tracks' | 'albums' | 'playlists'>('tracks');
  const [sortOption, setSortOption] = useState<'title' | 'plays' | 'duration'>('title');
  const [selectedTrackForMenu, setSelectedTrackForMenu] = useState<string | null>(null);

  // Filter and Search Tracks
  const filteredTracks = TRACKS.filter(track => {
    const matchSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  // Sort Tracks
  const sortedTracks = [...filteredTracks].sort((a, b) => {
    if (sortOption === 'title') return a.title.localeCompare(b.title);
    if (sortOption === 'plays') return b.plays - a.plays;
    return b.duration - a.duration;
  });

  // Gather unique albums
  const uniqueAlbums = Array.from(new Set(TRACKS.map(t => JSON.stringify({ name: t.album, artist: t.artist, cover: t.coverUrl }))))
    .map(str => JSON.parse(str));

  // Custom Form handler for new playlist
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const handleCreatePlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    createPlaylist(newPlaylistName, newPlaylistDesc);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setIsCreatingPlaylist(false);
  };

  const handleAddToPlaylistClick = (playlistId: string, trackId: string) => {
    addToPlaylist(playlistId, trackId);
    setSelectedTrackForMenu(null);
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
      className="p-4 md:p-8 space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            YOUR DIGITAL LIBRARY
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">Manage tracks, custom albums, and playlists</p>
        </div>

        {/* Action button to create playlist */}
        <button
          onClick={() => setIsCreatingPlaylist(true)}
          className="py-2.5 px-4.5 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center gap-2 border hover:bg-slate-900 transition-colors cursor-pointer text-slate-300 hover:text-white"
          style={{ borderColor: `${userProfile.accentColor}30` }}
        >
          <Plus className="w-4 h-4" style={{ color: userProfile.accentColor }} />
          CREATE PLAYLIST
        </button>
      </div>

      {/* TABS segmented navigation & Sorting controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
        <div className="flex gap-1.5 bg-[#0a0a0a] p-1.5 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('tracks')}
            className={`py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'tracks' ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Tracks
          </button>
          <button 
            onClick={() => setActiveTab('albums')}
            className={`py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'albums' ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Albums
          </button>
          <button 
            onClick={() => setActiveTab('playlists')}
            className={`py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'playlists' ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Playlists ({playlists.length})
          </button>
        </div>

        {/* Global Keyword search */}
        <div className="flex items-center gap-2">
          {activeTab === 'tracks' && (
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search songs, artists..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#050505] border border-white/5 rounded-xl text-xs text-slate-200 outline-none focus:border-white/10 transition-all w-full sm:w-56"
              />
            </div>
          )}

          {activeTab === 'tracks' && (
            <div className="flex items-center gap-1.5 bg-[#050505] border border-white/5 rounded-xl px-2.5 py-1.5 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select 
                value={sortOption} 
                onChange={(e: any) => setSortOption(e.target.value)}
                className="bg-transparent outline-none text-[11px] font-mono font-medium text-slate-300 cursor-pointer"
              >
                <option value="title">Title A-Z</option>
                <option value="plays">Most Played</option>
                <option value="duration">Length</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: ALL TRACKS TABLE-LIKE LAYOUT */}
      {activeTab === 'tracks' && (
        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
          {sortedTracks.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs font-mono">
              No tracks matched search criteria. Try another filter.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {/* Table header */}
              <div className="hidden sm:flex items-center justify-between px-6 py-3 text-[10px] font-mono tracking-widest text-white/40 uppercase">
                <div className="flex items-center gap-4.5 min-w-0 flex-1">
                  <span className="w-6 text-center">#</span>
                  <span>TRACK DETAILS</span>
                </div>
                <div className="flex items-center gap-8 shrink-0 w-80 justify-end pr-10 border-none">
                  <span>GENRE</span>
                  <span>PLAYS</span>
                  <span>DURATION</span>
                </div>
              </div>

              {sortedTracks.map((track, i) => {
                const isCurrent = currentTrack?.id === track.id;
                const menuOpen = selectedTrackForMenu === track.id;

                return (
                  <div 
                    key={track.id}
                    className={`w-full flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-white/[0.04] group transition-colors relative ${
                      isCurrent ? 'bg-white/[0.03]' : ''
                    }`}
                  >
                    {/* Details Column */}
                    <div 
                      onClick={() => playTrack(track, sortedTracks)}
                      className="flex items-center gap-4.5 min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="text-xs font-mono text-slate-600 w-6 group-hover:text-slate-400 text-center">
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
                        className="w-10 h-10 rounded-xl object-cover shadow border border-white/5"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className={`text-xs sm:text-sm font-semibold truncate ${isCurrent ? 'text-indigo-400' : 'text-slate-200 group-hover:text-white'}`}>
                          {track.title}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-white/40 truncate mt-0.5">{track.artist}</p>
                      </div>
                    </div>

                    {/* Numeric Columns */}
                    <div className="flex items-center gap-4 sm:gap-8 shrink-0 w-auto sm:w-80 justify-end pr-3 sm:pr-10">
                      <span className="hidden sm:inline text-xs text-slate-400 font-mono bg-white/5 px-2.5 py-0.5 rounded border border-white/10 uppercase">
                        {track.genre}
                      </span>
                      <span className="hidden sm:inline text-xs font-mono text-slate-500 w-20 text-right">
                        {track.plays.toLocaleString()}
                      </span>
                      <span className="text-xs font-mono text-slate-500 w-12 text-right">
                        {formatDuration(track.duration)}
                      </span>

                      {/* Add context options action button */}
                      <div className="relative">
                        <button 
                          onClick={() => setSelectedTrackForMenu(menuOpen ? null : track.id)}
                          className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                          {menuOpen && (
                            <>
                              {/* Page masking overlay for menu dismissal */}
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setSelectedTrackForMenu(null)}
                              />
                              
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                className="absolute right-0 mt-2 w-52 bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-2xl p-2.5 z-50 overflow-hidden"
                              >
                                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest px-2.5 pb-2 border-b border-white/5 mb-1.5">
                                  Playlist Options
                                </p>
                                
                                <div className="max-h-36 overflow-y-auto pr-1 flex flex-col gap-0.5">
                                  {playlists.map((pl) => {
                                    const includesTrack = pl.tracks.includes(track.id);
                                    return (
                                      <button
                                        key={pl.id}
                                        onClick={() => {
                                          if (includesTrack) {
                                            removeFromPlaylist(pl.id, track.id);
                                          } else {
                                            handleAddToPlaylistClick(pl.id, track.id);
                                          }
                                        }}
                                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                                          includesTrack 
                                            ? 'text-red-400 hover:bg-red-500/10 font-medium' 
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                      >
                                        <span className="truncate">{pl.name}</span>
                                        <span className="text-[9px] font-mono text-slate-500">
                                          {includesTrack ? 'Remove' : 'Add'}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: UNIQUE ALBUMS */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {uniqueAlbums.map((album, i) => (
            <div 
              key={i}
              className="bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-300 group cursor-pointer shadow"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                <img 
                  src={album.cover} 
                  alt={album.name} 
                  className="w-full h-full object-cover group-hover:scale-105 duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold truncate text-slate-100 group-hover:text-white">
                {album.name}
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-500 truncate mt-0.5">{album.artist}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CUSTOM PLAYLISTS */}
      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {playlists.map((pl) => (
            <div 
              key={pl.id}
              className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-4 flex gap-4 transition-all duration-300 group shadow"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/5 shadow">
                <img 
                  src={pl.coverUrl} 
                  alt={pl.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-white">
                    {pl.name}
                  </h4>
                  <p className="text-[10px] text-white/40 leading-normal line-clamp-2 mt-1 font-sans">
                    {pl.description || "No customized description provided."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1.5">
                    <ListMusic className="w-3.5 h-3.5 shrink-0" />
                    {pl.tracks.length} tracks
                  </span>

                  {pl.isCustom && (
                    <button 
                      onClick={() => deletePlaylist(pl.id)}
                      className="p-1 text-slate-500 hover:text-red-400 cursor-pointer rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete Playlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide open absolute Modal to CREATE A PLAYLIST */}
      <AnimatePresence>
        {isCreatingPlaylist && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-widest mb-1">
                Create New Playlist
              </h3>
              <p className="text-xs text-white/45 mb-6">Create customized channels to filter and stream tracks locally.</p>

              <form onSubmit={handleCreatePlaylistSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    Playlist Title
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Lofi Rainy Coding Sessions" 
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full bg-[#050505] border border-white/5 p-3 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-white/10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    Brief Description (Optional)
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="e.g., Chill lofi chords paired with mechanical keys for typing in terminal fields." 
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                    className="w-full bg-[#050505] border border-white/5 p-3 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-white/10"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-6">
                  <button 
                    type="button"
                    onClick={() => setIsCreatingPlaylist(false)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="py-2.5 px-5.5 rounded-xl text-xs font-bold text-slate-950 hover:opacity-90 cursor-pointer shadow-lg transition-opacity active:scale-95 transition-transform"
                    style={{ backgroundColor: userProfile.accentColor }}
                  >
                    Generate Playlist
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
