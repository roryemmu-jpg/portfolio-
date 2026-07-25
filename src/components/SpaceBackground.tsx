import React from 'react';
import { motion } from 'motion/react';

export function SpaceBackground() {
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 40 + 30, // Extremely slow drifting
    delay: Math.random() * -30,
    hex: Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase(),
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Abstract Grid and Grid Points */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute font-mono text-[10px] text-cyan-500/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: ['0vh', '-100vh'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: p.delay,
          }}
        >
          {p.id % 3 === 0 ? p.hex : <div className="w-1 h-1 bg-cyan-500/40 rounded-full" />}
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505] z-10" />
    </div>
  );
}
