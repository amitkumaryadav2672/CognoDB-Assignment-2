import express from 'express';
import { runQuery, getConnectionStatus } from '../db/neo4j.js';
import { MOCK_NODES, MOCK_RELATIONSHIPS, calculateMockBlastRadius, findMockBottlenecks } from '../db/mockData.js';
import {
  GET_FULL_GRAPH_CYPHER,
  DISCOVER_BOTTLENECKS_CYPHER
} from '../queries/cypherQueries.js';

const router = express.Router();

/**
 * GET /api/graph/full
 * Retrieve live graph nodes & edges directly from CognoDB Cloud
 */
router.get('/full', async (req, res) => {
  const status = getConnectionStatus();

  if (!status.isConnected) {
    return res.json({
      success: true,
      source: 'Mock / Fallback Graph Engine',
      nodes: MOCK_NODES,
      edges: MOCK_RELATIONSHIPS,
      summary: {
        totalNodes: MOCK_NODES.length,
        totalEdges: MOCK_RELATIONSHIPS.length,
        vulnerabilitiesCount: MOCK_NODES.filter(n => n.label === 'Vulnerability').length,
        servicesCount: MOCK_NODES.filter(n => n.label === 'Service').length,
        librariesCount: MOCK_NODES.filter(n => n.label === 'Library').length
      }
    });
  }

  try {
    const cypher = `MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 200`;
    const result = await runQuery(cypher);
    const nodesMap = new Map();
    const edges = [];

    result.records.forEach(record => {
      const nodeN = record.get('n');
      const relR = record.get('r');
      const nodeM = record.get('m');

      const processNode = (node) => {
        if (!node) return;
        const id = node.properties.id || node.properties.name || node.elementId || node.identity.toString();
        const label = (node.labels && node.labels[0]) ? node.labels[0] : 'Entity';
        const name = node.properties.name || node.properties.cve || node.properties.title || id;
        nodesMap.set(id, {
          id,
          label,
          name,
          ...node.properties
        });
      };

      processNode(nodeN);
      processNode(nodeM);

      if (relR && nodeN && nodeM) {
        const fromId = nodeN.properties.id || nodeN.properties.name || nodeN.elementId || nodeN.identity.toString();
        const toId = nodeM.properties.id || nodeM.properties.name || nodeM.elementId || nodeM.identity.toString();
        const relId = relR.elementId || relR.identity?.toString() || `${fromId}-${toId}`;
        
        edges.push({
          id: relId,
          from: fromId,
          to: toId,
          type: relR.type,
          properties: relR.properties || {}
        });
      }
    });

    const nodes = Array.from(nodesMap.values());
    res.json({
      success: true,
      source: 'CognoDB Cloud Live Graph',
      nodes,
      edges,
      summary: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        vulnerabilitiesCount: nodes.filter(n => n.label === 'Vulnerability').length,
        servicesCount: nodes.filter(n => n.label === 'Service').length,
        librariesCount: nodes.filter(n => n.label === 'Library').length,
        applicationsCount: nodes.filter(n => n.label === 'Application').length,
        infrastructureCount: nodes.filter(n => n.label === 'Infrastructure').length,
        vendorsCount: nodes.filter(n => n.label === 'Vendor').length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      nodes: MOCK_NODES,
      edges: MOCK_RELATIONSHIPS
    });
  }
});

/**
 * POST /api/graph/blast-radius
 * Multi-hop Graph Traversal (1 to 5 Hops)
 */
router.post('/blast-radius', async (req, res) => {
  const { startNodeId = 'VULN-001', maxHops = 4 } = req.body;
  const status = getConnectionStatus();

  if (!status.isConnected) {
    const mockResult = calculateMockBlastRadius(startNodeId, maxHops);
    return res.json({
      success: true,
      source: 'Mock / Fallback Blast Radius Engine',
      cypherQuery: `MATCH path = (start {id: $startNodeId})-[*1..${maxHops}]->(target) RETURN path`,
      queryParams: { startNodeId, maxHops },
      ...mockResult
    });
  }

  try {
    const hops = Math.min(Math.max(Number(maxHops) || 5, 1), 5);
    const cypher = `
      MATCH (start) WHERE start.id = $startNodeId OR start.name = $startNodeId OR elementId(start) = $startNodeId
      MATCH path = (start)-[*1..${hops}]->(target)
      WITH path, nodes(path) AS pathNodes, relationships(path) AS pathRels, target
      UNWIND pathNodes AS n
      UNWIND pathRels AS rel
      RETURN DISTINCT n, rel, target
    `;

    const result = await runQuery(cypher, { startNodeId });
    const nodesMap = new Map();
    const edgesMap = new Map();
    const impactedTargets = [];

    result.records.forEach(record => {
      const node = record.get('n');
      const rel = record.get('rel');
      const target = record.get('target');

      if (node) {
        const id = node.properties.id || node.properties.name || node.elementId;
        const label = (node.labels && node.labels[0]) ? node.labels[0] : 'Entity';
        const name = node.properties.name || node.properties.cve || id;
        nodesMap.set(id, { id, label, name, ...node.properties });
      }

      if (target) {
        const targetId = target.properties.id || target.properties.name || target.elementId;
        const targetLabel = (target.labels && target.labels[0]) ? target.labels[0] : 'Entity';
        const targetName = target.properties.name || target.properties.cve || targetId;
        if (!impactedTargets.some(t => t.id === targetId)) {
          impactedTargets.push({ id: targetId, label: targetLabel, name: targetName, ...target.properties });
        }
      }

      if (rel) {
        const relId = rel.elementId || rel.identity?.toString();
        edgesMap.set(relId, {
          id: relId,
          type: rel.type,
          properties: rel.properties || {}
        });
      }
    });

    res.json({
      success: true,
      source: 'CognoDB Cloud Live Graph',
      cypherQuery: cypher.trim(),
      queryParams: { startNodeId, maxHops },
      nodesCount: nodesMap.size,
      edgesCount: edgesMap.size,
      impactedTargetsCount: impactedTargets.length,
      impactedCustomersCount: impactedTargets.filter(t => t.label === 'Customer' || t.label === 'Application').length,
      impactedProductsCount: impactedTargets.filter(t => t.label === 'Product' || t.label === 'Service').length,
      totalFinancialRisk: impactedTargets.reduce((acc, t) => acc + (t.annualContractValue || t.riskValue || 250000), 0),
      nodes: Array.from(nodesMap.values()),
      edges: Array.from(edgesMap.values()),
      impactedCustomers: impactedTargets.filter(t => t.label === 'Customer' || t.label === 'Application'),
      impactedProducts: impactedTargets.filter(t => t.label === 'Product' || t.label === 'Service')
    });
  } catch (error) {
    const mockResult = calculateMockBlastRadius(startNodeId, maxHops);
    res.json({
      success: true,
      source: 'Fallback Blast Radius Engine',
      error: error.message,
      ...mockResult
    });
  }
});

/**
 * GET /api/graph/bottlenecks
 * Structural Bottleneck Discovery
 */
router.get('/bottlenecks', async (req, res) => {
  const status = getConnectionStatus();

  if (!status.isConnected) {
    const mockBottlenecks = findMockBottlenecks();
    return res.json({
      success: true,
      source: 'Mock / Fallback Bottleneck Engine',
      cypherQuery: DISCOVER_BOTTLENECKS_CYPHER,
      bottlenecks: mockBottlenecks
    });
  }

  try {
    const cypher = `
      MATCH (n)-[:DEPENDS_ON|MAINTAINED_BY|MANUFACTURING|COMPOSED_OF]->(dep)
      WITH dep, count(DISTINCT n) AS dependentCount, collect(DISTINCT n.name) AS dependentNames
      WHERE dependentCount >= 2
      RETURN dep AS node, dependentCount, dependentNames
    `;

    const result = await runQuery(cypher);
    const bottlenecks = result.records.map(record => {
      const node = record.get('node');
      const label = (node.labels && node.labels[0]) ? node.labels[0] : 'Entity';
      const name = node.properties.name || node.properties.id || 'Critical Dependency';
      return {
        supplier: { name, label, ...node.properties },
        component: { name: `Critical ${label} Dependency`, label },
        dependentProductsCount: record.get('dependentCount'),
        productNames: record.get('dependentNames'),
        atRiskContractValue: record.get('dependentCount') * 500000,
        riskLevel: 'CRITICAL (High In-Degree Bottleneck)',
        reason: `Multiple services and applications depend directly on this ${label} node.`
      };
    });

    res.json({
      success: true,
      source: 'CognoDB Cloud Live Graph',
      cypherQuery: cypher.trim(),
      bottlenecks
    });
  } catch (error) {
    const mockBottlenecks = findMockBottlenecks();
    res.json({
      success: true,
      source: 'Fallback Bottleneck Engine',
      error: error.message,
      bottlenecks: mockBottlenecks
    });
  }
});

/**
 * POST /api/graph/query
 * Raw Parameterised Cypher Runner
 */
router.post('/query', async (req, res) => {
  const { cypher, params = {} } = req.body;
  const status = getConnectionStatus();

  if (!cypher) {
    return res.status(400).json({ success: false, error: 'Missing Cypher query string.' });
  }

  if (!status.isConnected) {
    // Intelligent Fallback Cypher Query Simulator for Demo Mode
    const queryLower = cypher.toLowerCase();
    let records = [];

    if (queryLower.includes('blast') || queryLower.includes('totalrisk') || queryLower.includes('vulnerability')) {
      const startId = params.startNodeId || 'VULN-001';
      const blast = calculateMockBlastRadius(startId, 5);
      records = [
        {
          startNode: blast.startNode.name,
          impactedCustomersCount: blast.impactedCustomersCount,
          impactedProductsCount: blast.impactedProductsCount,
          totalFinancialRisk: `$${blast.totalFinancialRisk.toLocaleString('en-US')}`,
          impactedAccounts: blast.impactedCustomers.map(c => ({ customer: c.name, contractValue: `$${c.annualContractValue.toLocaleString('en-US')}` }))
        }
      ];
    } else if (queryLower.includes('bottleneck') || queryLower.includes('productcount') || queryLower.includes('supplier')) {
      const bottlenecks = findMockBottlenecks();
      records = bottlenecks.map(b => ({
        supplier: b.supplier.name,
        component: b.component.name,
        dependentProductsCount: b.dependentProductsCount,
        dependentProducts: b.dependentProducts,
        totalFinancialExposure: `$${b.atRiskContractValue.toLocaleString('en-US')}`,
        analysis: b.reason
      }));
    } else if (queryLower.includes('shortestpath')) {
      records = [
        {
          pathNodes: ['ASML Lithography', 'Hsinchu Cleanroom Fab 12', '3nm Microcontroller IC', 'Sentinel AI Server H100 Node', 'SpaceX Defense Systems'],
          hopCount: 4,
          status: 'VALID_PROCUREMENT_ROUTE',
          estimatedLeadTimeDays: 45
        }
      ];
    } else {
      // Default: Return sample node records matching limit or full nodes
      records = MOCK_NODES.slice(0, 10).map(n => ({
        id: n.id,
        label: n.label,
        name: n.name,
        attributes: { ...n }
      }));
    }

    return res.json({
      success: true,
      source: 'Mock / Fallback Cypher Engine (Demo Mode)',
      cypher,
      params,
      recordsCount: records.length,
      records
    });
  }

  try {
    const result = await runQuery(cypher, params);
    const records = result.records.map(r => r.toObject());
    res.json({
      success: true,
      cypher,
      params,
      recordsCount: records.length,
      records
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
