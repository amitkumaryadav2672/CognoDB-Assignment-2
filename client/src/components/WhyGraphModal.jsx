import React from 'react';
import { X, Network, Database, Check, AlertTriangle, ArrowRight } from 'lucide-react';

export default function WhyGraphModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Architectural Evaluation
          </span>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-2">
            Why Supply Chain Vulnerability Belongs in a Graph Database
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Comparing Graph Databases (CognoDB / openCypher) vs Relational RDBMS (SQL) for Supply Chain & Risk Blast Radius Analysis.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Relational SQL Card */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Database className="h-5 w-5" />
              Relational RDBMS (PostgreSQL / MySQL)
            </div>
            <p className="text-xs text-slate-400">
              Stores nodes as separate tables (`suppliers`, `facilities`, `components`, `products`, `customers`) linked via foreign key join tables.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2 text-rose-300/90">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>Expensive Recursive Joins:</strong> Multi-hop queries require complex Recursive Common Table Expressions (WITH RECURSIVE CTEs) or N nested SQL JOINs.</span>
              </li>
              <li className="flex items-start gap-2 text-rose-300/90">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>Performance Degradation:</strong> As depth grows (3+ hops), query execution time scales exponentially with table row count \(O(N^k)\).</span>
              </li>
              <li className="flex items-start gap-2 text-rose-300/90">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>Rigid Schema Evolution:</strong> Adding dynamic sub-component dependencies requires altering multiple join schemas.</span>
              </li>
            </ul>
          </div>

          {/* Graph Database Card */}
          <div className="bg-gradient-to-b from-cyan-950/40 to-slate-900/90 p-5 rounded-2xl border border-cyan-800/50 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Network className="h-5 w-5" />
              Graph Database (CognoDB / openCypher)
            </div>
            <p className="text-xs text-slate-400">
              Treats relationships as first-class citizens with direct index-free adjacency pointers between nodes.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2 text-cyan-300">
                <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Sub-Millisecond Multi-Hop Traversal:</strong> Variable length path match <code className="text-cyan-300 bg-cyan-950 px-1 py-0.5 rounded font-mono">*1..5</code> executes in constant time per node step.</span>
              </li>
              <li className="flex items-start gap-2 text-cyan-300">
                <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Shortest Path Built-In:</strong> Native graph algorithms like <code className="text-cyan-300 bg-cyan-950 px-1 py-0.5 rounded font-mono">shortestPath()</code> find alternative routes effortlessly.</span>
              </li>
              <li className="flex items-start gap-2 text-cyan-300">
                <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Expressive Cypher Syntax:</strong> Intuive pattern matching syntax that mirrors real-world supply chain dependency trees.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Example Query Syntax Comparison */}
        <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-900">
          <h4 className="text-xs font-bold text-slate-300">Syntax Comparison: 4-Hop Blast Radius Query</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-mono">
            <div className="bg-slate-900 p-3 rounded-xl text-rose-300 border border-slate-800 overflow-x-auto">
              <p className="text-[10px] text-slate-400 font-sans mb-1">SQL (Awkward & Lengthy):</p>
              <code>{`WITH RECURSIVE blast_radius AS (
  SELECT entity_id, 1 as depth FROM vulnerabilities WHERE id = 'VULN-001'
  UNION ALL
  SELECT r.target_id, b.depth + 1
  FROM relationships r JOIN blast_radius b ON r.source_id = b.entity_id
  WHERE b.depth < 5
) SELECT * FROM blast_radius;`}</code>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl text-cyan-300 border border-cyan-900/60 overflow-x-auto">
              <p className="text-[10px] text-slate-400 font-sans mb-1">openCypher (Clean & Native):</p>
              <code>{`MATCH path = (v:Vulnerability {id: 'VULN-001'})
  -[:IMPACTS|DEPENDS_ON|USED_IN*1..5]->(c:Customer)
RETURN path, sum(c.annualContractValue);`}</code>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
