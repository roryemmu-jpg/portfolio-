import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Download, ChevronRight, Sparkles } from 'lucide-react';
import { portfolioData } from '../lib/data';
import { cn } from '../lib/utils';

export function Hero() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [presentationScale, setPresentationScale] = useState(1);
  const [presentationText, setPresentationText] = useState("TARGET_ACQUIRED // ENHANCED_PROJECTION");
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [25, -25]);
  const rotateY = useTransform(x, [-300, 300], [-25, 25]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  function handleImageClick() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPresentationMode(false);
      setIsSpeaking(false);
      return;
    }
    
    setIsPresentationMode(true);
    setPresentationScale(1);
    setPresentationText("INITIALIZING...");
    
    const sequence = [
      { text: "Accessing hackathon records.", display: "HACKATHON_RECORDS: [ACCESSING...]", scale: 1.1 },
      { text: "Participated in multiple global hackathons, building innovative AI solutions.", display: "GLOBAL_HACKATHONS // AI_SOLUTIONS", scale: 1.25 },
      { text: "Accessing project archives.", display: "PROJECT_ARCHIVES: [ACCESSING...]", scale: 1.1 },
      { text: "Architected robust backend systems and immersive user experiences.", display: "SYSTEM_ARCHITECTURE // IMMERSIVE_UX", scale: 1.15 },
      { text: "Presentation complete.", display: "PRESENTATION_COMPLETE // RETURNING", scale: 1 }
    ];

    let currentStep = 0;
    
    const playNext = () => {
      if (currentStep >= sequence.length) {
        setIsPresentationMode(false);
        setIsSpeaking(false);
        return;
      }
      
      const step = sequence[currentStep];
      setPresentationScale(step.scale);
      setPresentationText(step.display);
      
      const utterance = new SpeechSynthesisUtterance(step.text);
      
      const voices = window.speechSynthesis.getVoices();
      const jarvisVoice = voices.find(v => 
        v.name.includes("Daniel") || 
        v.name.includes("Google UK English Male") || 
        v.name.includes("Arthur") ||
        (v.lang.includes('en-GB') && v.name.includes('Male'))
      ) || voices.find(v => v.lang.includes('en-GB')) || voices.find(v => v.name.includes("Premium") || v.name.includes("Google US English")) || voices[0];
      
      if (jarvisVoice) utterance.voice = jarvisVoice;
      utterance.pitch = 0.85;
      utterance.rate = 1.05;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        currentStep++;
        setTimeout(playNext, 300);
      };
      
      window.speechSynthesis.speak(utterance);
    };
    
    playNext();
  }

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section className="min-h-screen flex flex-col justify-center relative pt-20 overflow-hidden">
      {/* Deep Space / Cyberpunk Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col gap-8 lg:col-span-7 zero-g-1 relative z-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-white w-fit text-sm font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            System initialized. Audio module ready.
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-orbitron uppercase">
            Sathur <br /> Emmanuel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)] text-2xl md:text-3xl mt-2 block">
              System_Architect
            </span>
          </h1>
          
          <div className="hud-panel p-6 max-w-xl">
            <div className="hud-border" />
            <p className="text-xl text-slate-300 leading-relaxed font-light relative z-20">
              <span className="text-cyan-400 font-medium">{portfolioData.role}</span>. <br />
              {portfolioData.about}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 relative z-20">
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 py-4 bg-cyan-500/10 text-cyan-400 overflow-hidden hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] border border-cyan-500/50"
              style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative font-bold tracking-wide flex items-center gap-2 font-orbitron uppercase text-sm">
                Explore Archives <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={() => window.print()}
              className="group relative px-8 py-4 bg-amber-500/10 text-amber-400 overflow-hidden hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] border border-amber-500/50"
              style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-400/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative font-bold tracking-wide flex items-center gap-2 font-orbitron uppercase text-sm">
                <Download className="w-5 h-5" /> Export Data
              </span>
            </button>
          </div>
        </motion.div>

        {/* 3D Holographic Phone Container */}
        <div className="relative perspective-[1200px] flex justify-center items-center h-[700px] w-full lg:col-span-5 zero-g-2">
          <motion.div
            style={{ rotateX, rotateY }}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            className="relative w-[320px] h-[640px] transform-style-3d cursor-crosshair animate-float"
          >
            {/* The Phone Device (Base) */}
            <div className="absolute inset-0 rounded-[3rem] bg-slate-900 border-[6px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md overflow-hidden z-10" style={{ transform: 'translateZ(0px)' }}>
              
              {/* Screen Inner Bezel */}
              <div className="absolute inset-[2px] rounded-[2.6rem] bg-[#030712] overflow-hidden border border-white/10">
                {/* Dynamic Screen Background */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 via-black/80 to-black" />
                
                {/* Grid UI on screen */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 opacity-80">
                  <div className="w-24 h-1.5 bg-white/20 rounded-full mb-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  
                  {isSpeaking ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex gap-1 items-end h-6">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1.5 bg-cyan-400 rounded-full animate-pulse" 
                            style={{ 
                              animationDuration: `${Math.random() * 0.5 + 0.3}s`,
                              height: `${Math.random() * 100 + 40}%`
                            }} 
                          />
                        ))}
                      </div>
                      <div className="text-cyan-400 text-xs font-mono tracking-widest text-center animate-pulse">
                        TRANSMITTING AUDIO<br/>v2.0.4
                      </div>
                    </div>
                  ) : (
                    <div className="text-cyan-500/70 text-xs font-mono tracking-widest text-center animate-pulse">
                      PROJECTION ACTIVE<br/>v2.0.4
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Holographic Projection Base (Glowing circle under the image on the screen) */}
            <div 
              className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-[220px] h-[60px] rounded-[100%] bg-cyan-400/50 blur-[15px] z-20 shadow-[0_0_40px_rgba(6,182,212,0.8)] border border-cyan-300/30" 
              style={{ transform: 'translateZ(20px) translateX(-50%) rotateX(75deg)' }} 
            />

            {/* Hologram Light Beam rising from the phone */}
            <div 
              className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-[280px] h-[450px] bg-gradient-to-t from-cyan-400/30 via-cyan-400/5 to-transparent blur-md z-20" 
              style={{ transform: 'translateZ(30px) translateX(-50%)', clipPath: 'polygon(30% 100%, 70% 100%, 100% 0, 0 0)' }} 
            />
            {/* Added HUD scanner lines */}
            <div 
              className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-[280px] h-[450px] bg-[repeating-linear-gradient(transparent,transparent_4px,rgba(6,182,212,0.5)_4px,rgba(6,182,212,0.5)_5px)] z-20 opacity-30 hologram-scanline" 
              style={{ transform: 'translateZ(35px) translateX(-50%)', clipPath: 'polygon(30% 100%, 70% 100%, 100% 0, 0 0)' }} 
            />

            {/* The Holographic Image POPPING OUT in 3D */}
            <motion.div 
              className={`absolute bottom-[25%] left-1/2 -translate-x-1/2 w-[280px] h-[420px] z-30 hologram-flicker group cursor-crosshair ${isSpeaking ? 'animate-[pulse_0.2s_infinite]' : ''}`}
              style={{ transform: 'translateZ(80px) translateX(-50%)' }}
              onClick={handleImageClick}
            >
              {/* HUD Brackets */}
              <div className="absolute inset-0 z-40 pointer-events-none hud-border opacity-70 group-hover:opacity-100 group-hover:border-cyan-300 transition-all duration-500" />
              <div className="absolute -inset-4 z-40 pointer-events-none border border-cyan-500/30 opacity-50 hud-panel bg-transparent shadow-[inset_0_0_20px_rgba(6,182,212,0.2)] group-hover:shadow-[inset_0_0_40px_rgba(6,182,212,0.6)] group-hover:border-cyan-400/60 transition-all duration-500" />
              
              {/* Container for image to apply effects */}
              <div className="relative w-full h-full hud-panel overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.5)] border border-cyan-400/80 bg-black/80 backdrop-blur-md p-1 group-hover:shadow-[0_0_60px_rgba(6,182,212,0.8)] transition-all duration-500">
                
                {/* Cyan tint overlay */}
                <div className="absolute inset-0 bg-cyan-600/30 mix-blend-overlay z-10 group-hover:bg-cyan-400/40 transition-colors duration-500" />
                
                {/* Scanlines */}
                <div className="absolute inset-0 z-20 pointer-events-none hologram-scanline bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent h-[15%] group-hover:via-cyan-200/60" />
                <div className="absolute inset-0 z-20 pointer-events-none bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(6,182,212,0.15)_2px,rgba(6,182,212,0.15)_4px)] group-hover:bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(6,182,212,0.3)_2px,rgba(6,182,212,0.3)_4px)] transition-all duration-500" />

                {/* The actual image */}
                <img 
                  src="/profile.jpg" 
                  alt="Emmanuel Sathur Hologram"
                  className="w-full h-full object-cover filter contrast-125 saturate-110 brightness-110 opacity-90 mix-blend-lighten transform transition-all duration-700 group-hover:scale-110 group-hover:brightness-125 group-hover:contrast-150"
                  onError={(e) => {
                    // Fallback if profile.jpg is missing
                    e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
                    e.currentTarget.className = "w-full h-full object-cover filter contrast-125 saturate-150 hue-rotate-15 brightness-110 mix-blend-screen opacity-90 grayscale transform transition-all duration-700 group-hover:scale-110 group-hover:brightness-125 group-hover:contrast-150";
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Futuristic floating UI elements around the hologram */}
              <div 
                className="absolute top-8 -right-12 bg-black/80 border border-cyan-500/50 text-cyan-400 text-xs px-3 py-1.5 rounded backdrop-blur-md font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                style={{ transform: 'translateZ(40px)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  CLICK_TO_ACCESS
                </div>
              </div>
              <div 
                className="absolute bottom-16 -left-10 bg-black/80 border border-purple-500/50 text-purple-400 text-[10px] px-3 py-1.5 rounded backdrop-blur-md font-mono shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                style={{ transform: 'translateZ(20px)' }}
              >
                SYS.OPTIMIZED // 99%
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
      
      {/* Fullscreen Hologram Zoom Effect */}
      <AnimatePresence>
        {isPresentationMode && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl pointer-events-none overflow-hidden"
          >
            {/* Hologram Projector Light Beam */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[120vw] h-[80vh] bg-gradient-to-t from-cyan-400/40 via-cyan-500/10 to-transparent z-10 hologram-flicker mix-blend-screen"
              style={{ clipPath: 'polygon(5% 0, 95% 0, 55% 100%, 45% 100%)' }}
            />
            {/* Scanlines in the beam */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[120vw] h-[80vh] bg-[repeating-linear-gradient(transparent,transparent_4px,rgba(6,182,212,0.5)_4px,rgba(6,182,212,0.5)_5px)] opacity-30 z-10 hologram-scanline mix-blend-screen"
              style={{ clipPath: 'polygon(5% 0, 95% 0, 55% 100%, 45% 100%)' }}
            />

            {/* The Floating Image */}
            <motion.div 
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: [0, -10, 0], scale: presentationScale }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.8, ease: "easeOut" }
              }}
              className="relative w-full max-w-5xl aspect-[16/9] p-4 flex items-center justify-center overflow-hidden m-8 z-20 mb-[10vh]"
            >
              {/* HUD Brackets for Fullscreen */}
              <div className="absolute inset-0 z-40 pointer-events-none hud-border opacity-100" />
              <div className="absolute inset-4 z-40 pointer-events-none border border-cyan-400/80 opacity-70 hud-panel bg-transparent shadow-[inset_0_0_60px_rgba(6,182,212,0.6)]" />
              
              {/* Cyan tint overlay */}
              <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay z-10" />
              
              {/* Scanlines */}
              <div className="absolute inset-0 z-20 pointer-events-none hologram-scanline bg-gradient-to-b from-transparent via-cyan-200/40 to-transparent h-[15%]" />
              <div className="absolute inset-0 z-20 pointer-events-none bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(6,182,212,0.3)_2px,rgba(6,182,212,0.3)_4px)]" />

              <img 
                src="/profile.jpg" 
                alt="Emmanuel Sathur Hologram Fullscreen"
                className="w-full h-full object-cover filter contrast-150 saturate-150 brightness-125 opacity-90 mix-blend-lighten hologram-flicker"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
                  e.currentTarget.className = "w-full h-full object-cover filter contrast-125 saturate-150 hue-rotate-15 brightness-110 mix-blend-screen opacity-90 grayscale hologram-flicker";
                }}
              />
              
              <motion.div 
                key={presentationText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-12 left-12 z-50 text-cyan-400 font-orbitron text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              >
                {presentationText}
              </motion.div>
            </motion.div>

            {/* Hardware Projector Base at bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[40px] bg-cyan-950 rounded-t-[100px] border-t-2 border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.8)] z-50 flex justify-center items-start pt-2">
                <div className="w-16 h-4 bg-cyan-100 rounded-full shadow-[0_0_30px_#a5f3fc,0_0_60px_#22d3ee] animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

