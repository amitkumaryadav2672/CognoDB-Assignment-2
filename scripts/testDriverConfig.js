import neo4j from 'neo4j-driver';

const uri = 'bolt+s://db-1dd427e3.databases.cognodb.com';
const user = 'cognodb';
const pwd = 'a5da3589e851333410db79a22c5ce3df';

async function testConfig() {
  const configs = [
    { name: 'Default Options', opts: {} },
    { name: 'Encrypted ON / Trust System', opts: { encrypted: 'ENCRYPTION_ON', trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES' } },
    { name: 'Encrypted ON / Trust All', opts: { encrypted: 'ENCRYPTION_ON', trust: 'TRUST_ALL_CERTIFICATES' } },
    { name: 'Auth Bearer / Token', opts: {} }
  ];

  for (const item of configs) {
    console.log(`Testing config: ${item.name}...`);
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, pwd), item.opts);
    try {
      await driver.verifyConnectivity();
      const info = await driver.getServerInfo();
      console.log(` SUCCESS! Config "${item.name}" connected. Server: ${info.agent}`);
      await driver.close();
      return;
    } catch (err) {
      console.error(` Failed (${item.name}): ${err.message}`);
      await driver.close();
    }
  }
}

testConfig();
