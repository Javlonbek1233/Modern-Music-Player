import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAudio } from '../context/AudioContext';
import { Heart, UserPlus, UserCheck, Play, ArrowLeft, Disc, Sparkles } from 'lucide-react';
import { Artist, Track } from '../types';
import { TRACKS } from '../data';

export const Artists: React.FC = () => {
  const { artists, toggleFollowArtist, playTrack, currentTrack, userProfile } = useAudio();
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  // Helper to fetch songs belonging to target artist
  const getArtistTracks = (artistId: string): Track[] => {
    return TRACKS.filter(t => t.artistId === artistId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="p-4 md:p-8 space-y-8"
    >
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          CURATED SOUND ARTISTS
        </h2>
        <p className="text-xs text-slate-500 font-mono mt-1">Discover creators of lo-fi patterns and synthetic waves</p>
      </div>

      {/* Grid Shelf */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artists.map((artist) => {
          const artistTracks = getArtistTracks(artist.id);
          return (
            <div 
              key={artist.id}
              className="bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 group shadow relative overflow-hidden"
            >
              {/* Backglow element */}
              <div 
                className="absolute w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity -z-10"
                style={{ backgroundColor: userProfile.accentColor }}
              />

              {/* Avatar structure */}
              <div 
                onClick={() => setSelectedArtist(artist)}
                className="w-24 h-24 rounded-full overflow-hidden border border-white/5 shadow-lg cursor-pointer transform group-hover:scale-105 duration-300 relative"
              >
                <img 
                  src={artist.avatarUrl} 
                  alt={artist.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Titles */}
              <div className="mt-4 min-w-0 w-full">
                <h4 
                  onClick={() => setSelectedArtist(artist)}
                  className="text-sm md:text-base font-bold text-slate-100 group-hover:text-white truncate cursor-pointer hover:underline"
                >
                  {artist.name}
                </h4>
                <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">
                  {artistTracks.length} active channels
                </p>
              </div>

              {/* Brief Bio text */}
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2 mt-2 leading-relaxed h-8">
                {artist.bio}
              </p>

              {/* Followers & Follow Button */}
              <div className="w-full flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono text-slate-500 text-left">
                  {artist.followers.toLocaleString()} folls
                </span>

                <button
                  onClick={() => toggleFollowArtist(artist.id)}
                  className={`py-1.5 px-3 rounded-xl text-[10px] font-bold font-mono tracking-wider flex items-center gap-1.5 cursor-pointer border transition-colors ${
                    artist.isFollowed 
                      ? 'bg-white/5 border-white/5 text-slate-300 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400' 
                      : 'border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {artist.isFollowed ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      FOLLOWED
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                      FOLLOW
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL SCREEN / LARGE DIALOG POPUP MODAL FOR SELECTED ARTIST DETAILS */}
      <AnimatePresence>
        {selectedArtist && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-3xl bg-[#0a0a0a] border border-white/5 text-slate-100 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Top cover banner */}
              <div className="h-44 sm:h-52 bg-[#050505] relative">
                <img 
                  src={selectedArtist.avatarUrl} 
                  alt={selectedArtist.name} 
                  className="w-full h-full object-cover opacity-15 blur-md scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                
                {/* Close Button back action link */}
                <button 
                  onClick={() => setSelectedArtist(null)}
                  className="absolute top-4 left-4 h-9 px-3.5 rounded-xl bg-black/80 border border-white/5 text-xs font-mono flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-white/5 hover:scale-[1.03] cursor-pointer transition-all shadow"
                >
                  <ArrowLeft className="w-4 h-4" />
                  BACK
                </button>
              </div>

              {/* Main Info overlay */}
              <div className="px-6 sm:px-10 pb-8 relative -mt-16 sm:-mt-20">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-[#0a0a0a] shadow-2xl relative shrink-0">
                    <img 
                      src={selectedArtist.avatarUrl} 
                      alt={selectedArtist.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono rounded-md border border-indigo-500/15 uppercase font-bold">
                      VERIFIED STREAMER
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                      {selectedArtist.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-2">
                      {selectedArtist.followers.toLocaleString()} monthly active listeners
                    </p>
                  </div>
                </div>

                {/* Bio text detail */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 space-y-4">
                    <div>
                      <h4 className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                        Biography
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal font-sans mt-2">
                        {selectedArtist.bio}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => toggleFollowArtist(selectedArtist.id)}
                        className="py-2.5 w-full rounded-xl text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-2 border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        {selectedArtist.isFollowed ? 'Unfollow Creator' : 'Follow Creator'}
                      </button>
                    </div>
                  </div>

                  {/* Tracks index */}
                  <div className="md:col-span-2 space-y-3">
                    <h4 className="text-[10px] font-mono font-bold tracking-widest text-[#555555] uppercase pb-1 border-b border-white/5">
                      Popular Releases
                    </h4>

                    <div className="divide-y divide-white/5 max-h-[220px] overflow-y-auto pr-1">
                      {getArtistTracks(selectedArtist.id).map((track, i) => {
                        const isCurrent = currentTrack?.id === track.id;
                        return (
                          <div 
                            key={track.id}
                            onClick={() => playTrack(track, TRACKS)}
                            className="w-full flex items-center justify-between py-2 hover:bg-white/5 rounded-lg group cursor-pointer px-2 transition-all"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-xs font-mono text-slate-600 w-4 group-hover:text-slate-400">
                                {i + 1}
                              </span>
                              <img 
                                src={track.coverUrl} 
                                alt={track.title} 
                                className="w-8 h-8 rounded-lg object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <h5 className={`text-xs font-bold truncate ${isCurrent ? 'text-indigo-400' : 'text-slate-200 group-hover:text-white'}`}>
                                  {track.title}
                                </h5>
                                <p className="text-[9px] text-slate-500 truncate mt-0.5">{track.album}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {track.src.startsWith('synth:') && (
                                <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                              )}
                              <span className="text-[10px] font-mono text-slate-500">
                                {track.duration === 9999 ? '∞' : `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`}
                              </span>
                              <div className="w-6 h-6 rounded-full bg-[#050505] flex items-center justify-center opacity-0 group-hover:opacity-100 border border-white/5 transition-opacity">
                                <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
