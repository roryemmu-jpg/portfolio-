import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 777) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 777;
        }
        return prev + Math.floor(Math.random() * 70) + 20;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[200] bg-[#030712] flex flex-col items-center justify-center font-orbitron text-cyan-400"
    >
      <div className="w-72 relative">
        <div className="text-5xl font-bold mb-6 text-center tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
          5757
        </div>
        <div className="h-1 w-full bg-cyan-900/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            style={{ width: `${Math.min(100, (progress / 777) * 100)}%` }}
          />
        </div>
        <div className="mt-4 text-sm tracking-widest flex justify-between">
          <span className="animate-pulse">DOWNLOADING_SYS</span>
          <span>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}
