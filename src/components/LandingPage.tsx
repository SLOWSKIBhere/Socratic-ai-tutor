import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Brain, ShieldAlert, LineChart, Sparkles, GraduationCap, LayoutDashboard } from "lucide-react";

interface LandingPageProps {
  onEnter: (view: "student" | "teacher") => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <span className="text-white font-bold text-xl leading-none font-display">T</span>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">
            TitanTrack
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => onEnter("student")}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Student Portal
          </button>
          <button
            onClick={() => onEnter("teacher")}
            className="px-5 py-2.5 rounded-full bg-white text-slate-950 text-sm font-semibold hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Teacher Dashboard
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div 
          style={{ y, opacity }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-indigo-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>The Anti-Cheat Socratic AI Tutor</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[1.1] mb-8 text-glow"
          >
            Don't just give answers.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Teach them how to think.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            TitanTrack uses advanced AI to guide students through their struggles with Socratic questioning, while giving teachers real-time visibility into comprehension gaps.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={() => onEnter("student")}
              className="group relative px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <GraduationCap className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Try Student Portal</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => onEnter("teacher")}
              className="group px-8 py-4 rounded-full glass-panel text-white font-semibold text-lg hover:bg-white/10 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>View Teacher Dashboard</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Bento Grid Features */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Feature 1 */}
          <div className="md:col-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-colors" />
            <Brain className="w-10 h-10 text-indigo-400 mb-6" />
            <h3 className="text-2xl font-display font-bold mb-3">Socratic Pedagogy Engine</h3>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Our AI is strictly instructed to never provide direct answers. Instead, it analyzes the student's uploaded work and asks the exact right question to unblock them.
            </p>
            <div className="mt-8 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-slate-500 font-mono">BLOCKED: Direct Answer</span>
              </div>
              <p className="text-sm text-indigo-300 font-medium">
                "What is the first step to isolate x in this equation?"
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
            <ShieldAlert className="w-10 h-10 text-purple-400 mb-6" />
            <h3 className="text-2xl font-display font-bold mb-3">Jailbreak Defense</h3>
            <p className="text-slate-400 leading-relaxed">
              Built-in safeguards detect when students try to bypass the system with "Write my essay" or "Ignore previous instructions" prompts.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="md:col-span-3 glass-panel rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full" />
            <div className="flex-1 relative z-10">
              <LineChart className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-3xl font-display font-bold mb-4">Frustration Metrics</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Stop guessing where students are struggling. TitanTrack analyzes the tone and repetition of student queries to assign a "Frustration Marker" (1-5), giving teachers a real-time heat map of class comprehension.
              </p>
            </div>
            <div className="flex-1 w-full relative z-10">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                  <span className="text-sm font-medium text-slate-300">Live Dashboard</span>
                  <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Syncing
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    { concept: "Quadratic Formula", count: 14, fr: 4.2 },
                    { concept: "Cellular Respiration", count: 8, fr: 2.1 },
                    { concept: "Thesis Statements", count: 5, fr: 3.5 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{item.concept}</span>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.fr >= 4 ? 'bg-red-500' : item.fr >= 3 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${(item.fr / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-500">{item.fr.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
