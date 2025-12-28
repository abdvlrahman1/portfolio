"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, Variants } from 'framer-motion';
import { 
    ArrowUpRight, Instagram, Mail, Layers, 
    Code2, Clapperboard, MonitorPlay, AppWindow, 
    Sun, Moon, Volume2, VolumeX 
} from 'lucide-react';

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");
  const [isDark, setIsDark] = useState(false);
  
  // --- AUDIO STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- MOUSE SPOTLIGHT ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const bgGradient = useMotionTemplate`radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'},
      transparent 80%
  )`;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // --- AUDIO TOGGLE ---
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log("Audio play failed:", err));
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    setMounted(true);
    // NOTE: Ensure 'ambient.mp3' is in your public folder
    audioRef.current = new Audio('/ambient.mp3'); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    const updateTime = () => {
        setTime(new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', hour12: false 
        }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => {
        clearInterval(timer);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  if (!mounted) return null;

  // --- THEME CONFIG ---
  const theme = {
    bg: isDark ? "bg-[#0a0a0a]" : "bg-white",
    text: isDark ? "text-[#ededed]" : "text-[#111]",
    subtext: isDark ? "text-neutral-500" : "text-neutral-500",
    border: isDark ? "border-white/10" : "border-black/10",
    cardBg: isDark ? "bg-neutral-900/50" : "bg-neutral-50",
    hoverBg: isDark ? "hover:bg-white/10" : "hover:bg-black/5",
    button: isDark ? "bg-white text-black" : "bg-black text-white"
  };

  // --- ANIMATION VARIANTS ---
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.98 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } }
  };

  return (
    <main 
        /* UPDATED: Changed overflow-hidden to overflow-x-hidden and added pb-20 for mobile spacing */
        className={`min-h-[100dvh] w-full transition-colors duration-500 ease-in-out ${theme.bg} ${theme.text} font-sans flex flex-col items-center py-12 px-6 pb-24 relative overflow-x-hidden`}
        onMouseMove={handleMouseMove}
    >
      
      {/* --- GLOBAL STYLES --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Instrument Serif', serif; }
        
        .bg-grid {
            position: absolute; inset: 0;
            background-size: 40px 40px;
            background-image: radial-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px);
            mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
            z-index: 0;
            opacity: 0.5;
            height: 100%; /* Ensures grid covers full scrollable height */
        }
      `}</style>

      {/* --- BACKGROUNDS --- */}
      <div className="bg-grid pointer-events-none transition-opacity duration-500 fixed inset-0" />
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{ background: bgGradient }} 
      />

      {/* --- TOP LEFT: SOUND TOGGLE --- */}
      <div className="absolute top-6 left-6 z-50">
          <button 
            onClick={toggleAudio}
            className={`p-3 rounded-full backdrop-blur-md border transition-all hover:scale-105 active:scale-95 ${theme.cardBg} ${theme.border}`}
          >
            <AnimatePresence mode='wait'>
                {isPlaying ? (
                    <motion.div key="playing" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                        <Volume2 size={18} />
                    </motion.div>
                ) : (
                    <motion.div key="muted" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                        <VolumeX size={18} />
                    </motion.div>
                )}
            </AnimatePresence>
          </button>
      </div>

      {/* --- TOP RIGHT: THEME TOGGLE --- */}
      <div className="absolute top-6 right-6 z-50">
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-full backdrop-blur-md border transition-all hover:scale-105 active:scale-95 ${theme.cardBg} ${theme.border}`}
          >
            <AnimatePresence mode='wait'>
                {isDark ? (
                    <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                        <Moon size={18} />
                    </motion.div>
                ) : (
                    <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                        <Sun size={18} />
                    </motion.div>
                )}
            </AnimatePresence>
          </button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <motion.div 
        className="relative z-10 w-full max-w-lg flex flex-col items-center text-center gap-8 mt-12 md:mt-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >

        {/* 1. LOCATION & TIME */}
        <motion.div variants={item} className={`flex flex-col items-center gap-1 ${theme.subtext}`}>
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-70">Nairobi, KE</span>
            <span className="font-mono text-xs opacity-60">{time}</span>
        </motion.div>

        {/* 2. PHOTO */}
        <motion.div variants={item} className="relative group cursor-pointer">
            <div className={`w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-[3px] shadow-2xl relative z-10 transition-colors duration-500 ${isDark ? 'border-neutral-800' : 'border-white'}`}>
                {/* NOTE: Ensure 'shane.jpg' is in your public folder */}
                <img 
                    src="/shane.jpg" 
                    alt="Profile" 
                    className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-700 ease-in-out"
                />
            </div>
            <div className={`absolute inset-0 blur-3xl opacity-40 -z-10 transform scale-125 rounded-full transition-colors duration-500 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
        </motion.div>

        {/* 3. HERO TEXT (ROCK LEE QUOTE & ATTRIBUTION) */}
        <motion.div variants={item} className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif leading-[1.0]">
                Abdirahman Omar.
            </h1>
            
            {/* THE AESTHETIC QUOTE CONTAINER */}
            <div className={`flex flex-col items-center gap-3 max-w-sm mx-auto ${theme.subtext}`}>
                {/* Reflective Sentence */}
                <p className="text-base md:text-lg font-serif italic leading-relaxed">
                    "The lotus blooms twice only for those who believe in the power of their own hard work."
                </p>

                {/* Tiny Photo Attribution */}
                <div className="flex items-center gap-2 mt-1 opacity-70">
                    <div className={`w-5 h-5 rounded-full overflow-hidden border ${isDark ? 'border-neutral-700' : 'border-neutral-300'} bg-neutral-500`}>
                         {/* NOTE: Ensure 'rocklee.jpg' is in your public folder */}
                        <img src="/rocklee.jpg" alt="Rock Lee" className="w-full h-full object-cover grayscale" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-medium">Rock Lee</span>
                </div>
            </div>
        </motion.div>

        {/* 4. SKILLS */}
        <motion.div variants={item} className="w-full grid grid-cols-2 gap-3 mt-2">
            <SkillCard icon={<Clapperboard size={18} />} title="Video Editor" detail="DaVinci Resolve" theme={theme} isDark={isDark} />
            <SkillCard icon={<Code2 size={18} />} title="Frontend Dev" detail="React / Next.js" theme={theme} isDark={isDark} />
            <SkillCard icon={<MonitorPlay size={18} />} title="Colorist" detail="HDR Grading" theme={theme} isDark={isDark} />
            <SkillCard icon={<AppWindow size={18} />} title="Portfolio Maker" detail="Digital Identity" theme={theme} isDark={isDark} />
        </motion.div>

        {/* 5. PRIMARY CTA */}
        <motion.div variants={item} className="mt-6 w-full flex flex-col gap-4 items-center">
            <a 
                href="mailto:abdirahmanvomar1@gmail.com" 
                className={`w-full max-w-xs group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full overflow-hidden hover:scale-105 transition-transform shadow-lg ${theme.button}`}
            >
                <span className="font-medium text-xs md:text-sm tracking-widest uppercase z-10">Start Project</span>
                <ArrowUpRight size={16} className="z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
        </motion.div>

        {/* 6. SOCIALS */}
        <motion.div variants={item} className="flex gap-4 items-center justify-center w-full">
            <SocialButton href="https://instagram.com" icon={<Instagram size={20} />} label="Insta" theme={theme} />
            <SocialButton href="https://substack.com" icon={<Layers size={20} />} label="Substack" theme={theme} />
            <SocialButton href="mailto:abdirahmanvomar1@gmail.com" icon={<Mail size={20} />} label="Email" theme={theme} />
        </motion.div>

      </motion.div>
    </main>
  );
}

// --- SUB COMPONENTS ---

function SkillCard({ icon, title, detail, theme, isDark }: any) {
    return (
        <div className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-colors duration-300 group cursor-default ${theme.cardBg} ${theme.border} ${theme.hoverBg}`}>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
            <span className={`text-[10px] ${theme.subtext}`}>{detail}</span>
        </div>
    )
}

function SocialButton({ href, icon, label, theme }: any) {
    return (
        <a 
            href={href} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${theme.border} ${theme.cardBg} ${theme.hoverBg} transition-all hover:scale-105 hover:border-current`}
        >
            <span className="opacity-70">{icon}</span>
            <span className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</span>
        </a>
    )
}