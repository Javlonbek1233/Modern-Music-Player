import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAudio } from '../context/AudioContext';
import { User, Mail, Save, Calendar, Check, Sliders, Music, Clock, Sparkles } from 'lucide-react';

export const Profile: React.FC = () => {
  const { userProfile, updateProfile } = useAudio();

  // Edit fields state
  const [profileName, setProfileName] = useState(userProfile.name);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Emojis list
  const avatars = ['🪐', '🎧', '⚡', '🍀', '👽', '🚀', '💎', '🍿', '🎸', '🎹'];

  // Accordion preset themes
  const accentPresets = [
    { name: 'Cosmic Indigo', color: '#6366f1' },
    { name: 'Emerald Forest', color: '#10b981' },
    { name: 'Sunset Lofi', color: '#f43f5e' },
    { name: 'Synthwave Amber', color: '#f59e0b' },
    { name: 'Deep Sea Blue', color: '#3b82f6' },
    { name: 'Cyber Orchid', color: '#d946ef' },
  ];

  // Equalizer model
  const [eqPreset, setEqPreset] = useState('Chill Ambient');
  const [bassVal, setBassVal] = useState(65);
  const [vocalVal, setVocalVal] = useState(40);
  const [trebleVal, setTrebleVal] = useState(55);

  const handleApplyEqPreset = (preset: string) => {
    setEqPreset(preset);
    if (preset === 'Bass Boost') {
      setBassVal(90); setVocalVal(45); setTrebleVal(40);
    } else if (preset === 'Chill Ambient') {
      setBassVal(65); setVocalVal(40); setTrebleVal(55);
    } else if (preset === 'Vocal Crisp') {
      setBassVal(30); setVocalVal(85); setTrebleVal(75);
    } else {
      setBassVal(50); setVocalVal(50); setTrebleVal(50); // Flat
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: profileName });
    setIsSavedAlert(true);
    setTimeout(() => {
      setIsSavedAlert(false);
    }, 2500);
  };

  // Convert minutes
  const totalHours = Math.floor(userProfile.stats.listeningTime / 60);
  const remainingMins = userProfile.stats.listeningTime % 60;

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
          PROFILE COCKPIT & SETTINGS
        </h2>
        <p className="text-xs text-slate-500 font-mono mt-1">Configure your design aesthetic and audio behaviors</p>
      </div>

      {/* 1. Statistics Cards Deck */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Listening Duration</p>
            <h4 className="text-lg font-black text-white mt-1">
              {totalHours > 0 ? `${totalHours}h ${remainingMins}m` : `${remainingMins} mins`}
            </h4>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Waves Played</p>
            <h4 className="text-lg font-black text-white mt-1">
              {userProfile.stats.totalTracksPlayed} tracks
            </h4>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Core Vibe Profile</p>
            <h4 className="text-lg font-black text-white mt-1">
              {userProfile.stats.topGenre}
            </h4>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Custom Identity Fields and Avatar selector */}
        <section className="bg-white/5 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-xs font-mono font-bold tracking-widest text-[#555555] uppercase pb-2 border-b border-white/5">
            Profile Customization
          </h3>

          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Dynamic large avatar displaying chosen emoji */}
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border relative group select-none shadow"
                style={{ borderColor: `${userProfile.accentColor}30`, backgroundColor: `${userProfile.accentColor}10` }}
              >
                {userProfile.avatar}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#050505] border border-white/5 flex items-center justify-center text-[10px] text-slate-400">
                  ✎
                </div>
              </div>

              {/* Avatar Emoji picker grid */}
              <div className="space-y-2 flex-1 w-full">
                <p className="text-[10px] font-mono text-slate-450 uppercase tracking-widest">Select Avatar Emoji</p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {avatars.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => updateProfile({ avatar: av })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-base hover:bg-white/5 active:scale-95 transition-all border shrink-0 cursor-pointer ${
                        userProfile.avatar === av 
                          ? 'bg-white/5 border-white/10' 
                          : 'bg-transparent border-transparent'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  User Handle / Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs text-white outline-none w-full focus:border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold tracking-widest text-[#555555] uppercase">
                  Linked Account Email
                </label>
                <div className="relative opacity-60">
                  <span className="absolute left-3.5 top-3.5 text-slate-550">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    disabled
                    value={userProfile.email}
                    className="pl-10 pr-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs text-white/55 outline-none w-full cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              {/* Join date indicator */}
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined: {userProfile.joinedDate}
              </span>

              <button 
                type="submit"
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-slate-950 hover:opacity-90 cursor-pointer transition-all flex items-center gap-1.5 shadow"
                style={{ backgroundColor: userProfile.accentColor }}
              >
                <Save className="w-3.5 h-3.5" />
                SAVE PROFILE
              </button>
            </div>

            {/* Saved Alert state */}
            {isSavedAlert && (
              <p className="text-center text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-lg">
                ✔ Profile identities updated successfully. Saved to cache memory.
              </p>
            )}
          </form>
        </section>

        {/* 3. Customizable UI Accents selector & Equalizers */}
        <section className="space-y-6">
          {/* Aesthetic Color Themes Drawer */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#555555] uppercase pb-2 border-b border-white/5">
              Design Accent Theme
            </h3>
            <p className="text-[11px] text-slate-405 leading-normal">
              Pick a customized core branding hue. The entire website dynamically recolors sliders, highlight buttons, and canvas visualizer paths matching your pick.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {accentPresets.map((preset) => {
                const isSelected = userProfile.accentColor === preset.color;
                return (
                  <button
                    key={preset.name}
                    onClick={() => updateProfile({ accentColor: preset.color })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-[1.03] outline-none text-left w-full ${
                      isSelected 
                        ? 'bg-[#050505] border-white/10' 
                        : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-black/40 shadow-inner" style={{ backgroundColor: preset.color }} />
                    <span className="text-[10px] font-mono font-bold text-slate-300 flex items-center gap-1 select-none">
                      {preset.name}
                      {isSelected && <Check className="w-3 h-3 text-emerald-400 inline" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulated Digital Equalizer deck */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
                Digital Equalizer presets
              </h3>
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                EQ Preset Mode
              </span>
            </div>

            {/* Presets segment button selectors */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-[#050505] rounded-xl border border-white/5">
              {['Chill Ambient', 'Bass Boost', 'Vocal Crisp', 'Flat'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleApplyEqPreset(preset)}
                  className={`py-1 px-2 text-[10px] font-bold font-mono rounded-md shrink-0 cursor-pointer ${
                    eqPreset === preset ? 'bg-white/5 text-white' : 'text-slate-550 hover:text-slate-350'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Visual Equalizer slide bars */}
            <div className="space-y-4 pt-4 font-sans">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-sans">
                  <span>Sub Bass Sub-layer (60Hz)</span>
                  <span>{bassVal}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={bassVal} 
                  onChange={(e) => {
                    setBassVal(parseInt(e.target.value));
                    setEqPreset('Custom');
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none accent-slate-300 pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-sans">
                  <span>Middle Vocal core (1kHz)</span>
                  <span>{vocalVal}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={vocalVal} 
                  onChange={(e) => {
                    setVocalVal(parseInt(e.target.value));
                    setEqPreset('Custom');
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none accent-slate-300 pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-sans">
                  <span>High Treble filter (8kHz)</span>
                  <span>{trebleVal}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={trebleVal} 
                  onChange={(e) => {
                    setTrebleVal(parseInt(e.target.value));
                    setEqPreset('Custom');
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none accent-slate-305 pointer"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
