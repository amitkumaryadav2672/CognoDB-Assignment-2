import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConnectionBanner from './components/ConnectionBanner';
import GraphVisualizer from './components/GraphVisualizer';
import BlastRadiusTool from './components/BlastRadiusTool';
import BottleneckFinder from './components/BottleneckFinder';
import QueryConsole from './components/QueryConsole';
import WhyGraphModal from './components/WhyGraphModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('canvas');
  const [dbStatus, setDbStatus] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [selectedBlastRadiusId, setSelectedBlastRadiusId] = useState('VULN-001');

  // Check DB Health & Fetch Full Graph
  const loadInitialData = async () => {
    setLoadingGraph(true);
    try {
      // 1. Fetch DB Health
      const healthRes = await fetch('/api/health');
      const healthJson = await healthRes.json();
      setDbStatus(healthJson);

      // 2. Fetch Full Graph
      const graphRes = await fetch('/api/graph/full');
      const graphJson = await graphRes.json();
      setGraphData(graphJson);
    } catch (err) {
      console.error('Failed to connect to backend server:', err);
    } finally {
      setLoadingGraph(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleAnalyzeBlastRadiusFromNode = (nodeId) => {
    setSelectedBlastRadiusId(nodeId);
    setActiveTab('blast-radius');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbStatus={dbStatus}
        openWhyGraphModal={() => setIsWhyModalOpen(true)}
      />

      {/* CognoDB Connection Diagnostic Banner */}
      <ConnectionBanner dbStatus={dbStatus} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'canvas' && (
          <GraphVisualizer
            graphData={graphData}
            loading={loadingGraph}
            onRefresh={loadInitialData}
            onAnalyzeBlastRadius={handleAnalyzeBlastRadiusFromNode}
          />
        )}

        {activeTab === 'blast-radius' && (
          <BlastRadiusTool
            nodes={graphData?.nodes || []}
            initialNodeId={selectedBlastRadiusId}
            onRunBlastRadius={() => {}}
          />
        )}

        {activeTab === 'bottlenecks' && <BottleneckFinder />}

        {activeTab === 'console' && <QueryConsole />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Wexa AI Take-Home Assignment — Built with <strong>CognoDB Cloud (openCypher)</strong> & React
        </p>
      </footer>

      {/* Why Graph Database Explainer Modal */}
      <WhyGraphModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
      />

    </div>
  );
}
