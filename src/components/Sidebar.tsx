import React from 'react';
import { motion } from 'motion/react';
import { Home, Library, Mic2, ListMusic, User, Volume2, ShieldAlert, Sparkles, Disc } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: 'home' | 'library' | 'artists' | 'playlist' | 'profile') => void;
  onOpenSynthTutorial?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onOpenSynthTutorial }) => {
  const { userProfile, playlists, currentTrack, isPlaying } = useAudio();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'artists', label: 'Artists', icon: Mic2 },
    { id: 'playlist', label: 'Playlists', icon: ListMusic },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a0a0a] border-r border-white/5 text-slate-200 h-screen sticky top-0 shrink-0 select-none overflow-y-auto z-10 p-4">
        {/* Brand Banner */}
        <div className="p-4 pb-2 flex items-center gap-3 mb-6">
          <div className="relative">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/10 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${userProfile.accentColor}, #050505)` }}
            >
              <Disc className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h1 className="font-sans font-bold text-base tracking-widest text-white italic">
              SONIC
            </h1>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Hi-Fi DECK</p>
          </div>
        </div>

        {/* Premium Upgrade Card */}
        {userProfile.premium && (
          <div className="mx-2 mt-1 mb-4 p-3.5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-2.5">
            <span className="text-xl">✨</span>
            <div>
              <p className="text-xs font-semibold text-white flex items-center gap-1">
                Studio Premium
                <span className="text-[8px] px-1 bg-amber-500/20 text-amber-400 rounded-md py-0.5 border border-amber-500/30">PRO</span>
              </p>
              <p className="text-[10px] text-white/40 font-mono">Lossless Audio</p>
            </div>
          </div>
        )}

        {/* Menu Navigation Group */}
        <div className="px-1 py-2 flex-1 flex flex-col gap-1">
          <p className="px-3 text-[10px] font-mono font-semibold tracking-[0.2em] text-white/40 uppercase pb-2">
            Main Menu
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`relative w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group ${
                  isActive 
                    ? 'text-white font-bold bg-white/5' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute left-1 w-1 h-5 rounded-full"
                    style={{ backgroundColor: userProfile.accentColor }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon 
                  className={`w-4 h-4 transition-transform group-hover:scale-105 duration-200 ${
                    isActive ? 'text-white opacity-100' : 'text-white/40 group-hover:text-white opacity-70'
                  }`}
                  style={isActive ? { color: userProfile.accentColor } : undefined}
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Preset Playlists Section */}
          <div className="mt-8">
            <p className="px-3 text-[10px] font-mono font-semibold tracking-[0.2em] text-white/40 uppercase pb-2">
              Collection
            </p>
            <div className="max-h-[160px] overflow-y-auto pr-1 flex flex-col gap-1">
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => setActiveView('playlist')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-normal text-white/50 hover:text-white rounded-lg hover:bg-white/5 truncate text-left transition-colors duration-150"
                >
                  <ListMusic className="w-3.5 h-3.5 text-white/30 shrink-0" />
                  <span className="truncate">{pl.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Generator Banner */}
          <div className="mt-auto bg-white/5 rounded-2xl p-4 border border-white/5 mx-1">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-semibold text-white">Generative Synths</h4>
                <p className="text-[10px] text-white/40 leading-normal mt-1">
                  Listen to live arpeggiators & drone loops synthesized in your browser!
                </p>
                <button
                  onClick={onOpenSynthTutorial}
                  className="mt-3 text-[10px] font-semibold flex items-center gap-1 hover:underline text-indigo-400 cursor-pointer"
                >
                  How it works →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Mini Profile */}
        <div 
          className="p-3 border-t border-white/5 flex items-center gap-3 hover:bg-white/5 rounded-2xl cursor-pointer transition-colors mt-4"
          onClick={() => setActiveView('profile')}
        >
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-lg shadow-inner shrink-0 select-none">
            {userProfile.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-white truncate">{userProfile.name}</h4>
            <p className="text-[9px] font-mono text-white/40 truncate">{userProfile.email}</p>
          </div>
        </div>
      </aside>

      {/* Floating Responsive Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 shadow-2xl flex items-center justify-around px-4 pb-safe z-40 select-none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-center relative"
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-active-bg"
                  className="absolute inset-0 rounded-xl bg-white/5 -z-10"
                />
              )}
              <Icon 
                className="w-5 h-5"
                style={{ color: isActive ? userProfile.accentColor : 'rgba(255, 255, 255, 0.4)' }}
              />
              <span 
                className="text-[9px] font-medium mt-0.5"
                style={{ color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
