'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, 
  Type, 
  Layout, 
  Check,
  Smartphone,
  Monitor,
  Tablet,
  Sparkles,
  ArrowUp,
  ArrowUpRight,
  ArrowRight,
  ArrowDownRight,
  ArrowDown,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpLeft,
  Loader2,
  Save
} from 'lucide-react';

export const AppearanceModule = ({ user }: { user: any }) => {
  const profile = user?.profile || {};
  const [selectedTheme, setSelectedTheme] = useState(profile.theme || 'Minimal Dark');
  const [selectedFont, setSelectedFont] = useState(profile.fontFamily || 'Inter');
  const [selectedButtonStyle, setSelectedButtonStyle] = useState(profile.buttonStyle || 'Rounded');
  const [bgType, setBgType] = useState<'theme' | 'custom'>(profile.theme === 'Custom' ? 'custom' : 'theme');
  const [color1, setColor1] = useState(profile.gradientColor1 || '#0a0a0a');
  const [color2, setColor2] = useState(profile.gradientColor2 || '#121212');
  const [direction, setDirection] = useState(profile.gradientDirection || 'to bottom right');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const themes = [
    { 
      name: 'Minimal Dark', 
      colors: ['#0a0a0a', '#121212'], 
      accent: '#f43f5e',
      description: 'Sophisticated and modern.'
    },
    { 
      name: 'Ocean Breeze', 
      colors: ['#0ea5e9', '#14b8a6'], 
      accent: '#38bdf8',
      description: 'Calm and refreshing.'
    },
    { 
      name: 'Sunset Glow', 
      colors: ['#f59e0b', '#ef4444'], 
      accent: '#fbbf24',
      description: 'Vibrant and energetic.'
    },
    { 
      name: 'Forest Deep', 
      colors: ['#064e3b', '#065f46'], 
      accent: '#10b981',
      description: 'Natural and grounded.'
    },
    { 
      name: 'Royal Velvet', 
      colors: ['#4c1d95', '#5b21b6'], 
      accent: '#a78bfa',
      description: 'Luxury and elegance.'
    },
    { 
      name: 'Cyber Neon', 
      colors: ['#000000', '#111111'], 
      accent: '#22d3ee',
      description: 'Futuristic and bold.'
    },
  ];

  const fonts = [
    { name: 'Inter', className: 'font-sans' },
    { name: 'Poppins', className: 'font-sans' },
    { name: 'Outfit', className: 'font-sans' },
    { name: 'Roboto', className: 'font-sans' },
    { name: 'JetBrains Mono', className: 'font-mono' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/profile/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: bgType === 'theme' ? selectedTheme : 'Custom',
          gradientColor1: color1,
          gradientColor2: color2,
          gradientDirection: direction,
          buttonStyle: selectedButtonStyle,
          fontFamily: selectedFont,
        }),
      });

      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Failed to save appearance:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-12">
      <div className="lg:col-span-7 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Appearance</h2>
            <p className="text-slate-400 text-sm font-medium">Customize your profile&apos;s look and feel to match your brand.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-3 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
              saveStatus === 'success' ? 'bg-green-500 text-white' : 
              saveStatus === 'error' ? 'bg-red-500 text-white' : 
              'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-brand-primary/20'
            }`}
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : saveStatus === 'success' ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save Changes'}
          </button>
        </div>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-black text-white">Themes</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themes.map((theme) => (
              <button 
                key={theme.name} 
                onClick={() => {
                  setSelectedTheme(theme.name);
                  setBgType('theme');
                }}
                className={`premium-card p-4 rounded-3xl text-left group transition-all relative overflow-hidden ${
                  selectedTheme === theme.name && bgType === 'theme' ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'hover:border-white/20'
                }`}
              >
                <div className="aspect-video rounded-2xl mb-4 flex flex-col gap-2 p-3 relative overflow-hidden" style={{ background: theme.colors[0] }}>
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent" />
                  <div className="w-1/2 h-2 rounded-full bg-white/20" />
                  <div className="w-3/4 h-2 rounded-full bg-white/10" />
                  <div className="mt-auto flex gap-2">
                    <div className="w-8 h-8 rounded-lg" style={{ background: theme.accent }} />
                    <div className="flex-1 h-8 rounded-lg bg-white/5 border border-white/10" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-black text-white block">{theme.name}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{theme.description}</span>
                  </div>
                  {selectedTheme === theme.name && bgType === 'theme' && (
                    <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              <h3 className="text-lg font-black text-white">Background Gradient</h3>
            </div>
            <div className="flex bg-surface-900 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setBgType('theme')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${bgType === 'theme' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                Theme
              </button>
              <button 
                onClick={() => setBgType('custom')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${bgType === 'custom' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                Custom
              </button>
            </div>
          </div>

          {bgType === 'custom' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-6 rounded-[2.5rem] space-y-8"
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Start Color</label>
                  <div className="flex items-center gap-3 p-2 rounded-2xl bg-surface-950 border border-white/5">
                    <input 
                      type="color" 
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="bg-transparent text-sm font-black text-white outline-none w-20"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">End Color</label>
                  <div className="flex items-center gap-3 p-2 rounded-2xl bg-surface-950 border border-white/5">
                    <input 
                      type="color" 
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="bg-transparent text-sm font-black text-white outline-none w-20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Direction</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {[
                    { dir: 'to top', icon: ArrowUp },
                    { dir: 'to top right', icon: ArrowUpRight },
                    { dir: 'to right', icon: ArrowRight },
                    { dir: 'to bottom right', icon: ArrowDownRight },
                    { dir: 'to bottom', icon: ArrowDown },
                    { dir: 'to bottom left', icon: ArrowDownLeft },
                    { dir: 'to left', icon: ArrowLeft },
                    { dir: 'to top left', icon: ArrowUpLeft },
                  ].map((item) => (
                    <button
                      key={item.dir}
                      onClick={() => setDirection(item.dir)}
                      className={`aspect-square rounded-xl flex items-center justify-center border transition-all ${
                        direction === item.dir 
                          ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                          : 'bg-surface-950 border-white/5 text-slate-500 hover:border-white/20 hover:text-white'
                      }`}
                      title={item.dir}
                    >
                      <item.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-20 w-full rounded-2xl border border-white/10 relative overflow-hidden" style={{ background: `linear-gradient(${direction}, ${color1}, ${color2})` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] drop-shadow-lg">Preview</span>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-black text-white">Typography</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {fonts.map((font) => (
              <button 
                key={font.name} 
                onClick={() => setSelectedFont(font.name)}
                className={`px-6 py-3 rounded-2xl text-sm font-black transition-all border ${
                  selectedFont === font.name 
                    ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20' 
                    : 'bg-surface-900 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {font.name}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-black text-white">Button Style</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { id: 'Sharp', label: 'Sharp', radius: 'rounded-none', desc: 'Bold & Geometric' },
              { id: 'Rounded', label: 'Rounded', radius: 'rounded-2xl', desc: 'Modern & Friendly' },
              { id: 'Pill', label: 'Pill', radius: 'rounded-full', desc: 'Soft & Playful' }
            ].map((style) => (
              <button 
                key={style.id} 
                onClick={() => setSelectedButtonStyle(style.id)}
                className={`premium-card p-6 rounded-[2.5rem] text-left group transition-all relative overflow-hidden flex flex-col items-center ${
                  selectedButtonStyle === style.id ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-brand-primary/5' : 'hover:border-white/20'
                }`}
              >
                <div className="w-full aspect-video rounded-3xl bg-surface-950/50 border border-white/5 flex items-center justify-center p-4 mb-6 group-hover:bg-surface-950 transition-colors">
                  <div className={`w-full h-12 bg-brand-primary shadow-lg shadow-brand-primary/20 flex items-center px-4 gap-3 transition-all duration-500 ${style.radius} ${
                    selectedButtonStyle === style.id ? 'scale-105' : 'scale-100 group-hover:scale-105'
                  }`}>
                    <div className="w-6 h-6 rounded-lg bg-white/20" />
                    <div className="h-2 w-16 bg-white/40 rounded-full" />
                  </div>
                </div>
                
                <div className="text-center">
                  <span className={`text-sm font-black block transition-colors ${
                    selectedButtonStyle === style.id ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}>{style.label}</span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">{style.desc}</span>
                </div>

                {selectedButtonStyle === style.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center justify-between px-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Live Preview</label>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"><Smartphone className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"><Tablet className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"><Monitor className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="relative group">
            {/* Phone Frame */}
            <div className="max-w-[320px] mx-auto p-4 glass rounded-[3.5rem] border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative z-10">
              <div className={`bg-surface-950 rounded-[3rem] aspect-[9/19] overflow-hidden border border-white/5 flex flex-col items-center p-8 relative ${
                fonts.find(f => f.name === selectedFont)?.className || 'font-sans'
              }`}>
                {/* Dynamic Background */}
                <div 
                  className="absolute inset-0 transition-all duration-700" 
                  style={{ 
                    background: bgType === 'theme' 
                      ? `linear-gradient(to bottom, ${themes.find(t => t.name === selectedTheme)?.colors[0]}, ${themes.find(t => t.name === selectedTheme)?.colors[1]})` 
                      : `linear-gradient(${direction}, ${color1}, ${color2})` 
                  }} 
                />
                
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center w-full h-full">
                  <div className="w-20 h-20 rounded-[2rem] bg-brand-primary mb-6 shadow-2xl relative group/preview">
                    <div className="absolute inset-0 rounded-[2rem] bg-white/20 opacity-0 group-hover/preview:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center text-white font-black text-2xl">
                      {selectedTheme[0]}
                    </div>
                  </div>
                  
                  <h4 className="text-white font-black text-lg mb-1 tracking-tight">@linknest</h4>
                  <p className="text-white/60 text-[10px] font-medium mb-10 text-center line-clamp-2">
                    Digital creator & designer. Building the future of link-in-bio.
                  </p>
                  
                  <div className="w-full space-y-3">
                    {[
                      { label: 'My Portfolio', icon: Sparkles },
                      { label: 'Latest Project', icon: Layout },
                      { label: 'Twitter / X', icon: Smartphone },
                      { label: 'Instagram', icon: Palette }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className={`w-full h-12 bg-white/10 backdrop-blur-md border border-white/20 flex items-center px-4 gap-3 cursor-pointer group/item transition-all ${
                          selectedButtonStyle === 'Sharp' ? 'rounded-none' : selectedButtonStyle === 'Rounded' ? 'rounded-xl' : 'rounded-full'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center group-hover/item:bg-brand-primary/20 transition-colors">
                          <item.icon className="w-3 h-3 text-white/60 group-hover/item:text-brand-primary transition-colors" />
                        </div>
                        <div className="text-[10px] font-black text-white/80 group-hover/item:text-white transition-colors">
                          {item.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-auto pt-12">
                    <div className="flex gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-brand-primary/20 transition-colors cursor-pointer">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary/10 blur-[100px] rounded-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>
          
          <div className="text-center">
            <button className="inline-flex items-center gap-2 text-brand-primary font-black text-sm uppercase tracking-widest hover:underline">
              <Sparkles className="w-4 h-4" /> View Full Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
