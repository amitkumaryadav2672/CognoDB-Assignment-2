import React from 'react';
import { Network, ShieldAlert, Cpu, Terminal, HelpCircle, Database, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, dbStatus, openWhyGraphModal }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Network className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                NexusGraph
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                CognoDB Graph AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Supply Chain & Vulnerability Blast Radius Engine
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'canvas'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="h-4 w-4" />
            Graph Canvas
          </button>

          <button
            onClick={() => setActiveTab('blast-radius')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'blast-radius'
                ? 'bg-gradient-to-r from-rose-500 to-amber-600 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            Blast Radius (Multi-Hop)
          </button>

          <button
            onClick={() => setActiveTab('bottlenecks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'bottlenecks'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="h-4 w-4" />
            Chokepoints & Bottlenecks
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'console'
                ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="h-4 w-4" />
            Cypher Console
          </button>
        </nav>

        {/* Database Status & Why Graph Modal Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={openWhyGraphModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 rounded-lg transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Why Graph DB?
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <Database className="h-4 w-4 text-slate-400" />
            {dbStatus?.isConnected ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                CognoDB Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400 font-medium" title={dbStatus?.connectionError || 'Running in Fallback Mode'}>
                <AlertTriangle className="h-3.5 w-3.5" />
                Demo / Fallback Mode
              </span>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
