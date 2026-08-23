import React, { useState } from 'react';
import { Database, AlertCircle, CheckCircle2, Copy, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export default function ConnectionBanner({ dbStatus }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEnvSnippet = () => {
    const text = `COGNO_DB_URI=bolt+s://<instance-id>.databases.cognodb.com\nCOGNO_DB_USER=cognodb\nCOGNO_DB_PASSWORD=<your-saved-password>`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (dbStatus?.isConnected) {
    return (
      <div className="bg-emerald-950/40 border-b border-emerald-800/40 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            Connected to <strong>CognoDB Cloud</strong> graph instance ({dbStatus.uri}). openCypher queries are running directly against live Bolt protocol.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-2.5 text-xs text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-semibold text-amber-300">Demo / Fallback Mode Active:</span>{' '}
            <span>CognoDB connection unavailable ({dbStatus?.connectionError || 'Credentials not configured'}). Interactive mock graph engine active!</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-amber-400 hover:text-amber-200 font-semibold underline shrink-0 transition-colors"
        >
          <span>{expanded ? 'Hide CognoDB Setup Instructions' : 'How to Connect CognoDB Cloud'}</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-amber-800/40 grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div>
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
              1. Provision Free CognoDB Instance
            </h4>
            <p className="text-xs text-slate-400">
              Sign up at <a href="https://console.cognodb.com/signup" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">console.cognodb.com <ExternalLink className="h-3 w-3" /></a> and create a free (c0) graph instance.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 mb-1">
              2. Save Connection Password
            </h4>
            <p className="text-xs text-slate-400">
              Copy the generated password for user <code className="text-amber-300 font-mono">cognodb</code> and connection URI (<code className="text-amber-300 font-mono">bolt+s://...</code>).
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-amber-400">3. Set Environment Variables</h4>
              <button
                onClick={copyEnvSnippet}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                <Copy className="h-3 w-3" />
                {copied ? 'Copied!' : 'Copy .env snippet'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Paste your credentials into <code className="text-cyan-300 font-mono">.env</code> then run <code className="text-cyan-300 font-mono">npm run seed</code> to populate the graph.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
