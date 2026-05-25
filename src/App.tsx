import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ShieldAlert, Cpu, Layers, Radio } from 'lucide-react';
import { AudioProvider, useAudio } from './context/AudioContext';
import { Sidebar } from './components/Sidebar';
import { AudioPlayer } from './components/AudioPlayer';

// Views
import { Home } from './components/Home';
import { Library } from './components/Library';
import { Artists } from './components/Artists';
import { Playlist } from './components/Playlist';
import { Profile } from './components/Profile';

function MainAppContent() {
  const [activeView, setActiveView] = useState<'home' | 'library' | 'artists' | 'playlist' | 'profile'>('home');
  const [showSynthTutorial, setShowSynthTutorial] = useState(false);
  const { userProfile, plays } = useAudio() as any;

  // Render view dispatcher
  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <Home />;
      case 'library':
        return <Library />;
      case 'artists':
        return <Artists />;
      case 'playlist':
        return <Playlist />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30 selection:text-white pb-36 md:pb-24">
      
      {/* 1. Responsive Sidebar / Nav components */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onOpenSynthTutorial={() => setShowSynthTutorial(true)} 
      />

      {/* 2. Main Content frame with customized scroll bars */}
      <main className="flex-1 overflow-y-auto h-screen relative scrollbar-custom bg-[#050505]">
        {/* Dynamic decorative visual banner header context */}
        <header className="sticky top-0 bg-[#050505]/80 backdrop-blur-md px-6 md:px-8 py-4 flex items-center justify-between z-20 border-b border-white/5">
          <div className="flex items-center gap-1.5 flex-1 max-w-md">
            <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase select-none">SONIC STREAM DECK ACTIVE</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/5 border border-white/5 px-3 py-1 rounded-full uppercase tracking-wider hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              SYSTEM OPERATIONAL
            </span>

            {/* Quick avatar link */}
            <div 
              onClick={() => setActiveView('profile')}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm border border-white/5 cursor-pointer shadow-sm active:scale-95 transition-transform"
            >
              {userProfile.avatar}
            </div>
          </div>
        </header>

        {/* Dynamic page render space wrapped in AnimatePresence logic */}
        <AnimatePresence mode="wait">
          <div key={activeView} className="relative">
            {renderView()}
          </div>
        </AnimatePresence>
      </main>

      {/* 3. Bottom persistent media control player desk */}
      <AudioPlayer />

      {/* 4. Elegant absolute browser synthesis explanation Modal */}
      <AnimatePresence>
        {showSynthTutorial && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5 text-indigo-400">
                  <Cpu className="w-6 h-6 animate-pulse" />
                  <h3 className="text-base md:text-lg font-bold uppercase text-white tracking-widest">
                    Generative Web Audio Synthesis
                  </h3>
                </div>
                <button 
                  onClick={() => setShowSynthTutorial(false)}
                  className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-white/60 leading-relaxed font-normal">
                Unlike traditional streaming applications that download massive pre-recorded audio waveforms, our site contains a native computer-synthesizer constructed entirely in pure Web Code!
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/5 shrink-0 flex items-center justify-center text-indigo-400 border border-white/5">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Analog Waveform Oscillators</h4>
                    <p className="text-[11px] text-white/40 mt-0.5">We synthesize basic geometric sounds: Triangle waves represent deep acoustic bass kicks, while pure Sine waves represent high crystal-clear note elements.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/5 shrink-0 flex items-center justify-center text-indigo-400 border border-white/5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Resonant Sweep Filter Nodes</h4>
                    <p className="text-[11px] text-white/40 mt-0.5">Raw waves go through low-pass filters that sweep up and down dynamically to reproduce warm, dreamy analog filter sounds.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/5 shrink-0 flex items-center justify-center text-indigo-400 border border-white/5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Pentatonic Arpeggiator Scales</h4>
                    <p className="text-[11px] text-white/40 mt-0.5">High notes wander randomly inside the classic Major Pentatonic scales, meaning the generated music remains harmonious, elegant, and peaceful forever.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-[11px] font-mono text-indigo-300 leading-normal">
                  ⚡ <strong>Tip:</strong> Simply head over to the <strong>Library</strong> page or the <strong>Home Generator shelf</strong>, and click play on any track labeled with the badge <strong>[Synth Engine]</strong> to kick Off generative ambient streams instantly!
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  onClick={() => setShowSynthTutorial(false)}
                  className="py-2.5 px-6 rounded-xl text-xs font-bold font-mono tracking-wider cursor-pointer text-slate-950 transition-transform active:scale-95"
                  style={{ backgroundColor: userProfile.accentColor }}
                >
                  DISMISS INFO
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <MainAppContent />
    </AudioProvider>
  );
}
