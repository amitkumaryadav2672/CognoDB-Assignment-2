/**
 * Fallback & Seed Dataset for Supply Chain & Vulnerability Blast Radius Graph
 */

export const MOCK_NODES = [
  // Vulnerabilities
  { id: 'VULN-001', label: 'Vulnerability', name: 'CVE-2026-8801 EUV Laser Overheat', cve: 'CVE-2026-8801', severity: 'CRITICAL', riskScore: 9.8, type: 'Hardware Defect' },
  { id: 'VULN-002', label: 'Vulnerability', name: 'Geo-Political Port Lockout', cve: 'GEO-2026-04', severity: 'HIGH', riskScore: 8.5, type: 'Geopolitical Risk' },
  { id: 'VULN-003', label: 'Vulnerability', name: 'Silicon Raw Shortage 2026', cve: 'MAT-2026-11', severity: 'MEDIUM', riskScore: 6.7, type: 'Material Shortage' },

  // Suppliers
  { id: 'SUP-001', label: 'Supplier', name: 'TSMC', country: 'Taiwan', tier: 1, status: 'DISRUPTED', reliabilityScore: 0.94 },
  { id: 'SUP-002', label: 'Supplier', name: 'ASML Lithography', country: 'Netherlands', tier: 1, status: 'OPERATIONAL', reliabilityScore: 0.99 },
  { id: 'SUP-003', label: 'Supplier', name: 'BASF Special Chemicals', country: 'Germany', tier: 2, status: 'OPERATIONAL', reliabilityScore: 0.91 },
  { id: 'SUP-004', label: 'Supplier', name: 'Samsung Foundry', country: 'South Korea', tier: 1, status: 'OPERATIONAL', reliabilityScore: 0.93 },
  { id: 'SUP-005', label: 'Supplier', name: 'Texas Instruments', country: 'USA', tier: 2, status: 'OPERATIONAL', reliabilityScore: 0.96 },

  // Facilities
  { id: 'FAC-001', label: 'Facility', name: 'Hsinchu Cleanroom Fab 12', city: 'Hsinchu', status: 'IMPACTED' },
  { id: 'FAC-002', label: 'Facility', name: 'Dresden Optics Plant', city: 'Dresden', status: 'OPERATIONAL' },
  { id: 'FAC-003', label: 'Facility', name: 'Ludwigshafen Polymer Lab', city: 'Ludwigshafen', status: 'OPERATIONAL' },
  { id: 'FAC-004', label: 'Facility', name: 'Austin Fab 1', city: 'Austin', status: 'OPERATIONAL' },

  // Components
  { id: 'CMP-001', label: 'Component', name: '3nm Microcontroller IC', partNumber: 'MCU-3NM-X', category: 'Semiconductor', unitCost: 45.0, status: 'CRITICAL_SHORTAGE' },
  { id: 'CMP-002', label: 'Component', name: 'EUV Mirror Optics Assembly', partNumber: 'OPT-EUV-99', category: 'Precision Optics', unitCost: 12000.0, status: 'OPERATIONAL' },
  { id: 'CMP-003', label: 'Component', name: 'Ultra-Pure Photoresist Chemical', partNumber: 'CHM-PR-900', category: 'Raw Materials', unitCost: 850.0, status: 'OPERATIONAL' },
  { id: 'CMP-004', label: 'Component', name: 'Power Regulator Module', partNumber: 'PWR-REG-24V', category: 'Power Electronics', unitCost: 12.5, status: 'OPERATIONAL' },
  { id: 'CMP-005', label: 'Component', name: 'High-Bandwidth Memory (HBM3)', partNumber: 'MEM-HBM-8G', category: 'Memory', unitCost: 180.0, status: 'OPERATIONAL' },

  // Products
  { id: 'PRD-001', label: 'Product', name: 'Sentinel AI Server H100 Node', sku: 'SKU-AI-H100', price: 35000, category: 'AI Infrastructure' },
  { id: 'PRD-002', label: 'Product', name: 'Quantum-X Autonomous Drone', sku: 'SKU-DRONE-QX', price: 18500, category: 'Aerospace & Defense' },
  { id: 'PRD-003', label: 'Product', name: 'Titan EV Power Inverter', sku: 'SKU-EV-INV4', price: 4200, category: 'Automotive' },
  { id: 'PRD-004', label: 'Product', name: 'MedTech Smart BioMonitor', sku: 'SKU-MED-BM99', price: 8900, category: 'Healthcare' },

  // Customers
  { id: 'CUST-001', label: 'Customer', name: 'SpaceX Defense Systems', sector: 'Defense', annualContractValue: 24000000 },
  { id: 'CUST-002', label: 'Customer', name: 'Tesla Global Motors', sector: 'Automotive', annualContractValue: 65000000 },
  { id: 'CUST-003', label: 'Customer', name: 'Apple Enterprise Systems', sector: 'Consumer Electronics', annualContractValue: 120000000 },
  { id: 'CUST-004', label: 'Customer', name: 'Mayo Clinic Health Network', sector: 'Healthcare', annualContractValue: 18000000 }
];

export const MOCK_RELATIONSHIPS = [
  // Vulnerability Impacts
  { id: 'REL-01', from: 'VULN-001', to: 'FAC-001', type: 'IMPACTS', properties: { severity: 'CRITICAL', reportedAt: '2026-08-15' } },
  { id: 'REL-02', from: 'VULN-002', to: 'SUP-001', type: 'THREATENS', properties: { severity: 'HIGH', region: 'Strait Port' } },
  { id: 'REL-03', from: 'VULN-003', to: 'CMP-003', type: 'IMPACTS', properties: { severity: 'MEDIUM', supplyDrop: '40%' } },

  // Supplier Facilities
  { id: 'REL-04', from: 'SUP-001', to: 'FAC-001', type: 'OPERATES', properties: { capacityPct: 100 } },
  { id: 'REL-05', from: 'SUP-002', to: 'FAC-002', type: 'OPERATES', properties: { capacityPct: 95 } },
  { id: 'REL-06', from: 'SUP-003', to: 'FAC-003', type: 'OPERATES', properties: { capacityPct: 90 } },
  { id: 'REL-07', from: 'SUP-004', to: 'FAC-004', type: 'OPERATES', properties: { capacityPct: 85 } },

  // Supplier -> Component
  { id: 'REL-08', from: 'SUP-001', to: 'CMP-001', type: 'MANUFACTURING', properties: { leadTimeDays: 45, marketShare: '78%' } },
  { id: 'REL-09', from: 'SUP-002', to: 'CMP-002', type: 'MANUFACTURING', properties: { leadTimeDays: 90, marketShare: '95%' } },
  { id: 'REL-10', from: 'SUP-003', to: 'CMP-003', type: 'MANUFACTURING', properties: { leadTimeDays: 30, marketShare: '60%' } },
  { id: 'REL-11', from: 'SUP-005', to: 'CMP-004', type: 'MANUFACTURING', properties: { leadTimeDays: 14, marketShare: '45%' } },
  { id: 'REL-12', from: 'SUP-004', to: 'CMP-005', type: 'MANUFACTURING', properties: { leadTimeDays: 60, marketShare: '50%' } },

  // Component Sub-Dependencies
  { id: 'REL-13', from: 'CMP-002', to: 'CMP-001', type: 'DEPENDS_ON', properties: { criticalLevel: 'HIGH' } },
  { id: 'REL-14', from: 'CMP-003', to: 'CMP-001', type: 'DEPENDS_ON', properties: { criticalLevel: 'CRITICAL' } },

  // Component -> Product
  { id: 'REL-15', from: 'CMP-001', to: 'PRD-001', type: 'USED_IN', properties: { qtyPerUnit: 4 } },
  { id: 'REL-16', from: 'CMP-001', to: 'PRD-002', type: 'USED_IN', properties: { qtyPerUnit: 2 } },
  { id: 'REL-17', from: 'CMP-004', to: 'PRD-003', type: 'USED_IN', properties: { qtyPerUnit: 1 } },
  { id: 'REL-18', from: 'CMP-005', to: 'PRD-001', type: 'USED_IN', properties: { qtyPerUnit: 8 } },
  { id: 'REL-19', from: 'CMP-001', to: 'PRD-004', type: 'USED_IN', properties: { qtyPerUnit: 1 } },

  // Product -> Customer
  { id: 'REL-20', from: 'PRD-001', to: 'CUST-003', type: 'DELIVERED_TO', properties: { contractYear: 2026 } },
  { id: 'REL-21', from: 'PRD-001', to: 'CUST-001', type: 'DELIVERED_TO', properties: { contractYear: 2026 } },
  { id: 'REL-22', from: 'PRD-002', to: 'CUST-001', type: 'DELIVERED_TO', properties: { contractYear: 2026 } },
  { id: 'REL-23', from: 'PRD-003', to: 'CUST-002', type: 'DELIVERED_TO', properties: { contractYear: 2026 } },
  { id: 'REL-24', from: 'PRD-004', to: 'CUST-004', type: 'DELIVERED_TO', properties: { contractYear: 2026 } }
];

/**
 * Perform multi-hop graph blast radius traversal in-memory for fallback mode
 */
export function calculateMockBlastRadius(startNodeId, maxHops = 5) {
  const visitedNodes = new Set([startNodeId]);
  const visitedEdges = new Set();
  const queue = [{ id: startNodeId, depth: 0, path: [startNodeId] }];
  const impactedCustomers = [];
  const impactedProducts = [];
  let totalFinancialRisk = 0;

  const nodeMap = new Map(MOCK_NODES.map(n => [n.id, n]));

  while (queue.length > 0) {
    const { id, depth } = queue.shift();
    if (depth >= maxHops) continue;

    // Find connected relationships (outgoing or incoming)
    const connectedRels = MOCK_RELATIONSHIPS.filter(rel => rel.from === id || rel.to === id);
    for (const rel of connectedRels) {
      visitedEdges.add(rel.id);
      const neighborId = rel.from === id ? rel.to : rel.from;
      const targetNode = nodeMap.get(neighborId);
      if (targetNode) {
        if (!visitedNodes.has(targetNode.id)) {
          visitedNodes.add(targetNode.id);
          queue.push({ id: targetNode.id, depth: depth + 1 });

          if (targetNode.label === 'Customer') {
            impactedCustomers.push(targetNode);
            totalFinancialRisk += (targetNode.annualContractValue || 0);
          } else if (targetNode.label === 'Product') {
            impactedProducts.push(targetNode);
          }
        }
      }
    }
  }

  const nodes = Array.from(visitedNodes).map(id => nodeMap.get(id)).filter(Boolean);
  const edges = MOCK_RELATIONSHIPS.filter(rel => visitedEdges.has(rel.id));

  return {
    startNode: nodeMap.get(startNodeId),
    nodesCount: nodes.length,
    edgesCount: edges.length,
    totalFinancialRisk,
    impactedCustomersCount: impactedCustomers.length,
    impactedProductsCount: impactedProducts.length,
    nodes,
    edges,
    impactedCustomers,
    impactedProducts
  };
}

/**
 * Discover single-point-of-failure suppliers in-memory for fallback mode
 */
export function findMockBottlenecks() {
  const nodeMap = new Map(MOCK_NODES.map(n => [n.id, n]));
  const bottlenecks = [];

  // TSMC (SUP-001) supplies 3nm Microcontroller (CMP-001) which is used in 3 major products
  const tsmc = nodeMap.get('SUP-001');
  const mcu = nodeMap.get('CMP-001');
  if (tsmc && mcu) {
    bottlenecks.push({
      supplier: tsmc,
      component: mcu,
      dependentProductsCount: 3,
      dependentProducts: ['Sentinel AI Server H100 Node', 'Quantum-X Autonomous Drone', 'MedTech Smart BioMonitor'],
      atRiskContractValue: 162000000,
      riskLevel: 'CRITICAL (Single Point of Failure)',
      reason: 'No alternative supplier configured for 3nm Microcontroller IC'
    });
  }

  return bottlenecks;
}
