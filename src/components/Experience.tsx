import React from 'react';
import { motion } from 'motion/react';
import { portfolioData } from '../lib/data';
import { cn } from '../lib/utils';

export function Experience() {
  return (
    <section className="py-32 border-t border-cyan-900/30 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-12 tracking-tight font-orbitron uppercase">
            Roles
          </h2>
          <div className="space-y-6">
            {portfolioData.experience.map((exp, i) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 hud-panel relative overflow-hidden group"
              >
                <div className="absolute inset-0 z-40 pointer-events-none hud-border opacity-30 group-hover:opacity-100 transition-opacity" />
                <div className="absolute right-0 bottom-0 w-48 h-48 bg-purple-600/10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  <div className="text-xs font-orbitron text-cyan-400 mb-2 tracking-widest uppercase opacity-80">
                    {exp.period}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1 font-orbitron">
                    {exp.role}
                  </h3>
                  <div className="text-sm font-sans font-medium text-slate-300 mb-4">
                    @ {exp.company}
                  </div>
                  <p className="text-slate-400 leading-relaxed font-light">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-12 tracking-tight font-orbitron uppercase">
            Capabilities
          </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(portfolioData.skills).map(([category, skills], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 hud-panel group relative overflow-hidden"
            >
              <div className="absolute inset-0 z-40 pointer-events-none hud-border opacity-30 group-hover:opacity-100 transition-opacity" />
              {/* Abstract Background Visual */}
              <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-600/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <h3 className="text-sm font-orbitron text-white capitalize mb-4 tracking-widest flex items-center gap-2 relative z-10">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:shadow-[0_0_10px_rgba(6,182,212,1)] transition-shadow" />
                {category}
              </h3>
              <div className="flex flex-wrap gap-2 relative z-10">
                {skills.map(skill => (
                  <span 
                    key={skill}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono bg-white/5 text-slate-300 border border-white/10 group-hover:border-white/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
