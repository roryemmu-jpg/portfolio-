export const portfolioData = {
  name: "Emmanuel Sathur",
  role: "Full Stack & AI Developer",
  tagline: "Building AI-powered, impactful products.",
  about: "3rd-year IT student passionate about building real-world solutions. Experienced in full-stack development, hackathon-winning projects, and deploying AI-driven applications.",
  email: "roryemmu@gmail.com",
  location: "Hyderabad, India",
  socials: {
    linkedin: "https://linkedin.com/in/emmanuel-sathur-113128342",
    github: "https://github.com/roryemmu-jpg",
  },
  education: {
    degree: "B.Tech — Information Technology",
    institution: "VJIT, Hyderabad",
    period: "2024 – 2028",
    cgpa: "7.5",
  },
  skills: {
    languages: ["C", "C++", "Java", "Python", "HTML", "CSS", "JavaScript", "TypeScript"],
    frontend: ["React", "Vite", "Tailwind CSS", "CSS Modules"],
    backend: ["Node.js", "Express.js", "MongoDB", "Firebase"],
    ai: ["LangChain", "Gemini", "HuggingFace", "Agentic AI"],
    tools: ["Git", "Figma", "OBS", "Google Cloud Run"],
  },
  projects: [
    {
      id: "medisense",
      title: "MediSense AI",
      category: "Hackathon Project – HackXplore VJIT",
      period: "2024–2025",
      description: "Multilingual clinical triage web app with 6 input modalities (text, voice, 3D pain map, RetinaScan AI, ISL Assist). Won 2nd Prize out of 30+ teams.",
      technologies: ["React", "Vite", "TypeScript", "Firebase", "Gemini 2.0 Flash"],
      featured: true,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000"
    },
    {
      id: "crashguard",
      title: "CrashGuard",
      category: "IoT Accident Detection System",
      period: "2024",
      description: "RC car prototype with ESP32 firmware for crash detection, Firebase real-time DB integration, and a React dashboard for live alerts.",
      technologies: ["ESP32", "Firebase", "React", "IoT"],
      featured: true,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000"
    },
    {
      id: "jarvis",
      title: "JARVIS – Personal AI Assistant",
      category: "Self-initiated",
      period: "2025",
      description: "A fully AI-powered personal assistant that runs as a terminal-based app (CLI) for daily activity tracking, powered by an LLM orchestrated with LangChain.",
      technologies: ["Python", "LangChain", "LLMs", "CLI"],
      featured: true,
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=2000"
    },
    {
      id: "church-website",
      title: "Church Community Website",
      category: "Self-initiated",
      period: "2025",
      description: "Built and currently maintains the live website for the church community, developed using Gemini AI Studio with Firebase as the backend.",
      technologies: ["React", "Firebase", "Gemini AI Studio"],
      featured: false,
      image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=2000"
    },
    {
      id: "cyberbugs",
      title: "CyberBugs Dev Tools",
      category: "Startup/Tools",
      period: "2024",
      description: "Python Port Scanner and Basic Vulnerability Scanner. Includes a Voice Assistant built using Python with real-time command parsing.",
      technologies: ["Python", "Cybersecurity", "Voice APIs"],
      featured: false,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2000"
    },
    {
      id: "home-security",
      title: "Home Security Check-In/Out",
      category: "Arduino/IoT Project",
      period: "2025",
      description: "Camera-based check-in/check-out system for home security using an ESP32 Wi-Fi Cam module to capture and log entry/exit activity.",
      technologies: ["Arduino", "ESP32", "IoT"],
      featured: false,
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=2000"
    }
  ],
  experience: [
    {
      id: "devup",
      role: "Event & Operations Lead",
      company: "DevUp Society, VJIT",
      period: "2024–Present",
      description: "Leading the college's developer community — organizing workshops, hackathon prep sessions, and peer-to-peer tech learning. Driving a culture of building and shipping projects.",
    },
    {
      id: "cyberbugs-founder",
      role: "Founder",
      company: "CyberBugs",
      period: "2024–Present",
      description: "Founded CyberBugs — a 2-person dev team focused on AI, security tools, and hackathon-ready full-stack products.",
    }
  ]
};
