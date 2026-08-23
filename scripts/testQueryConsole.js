async function testQueryConsole() {
  console.log('Testing Cypher Console POST /api/graph/query in Fallback Mode...\n');

  const queries = [
    { name: '1. Blast Radius Query', cypher: 'MATCH path = (v:Vulnerability {id: $startNodeId})-[*1..5]->(c:Customer) RETURN path, sum(c.annualContractValue)', params: { startNodeId: 'VULN-001' } },
    { name: '2. Bottleneck Query', cypher: 'MATCH (s:Supplier)-[:MANUFACTURING]->(c:Component)-[:USED_IN*1..3]->(p:Product) RETURN s, c, count(DISTINCT p)', params: {} },
    { name: '3. Shortest Path Query', cypher: 'MATCH p = shortestPath((start)-[*..6]->(end)) RETURN p', params: {} }
  ];

  for (const q of queries) {
    try {
      const res = await fetch('http://localhost:5000/api/graph/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cypher: q.cypher, params: q.params })
      });
      const data = await res.json();
      console.log(` [${q.name}] Status:`, res.status, `Success: ${data.success}`);
      console.log('   Records Count:', data.recordsCount);
      console.log('   Records:', JSON.stringify(data.records[0] || {}, null, 2));
    } catch (e) {
      console.error(` [${q.name}] Error:`, e.message);
    }
  }
}

testQueryConsole();
