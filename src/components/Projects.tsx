import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { portfolioData } from '../lib/data';
import { cn } from '../lib/utils';
import { ArrowUpRight } from 'lucide-react';

export function Projects() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [presentationScale, setPresentationScale] = useState(1);
  const [presentationText, setPresentationText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  function handleImageClick(project: any) {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setActiveProject(null);
      setIsSpeaking(false);
      return;
    }
    
    setActiveProject(project.id);
    setPresentationScale(1);
    setPresentationText(`INITIALIZING_RECORD // ${project.title.toUpperCase()}`);
    
    const sequence = [
      { text: `Accessing project records for ${project.title}.`, display: `ACCESSING: ${project.title.toUpperCase()}`, scale: 1.1 },
      { text: `${project.description}`, display: `ANALYZING // DESCRIPTION`, scale: 1.25 },
      { text: `Built using ${project.technologies.join(", ")}.`, display: `TECH_STACK // ${project.technologies.join(" | ")}`, scale: 1.15 },
      { text: "Record presentation complete.", display: "PRESENTATION_COMPLETE // RETURNING", scale: 1 }
    ];

    let currentStep = 0;
    
    const playNext = () => {
      if (currentStep >= sequence.length) {
        setActiveProject(null);
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

  return (
    <section id="projects" className="py-32 relative">
      <div className="mb-16 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]"
        >
          SYSTEM_ARCHIVES
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-cyan-500/70 font-mono tracking-wide"
        >
          // HACKATHON_PROJECTS & REAL_WORLD_DEPLOYMENTS
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {portfolioData.projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            className={cn(
              "group relative flex flex-col justify-between p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer hud-panel hover:border-cyan-400/80",
              project.featured ? "md:col-span-2 min-h-[450px]" : "min-h-[400px]"
            )}
            onClick={() => handleImageClick(project)}
          >
            <div className="absolute inset-0 z-40 pointer-events-none hud-border opacity-30 group-hover:opacity-100 transition-opacity" />

            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-colors duration-500 -z-10" />

            {/* Background Image Layer */}
            {project.image && (
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 opacity-40 group-hover:opacity-60 mix-blend-screen" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-transparent to-transparent" />
              </div>
            )}

            <div className="flex justify-between items-start mb-12 relative z-10">
              <div>
                <div className="text-xs font-orbitron text-cyan-400 mb-3 tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                  {project.category} // {project.period}
                </div>
                <h3 className="text-3xl lg:text-5xl font-orbitron font-bold text-white leading-tight">
                  {project.title}
                </h3>
              </div>
              <div className="w-14 h-14 rounded-full glass-panel flex items-center justify-center transform group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300">
                <ArrowUpRight className="w-6 h-6 transition-colors" />
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-slate-400 mb-8 max-w-2xl leading-relaxed font-light text-lg">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {project.technologies.map(tech => (
                  <span 
                    key={tech} 
                    className="px-4 py-2 rounded-full text-xs font-mono bg-white/5 text-white border border-white/10 group-hover:border-cyan-500/40 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Abstract Background Visual for NFT Card Style */}
            <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-gradient-to-tl from-cyan-600/20 to-transparent blur-3xl rounded-full translate-x-1/3 translate-y-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Hologram Zoom Effect */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl pointer-events-none overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] mix-blend-screen" />
            
            {/* Grid overlay */}
            <div 
              className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: 'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
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
              <div className="absolute inset-0 z-40 pointer-events-none hud-border opacity-100 border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.3)]" />
              
              <img 
                src={portfolioData.projects.find(p => p.id === activeProject)?.image} 
                alt="Presentation Visual"
                className="w-full h-full object-cover filter contrast-125 saturate-150 brightness-110 opacity-90 mix-blend-lighten"
              />

              {/* Scanning Line */}
              <motion.div 
                className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,1)] z-50 opacity-50"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div 
                key={presentationText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-12 left-12 z-50 text-cyan-400 font-orbitron text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] max-w-[80%]"
              >
                {presentationText}
              </motion.div>
            </motion.div>

            {/* Hardware Projector Base at bottom */}
            <div className="absolute bottom-0 w-full h-[15vh] bg-gradient-to-t from-cyan-950/80 to-transparent z-10 flex items-end justify-center pb-8">
              <div className="w-64 h-2 bg-cyan-500/50 rounded-full blur-md" />
              <div className="absolute w-32 h-1 bg-cyan-400 rounded-full shadow-[0_0_30px_rgba(6,182,212,1)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
