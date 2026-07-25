import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, LogIn, Code2 } from 'lucide-react';
import { initAuth, googleSignIn, getAccessToken } from '../lib/auth';
import { User } from 'firebase/auth';

export function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
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
    let sheetId = localStorage.getItem('contact_inquiries_sheet_id');
    if (!sheetId) {
      const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: { title: "Contact Inquiries Archive" },
          sheets: [{ properties: { title: "Inquiries" } }]
        })
      });
      if (!res.ok) throw new Error('Failed to create spreadsheet');
      const data = await res.json();
      sheetId = data.spreadsheetId;
      localStorage.setItem('contact_inquiries_sheet_id', sheetId!);
      
      // Add headers
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [['Timestamp', 'Sender Verified Email', 'Contact Email', 'Message']]
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
          values: [[new Date().toISOString(), user.email, email, message]]
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
        setSubmitSuccess(false);
        setEmail('');
        setMessage('');
      }, 3000);
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Transmission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="absolute inset-0 bg-cyan-900/5 rounded-3xl -z-10 border border-cyan-500/10" />
      
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-950/50 text-cyan-400 mb-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            <Mail className="w-8 h-8" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight font-orbitron uppercase"
          >
            Establish Connection
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 font-light max-w-2xl mx-auto"
          >
            System is currently accepting new inquiries. Open a channel to discuss opportunities or collaborations.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative w-full hud-panel p-8 bg-[#050505] border border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.3)]"
        >
          <div className="absolute inset-0 z-40 pointer-events-none hud-border opacity-100" />
          
          <h3 className="text-2xl font-orbitron text-white mb-2 tracking-wider">OPEN_CHANNEL</h3>
          <p className="text-cyan-400 font-mono text-sm mb-6">// ENTER_TRANSMISSION_DETAILS</p>

          {needsAuth ? (
            <div className="relative z-50 flex flex-col items-center py-8">
              <p className="text-slate-300 font-mono text-sm text-center mb-6">
                SYSTEM_AUTH_REQUIRED
                <br />
                Please verify identity via Google to proceed with transmission.
              </p>
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="group relative px-6 py-4 w-full md:w-auto min-w-[250px] bg-blue-500/10 text-blue-400 overflow-hidden hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] border border-blue-500/50 cursor-pointer disabled:opacity-50"
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
                TRANSMISSION_SUCCESSFUL
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
                <label htmlFor="contact-email" className="block text-sm font-mono text-slate-400 mb-2">RETURN_ADDRESS</label>
                <input 
                  type="email" 
                  id="contact-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-cyan-950/30 border border-cyan-500/30 text-white font-mono px-4 py-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all placeholder:text-cyan-900/50"
                  placeholder="user@domain.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-mono text-slate-400 mb-2">PAYLOAD</label>
                <textarea 
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-cyan-950/30 border border-cyan-500/30 text-white font-mono px-4 py-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all resize-none placeholder:text-cyan-900/50"
                  placeholder="Enter transmission data..."
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
                  <Send className="w-4 h-4" /> {isSubmitting ? 'TRANSMITTING...' : 'INITIATE_CONTACT'}
                </span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
