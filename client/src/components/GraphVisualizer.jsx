import React, { useEffect, useRef, useState } from 'react';
import { Network as VisNetwork } from 'vis-network';
import { DataSet } from 'vis-data';
import { Search, Filter, RefreshCw, Info, ShieldAlert, Layers } from 'lucide-react';

const NODE_COLORS = {
  Vulnerability: { background: '#a855f7', border: '#9333ea', highlight: '#c084fc' },  // Purple
  Supplier: { background: '#8b5cf6', border: '#7c3aed', highlight: '#a78bfa' },       // Violet
  Facility: { background: '#f97316', border: '#ea580c', highlight: '#fb923c' },       // Orange
  Component: { background: '#06b6d4', border: '#0891b2', highlight: '#22d3ee' },      // Cyan
  Product: { background: '#10b981', border: '#059669', highlight: '#34d399' },        // Emerald Green
  Customer: { background: '#3b82f6', border: '#2563eb', highlight: '#60a5fa' },       // Royal Blue
  Library: { background: '#0284c7', border: '#0369a1', highlight: '#38bdf8' },        // Sky Blue
  Service: { background: '#f43f5e', border: '#e11d48', highlight: '#fb7185' },        // Rose Red
  Application: { background: '#22c55e', border: '#16a34a', highlight: '#4ade80' },    // Green
  Vendor: { background: '#f59e0b', border: '#d97706', highlight: '#fbbf24' },         // Amber
  Infrastructure: { background: '#64748b', border: '#475569', highlight: '#94a3b8' } // Slate
};

export default function GraphVisualizer({ graphData, loading, onRefresh, onAnalyzeBlastRadius }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabelFilter, setSelectedLabelFilter] = useState('ALL');

  const availableLabels = Array.from(
    new Set((graphData?.nodes || []).map(n => n.label).filter(Boolean))
  );

  useEffect(() => {
    if (!containerRef.current || !graphData || !graphData.nodes) return;

    // Filter nodes if search or label filter active
    let filteredNodes = graphData.nodes;
    if (selectedLabelFilter !== 'ALL') {
      filteredNodes = filteredNodes.filter(n => n.label === selectedLabelFilter);
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(n => 
        (n.name && n.name.toLowerCase().includes(term)) ||
        (n.id && n.id.toLowerCase().includes(term)) ||
        (n.cve && n.cve.toLowerCase().includes(term)) ||
        (n.partNumber && n.partNumber.toLowerCase().includes(term))
      );
    }

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = (graphData.edges || []).filter(
      e => nodeIds.has(e.from) && nodeIds.has(e.to)
    );

    const visNodes = new DataSet(
      filteredNodes.map(n => {
        const color = NODE_COLORS[n.label] || { background: '#64748b', border: '#475569', highlight: '#94a3b8' };
        return {
          id: n.id,
          label: `${n.name || n.id}\n[${n.label}]`,
          shape: 'dot',
          size: ['Customer', 'Application'].includes(n.label) ? 26 : ['Vulnerability', 'Service'].includes(n.label) ? 24 : 20,
          color: {
            background: color.background,
            border: color.border,
            highlight: { background: color.highlight, border: '#ffffff' }
          },
          font: { color: '#f8fafc', size: 11, strokeWidth: 3, strokeColor: '#0f172a' },
          rawNode: n
        };
      })
    );

    const visEdges = new DataSet(
      filteredEdges.map(e => ({
        id: e.id || `${e.from}-${e.to}`,
        from: e.from,
        to: e.to,
        label: e.type,
        arrows: 'to',
        color: { color: '#475569', highlight: '#38bdf8' },
        font: { color: '#94a3b8', size: 9, align: 'middle', strokeWidth: 2, strokeColor: '#0f172a' },
        smooth: { type: 'continuous', roundness: 0.2 }
      }))
    );

    const data = { nodes: visNodes, edges: visEdges };
    const options = {
      nodes: {
        borderWidth: 2,
        shadow: true
      },
      edges: {
        width: 1.5,
        shadow: false
      },
      physics: {
        barnesHut: {
          gravitationalConstant: -4000,
          centralGravity: 0.3,
          springLength: 130,
          springConstant: 0.04
        },
        stabilization: { iterations: 120 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true
      }
    };

    const network = new VisNetwork(containerRef.current, data, options);
    networkRef.current = network;

    network.on('selectNode', (params) => {
      const nodeId = params.nodes[0];
      const clickedNode = filteredNodes.find(n => n.id === nodeId);
      if (clickedNode) setSelectedNode(clickedNode);
    });

    network.on('deselectNode', () => {
      setSelectedNode(null);
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [graphData, selectedLabelFilter, searchTerm]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      
      {/* Canvas Column */}
      <div className="flex-1 flex flex-col glass-panel rounded-2xl border border-slate-800 p-4 overflow-hidden relative shadow-2xl">
        
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 z-10">
          
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search nodes by name, ID, CVE, package..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 text-xs text-slate-100 pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Label Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <Filter className="h-4 w-4 text-slate-500 shrink-0" />
            <button
              onClick={() => setSelectedLabelFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                selectedLabelFilter === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              ALL ({graphData?.nodes?.length || 0})
            </button>
            {availableLabels.map(label => (
              <button
                key={label}
                onClick={() => setSelectedLabelFilter(label)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                  selectedLabelFilter === label
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-800 transition-all shrink-0"
            title="Refresh Graph Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 py-2 px-3 bg-slate-900/60 rounded-xl border border-slate-800/80 mb-3 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
            <Layers className="h-3.5 w-3.5" /> Node Labels ({availableLabels.length}):
          </span>
          {availableLabels.map(type => {
            const color = NODE_COLORS[type] || { background: '#64748b' };
            return (
              <div key={type} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color.background }} />
                {type}
              </div>
            );
          })}
        </div>

        {/* Interactive Network Container */}
        <div className="flex-1 w-full rounded-xl bg-slate-950/60 border border-slate-900 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
              <p className="text-xs text-slate-300 font-medium">Querying CognoDB Graph Topology...</p>
            </div>
          )}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>

      </div>

      {/* Node Inspector Drawer */}
      <div className="w-full lg:w-80 glass-panel rounded-2xl border border-slate-800 p-5 flex flex-col justify-between shadow-xl">
        {selectedNode ? (
          <div className="space-y-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-2 bg-slate-800 text-cyan-300 border border-slate-700">
                {selectedNode.label}
              </span>
              <h3 className="text-lg font-extrabold text-slate-100">{selectedNode.name || selectedNode.id}</h3>
              <p className="text-xs text-slate-400 font-mono">ID: {selectedNode.id}</p>
            </div>

            <div className="space-y-2 border-t border-slate-800/80 pt-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Node Attributes</h4>
              {Object.entries(selectedNode)
                .filter(([k]) => !['id', 'label', 'name'].includes(k))
                .map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center text-xs py-1 border-b border-slate-900">
                    <span className="text-slate-400 capitalize">{key}:</span>
                    <span className="font-mono text-slate-200 font-medium">
                      {String(val)}
                    </span>
                  </div>
                ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => onAnalyzeBlastRadius(selectedNode.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all"
              >
                <ShieldAlert className="h-4 w-4" />
                Simulate Multi-Hop Impact
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
            <Info className="h-10 w-10 text-slate-600 mb-3" />
            <h4 className="text-sm font-semibold text-slate-300 mb-1">Interactive Node Inspector</h4>
            <p className="text-xs text-slate-400">
              Click any node in the graph canvas to inspect properties, relationships, or simulate multi-hop vulnerability impact.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
