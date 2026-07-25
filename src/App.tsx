/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Resume } from './components/Resume';
import { Contact } from './components/Contact';
import { SpaceBackground } from './components/SpaceBackground';
import { Preloader } from './components/Preloader';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <ThemeProvider>
      <AnimatePresence>
        {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      <div className="min-h-screen bg-[#030712] transition-colors duration-500 font-sans selection:bg-cyan-500/30 text-white relative">
        <SpaceBackground />
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-6 sm:px-12 md:px-24">
          <Hero />
          <Projects />
          <Experience />
          <Resume />
          <Contact />
        </main>
        
        <footer className="py-12 text-center text-slate-500 text-sm border-t border-cyan-900/30 mt-20 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <p className="tracking-widest font-mono uppercase text-cyan-700">© {new Date().getFullYear()} Emmanuel Sathur. System Terminated.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}
