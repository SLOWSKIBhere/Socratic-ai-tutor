import React, { useEffect, useState } from "react";
import { getInteractions, Interaction, clearInteractions } from "../store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle, Users, Brain, Trash2 } from "lucide-react";

export default function TeacherDashboard() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    const loadData = () => {
      setInteractions(getInteractions());
    };
    loadData();
    window.addEventListener("titantrack_updated", loadData);
    return () => window.removeEventListener("titantrack_updated", loadData);
  }, []);

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all data?")) {
      clearInteractions();
    }
  };

  const totalInteractions = interactions.length;
  const avgFrustration =
    totalInteractions > 0
      ? (
          interactions.reduce((sum, i) => sum + i.frustration_marker, 0) /
          totalInteractions
        ).toFixed(1)
      : "0.0";
  const jailbreakAttempts = interactions.filter(
    (i) => i.is_jailbreak_attempt
  ).length;

  const conceptStats = interactions.reduce((acc, curr) => {
    const concept = curr.identified_concept || "Unknown";
    if (!acc[concept]) {
      acc[concept] = { count: 0, totalFrustration: 0 };
    }
    acc[concept].count += 1;
    acc[concept].totalFrustration += curr.frustration_marker;
    return acc;
  }, {} as Record<string, { count: number; totalFrustration: number }>);

  const chartData = Object.entries(conceptStats)
    .map(([name, stats]: [string, any]) => ({ name, count: stats.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const top3Concepts = Object.entries(conceptStats)
    .map(([name, stats]: [string, any]) => ({
      name,
      count: stats.count,
      avgFrustration: (stats.totalFrustration / stats.count).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            TitanTrack Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time insights into student struggles.
          </p>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Total Interactions
            </p>
            <p className="text-3xl font-display font-bold text-white">
              {totalInteractions}
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Avg Frustration (1-5)
            </p>
            <p className="text-3xl font-display font-bold text-white">
              {avgFrustration}
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Integrity Flags
            </p>
            <p className="text-3xl font-display font-bold text-white">
              {jailbreakAttempts}
            </p>
          </div>
        </div>
      </div>

      {top3Concepts.length > 0 && (
        <div className="mb-8 relative z-10">
          <h2 className="text-xl font-display font-bold text-white mb-5">
            Top 3 Struggled Concepts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3Concepts.map((concept, index) => (
              <div
                key={concept.name}
                className="glass-panel p-6 rounded-3xl shadow-xl hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {concept.count} interactions
                  </span>
                </div>
                <h3
                  className="font-semibold text-white truncate text-lg"
                  title={concept.name}
                >
                  {concept.name}
                </h3>
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      parseFloat(concept.avgFrustration) >= 4
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : parseFloat(concept.avgFrustration) >= 3
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    Avg Frustration: {concept.avgFrustration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-xl font-display font-bold text-white">
              Recent Teacher Insights
            </h2>
          </div>
          <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto hide-scrollbar">
            {interactions.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No interactions recorded yet.
              </div>
            ) : (
              interactions
                .slice()
                .reverse()
                .map((interaction) => (
                  <div key={interaction.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {interaction.identified_concept}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                            interaction.frustration_marker >= 4
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : interaction.frustration_marker >= 3
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          Frustration: {interaction.frustration_marker}
                        </span>
                        {interaction.is_jailbreak_attempt && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            Flagged
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(interaction.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium mb-2">
                      Insight: {interaction.teacher_insight}
                    </p>
                    <p className="text-sm text-slate-500 italic">
                      Student asked: "{interaction.studentQuery}"
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-xl font-display font-bold text-white">
              Top Struggled Concepts
            </h2>
          </div>
          <div className="p-6 h-[400px]">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500">
                No data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" allowDecimals={false} stroke="#64748b" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#6366f1"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
