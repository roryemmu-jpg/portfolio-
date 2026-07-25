import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { portfolioData } from '../lib/data';
import { Terminal, Code2, Cpu, GraduationCap, FileText, X, Send, LogIn } from 'lucide-react';
import { initAuth, googleSignIn, getAccessToken } from '../lib/auth';
import { User } from 'firebase/auth';

export function Resume() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  
  const [needsAuth, setNeedsAuth] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUser(user);
        setToken(token);
        setNeedsAuth(false);
      },
      () => setNeedsAuth(true)
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg('');
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setErrorMsg('Authentication failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const getOrCreateSpreadsheet = async (accessToken: string) => {
    let sheetId = localStorage.getItem('resume_requests_sheet_id');
    if (!sheetId) {
      const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: { title: "Resume Requests Archive" },
          sheets: [{ properties: { title: "Requests" } }]
        })
      });
      if (!res.ok) throw new Error('Failed to create spreadsheet');
      const data = await res.json();
      sheetId = data.spreadsheetId;
      localStorage.setItem('resume_requests_sheet_id', sheetId!);
      
      // Add headers
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [['Timestamp', 'Requester Email', 'Target Email', 'Purpose']]
        })
      });
    }
    return sheetId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) {
      setNeedsAuth(true);
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const currentToken = await getAccessToken() || token;
      const sheetId = await getOrCreateSpreadsheet(currentToken);
      
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [[new Date().toISOString(), user.email, email, purpose]]
        })
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          setNeedsAuth(true);
          throw new Error("Session expired. Please sign in again.");
        }
        throw new Error("Failed to save request");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setEmail('');
        setPurpose('');
      }, 3000);
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Transmission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="resume" className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight font-orbitron uppercase">
              System Archives
            </h2>
            <p className="text-xl text-cyan-400 font-mono">
              // RESUME_DATA_STREAM
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative px-6 py-3 bg-cyan-500/10 text-cyan-400 overflow-hidden hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] border border-cyan-500/50 flex-shrink-0"
            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative font-bold text-sm font-orbitron tracking-widest uppercase flex items-center gap-2">
              <FileText className="w-4 h-4" /> Request_Resume
            </span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Education Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 hud-panel p-8"
          >
            <div className="absolute inset-0 z-40 pointer-events-none hud-border opacity-50" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-orbitron text-white uppercase tracking-wider">Education</h3>
            </div>

            <div className="relative pl-6 border-l border-cyan-500/30">
              <div className="absolute w-3 h-3 bg-cyan-400 rounded-full -left-[6.5px] top-1 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <div className="mb-2 text-cyan-400 font-mono text-sm">{portfolioData.education.period}</div>
              <h4 className="text-lg font-bold text-white mb-1">{portfolioData.education.degree}</h4>
              <p className="text-slate-400 mb-2">{portfolioData.education.institution}</p>
              <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono rounded">
                CGPA: {portfolioData.education.cgpa}
              </div>
            </div>
          </motion.div>

          {/* Skills Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 hud-panel p-8"
          >
            <div className="absolute inset-0 z-40 pointer-events-none hud-border opacity-50" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-orbitron text-white uppercase tracking-wider">Technical Specs</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Category 1 */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-mono text-cyan-400 mb-4 border-b border-cyan-900/50 pb-2">
                  <Code2 className="w-4 h-4" /> LANGUAGES & CORE
                </h4>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.languages.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category 2 */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-mono text-purple-400 mb-4 border-b border-purple-900/50 pb-2">
                  <Cpu className="w-4 h-4" /> AI & BACKEND
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[...portfolioData.skills.ai, ...portfolioData.skills.backend].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Category 3 */}
              <div className="md:col-span-2">
                <h4 className="text-sm font-mono text-emerald-400 mb-4 border-b border-emerald-900/50 pb-2">
                  FRONTEND & TOOLS
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[...portfolioData.skills.frontend, ...portfolioData.skills.tools].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* Resume Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md hud-panel p-8 bg-[#050505] border border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.3)]"
            >
              <div className="absolute inset-0 z-40 pointer-events-none hud-border opacity-100" />
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-cyan-500 hover:text-cyan-300 transition-colors z-50 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h3 className="text-2xl font-orbitron text-white mb-2 tracking-wider">REQUEST_ACCESS</h3>
              <p className="text-cyan-400 font-mono text-sm mb-6">// ENTER_CREDENTIALS</p>

              {needsAuth ? (
                <div className="relative z-50 flex flex-col items-center py-8">
                  <p className="text-slate-300 font-mono text-sm text-center mb-6">
                    SYSTEM_AUTH_REQUIRED
                    <br />
                    Please verify identity via Google to proceed.
                  </p>
                  <button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className="group relative px-6 py-4 w-full bg-blue-500/10 text-blue-400 overflow-hidden hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] border border-blue-500/50 cursor-pointer disabled:opacity-50"
                    style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative font-bold text-sm font-orbitron tracking-widest uppercase flex items-center justify-center gap-2">
                      <LogIn className="w-4 h-4" /> {isLoggingIn ? 'AUTHENTICATING...' : 'GOOGLE_LOGIN'}
                    </span>
                  </button>
                  {errorMsg && <p className="text-red-400 text-xs font-mono mt-4 text-center">{errorMsg}</p>}
                </div>
              ) : submitSuccess ? (
                <div className="relative z-50 flex flex-col items-center py-8">
                  <div className="w-16 h-16 rounded-full border-2 border-emerald-500 flex items-center justify-center mb-4 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <Code2 className="w-8 h-8" />
                  </div>
                  <p className="text-emerald-400 font-mono text-center tracking-widest uppercase">
                    DATA_TRANSMITTED
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-50">
                  {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 text-xs font-mono">
                      ERROR: {errorMsg}
                    </div>
                  )}
                  <div>
                    <label htmlFor="email" className="block text-sm font-mono text-slate-400 mb-2">TARGET_EMAIL</label>
                    <input 
                      type="email" 
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-cyan-950/30 border border-cyan-500/30 text-white font-mono px-4 py-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all placeholder:text-cyan-900/50"
                      placeholder="user@domain.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-mono text-slate-400 mb-2">ACCESS_PURPOSE</label>
                    <textarea 
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      required
                      rows={3}
                      className="w-full bg-cyan-950/30 border border-cyan-500/30 text-white font-mono px-4 py-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all resize-none placeholder:text-cyan-900/50"
                      placeholder="State your intent..."
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group relative px-6 py-4 bg-cyan-500/10 text-cyan-400 overflow-hidden hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] border border-cyan-500/50 cursor-pointer disabled:opacity-50"
                    style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative font-bold text-sm font-orbitron tracking-widest uppercase flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> {isSubmitting ? 'TRANSMITTING...' : 'TRANSMIT_REQUEST'}
                    </span>
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
