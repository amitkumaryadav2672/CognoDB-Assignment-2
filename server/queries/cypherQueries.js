/**
 * Parameterised Cypher Queries for CognoDB (openCypher / Neo4j Driver)
 * All queries strictly use $param placeholders to prevent injection and optimize query plans.
 */

// 1. Fetch entire graph for initial visual canvas rendering
export const GET_FULL_GRAPH_CYPHER = `
  MATCH (n)
  OPTIONAL MATCH (n)-[r]->(m)
  RETURN n, r, m
  LIMIT $limit
`;

// 2. Multi-hop Blast Radius Analysis (1 to 5 Hops)
// Demonstrates multi-hop graph traversal (SQL awkward query)
export const MULTI_HOP_BLAST_RADIUS_CYPHER = `
  MATCH path = (v {id: $startNodeId})-[r:IMPACTS|THREATENS|OPERATES|MANUFACTURING|DEPENDS_ON|USED_IN|DELIVERED_TO*1..5]->(c:Customer)
  WITH path, nodes(path) AS pathNodes, relationships(path) AS pathRels, c
  UNWIND pathNodes AS n
  UNWIND pathRels AS rel
  RETURN DISTINCT n, rel, sum(c.annualContractValue) AS totalFinancialRisk
`;

// 3. Discover Single Point of Failure (Bottleneck Node Discovery)
// Query awkward in Relational SQL due to multi-level recursive aggregation
export const DISCOVER_BOTTLENECKS_CYPHER = `
  MATCH (s:Supplier)-[:MANUFACTURING]->(c:Component)-[:USED_IN*1..3]->(p:Product)
  WITH s, c, count(DISTINCT p) AS dependentProductsCount, collect(DISTINCT p.name) AS productNames
  WHERE dependentProductsCount >= 2 AND NOT (c)<-[:MANUFACTURING]-(:Supplier WHERE s.id <> id)
  MATCH (p:Product)-[:DELIVERED_TO]->(cust:Customer) WHERE p.name IN productNames
  RETURN s AS supplier, c AS component, dependentProductsCount, productNames, sum(cust.annualContractValue) AS atRiskValue
`;

// 4. Shortest Unaffected Procurement Path (ShortestPath algorithm)
export const SHORTEST_PATH_CYPHER = `
  MATCH (start {id: $startId}), (end {id: $targetId})
  MATCH p = shortestPath((start)-[:MANUFACTURING|DEPENDS_ON|USED_IN|DELIVERED_TO*..6]->(end))
  WHERE NONE(node IN nodes(p) WHERE node.status = 'DISRUPTED')
  RETURN p
`;

// 5. Get Schema Overview (Node labels & counts)
export const GET_SCHEMA_OVERVIEW_CYPHER = `
  CALL db.labels() YIELD label
  MATCH (n) WHERE label IN labels(n)
  RETURN label, count(n) AS nodeCount
`;

// 6. Idempotent Graph Seeding Cypher (UNWIND Batch MERGE)
export const SEED_GRAPH_CYPHER = `
  // 1. Create Vulnerabilities
  UNWIND $vulnerabilities AS v
  MERGE (node:Vulnerability {id: v.id})
  SET node.name = v.name, node.cve = v.cve, node.severity = v.severity, node.riskScore = v.riskScore, node.type = v.type

  // 2. Create Suppliers
  WITH 1 AS dummy
  UNWIND $suppliers AS s
  MERGE (node:Supplier {id: s.id})
  SET node.name = s.name, node.country = s.country, node.tier = s.tier, node.status = s.status, node.reliabilityScore = s.reliabilityScore

  // 3. Create Facilities
  WITH 1 AS dummy
  UNWIND $facilities AS f
  MERGE (node:Facility {id: f.id})
  SET node.name = f.name, node.city = f.city, node.status = f.status

  // 4. Create Components
  WITH 1 AS dummy
  UNWIND $components AS c
  MERGE (node:Component {id: c.id})
  SET node.name = c.name, node.partNumber = c.partNumber, node.category = c.category, node.unitCost = c.unitCost, node.status = c.status

  // 5. Create Products
  WITH 1 AS dummy
  UNWIND $products AS p
  MERGE (node:Product {id: p.id})
  SET node.name = p.name, node.sku = p.sku, node.price = p.price, node.category = p.category

  // 6. Create Customers
  WITH 1 AS dummy
  UNWIND $customers AS cust
  MERGE (node:Customer {id: cust.id})
  SET node.name = cust.name, node.sector = cust.sector, node.annualContractValue = cust.annualContractValue

  // 7. Connect Relationships
  WITH 1 AS dummy
  UNWIND $relationships AS rel
  MATCH (from {id: rel.from})
  MATCH (to {id: rel.to})
  CALL apoc.create.relationship(from, rel.type, rel.properties, to) YIELD rel AS r
  RETURN count(r) AS relsCreated
`;
