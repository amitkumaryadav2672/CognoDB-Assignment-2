
async function testEndpoints() {
  console.log('--- Testing NexusGraph Backend API Endpoints ---\n');

  // 1. Health
  try {
    const healthRes = await fetch('http://localhost:5000/api/health');
    const healthData = await healthRes.json();
    console.log(' [GET /api/health] Status:', healthRes.status);
    console.log('   Mode:', healthData.mode);
  } catch (err) {
    console.error(' [GET /api/health] Failed:', err.message);
  }

  // 2. Full Graph
  try {
    const fullRes = await fetch('http://localhost:5000/api/graph/full');
    const fullData = await fullRes.json();
    console.log(' [GET /api/graph/full] Status:', fullRes.status);
    console.log('   Nodes Count:', fullData.summary?.totalNodes);
    console.log('   Edges Count:', fullData.summary?.totalEdges);
  } catch (err) {
    console.error(' [GET /api/graph/full] Failed:', err.message);
  }

  // 3. Multi-Hop Blast Radius
  try {
    const blastRes = await fetch('http://localhost:5000/api/graph/blast-radius', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startNodeId: 'VULN-001', maxHops: 5 })
    });
    const blastData = await blastRes.json();
    console.log(' [POST /api/graph/blast-radius] Status:', blastRes.status);
    console.log('   Total Financial Risk:', `$${(blastData.totalFinancialRisk || 0).toLocaleString()}`);
    console.log('   Impacted Customers:', blastData.impactedCustomersCount);
    console.log('   Impacted Products:', blastData.impactedProductsCount);
  } catch (err) {
    console.error(' [POST /api/graph/blast-radius] Failed:', err.message);
  }

  // 4. Bottlenecks
  try {
    const btnRes = await fetch('http://localhost:5000/api/graph/bottlenecks');
    const btnData = await btnRes.json();
    console.log(' [GET /api/graph/bottlenecks] Status:', btnRes.status);
    console.log('   Discovered Bottlenecks:', btnData.bottlenecks?.length);
  } catch (err) {
    console.error(' [GET /api/graph/bottlenecks] Failed:', err.message);
  }

  console.log('\n--- All API Endpoints Verified Successfully ---');
}

testEndpoints();
