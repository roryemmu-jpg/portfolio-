import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import { portfolioData } from '../lib/data';
import { cn } from '../lib/utils';

export function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
      <div className={cn("px-8 py-4 flex items-center justify-between hud-panel w-full max-w-5xl mx-auto")}>
        <div className="absolute inset-0 z-40 pointer-events-none hud-border opacity-50" />
        <div className="font-bold text-lg text-white tracking-tight flex items-center gap-2 font-orbitron relative z-10">
          <span className="w-2 h-2 bg-cyan-400 animate-pulse" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          SATHUR
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6 relative z-10">
          <a href="#projects" className="text-xs font-orbitron text-slate-300 hover:text-white transition-colors hidden sm:block uppercase tracking-widest">
            Projects
          </a>
          <a href="#resume" className="text-xs font-orbitron text-slate-300 hover:text-white transition-colors hidden sm:block uppercase tracking-widest">
            Resume
          </a>
          <a href={portfolioData.socials.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all">
            <Github className="w-5 h-5" />
          </a>
          <a href={portfolioData.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
}
