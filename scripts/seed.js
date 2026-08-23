import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import { MOCK_NODES, MOCK_RELATIONSHIPS } from '../server/db/mockData.js';

dotenv.config();

const uri = process.env.COGNO_DB_URI;
const user = process.env.COGNO_DB_USER || 'cognodb';
const password = process.env.COGNO_DB_PASSWORD;

if (!uri || !password || uri.includes('your-instance-id') || uri.includes('demo.')) {
  console.error('\n Error: Missing or invalid CognoDB connection credentials in .env file!');
  console.error('Please create your free CognoDB instance at https://console.cognodb.com and set COGNO_DB_URI and COGNO_DB_PASSWORD in .env\n');
  process.exit(1);
}

console.log(`\n Connecting to CognoDB Cloud at ${uri}...`);
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function seedDatabase() {
  const session = driver.session();
  try {
    // 1. Verify connection
    await driver.verifyConnectivity();
    const info = await driver.getServerInfo();
    console.log(` Verified CognoDB server connection (${info.agent})`);

    console.log('\n Clearing existing graph data...');
    await session.run('MATCH (n) DETACH DELETE n');

    console.log(' Seeding labeled nodes with parameterised UNWIND batching...');

    const vulnerabilities = MOCK_NODES.filter(n => n.label === 'Vulnerability');
    const suppliers = MOCK_NODES.filter(n => n.label === 'Supplier');
    const facilities = MOCK_NODES.filter(n => n.label === 'Facility');
    const components = MOCK_NODES.filter(n => n.label === 'Component');
    const products = MOCK_NODES.filter(n => n.label === 'Product');
    const customers = MOCK_NODES.filter(n => n.label === 'Customer');

    // Create Vulnerability Nodes
    await session.run(
      `UNWIND $batch AS v
       MERGE (n:Vulnerability {id: v.id})
       SET n.name = v.name, n.cve = v.cve, n.severity = v.severity, n.riskScore = v.riskScore, n.type = v.type`,
      { batch: vulnerabilities }
    );

    // Create Supplier Nodes
    await session.run(
      `UNWIND $batch AS s
       MERGE (n:Supplier {id: s.id})
       SET n.name = s.name, n.country = s.country, n.tier = s.tier, n.status = s.status, n.reliabilityScore = s.reliabilityScore`,
      { batch: suppliers }
    );

    // Create Facility Nodes
    await session.run(
      `UNWIND $batch AS f
       MERGE (n:Facility {id: f.id})
       SET n.name = f.name, n.city = f.city, n.status = f.status`,
      { batch: facilities }
    );

    // Create Component Nodes
    await session.run(
      `UNWIND $batch AS c
       MERGE (n:Component {id: c.id})
       SET n.name = c.name, n.partNumber = c.partNumber, n.category = c.category, n.unitCost = c.unitCost, n.status = c.status`,
      { batch: components }
    );

    // Create Product Nodes
    await session.run(
      `UNWIND $batch AS p
       MERGE (n:Product {id: p.id})
       SET n.name = p.name, n.sku = p.sku, n.price = p.price, n.category = p.category`,
      { batch: products }
    );

    // Create Customer Nodes
    await session.run(
      `UNWIND $batch AS cust
       MERGE (n:Customer {id: cust.id})
       SET n.name = cust.name, n.sector = cust.sector, n.annualContractValue = cust.annualContractValue`,
      { batch: customers }
    );

    console.log(' Nodes seeded successfully!');

    console.log('\n Seeding typed relationships...');
    for (const rel of MOCK_RELATIONSHIPS) {
      // Cypher relationship creation via parameterised MERGE
      const relCypher = `
        MATCH (a {id: $fromId}), (b {id: $toId})
        MERGE (a)-[r:${rel.type}]->(b)
        SET r += $props
      `;
      await session.run(relCypher, {
        fromId: rel.from,
        toId: rel.to,
        props: rel.properties || {}
      });
    }

    console.log(' Relationships seeded successfully!');

    // Fetch summary count
    const nodeCountRes = await session.run('MATCH (n) RETURN count(n) AS totalNodes');
    const relCountRes = await session.run('MATCH ()-[r]->() RETURN count(r) AS totalRels');

    const totalNodes = nodeCountRes.records[0].get('totalNodes');
    const totalRels = relCountRes.records[0].get('totalRels');

    console.log(`\n CognoDB Seeding Complete!`);
    console.log(` Total Nodes: ${totalNodes}`);
    console.log(` Total Relationships: ${totalRels}`);

  } catch (error) {
    console.error('\n Error seeding CognoDB database:', error.message);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();
