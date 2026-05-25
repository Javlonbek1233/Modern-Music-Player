import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, 
  Volume2, VolumeX, Maximize2, Minimize2, ListMusic, Sparkles, Disc, Heart 
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { Visualizer } from './Visualizer';

export const AudioPlayer: React.FC = () => {
  const {
    isPlaying,
    currentTrack,
    volume,
    isMuted,
    progress,
    duration,
    isShuffle,
    isRepeat,
    setVolume,
    setIsMuted,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    toggleShuffle,
    toggleRepeat,
    userProfile,
    analyzerValues,
    artists,
    toggleFollowArtist
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  if (!currentTrack) return null;

  // Find dynamic follow state of current song artist
  const activeArtist = artists.find(a => a.id === currentTrack.artistId);
  const isFollowingArtist = activeArtist?.isFollowed || false;

  // Format time util
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Percent calculator
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek((val / 100) * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  // Helper lyrics prompt
  const mockVibes = [
    "Catching the warm morning sun rays on a cassette tape...",
    "Riding down the electric cyberpunk neon grid...",
    "Luminous solar flares rising in deep cosmic orbits...",
    "The rain drops tapping against the dusty window panel...",
    "Diving slowly below deep ocean thermal current lines...",
    "Floating through weightless clouds in a synthetic dreamscape..."
  ];
  const activeVibePhrase = mockVibes[currentTrack.title.length % mockVibes.length];

  return (
    <>
      {/* Footer Player Bar (Desktop & Mobile Compact) */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 h-20 md:h-24 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 px-4 md:px-8 flex items-center justify-between z-30 select-none shadow-[0_-10px_35px_rgba(0,0,0,0.8)]">
        
        {/* Left Side: Thumbnail & Title */}
        <div className="flex items-center gap-3.5 min-w-0 max-w-[280px]">
          <div 
            onClick={() => setIsExpanded(true)}
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-lg border border-white/5 cursor-pointer group relative active:scale-95 transition-transform"
          >
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title} 
              className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'rotate-animation' : ''}`}
              referrerPolicy="no-referrer"
              style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
            />
          </div>
          <div className="min-w-0">
            <h4 
              onClick={() => setIsExpanded(true)}
              className="text-xs md:text-sm font-semibold text-white truncate hover:underline cursor-pointer"
            >
              {currentTrack.title}
            </h4>
            <p className="text-[10px] md:text-xs text-slate-400 truncate mt-0.5">{currentTrack.artist}</p>
          </div>
          
          <button 
            onClick={() => toggleFollowArtist(currentTrack.artistId)}
            className="text-slate-500 hover:text-red-500 active:scale-90 transition-transform cursor-pointer ml-1 p-1"
          >
            <Heart className={`w-4 h-4 ${isFollowingArtist ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Center Side: Core Player Controls */}
        <div className="flex-1 flex flex-col items-center max-w-xl px-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleShuffle}
              className={`text-xs hover:scale-105 active:scale-95 transition-colors cursor-pointer hidden sm:block ${
                isShuffle ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4.5 h-4.5" />
            </button>

            <button 
              onClick={prevTrack}
              className="text-slate-400 hover:text-white hover:scale-105 active:scale-95 transition-colors cursor-pointer"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5 md:w-5.5 md:h-5.5" />
            </button>

            <button 
              onClick={togglePlay}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-slate-950 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/40"
              style={{ backgroundColor: userProfile.accentColor }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>

            <button 
              onClick={nextTrack}
              className="text-slate-400 hover:text-white hover:scale-105 active:scale-95 transition-colors cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5 md:w-5.5 md:h-5.5" />
            </button>

            <button 
              onClick={toggleRepeat}
              className={`text-xs hover:scale-105 active:scale-95 transition-colors cursor-pointer relative hidden sm:block ${
                isRepeat !== 'none' ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={`Repeat: ${isRepeat}`}
            >
              <Repeat className="w-4.5 h-4.5" />
              {isRepeat === 'one' && (
                <span className="absolute -top-1 -right-1.5 text-[8px] bg-amber-500 text-slate-950 font-black rounded-full w-3 h-3 flex items-center justify-center scale-90">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Scrub Bar */}
          <div className="w-full flex items-center gap-3 mt-2 md:mt-3">
            <span className="text-[10px] font-mono text-slate-500 select-none w-8 text-right">
              {formatTime(progress)}
            </span>
            <div className="flex-1 relative group py-2 flex items-center">
              <input 
                type="range"
                min="0"
                max="100"
                value={progressPercent}
                onChange={handleProgressChange}
                disabled={currentTrack.src.startsWith('synth:')}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer tracking-slider accent-indigo-500 group-hover:h-1.5 transition-all outline-none"
                style={{
                  background: `linear-gradient(to right, ${userProfile.accentColor} ${progressPercent}%, rgba(255,255,255,0.05) ${progressPercent}%)`
                }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500 select-none w-8 text-left">
              {currentTrack.src.startsWith('synth:') ? '∞' : formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Side: Sound Controls */}
        <div className="flex items-center gap-3.5 min-w-[140px] md:min-w-[200px] justify-end">
          {/* Active synthesis glowing orb */}
          {currentTrack.src.startsWith('synth:') && (
            <span className="flex h-2 w-2 relative" title="Synthesizer Active">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
            </span>
          )}

          <div className="h-4.5 w-16 hidden lg:block mr-2">
            <Visualizer analyzerValues={analyzerValues} isPlaying={isPlaying} color={userProfile.accentColor} />
          </div>

          <button 
            onClick={handleMuteToggle}
            className="text-slate-400 hover:text-slate-200 cursor-pointer p-1"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
          </button>

          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 md:w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none accent-slate-300"
            style={{
              background: `linear-gradient(to right, rgba(255,255,255,0.4) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.05) ${(isMuted ? 0 : volume) * 100}%)`
            }}
          />

          <button 
            onClick={() => setIsExpanded(true)}
            className="text-slate-400 hover:text-white hover:scale-105 cursor-pointer ml-1 p-1"
            title="Expand Visual Space"
          >
            <Maximize2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Full-Screen Immersive Audio Player Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 180 }}
            className="fixed inset-0 bg-[#050505] text-slate-200 z-50 flex flex-col md:flex-row p-6 md:p-12 overflow-y-auto font-sans"
          >
            {/* Immersive blurred background radial gradient glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              <div 
                className="absolute w-[500px] h-[500px] rounded-full blur-[160px] opacity-15"
                style={{ 
                  backgroundColor: userProfile.accentColor,
                  top: '10%',
                  right: '15%' 
                }}
              />
              <div 
                className="absolute w-[400px] h-[400px] rounded-full blur-[140px] opacity-10 bg-indigo-600"
                style={{ 
                  bottom: '15%',
                  left: '10%' 
                }}
              />
              {/* Mesh geometric textures */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
            </div>

            {/* Back Close controls */}
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-slate-300 hover:text-white cursor-pointer z-50 shadow-lg"
              title="Collapse"
            >
              <Minimize2 className="w-5 h-5" />
            </button>

            {/* Left Box: Vinyl disk visualizer & metadata */}
            <div className="flex-1 flex flex-col items-center justify-center py-6 md:py-0 pr-0 md:pr-12 md:border-r border-white/5">
              
              {/* Floating synth badge overlay */}
              {currentTrack.src.startsWith('synth:') && (
                <div className="mb-6 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center gap-2 text-indigo-300 text-xs font-mono shadow-md animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Browser Web Audio Synthesis
                </div>
              )}

              {/* Glowing Vinyl Disk Wrapper */}
              <div className="relative group flex items-center justify-center my-6">
                {/* Backdrop ambient aura glow */}
                <div 
                  className={`absolute w-64 h-64 md:w-80 md:h-80 rounded-full blur-[60px] opacity-35 transition-all duration-1000 ${
                    isPlaying ? 'scale-110 rotate-animation' : 'scale-95'
                  }`}
                  style={{ backgroundColor: userProfile.accentColor, animationDuration: '30s' }}
                />
                               {/* Visual record spinner */}
                <div 
                  className={`w-64 h-64 md:w-80 md:h-80 rounded-full bg-black border-[12px] border-white/5 shadow-[0_15px_60px_rgba(0,0,0,0.85)] flex items-center justify-center relative select-none transform transition-transform group-hover:scale-[1.02] duration-300 ${
                    isPlaying ? 'rotate-animation' : ''
                  }`}
                  style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                >
                  {/* Vinyl grooves */}
                  <div className="absolute inset-0 rounded-full border border-white/5" />
                  <div className="absolute inset-4 rounded-full border border-white/5" />
                  <div className="absolute inset-8 rounded-full border border-white/5" />
                  <div className="absolute inset-12 rounded-full border border-white/5" />
                  <div className="absolute inset-16 rounded-full border border-white/5" />
                  {/* Album Cover inside */}
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-[#050505] relative">
                    <img 
                      src={currentTrack.coverUrl} 
                      alt={currentTrack.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Metal center spindle pinhole */}
                    <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-[#050505] border-2 border-white/10 shadow-md" />
                  </div>
                </div>
              </div>

              {/* Title, Artist with follow button */}
              <div className="text-center mt-6 max-w-sm">
                <h2 className="text-xl md:text-3xl font-black text-white tracking-tight">{currentTrack.title}</h2>
                <div className="flex items-center justify-center gap-2.5 mt-2">
                  <span className="text-slate-400 font-medium text-sm md:text-base">{currentTrack.artist}</span>
                  <span className="text-white/20">•</span>
                  <button 
                    onClick={() => toggleFollowArtist(currentTrack.artistId)}
                    className="text-xs font-semibold py-0.5 px-2.5 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
                  >
                    {isFollowingArtist ? 'Following' : 'Follow'}
                  </button>
                </div>
                <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-2">{currentTrack.album}</p>
              </div>
            </div>

            {/* Right Box: Audio Spectrum Visualizer & Interactive Vibes Lyrist */}
            <div className="flex-1 flex flex-col justify-between py-6 md:py-0 pl-0 md:pl-12">
              <div>
                <h3 className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase mb-4">
                  Audio Spectrum Visualizer
                </h3>
                <div className="h-28 md:h-40 bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl p-4 md:p-6 w-full shadow-inner">
                  <Visualizer analyzerValues={analyzerValues} isPlaying={isPlaying} color={userProfile.accentColor} />
                </div>
              </div>

              {/* Interactive Synesthesic Lyrics / Vibe Card */}
              <div className="my-8 flex-1 flex flex-col justify-center">
                <h3 className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase mb-4">
                  Visual Lyric Space
                </h3>
                <div className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-2xl min-h-[160px] flex flex-col justify-center">
                  <span className="text-slate-600 text-sm font-mono mb-2 block">Ambient Prompt:</span>
                  <p className="text-base md:text-lg font-light text-slate-200 leading-relaxed italic">
                    "{activeVibePhrase}"
                  </p>
                  <p className="text-[11px] font-mono text-indigo-400/80 mt-4 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    Generative canvas reacting to tone frequencies...
                  </p>
                </div>
              </div>

              {/* Expanded player slider controls */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="w-full flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-500 w-10 text-right">
                    {formatTime(progress)}
                  </span>
                  <div className="flex-1 relative py-2">
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={progressPercent}
                      onChange={handleProgressChange}
                      disabled={currentTrack.src.startsWith('synth:')}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer outline-none accent-indigo-500"
                      style={{
                        background: `linear-gradient(to right, ${userProfile.accentColor} ${progressPercent}%, #334155 ${progressPercent}%)`
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 w-10 text-left">
                    {currentTrack.src.startsWith('synth:') ? '∞' : formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center justify-around mt-6 max-w-md mx-auto">
                  <button 
                    onClick={toggleShuffle}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isShuffle ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>

                  <button 
                    onClick={prevTrack}
                    className="p-2 text-slate-400 hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    <SkipBack className="w-6 h-6" />
                  </button>

                  <button 
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-slate-950 transition-all hover:scale-110 active:scale-90 cursor-pointer shadow-xl shadow-black/60 font-black"
                    style={{ backgroundColor: userProfile.accentColor }}
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950 ml-0.5" />}
                  </button>

                  <button 
                    onClick={nextTrack}
                    className="p-2 text-slate-400 hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    <SkipForward className="w-6 h-6" />
                  </button>

                  <button 
                    onClick={toggleRepeat}
                    className={`p-2 rounded-xl transition-all cursor-pointer relative ${
                      isRepeat !== 'none' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Repeat className="w-5 h-5" />
                    {isRepeat === 'one' && (
                      <span className="absolute top-1 right-1 text-[8px] bg-amber-500 text-slate-950 font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                        1
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
