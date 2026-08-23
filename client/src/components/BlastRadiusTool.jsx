import React, { useState, useEffect } from 'react';
import { ShieldAlert, Zap, DollarSign, Users, Package, Play, Code2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getFallbackBlastRadius, FALLBACK_NODES } from '../utils/mockFallbackData';

export default function BlastRadiusTool({ nodes = [], initialNodeId, onRunBlastRadius }) {
  const activeNodes = nodes.length > 0 ? nodes : FALLBACK_NODES;
  const [selectedNodeId, setSelectedNodeId] = useState(initialNodeId || 'VULN-001');
  const [maxHops, setMaxHops] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const startNodes = activeNodes.filter(n => ['Vulnerability', 'Supplier', 'Component', 'Facility'].includes(n.label));

  const handleRunAnalysis = async (nodeId = selectedNodeId, hops = maxHops) => {
    setLoading(true);
    const activeNodeId = nodeId || selectedNodeId;
    const activeHops = Number(hops) || Number(maxHops) || 5;

    try {
      const res = await fetch('/api/graph/blast-radius', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startNodeId: activeNodeId, maxHops: activeHops })
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult(getFallbackBlastRadius(activeNodeId, activeHops));
      }
    } catch (err) {
      console.warn('Blast radius API call failed, falling back to local calculation:', err.message);
      setResult(getFallbackBlastRadius(activeNodeId, activeHops));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNodeId) {
      setSelectedNodeId(initialNodeId);
    }
    handleRunAnalysis(initialNodeId || selectedNodeId, maxHops);
  }, [initialNodeId, selectedNodeId, maxHops]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header & Controls Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Multi-Hop Graph Traversal Engine
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100">
              Vulnerability & Risk Blast Radius Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Traverses variable-length graph relationships (1 to 5 hops) to calculate cascading downstream impact on enterprise products and customer contracts.
            </p>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-all shrink-0"
          >
            {loading ? <Zap className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Execute Multi-Hop Cypher Traversal
          </button>
        </div>

        {/* Input Parameters Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Origin Disruption / Vulnerability Node:
            </label>
            <select
              value={selectedNodeId}
              onChange={e => {
                const val = e.target.value;
                setSelectedNodeId(val);
                handleRunAnalysis(val, maxHops);
              }}
              className="w-full bg-slate-950 text-xs text-slate-100 p-2.5 rounded-xl border border-slate-800 focus:border-rose-500 outline-none"
            >
              {startNodes.map(node => (
                <option key={node.id} value={node.id}>
                  [{node.label}] {node.name || node.id} ({node.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Graph Traversal Depth (Variable-Length Hops 1..{maxHops}):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="5"
                value={maxHops}
                onChange={e => {
                  const val = Number(e.target.value);
                  setMaxHops(val);
                  handleRunAnalysis(selectedNodeId, val);
                }}
                className="flex-1 accent-rose-500 cursor-pointer"
              />
              <span className="px-3 py-1 bg-slate-950 text-xs font-mono font-bold text-rose-400 border border-slate-800 rounded-lg">
                {maxHops} Hops
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Dashboard */}
      {result && (
        <div className="space-y-6">

          {/* Summary Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Total Financial Risk</p>
                <h3 className="text-2xl font-black text-rose-400 font-mono">
                  ${(result.totalFinancialRisk || 0).toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Impacted Enterprise Customers</p>
                <h3 className="text-2xl font-black text-amber-400 font-mono">
                  {result.impactedCustomersCount || 0} Accounts
                </h3>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Affected Product Lines</p>
                <h3 className="text-2xl font-black text-cyan-400 font-mono">
                  {result.impactedProductsCount || 0} Products
                </h3>
              </div>
            </div>
          </div>

          {/* Cypher Query Inspector Box */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-400" />
                Executed Parameterised openCypher Query
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Source: {result.source}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-cyan-300 overflow-x-auto">
              <code>{result.cypherQuery}</code>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Bound Parameters:</span>
              <code className="bg-slate-900 px-2 py-0.5 rounded text-amber-400 font-mono">
                {JSON.stringify(result.queryParams)}
              </code>
            </div>
          </div>

          {/* Step-by-Step Multi-Hop Traversal Timeline */}
          {result.steps && result.steps.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Play className="h-4 w-4 text-rose-400" />
                Step-by-Step Multi-Hop Graph Traversal Sequence ({result.queryParams?.maxHops} Hops Deep)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {result.steps.map((st, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Step {st.step}
                      </span>
                      <h4 className="text-xs font-bold text-slate-200 mt-2">{st.title}</h4>
                      <p className="text-[11px] font-mono text-cyan-300 mt-1">{st.node}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">{st.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Impacted Downstream Entities List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Impacted Customers */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                Downstream Impacted Enterprise Customers
              </h3>
              {result.impactedCustomers && result.impactedCustomers.length > 0 ? (
                <div className="space-y-2">
                  {result.impactedCustomers.map(cust => (
                    <div key={cust.id} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{cust.name}</h4>
                        <p className="text-[11px] text-slate-400">Sector: {cust.sector || 'Enterprise'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-rose-400">
                          ${(cust.annualContractValue || 0).toLocaleString()}
                        </span>
                        <p className="text-[10px] text-slate-500">Annual Value</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No direct enterprise customers affected at this traversal depth.</p>
              )}
            </div>

            {/* Impacted Products */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-cyan-400" />
                Affected Downstream Product Models
              </h3>
              {result.impactedProducts && result.impactedProducts.length > 0 ? (
                <div className="space-y-2">
                  {result.impactedProducts.map(prd => (
                    <div key={prd.id} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{prd.name}</h4>
                        <p className="text-[11px] text-slate-400">SKU: {prd.sku || prd.id}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-cyan-400">
                          ${(prd.price || 0).toLocaleString()} / unit
                        </span>
                        <p className="text-[10px] text-slate-500">{prd.category || 'Product'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No products impacted at this hop depth.</p>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
