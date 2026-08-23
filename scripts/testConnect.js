import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const password = (process.env.COGNO_DB_PASSWORD || '').trim();
const user = (process.env.COGNO_DB_USER || 'cognodb').trim();

const schemes = [
  'bolt+s://db-1dd427e3.databases.cognodb.com',
  'bolt+s://db-1dd427e3.databases.cognodb.com:7687',
  'bolt://db-1dd427e3.databases.cognodb.com:7687',
  'neo4j+s://db-1dd427e3.databases.cognodb.com'
];

async function test() {
  for (const uri of schemes) {
    console.log(`Testing URI: ${uri} with user: "${user}" password: "${password}"`);
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    try {
      await driver.verifyConnectivity();
      const info = await driver.getServerInfo();
      console.log(` SUCCESS with ${uri}! Server: ${info.agent}`);
      await driver.close();
      return;
    } catch (e) {
      console.error(` Failed ${uri}:`, e.message);
      await driver.close();
    }
  }
}

test();
