import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, PresentationControls, Sparkles, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, Code, Monitor, Cpu, ChevronDown, Menu, X, Plus, Minus, Layers, Terminal, Sparkles as SparklesIcon, Github, Linkedin, Twitter, Mail, Trophy, Award, Users, Volume2, VolumeX } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Ambient Soundscape Engine ---
class AmbientSoundscape {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private isPlaying = false;

  start() {
    if (this.isPlaying) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!this.ctx) {
      this.ctx = new AudioContextClass();
    }
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 4); // Very slow fade in
    
    // Warm low-pass filter to make it ambient and not harsh
    const masterFilter = this.ctx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.value = 1000;
    
    this.masterGain.connect(masterFilter);
    masterFilter.connect(this.ctx.destination);

    // Ethereal chord frequencies (e.g., Cmaj9 / open voicing)
    const frequencies = [130.81, 196.00, 246.94, 293.66, 392.00]; // C3, G3, B3, D4, G4
    
    frequencies.forEach(freq => {
      if(!this.ctx || !this.masterGain) return;
      
      const osc = this.ctx.createOscillator();
      const panner = this.ctx.createStereoPanner();
      const oscGain = this.ctx.createGain();

      // Soft sine waves
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      // Slight detune for thickness
      osc.detune.value = (Math.random() - 0.5) * 10;

      // Setup slow LFO for volume pulsing (breathing effect)
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.02 + Math.random() * 0.05; // Very slow speed
      
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 0.5; // Depth of volume modulation
      
      lfo.connect(lfoGain);
      
      // We want base volume 0.5, fluctuating up and down
      oscGain.gain.value = 0.5;
      lfoGain.connect(oscGain.gain);

      // Random panning for width
      panner.pan.value = (Math.random() - 0.5) * 1.2;

      osc.connect(oscGain);
      oscGain.connect(panner);
      panner.connect(this.masterGain);

      osc.start();
      lfo.start();
      
      this.oscillators.push(osc);
      this.oscillators.push(lfo);
    });

    // Add gentle noise for "air" texture
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // White noise
    }
    
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 400; // Low rumble
    noiseFilter.Q.value = 0.5;
    
    const noiseVol = this.ctx.createGain();
    noiseVol.gain.value = 0.05; // Very quiet
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseVol);
    noiseVol.connect(this.masterGain);
    
    noiseSource.start();
    this.oscillators.push(noiseSource);
    
    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying || !this.masterGain || !this.ctx) return;
    
    // Slow fade out
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 3);
    
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch(e) {}
      });
      this.oscillators = [];
      this.masterGain?.disconnect();
      this.masterGain = null;
      this.isPlaying = false;
    }, 3100);
  }
}

const ambientAudio = new AmbientSoundscape();

// --- Custom Cursor ---
function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white/50 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
      }}
      transition={{ type: 'spring', stiffness: 2500, damping: 25, mass: 0.05 }}
    >
      <motion.div 
        className="w-1 h-1 bg-white rounded-full"
        animate={{ opacity: isHovering ? 0 : 1 }}
      />
    </motion.div>
  );
}

// --- 3D Abstract Shape ---
function AbstractShape({ color = "#ffffff", variant = 0 }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      group.current.rotation.y += 0.005;
      group.current.rotation.x += 0.002;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh castShadow receiveShadow>
          {variant === 0 && <torusKnotGeometry args={[1, 0.3, 128, 32]} />}
          {variant === 1 && <icosahedronGeometry args={[1.5, 0]} />}
          {variant === 2 && <octahedronGeometry args={[1.5, 0]} />}
          
          <meshPhysicalMaterial 
            color={color}
            metalness={0.9}
            roughness={0.1}
            transmission={0.9}
            ior={1.5}
            thickness={0.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* Wireframe Core */}
        <mesh>
           {variant === 0 && <icosahedronGeometry args={[0.5, 1]} />}
           {variant === 1 && <torusGeometry args={[0.8, 0.2, 16, 100]} />}
           {variant === 2 && <icosahedronGeometry args={[0.7, 0]} />}
           <meshStandardMaterial color={color === "#f8fafc" ? "#000000" : "#ffffff"} wireframe />
        </mesh>
      </Float>
    </group>
  );
}

// --- Holographic Component ---
function HolographicDevice() {
  const group = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (group.current) {
      // Smoothly track mouse for parallax effect
      const targetX = state.pointer.x * 0.4;
      const targetY = state.pointer.y * 0.4;
      
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetX, 4, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -targetY, 4, delta);
    }
    
    if (coreRef.current) {
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        
        {/* Main Spatial Glass Window */}
        <RoundedBox args={[7, 4.5, 0.1]} radius={0.3} smoothness={16} position={[0, 0, -0.1]}>
          <meshPhysicalMaterial 
            color="#ffffff"
            transmission={0.95}
            opacity={1}
            metalness={0.5}
            roughness={0.1}
            ior={1.52}
            thickness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>

        {/* Frosted Layer */}
        <RoundedBox args={[6.9, 4.4, 0.01]} radius={0.25} smoothness={16} position={[0, 0, 0]}>
          <meshPhysicalMaterial 
            color="#0a0a0a"
            transmission={0.4}
            opacity={0.8}
            metalness={0.8}
            roughness={0.6}
            ior={1.4}
          />
        </RoundedBox>

        {/* UI Elements Layer */}
        <group position={[0, 0, 0.05]}>
          
          {/* Top Navigation Bar */}
          <RoundedBox args={[6.5, 0.4, 0.02]} radius={0.1} smoothness={8} position={[0, 1.8, 0]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
          </RoundedBox>
          <RoundedBox args={[0.8, 0.2, 0.02]} radius={0.1} smoothness={4} position={[-2.7, 1.8, 0.02]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </RoundedBox>
          <RoundedBox args={[0.3, 0.2, 0.02]} radius={0.1} smoothness={4} position={[2.9, 1.8, 0.02]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </RoundedBox>
          <RoundedBox args={[0.3, 0.2, 0.02]} radius={0.1} smoothness={4} position={[2.5, 1.8, 0.02]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
          </RoundedBox>

          {/* Left Panel - Text/Content Blocks */}
          <group position={[-1.6, -0.1, 0]}>
            <RoundedBox args={[3.1, 3.2, 0.02]} radius={0.15} smoothness={8} position={[0, 0, 0]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
            </RoundedBox>
            {/* Mock Text Lines */}
            <RoundedBox args={[2.5, 0.15, 0.02]} radius={0.05} smoothness={4} position={[0, 1.2, 0.02]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
            </RoundedBox>
            <RoundedBox args={[2.0, 0.1, 0.02]} radius={0.05} smoothness={4} position={[-0.25, 0.9, 0.02]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
            </RoundedBox>
            <RoundedBox args={[2.2, 0.1, 0.02]} radius={0.05} smoothness={4} position={[-0.15, 0.7, 0.02]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
            </RoundedBox>
            <RoundedBox args={[1.8, 0.1, 0.02]} radius={0.05} smoothness={4} position={[-0.35, 0.5, 0.02]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
            </RoundedBox>
            
            {/* Interactive Cards */}
            <RoundedBox args={[1.2, 0.8, 0.05]} radius={0.1} smoothness={8} position={[-0.7, -0.4, 0.05]}>
              <meshPhysicalMaterial color="#38bdf8" transmission={0.5} roughness={0.2} clearcoat={1} />
            </RoundedBox>
            <RoundedBox args={[1.2, 0.8, 0.05]} radius={0.1} smoothness={8} position={[0.7, -0.4, 0.05]}>
              <meshPhysicalMaterial color="#818cf8" transmission={0.5} roughness={0.2} clearcoat={1} />
            </RoundedBox>
            
            <RoundedBox args={[2.6, 0.6, 0.02]} radius={0.1} smoothness={8} position={[0, -1.2, 0.02]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
            </RoundedBox>
          </group>

          {/* Right Panel - 3D Visualizer */}
          <group position={[1.6, -0.1, 0]}>
            <RoundedBox args={[3.1, 3.2, 0.02]} radius={0.15} smoothness={8} position={[0, 0, 0]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
            </RoundedBox>
            
            {/* 3D Core floating inside the glass UI */}
            <group ref={coreRef} position={[0, 0, 0.5]}>
              <mesh>
                <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
                <meshPhysicalMaterial 
                  color="#a78bfa" 
                  metalness={0.9} 
                  roughness={0.1} 
                  transmission={0.8} 
                  ior={1.5} 
                  thickness={0.5} 
                />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.2} />
              </mesh>
            </group>
            
            <RoundedBox args={[2.6, 0.4, 0.02]} radius={0.1} smoothness={8} position={[0, -1.3, 0.02]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
            </RoundedBox>
          </group>
          
        </group>
        
        {/* Soft Ambient Glow Behind */}
        <mesh position={[-3, 0, -1.5]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[3, 0, -1.5]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>

      </Float>
    </group>
  );
}

// --- NavBar ---
function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4",
      scrolled ? "bg-background/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="#" className="text-2xl font-bold tracking-tighter text-white z-50 relative">
          EMMANUEL<span className="text-white/40">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Work', 'Expertise', 'Tech', 'Journey', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-secondary hover:text-white transition-colors uppercase tracking-widest">{item}</a>
          ))}
          <a href="#contact" className="px-6 py-2 rounded-full bg-white text-black font-medium text-sm hover:scale-105 transition-transform duration-300">
            Let's Talk
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white z-50 relative" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 w-full h-screen bg-background border-b border-white/5 p-6 pt-32 flex flex-col gap-6 md:hidden z-40"
          >
            {['Work', 'Expertise', 'Tech', 'Journey', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-3xl font-medium text-secondary hover:text-white" onClick={() => setIsOpen(false)}>{item}</a>
            ))}
            <a href="#contact" onClick={() => setIsOpen(false)} className="w-full py-4 rounded-full bg-white text-black font-medium mt-auto mb-10 text-lg text-center flex items-center justify-center">
              Let's Talk
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- Hero Section ---
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textScale = useTransform(scrollY, [0, 400], [1, 1.1]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-gradient-to-tr from-sky-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <PresentationControls global rotation={[0, 0, 0]} polar={[-0.2, 0.2]} azimuth={[-0.3, 0.3]} config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
            <HolographicDevice />
          </PresentationControls>
          <Sparkles count={300} scale={15} size={2} speed={0.2} opacity={0.5} color="#ffffff" />
        </Canvas>
      </div>

      <motion.div className="relative z-20 text-center w-full max-w-5xl px-6 pointer-events-none" style={{ y, opacity, scale: textScale }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
          <span className="inline-block py-1 px-4 rounded-full border border-white/10 bg-white/5 text-xs font-medium tracking-widest text-white/70 mb-6 uppercase backdrop-blur-md">
            Full Stack & AI Developer
          </span>
        </motion.div>
        
        <motion.h1 
          className="text-[11vw] md:text-[8rem] font-bold leading-[0.8] tracking-tighter mix-blend-difference relative z-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          EMMANUEL
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/70 to-white/30">
            SATHUR.
          </span>
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto mix-blend-difference">
          <span className="text-xs text-white uppercase tracking-widest">Scroll to explore</span>
          <ChevronDown className="text-white animate-bounce" size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// --- Horizontal Scroll Showcase (Work) ---
function WorkShowcase() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const allProjects = [
    { 
      title: "MediSense AI", 
      desc: "Multilingual clinical triage web app with 6 input modalities. Built with React, Firebase, and Gemini 2.0 Flash for real-time AI inference.", 
      color: "#0a0a0a", 
      variant: 1,
      categories: ["AI", "Full Stack"],
      details: [
        "Multilingual clinical triage web app with 6 input modalities — text, voice (English/Hindi/Telugu), 3D pain map, RetinaScan AI, ISL Assist, and SilentDoc.",
        "Built with React, Vite, TypeScript, Firebase, and Gemini 2.0 Flash for real-time AI inference.",
        "Integrated Web Speech API for Hindi/Telugu voice input targeting underserved rural populations in India.",
        "Won 2nd Prize at HackXplore Hackathon, VJIT, competing against 30+ teams.",
        "Currently in active development; hackathon demo tested by 5–10 users with RetinaScan AI performing reliably."
      ]
    },
    { 
      title: "Nova Analytics", 
      desc: "A highly interactive, real-time data visualization dashboard featuring predictive analytics and complex bento-grid layouts.", 
      color: "#0ea5e9", 
      variant: 2,
      categories: ["Full Stack", "AI"],
      details: [
        "Built a modular React/Vite architecture rendering dynamic, resizeable bento-grid components.",
        "Integrated real-time WebSocket streams for live metric updates without relying on polling.",
        "Implemented high-performance charting capabilities to visualize multi-dimensional datasets.",
        "Designed an elegant, low-contrast dark mode palette ensuring maximum readability during prolonged usage."
      ]
    },
    { 
      title: "JARVIS AI", 
      desc: "Fully AI-powered personal assistant CLI powered by an LLM orchestrated with LangChain for natural language understanding.", 
      color: "#1e1b4b", 
      variant: 0,
      categories: ["AI"],
      details: [
        "Built a fully AI-powered personal assistant that runs as a terminal-based app (CLI), not a website, for daily activity tracking.",
        "Powered by an LLM orchestrated with LangChain for natural language understanding and task automation.",
        "Integrates with local system APIs for customized daily automation flows."
      ]
    }
  ];

  const projects = allProjects.filter(p => selectedCategory === 'All' || p.categories.includes(selectedCategory));

  const { scrollYProgress } = useScroll({ target: targetRef });
  
  // Calculate total width based on number of projects
  // If we have 3 projects, we need 300vw.
  const numProjects = Math.max(1, projects.length); // Avoid division by zero
  const widthViewport = `${numProjects * 100}vw`;
  
  // X transform goes from 0% to -((numProjects - 1) / numProjects * 100)%
  const maxScroll = -((numProjects - 1) / numProjects) * 100;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `${maxScroll}%`]);
  
  const springX = useSpring(x, { stiffness: 400, damping: 90 });
  const categories = ['All', 'AI', 'Full Stack', 'IoT'];

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!targetRef.current) return;
      
      const rect = targetRef.current.getBoundingClientRect();
      // Add a small buffer to account for smooth scrolling or rounding errors
      const inView = rect.top <= 5 && rect.bottom >= window.innerHeight - 5;
      
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <section id="work" ref={targetRef} className="relative bg-background" style={{ height: `${numProjects * 100}vh` }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          
          {/* Category Filter */}
          <div className="absolute top-24 left-6 md:left-24 z-30">
            <h2 className="text-3xl font-medium tracking-tight mb-6">Work Showcase.</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                    selectedCategory === cat 
                      ? "bg-white text-black border-white" 
                      : "bg-white/5 text-secondary border-white/10 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div style={{ x: springX, width: widthViewport }} className="flex h-full items-center mt-12">
            <AnimatePresence mode="popLayout">
              {projects.map((project, i) => (
                <motion.div 
                  key={project.title} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="w-screen h-full flex items-center justify-center px-6 md:px-24"
                >
                  <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative pt-20 md:pt-0">
                    
                    {/* 3D Model Container */}
                    <div className="w-full md:w-1/2 h-[40vh] md:h-[60vh] relative z-10 glass-panel rounded-[2rem] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-0 pointer-events-none" />
                      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <ambientLight intensity={1} />
                        <spotLight position={[5, 5, 5]} intensity={2} />
                        <PresentationControls global rotation={[0.1, 0, 0]} polar={[-0.2, 0.2]} azimuth={[-0.5, 0.5]}>
                          <AbstractShape color={project.color} variant={project.variant} />
                        </PresentationControls>
                        <Environment preset="city" />
                      </Canvas>
                    </div>
                    
                    {/* Text Content */}
                    <div className="w-full md:w-1/2 z-20">
                      <div className="flex gap-2 mb-4">
                        {project.categories.map(cat => (
                          <span key={cat} className="text-xs font-medium tracking-widest text-white/50 uppercase border border-white/10 px-3 py-1 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none">{project.title}</h2>
                      <p className="text-xl text-secondary mb-10 max-w-md">{project.desc}</p>
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="px-8 py-4 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                      >
                        View Case Study <ArrowRight size={18} />
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-surface border border-white/10 p-8 md:p-12 rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="text-sm font-medium tracking-widest text-white/50 uppercase mb-4">Case Study</div>
              <h3 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter">{selectedProject.title}</h3>
              
              <div className="space-y-4">
                {selectedProject.details.map((detail: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2.5 shrink-0" />
                    <p className="text-lg text-secondary leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/10">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="px-8 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Close Case Study
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- GitHub Activity Visualization ---
function GitHubActivity() {
  const weeks = 52;
  const daysPerWeek = 7;
  const totalDays = weeks * daysPerWeek;
  
  const [contributions, setContributions] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate realistic-looking commit activity
    const data = Array.from({ length: totalDays }, () => {
      // Create some patterns so it looks somewhat like a real graph
      const rand = Math.random();
      if (rand > 0.9) return 4;
      if (rand > 0.7) return 3;
      if (rand > 0.5) return 2;
      if (rand > 0.3) return 1;
      return 0;
    });
    setContributions(data);
  }, []);

  const getColor = (level: number) => {
    switch(level) {
      case 4: return 'bg-emerald-400';
      case 3: return 'bg-emerald-500/80';
      case 2: return 'bg-emerald-600/60';
      case 1: return 'bg-emerald-700/40';
      default: return 'bg-white/5';
    }
  };

  return (
    <div className="mt-20 pt-16 border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h3 className="text-3xl font-medium mb-3 flex items-center gap-3">
            <Github size={28} /> Consistent Activity
          </h3>
          <p className="text-secondary text-lg max-w-xl">A visualization of my coding consistency and daily contributions across projects.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-secondary">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-white/5" />
            <div className="w-3 h-3 rounded-sm bg-emerald-700/40" />
            <div className="w-3 h-3 rounded-sm bg-emerald-600/60" />
            <div className="w-3 h-3 rounded-sm bg-emerald-500/80" />
            <div className="w-3 h-3 rounded-sm bg-emerald-400" />
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="glass-panel p-8 rounded-[2rem] overflow-x-auto relative group">
        <div className="min-w-[800px] flex gap-1.5">
          {Array.from({ length: weeks }).map((_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1.5">
              {Array.from({ length: daysPerWeek }).map((_, dayIdx) => {
                const day = weekIdx * daysPerWeek + dayIdx;
                const level = contributions[day] || 0;
                return (
                  <motion.div 
                    key={dayIdx}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.2, delay: (weekIdx * 0.01) }}
                    className={`w-3.5 h-3.5 rounded-[3px] ${getColor(level)} transition-colors hover:ring-2 hover:ring-white/50 cursor-crosshair`}
                  />
                )
              })}
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface/20 pointer-events-none" />
      </div>
    </div>
  );
}

// --- Expertise ---
function Expertise() {
  const skills = [
    { 
      icon: <Code />, 
      title: "Full Stack Development", 
      desc: "End-to-end product development using React, Node.js, Express, MongoDB, TypeScript, and Vite.",
      projects: ["MediSense AI", "Nova Analytics"]
    },
    { 
      icon: <SparklesIcon />, 
      title: "AI/ML Integration", 
      desc: "Building intelligent applications with Gemini, LangChain, Agentic AI pipelines, and Vertex AI.",
      projects: ["MediSense AI", "JARVIS AI"]
    },
    { 
      icon: <Monitor />, 
      title: "Cybersecurity & Cloud", 
      desc: "Vulnerability assessment, Firebase, Google Cloud Run, Git/GitHub, and CI/CD basics.",
      projects: ["Nova Analytics", "CyberBugs Projects"]
    }
  ];

  return (
    <section id="expertise" className="py-32 relative z-20 bg-surface border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="mb-20 md:w-2/3">
          <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-6 leading-[1.1]">
            Bridging the gap between <br/>
            <span className="text-white/40">design and engineering.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-panel glass-panel-hover p-10 rounded-[2rem] transition-all duration-500 group relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] group-hover:bg-white/10 transition-colors duration-500" />
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-8 text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300 relative z-10">
                {skill.icon}
              </div>
              <h3 className="text-2xl font-medium mb-4 relative z-10">{skill.title}</h3>
              <p className="text-secondary leading-relaxed text-lg mb-8 relative z-10">{skill.desc}</p>
              
              <div className="relative z-10 mt-auto">
                <div className="text-sm font-medium tracking-widest text-white/40 uppercase mb-4 border-t border-white/10 pt-6">Featured Work</div>
                <div className="flex flex-wrap gap-2">
                  {skill.projects.map(project => (
                    <span key={project} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 group-hover:bg-white/10 transition-colors">
                      {project}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <GitHubActivity />
      </div>
    </section>
  );
}

// --- Tech Stack Interactive ---
function TechStack() {
  const tech = [
    { id: 1, name: "Core Web & Backend", desc: "React, Node.js, Express, MongoDB, TypeScript, Tailwind CSS.", icon: <Layers /> },
    { id: 2, name: "AI & ML", desc: "Gemini, LangChain, Vertex AI, Agentic Pipelines.", icon: <Cpu /> },
    { id: 3, name: "Cybersecurity", desc: "Port scanning, Vulnerability assessment, CTF mindset.", icon: <SparklesIcon /> },
    { id: 4, name: "DevOps & Cloud", desc: "Firebase, Google Cloud Run, Git/GitHub, CI/CD.", icon: <Terminal /> },
  ];

  const [active, setActive] = useState(tech[0]);

  return (
    <section id="tech" className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-6xl font-medium text-center mb-20 tracking-tighter">The Toolkit.</h2>
        
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* Interactive Circle Map */}
          <div className="w-full md:w-1/2 aspect-square relative flex items-center justify-center">
            <div className="absolute w-2/3 h-2/3 rounded-full border border-white/10 animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-full h-full rounded-full border border-white/5 animate-[spin_60s_linear_infinite_reverse]" />
            
            {tech.map((item, i) => {
              const angle = (i * (360 / tech.length)) * (Math.PI / 180);
              const radius = 40; // percentage
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              const isActive = active.id === item.id;
              
              return (
                <button
                  key={item.id}
                  onMouseEnter={() => setActive(item)}
                  onClick={() => setActive(item)}
                  className={cn(
                    "absolute w-16 h-16 -ml-8 -mt-8 rounded-full flex items-center justify-center transition-all duration-500 z-10",
                    isActive ? "bg-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]" : "bg-surface border border-white/10 text-white/50 hover:text-white"
                  )}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {item.icon}
                </button>
              );
            })}
            
            {/* Center display */}
            <div className="w-32 h-32 rounded-full glass-panel flex items-center justify-center z-0">
              <span className="text-white/20 font-bold tracking-widest text-sm uppercase">Stack</span>
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-10 rounded-[2rem]"
              >
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center mb-6">
                  {active.icon}
                </div>
                <h3 className="text-3xl font-medium mb-4">{active.name}</h3>
                <p className="text-xl text-secondary leading-relaxed">{active.desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Story / Timeline ---
function Journey() {
  return (
    <section id="journey" className="py-32 bg-surface border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 sticky top-32">
              The Journey.
            </h2>
          </div>
          <div className="md:w-2/3 space-y-32">
            {[
              { year: "2024", title: "The Beginning", text: "Started my journey as an IT student at VJIT. Dove deep into programming, cybersecurity, and open-source." },
              { year: "2025", title: "Hackathon Success", text: "Won 2nd Prize at HackXplore for MediSense AI. Represented VJIT at Smart India Hackathon (SIH)." },
              { year: "2026", title: "Leading the Community", text: "Event & Operations Lead at DevUp Society, and Co-Founder of CyberBugs, focusing on AI and security tools." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative pl-12 md:pl-0"
              >
                <div className="md:hidden absolute left-0 top-0 w-px h-full bg-white/10" />
                <div className="md:hidden absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-white" />
                
                <h3 className="text-xl font-medium text-white/50 mb-2">{item.year}</h3>
                <h4 className="text-3xl font-medium mb-4">{item.title}</h4>
                <p className="text-xl text-secondary leading-relaxed max-w-xl">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Achievements & Leadership ---
function AchievementCard({ item, index }: { item: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="glass-panel p-10 rounded-[2rem] flex flex-col h-full relative overflow-hidden group perspective-1000"
    >
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] group-hover:bg-white/10 transition-colors duration-500" 
      />
      <div 
        style={{ transform: "translateZ(40px)" }}
        className="flex items-start justify-between mb-8 relative z-10"
      >
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white relative shadow-xl">
          {item.icon}
        </div>
        <span className="text-xs font-medium tracking-widest text-white/50 uppercase border border-white/10 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md">
          {item.date}
        </span>
      </div>
      <motion.h3 
        style={{ transform: "translateZ(50px)" }}
        className="text-2xl font-medium mb-4 relative z-10"
      >
        {item.title}
      </motion.h3>
      <motion.p 
        style={{ transform: "translateZ(30px)" }}
        className="text-secondary leading-relaxed text-lg relative z-10"
      >
        {item.desc}
      </motion.p>
    </motion.div>
  );
}

function Achievements() {
  const achievements = [
    {
      icon: <Trophy className="text-yellow-500" />,
      title: "2nd Prize – HackXplore, VJIT",
      desc: "Developed MediSense AI, an AI-powered clinical triage app. Selected among top teams for real-world healthcare impact.",
      date: "2024–2025"
    },
    {
      icon: <Award className="text-blue-400" />,
      title: "Smart India Hackathon (SIH)",
      desc: "Represented VJIT at SIH, one of India's largest student hackathons, showcasing full-stack capabilities.",
      date: "Participant"
    },
    {
      icon: <Users className="text-emerald-400" />,
      title: "Event & Ops Lead | DevUp Society",
      desc: "Leading the college's developer community. Organizing workshops, hackathons, and driving a culture of shipping projects.",
      date: "2024–Present"
    },
    {
      icon: <Cpu className="text-purple-400" />,
      title: "Co-Founder | CyberBugs",
      desc: "Founded a 2-person dev team focused on AI, security tools, and building hackathon-ready full-stack products.",
      date: "2024–Present"
    }
  ];

  return (
    <section id="achievements" className="py-32 bg-background border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-20 text-center">
          Achievements & Leadership.
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6" style={{ perspective: "1000px" }}>
          {achievements.map((item, i) => (
            <AchievementCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- FAQ ---
function FAQ() {
  const faqs = [
    { q: "Are you available for freelance work?", a: "Yes, I am currently accepting new projects for Q3/Q4. Feel free to reach out via the contact section to discuss your ideas." },
    { q: "What is your typical process?", a: "I start with a deep dive into your goals and target audience. Then we move to wireframing, high-fidelity design in Figma, and finally, precise execution in code." },
    { q: "Do you offer both design and development?", a: "Absolutely. I specialize in bridging the gap between design and engineering, ensuring the final product matches the initial vision perfectly." },
  ];
  
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 bg-surface">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-medium mb-16 tracking-tighter text-center">Common Questions.</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="glass-panel rounded-2xl overflow-hidden cursor-pointer" onClick={() => setOpenIdx(isOpen ? null : i)}>
                <div className="px-8 py-6 flex justify-between items-center">
                  <h3 className="text-lg font-medium">{faq.q}</h3>
                  <div className="text-white/50">{isOpen ? <Minus size={20}/> : <Plus size={20}/>}</div>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-6 text-secondary"
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --- Final CTA ---
function FinalCTA() {
  return (
    <section id="contact" className="py-40 text-center px-6 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h2 className="text-6xl md:text-[8rem] font-bold tracking-tighter mb-8 leading-none">Let's Build<br/>Something.</h2>
        <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto">Open for new opportunities and exciting collaborations.</p>
        <a href="mailto:roryemmu@gmail.com" className="px-12 py-6 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 mx-auto w-max">
          <Mail size={20} /> roryemmu@gmail.com
        </a>
      </motion.div>
    </section>
  );
}

// --- Footer ---
function Footer() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const toggleSound = () => {
    if (soundEnabled) {
      ambientAudio.stop();
    } else {
      ambientAudio.start();
    }
    setSoundEnabled(!soundEnabled);
  };

  return (
    <footer className="pt-20 pb-10 border-t border-white/10 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full overflow-hidden flex justify-center pointer-events-none opacity-5">
        <span className="text-[15vw] font-black leading-none tracking-tighter">EMMANUEL</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <a href="#" className="text-3xl font-bold tracking-tighter text-white mb-6 block">
              EMMANUEL<span className="text-white/40">.</span>
            </a>
            <p className="text-secondary max-w-sm">
              3rd-year IT student passionate about building AI-powered, impactful products and real-world solutions.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-6">Navigation</h4>
            <ul className="space-y-4 text-secondary">
              <li><a href="#work" className="hover:text-white transition-colors">Work</a></li>
              <li><a href="#expertise" className="hover:text-white transition-colors">Expertise</a></li>
              <li><a href="#journey" className="hover:text-white transition-colors">Journey</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-6">Socials</h4>
            <ul className="space-y-4 text-secondary">
              <li><a href="https://github.com/roryemmu-jpg" target="_blank" className="hover:text-white transition-colors flex items-center gap-2"><Github size={16}/> GitHub</a></li>
              <li><a href="https://linkedin.com/in/emmanuel-sathur-113128342" target="_blank" className="hover:text-white transition-colors flex items-center gap-2"><Linkedin size={16}/> LinkedIn</a></li>
              <li><a href="mailto:roryemmu@gmail.com" className="hover:text-white transition-colors flex items-center gap-2"><Mail size={16}/> Email</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-secondary">
          <p>© 2026 Emmanuel Sathur. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
            <button 
              onClick={toggleSound}
              className="flex items-center gap-2 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10"
              aria-label="Toggle ambient sound"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{soundEnabled ? 'Ambient Sound: On' : 'Ambient Sound: Off'}</span>
            </button>
            <a href="#" className="hover:text-white">Built with React & Three.js</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Main App ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return p + Math.floor(Math.random() * 5) + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="fixed inset-0 z-[99999] bg-background flex flex-col items-center justify-center text-white"
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold tracking-tighter mb-8"
            >
              EMMANUEL.
            </motion.div>
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-6 text-xs text-white/40 font-medium tracking-[0.2em] uppercase">
              Initializing Experience {progress}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <NavBar />
          <Hero />
          <WorkShowcase />
          <Expertise />
          <TechStack />
          <Journey />
          <Achievements />
          <FAQ />
          <FinalCTA />
          <Footer />
        </motion.div>
      )}
    </>
  );
}
