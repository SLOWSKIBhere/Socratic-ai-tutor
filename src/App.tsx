/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import StudentView from "./components/StudentView";
import TeacherDashboard from "./components/TeacherDashboard";
import LandingPage from "./components/LandingPage";
import { GraduationCap, LayoutDashboard, Home } from "lucide-react";

export default function App() {
  const [view, setView] = useState<"landing" | "student" | "teacher">("landing");

  if (view === "landing") {
    return <LandingPage onEnter={setView} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-indigo-500/30">
      <nav className="bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setView("landing")}
            >
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <span className="text-white font-bold text-lg leading-none font-display">T</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                TitanTrack
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView("landing")}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={() => setView("student")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === "student"
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Student View</span>
              </button>
              <button
                onClick={() => setView("teacher")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === "teacher"
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Teacher Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {view === "student" ? <StudentView /> : <TeacherDashboard />}
      </main>
    </div>
  );
}
