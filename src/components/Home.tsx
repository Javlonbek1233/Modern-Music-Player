import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, TrendingUp, Music, Disc, Heart, Compass } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { TRACKS, ARTISTS } from '../data';
import { Track } from '../types';

export const Home: React.FC = () => {
  const { playTrack, currentTrack, isPlaying, userProfile } = useAudio();
  const [activeGenre, setActiveGenre] = useState<string>('All');

  // Featured Hero Track
  const featuredTrack = TRACKS[0]; // Neon Horizon

  // Filter genres list dynamically
  const genres = ['All', 'Synthwave', 'Lofi Chill', 'Ambient', 'Cyber-Beats'];

  const filteredTracks = activeGenre === 'All' 
    ? TRACKS 
    : TRACKS.filter(t => t.genre === activeGenre);

  // Play lists recommendation
  const topPickedTracks = TRACKS.slice(1, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="p-4 md:p-8 space-y-10"
    >
      {/* 1. Immersive Hero Row */}
      <section className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5">
        {/* Dynamic mesh backgrounds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div 
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-20"
            style={{ backgroundColor: userProfile.accentColor }}
          />
          <img 
            src={featuredTrack.coverUrl} 
            alt="Hero Blur Backdrop" 
            className="absolute w-full h-full object-cover opacity-15 blur-xl scale-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative p-6 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Cover card with spin interaction on play */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/5 group">
            <img 
              src={featuredTrack.coverUrl} 
              alt={featuredTrack.title} 
              className="w-full h-full object-cover group-hover:scale-105 duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#050505]/95 backdrop-blur-md rounded-lg text-[9px] font-mono tracking-widest text-indigo-400 font-bold border border-white/5 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-indigo-450" />
              HOT RELEASE
            </span>
          </div>

          <div className="text-center md:text-left space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Compass className="w-4 h-4" style={{ color: userProfile.accentColor }} />
              <span className="text-xs font-mono tracking-widest text-white/40 uppercase">FEATURED RELEASE</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter leading-none italic">
                {featuredTrack.title}
              </h1>
              <p className="text-sm md:text-lg text-white/60 mt-2 font-medium">
                by <span className="text-white hover:underline cursor-pointer">{featuredTrack.artist}</span>
              </p>
            </div>
            <p className="text-xs text-white/50 leading-relaxed max-w-lg">
              Drive deep into retro-futurism with analog waves, filtered heavy bass drops, and mechanical cyber frequencies. Perfect for late night operations.
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={() => playTrack(featuredTrack, TRACKS)}
                className="px-8 py-3.5 rounded-full text-slate-950 font-bold text-xs tracking-wider flex items-center gap-2.5 hover:scale-105 transition-transform active:scale-95 cursor-pointer shadow-xl shadow-white/5"
                style={{ backgroundColor: userProfile.accentColor }}
              >
                <Play className="w-4 h-4 fill-slate-950" />
                PLAY ALBUM
              </button>
              <div className="text-xs font-mono text-white/30">
                Plays: {featuredTrack.plays.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Horizontal Vibe Filters Shelf */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h2 className="text-lg md:text-xl font-bold tracking-wide italic font-sans text-white">
              Recent Mixes
            </h2>
          </div>
          <p className="text-white/40 text-[10px] uppercase font-mono tracking-widest hidden sm:block">Filter by genre</p>
        </div>

        {/* Scrollable visual genre tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {genres.map((g) => {
            const isActive = activeGenre === g;
            return (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`py-2 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'text-white shadow-md' 
                    : 'text-white/60 bg-white/5 border border-white/5 hover:text-white hover:border-white/20'
                }`}
                style={isActive ? { backgroundColor: userProfile.accentColor } : undefined}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* Visual card slider layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredTracks.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div 
                key={track.id}
                onClick={() => playTrack(track, filteredTracks)}
                className="group relative bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 cursor-pointer shadow-md flex flex-col justify-between"
              >
                {/* Vinyl plate peaking animation effect on card hover */}
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg mb-4">
                  <img 
                    src={track.coverUrl} 
                    alt={track.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Glass visual overlay play icon trigger */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                      <Play className="w-5.5 h-5.5 text-slate-950 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <h4 className={`text-xs md:text-sm font-bold truncate ${isCurrent ? 'text-indigo-400' : 'text-slate-100 group-hover:text-white'}`}>
                    {track.title}
                  </h4>
                  <p className="text-[10px] md:text-xs text-white/40 truncate mt-0.5">{track.artist}</p>
                </div>

                {/* Subtag Genre */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                  <span className="text-[9px] font-mono text-white/40 tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
                    {track.genre}
                  </span>
                  
                  {isCurrent && isPlaying && (
                    <div className="flex items-center gap-0.5 shrink-0 h-3">
                      <span className="w-0.5 bg-indigo-400 animate-bounce h-2" style={{ animationDelay: '0s', animationDuration: '0.6s' }} />
                      <span className="w-0.5 bg-indigo-400 animate-bounce h-3" style={{ animationDelay: '0.15s', animationDuration: '0.4s' }} />
                      <span className="w-0.5 bg-indigo-400 animate-bounce h-1.5" style={{ animationDelay: '0.3s', animationDuration: '0.5s' }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Curator Picks Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Curated Hot List */}
        <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-xs font-mono font-bold tracking-widest text-white/40 uppercase flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-indigo-400" />
              HOT PICKS
            </h3>
            <span className="text-[10px] text-white/30 uppercase font-mono">Real-time</span>
          </div>

          <div className="space-y-1.5">
            {topPickedTracks.map((track, i) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div 
                  key={track.id}
                  onClick={() => playTrack(track, TRACKS)}
                  className="w-full flex items-center justify-between p-2 rounded-xl border border-transparent hover:bg-white/5 hover:border-white/10 group cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-xs font-mono text-white/30 w-4.5 text-center group-hover:text-white/60">
                      {i + 1}
                    </span>
                    <img 
                      src={track.coverUrl} 
                      alt={track.title} 
                      className="w-10 h-10 rounded-lg object-cover shadow-sm border border-white/5"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className={`text-xs font-semibold truncate ${isCurrent ? 'text-indigo-400' : 'text-slate-200 group-hover:text-white'}`}>
                        {track.title}
                      </h4>
                      <p className="text-[10px] text-white/40 truncate mt-0.5">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[9px] font-mono text-white/30">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-3.5 h-3.5 text-[#050505] fill-[#050505] ml-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ambient Generator Banner */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-white/5 text-indigo-400 text-[10px] font-mono rounded-full border border-white/5 inline-block">
              Interactive Space
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight italic">
              Procedural Web Audio Synths
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Don't want standard recorded music? Launch our Web Audio synthesizer generator! Generating real low analog filter sweeping drones, sub-bass kicks, and high randomized pentatonic keys right in your system in real-time. Unaffected by CORS blocks.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <button 
              onClick={() => {
                const synthTrack = TRACKS.find(t => t.src === 'synth:ambient');
                if (synthTrack) playTrack(synthTrack, TRACKS);
              }}
              className="py-2.5 px-4 rounded-xl text-slate-950 bg-indigo-400 font-bold text-[11px] uppercase tracking-wider hover:bg-indigo-300 transition-colors cursor-pointer"
            >
              Play Ambient Drone
            </button>
            <button 
              onClick={() => {
                const synthTrack = TRACKS.find(t => t.src === 'synth:lofi');
                if (synthTrack) playTrack(synthTrack, TRACKS);
              }}
              className="py-2.5 px-4 rounded-xl text-white bg-white/5 border border-white/5 font-bold text-[11px] uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
            >
              Play Lofi Synth loop
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
