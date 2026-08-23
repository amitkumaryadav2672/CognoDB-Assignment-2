import React, { useState, useEffect } from 'react';
import { Cpu, AlertOctagon, TrendingUp, ShieldAlert, Code2, RefreshCw } from 'lucide-react';

export default function BottleneckFinder() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchBottlenecks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/graph/bottlenecks');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch graph bottlenecks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBottlenecks();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Graph Structural Vulnerability Analysis
          </span>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-2">
            Single Point of Failure (Chokepoint) Finder
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Identifies single-sourced suppliers and critical sub-components that lack redundant backups and represent structural bottleneck risks across your supply network.
          </p>
        </div>

        <button
          onClick={fetchBottlenecks}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-800 text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          Run Bottleneck Discovery
        </button>
      </div>

      {/* Cypher Query Explanation */}
      {data && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-amber-400" />
              openCypher Structural Chokepoint Discovery Query
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Source: {data.source}</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-amber-300 overflow-x-auto">
            <code>{data.cypherQuery}</code>
          </div>
        </div>
      )}

      {/* Bottlenecks List */}
      {data && data.bottlenecks && data.bottlenecks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.bottlenecks.map((item, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-amber-900/50 space-y-4 shadow-xl">
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {item.riskLevel}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 mt-2">
                    {item.supplier?.name} &rarr; {item.component?.name}
                  </h3>
                  <p className="text-xs text-slate-400">Supplier Country: {item.supplier?.country || 'Global'}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <AlertOctagon className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Dependent Product Models:</span>
                  <span className="font-bold text-amber-400 font-mono">{item.dependentProductsCount} Models</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Financial Exposure:</span>
                  <span className="font-bold text-rose-400 font-mono">${(item.atRiskContractValue || 0).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-1.5">Affected Product Portfolio:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(item.productNames || []).map((name, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-900 text-[11px] text-slate-300 rounded-lg border border-slate-800">
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-amber-300/80 bg-amber-950/30 p-3 rounded-xl border border-amber-800/30 font-medium">
                <strong>Analysis:</strong> {item.reason}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-8 text-center text-slate-500 rounded-2xl">
          No critical single-point-of-failure bottlenecks detected in current graph state.
        </div>
      )}

    </div>
  );
}
