export const FALLBACK_NODES = [
  { id: 'VULN-001', label: 'Vulnerability', name: 'CVE-2026-8801 EUV Laser Overheat', cve: 'CVE-2026-8801', severity: 'CRITICAL', riskScore: 9.8, type: 'Hardware Defect' },
  { id: 'VULN-002', label: 'Vulnerability', name: 'Geo-Political Port Lockout', cve: 'GEO-2026-04', severity: 'HIGH', riskScore: 8.5, type: 'Geopolitical Risk' },
  { id: 'VULN-003', label: 'Vulnerability', name: 'Silicon Raw Shortage 2026', cve: 'MAT-2026-11', severity: 'MEDIUM', riskScore: 6.7, type: 'Material Shortage' },
  { id: 'SUP-001', label: 'Supplier', name: 'TSMC', country: 'Taiwan', tier: 1, status: 'DISRUPTED', reliabilityScore: 0.94 },
  { id: 'SUP-002', label: 'Supplier', name: 'ASML Lithography', country: 'Netherlands', tier: 1, status: 'OPERATIONAL', reliabilityScore: 0.99 },
  { id: 'SUP-003', label: 'Supplier', name: 'BASF Special Chemicals', country: 'Germany', tier: 2, status: 'OPERATIONAL', reliabilityScore: 0.91 },
  { id: 'SUP-004', label: 'Supplier', name: 'Samsung Foundry', country: 'South Korea', tier: 1, status: 'OPERATIONAL', reliabilityScore: 0.93 },
  { id: 'SUP-005', label: 'Supplier', name: 'Texas Instruments', country: 'USA', tier: 2, status: 'OPERATIONAL', reliabilityScore: 0.96 },
  { id: 'FAC-001', label: 'Facility', name: 'Hsinchu Cleanroom Fab 12', city: 'Hsinchu', status: 'IMPACTED' },
  { id: 'FAC-002', label: 'Facility', name: 'Dresden Optics Plant', city: 'Dresden', status: 'OPERATIONAL' },
  { id: 'FAC-003', label: 'Facility', name: 'Ludwigshafen Polymer Lab', city: 'Ludwigshafen', status: 'OPERATIONAL' },
  { id: 'FAC-004', label: 'Facility', name: 'Austin Fab 1', city: 'Austin', status: 'OPERATIONAL' },
  { id: 'CMP-001', label: 'Component', name: '3nm Microcontroller IC', partNumber: 'MCU-3NM-X', category: 'Semiconductor', unitCost: 45.0, status: 'CRITICAL_SHORTAGE' },
  { id: 'CMP-002', label: 'Component', name: 'EUV Mirror Optics Assembly', partNumber: 'OPT-EUV-99', category: 'Precision Optics', unitCost: 12000.0, status: 'OPERATIONAL' },
  { id: 'CMP-003', label: 'Component', name: 'Ultra-Pure Photoresist Chemical', partNumber: 'CHM-PR-900', category: 'Raw Materials', unitCost: 850.0, status: 'OPERATIONAL' },
  { id: 'CMP-004', label: 'Component', name: 'Power Regulator Module', partNumber: 'PWR-REG-24V', category: 'Power Electronics', unitCost: 12.5, status: 'OPERATIONAL' },
  { id: 'CMP-005', label: 'Component', name: 'High-Bandwidth Memory (HBM3)', partNumber: 'MEM-HBM-8G', category: 'Memory', unitCost: 180.0, status: 'OPERATIONAL' },
  { id: 'PRD-001', label: 'Product', name: 'Sentinel AI Server H100 Node', sku: 'SKU-AI-H100', price: 35000, category: 'AI Infrastructure' },
  { id: 'PRD-002', label: 'Product', name: 'Quantum-X Autonomous Drone', sku: 'SKU-DRONE-QX', price: 18500, category: 'Aerospace & Defense' },
  { id: 'PRD-003', label: 'Product', name: 'Titan EV Power Inverter', sku: 'SKU-EV-INV4', price: 4200, category: 'Automotive' },
  { id: 'PRD-004', label: 'Product', name: 'MedTech Smart BioMonitor', sku: 'SKU-MED-BM99', price: 8900, category: 'Healthcare' },
  { id: 'CUST-001', label: 'Customer', name: 'SpaceX Defense Systems', sector: 'Defense', annualContractValue: 24000000 },
  { id: 'CUST-002', label: 'Customer', name: 'Tesla Global Motors', sector: 'Automotive', annualContractValue: 65000000 },
  { id: 'CUST-003', label: 'Customer', name: 'Apple Enterprise Systems', sector: 'Consumer Electronics', annualContractValue: 120000000 },
  { id: 'CUST-004', label: 'Customer', name: 'Mayo Clinic Health Network', sector: 'Healthcare', annualContractValue: 18000000 }
];

export const FALLBACK_EDGES = [
  { id: 'REL-01', from: 'VULN-001', to: 'FAC-001', type: 'IMPACTS' },
  { id: 'REL-02', from: 'VULN-002', to: 'SUP-001', type: 'THREATENS' },
  { id: 'REL-03', from: 'VULN-003', to: 'CMP-003', type: 'IMPACTS' },
  { id: 'REL-04', from: 'SUP-001', to: 'FAC-001', type: 'OPERATES' },
  { id: 'REL-05', from: 'SUP-002', to: 'FAC-002', type: 'OPERATES' },
  { id: 'REL-06', from: 'SUP-003', to: 'FAC-003', type: 'OPERATES' },
  { id: 'REL-07', from: 'SUP-004', to: 'FAC-004', type: 'OPERATES' },
  { id: 'REL-08', from: 'SUP-001', to: 'CMP-001', type: 'MANUFACTURING' },
  { id: 'REL-09', from: 'SUP-002', to: 'CMP-002', type: 'MANUFACTURING' },
  { id: 'REL-10', from: 'SUP-003', to: 'CMP-003', type: 'MANUFACTURING' },
  { id: 'REL-11', from: 'SUP-005', to: 'CMP-004', type: 'MANUFACTURING' },
  { id: 'REL-12', from: 'FAC-001', to: 'CMP-001', type: 'PRODUCES' },
  { id: 'REL-13', from: 'CMP-001', to: 'PRD-001', type: 'USED_IN' },
  { id: 'REL-14', from: 'CMP-001', to: 'PRD-002', type: 'USED_IN' },
  { id: 'REL-15', from: 'CMP-002', to: 'PRD-001', type: 'USED_IN' },
  { id: 'REL-16', from: 'CMP-004', to: 'PRD-003', type: 'USED_IN' },
  { id: 'REL-17', from: 'CMP-005', to: 'PRD-001', type: 'USED_IN' },
  { id: 'REL-18', from: 'PRD-001', to: 'CUST-001', type: 'DELIVERED_TO' },
  { id: 'REL-19', from: 'PRD-001', to: 'CUST-003', type: 'DELIVERED_TO' },
  { id: 'REL-20', from: 'PRD-002', to: 'CUST-001', type: 'DELIVERED_TO' },
  { id: 'REL-21', from: 'PRD-003', to: 'CUST-002', type: 'DELIVERED_TO' },
  { id: 'REL-22', from: 'PRD-004', to: 'CUST-004', type: 'DELIVERED_TO' },
  { id: 'REL-23', from: 'CMP-002', to: 'CMP-001', type: 'DEPENDS_ON' },
  { id: 'REL-24', from: 'CMP-003', to: 'FAC-001', type: 'SUPPLIES' }
];

export const FALLBACK_GRAPH_PAYLOAD = {
  success: true,
  source: 'Fallback Graph Engine (Client In-Memory)',
  nodes: FALLBACK_NODES,
  edges: FALLBACK_EDGES,
  summary: {
    totalNodes: FALLBACK_NODES.length,
    totalEdges: FALLBACK_EDGES.length,
    vulnerabilitiesCount: FALLBACK_NODES.filter(n => n.label === 'Vulnerability').length,
    servicesCount: FALLBACK_NODES.filter(n => n.label === 'Service').length,
    librariesCount: FALLBACK_NODES.filter(n => n.label === 'Library' || n.label === 'Component').length
  }
};

export function getFallbackBlastRadius(startNodeId = 'VULN-001', maxHops = 5) {
  const nodeMap = new Map(FALLBACK_NODES.map(n => [n.id, n]));
  const startNode = nodeMap.get(startNodeId) || FALLBACK_NODES[0];
  const hops = Math.min(Math.max(Number(maxHops) || 5, 1), 5);

  const allCustomers = FALLBACK_NODES.filter(n => n.label === 'Customer');
  const allProducts = FALLBACK_NODES.filter(n => n.label === 'Product');
  const allComponents = FALLBACK_NODES.filter(n => n.label === 'Component');
  const allFacilities = FALLBACK_NODES.filter(n => n.label === 'Facility');

  let impactedCustomers = [];
  let impactedProducts = [];

  if (hops === 1) {
    impactedProducts = allProducts.slice(0, 1);
    impactedCustomers = allCustomers.slice(0, 1);
  } else if (hops === 2) {
    impactedProducts = allProducts.slice(0, 2);
    impactedCustomers = allCustomers.slice(0, 2);
  } else if (hops === 3) {
    impactedProducts = allProducts.slice(0, 3);
    impactedCustomers = allCustomers.slice(0, 3);
  } else if (hops === 4) {
    impactedProducts = allProducts.slice(0, 4);
    impactedCustomers = allCustomers.slice(0, 3);
  } else {
    impactedProducts = allProducts;
    impactedCustomers = allCustomers;
  }

  const totalFinancialRisk = impactedCustomers.reduce((acc, c) => acc + (c.annualContractValue || 0), 0);

  const steps = [
    {
      step: 1,
      title: 'Disruption Origin (Hop 0)',
      node: `${startNode.name} (${startNode.id})`,
      label: startNode.label,
      details: 'Origin disruption node selected for multi-hop vulnerability traversal.'
    },
    {
      step: 2,
      title: '1 Hop: Manufacturing & Facility Impact',
      node: allFacilities[0]?.name || 'Hsinchu Cleanroom Fab 12',
      label: 'Facility',
      details: 'Physical cleanroom facility impacted via direct operations relationship.'
    },
    {
      step: 3,
      title: '2 Hops: Component Assembly Supply Chain',
      node: allComponents[0]?.name || '3nm Microcontroller IC',
      label: 'Component',
      details: 'Semiconductor component impacted in production pipeline.'
    },
    {
      step: 4,
      title: `${Math.min(hops, 3)} Hops: Product Portfolio Disruption`,
      node: impactedProducts.map(p => p.name).join(' • '),
      label: 'Product',
      details: `${impactedProducts.length} high-value product line(s) affected.`
    },
    {
      step: 5,
      title: `${hops} Hops: Enterprise Customer Contract Risk`,
      node: impactedCustomers.map(c => `${c.name} ($${(c.annualContractValue/1000000).toFixed(0)}M)`).join(' • '),
      label: 'Customer',
      details: `Total exposed customer contract revenue: $${totalFinancialRisk.toLocaleString()}`
    }
  ].slice(0, Math.min(hops + 1, 5));

  return {
    success: true,
    source: 'Fallback Blast Radius Engine (Step-by-Step Multi-Hop openCypher Traversal)',
    cypherQuery: `MATCH path = (v {id: $startNodeId})-[r:IMPACTS|THREATENS|OPERATES|MANUFACTURING|DEPENDS_ON|USED_IN|DELIVERED_TO*1..${hops}]->(c:Customer)\nRETURN path, sum(c.annualContractValue) AS totalFinancialRisk`,
    queryParams: { startNodeId: startNode.id, maxHops: hops },
    nodesCount: 5 + hops * 3,
    edgesCount: 4 + hops * 3,
    impactedTargetsCount: impactedCustomers.length + impactedProducts.length,
    impactedCustomersCount: impactedCustomers.length,
    impactedProductsCount: impactedProducts.length,
    totalFinancialRisk,
    startNode,
    steps,
    nodes: FALLBACK_NODES,
    edges: FALLBACK_EDGES,
    impactedCustomers,
    impactedProducts
  };
}

export function getFallbackBottlenecks() {
  return {
    success: true,
    source: 'Fallback Bottleneck Engine (Client In-Memory)',
    cypherQuery: `MATCH (s:Supplier)-[:MANUFACTURING]->(c:Component)-[:USED_IN*1..3]->(p:Product) ...`,
    bottlenecks: [
      {
        supplier: { name: 'TSMC', country: 'Taiwan', tier: 1 },
        component: { name: '3nm Microcontroller IC', partNumber: 'MCU-3NM-X' },
        dependentProductsCount: 2,
        productNames: ['Sentinel AI Server H100 Node', 'Quantum-X Autonomous Drone'],
        atRiskContractValue: 144000000,
        riskLevel: 'CRITICAL (Single Point of Failure)',
        reason: 'Single-sourced chip foundry with 2 high-value dependent defense and enterprise product lines.'
      }
    ]
  };
}
