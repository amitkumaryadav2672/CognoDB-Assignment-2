import neo4j from 'neo4j-driver';

const password = "a5da3589e851333410db79a22c5ce3df";
const users = ["cognodb", "neo4j", "admin", "cognodb-admin"];
const uri = 'bolt+s://db-1dd427e3.databases.cognodb.com';

async function test() {
  for (const user of users) {
    console.log(`Testing user: "${user}"...`);
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    try {
      await driver.verifyConnectivity();
      const info = await driver.getServerInfo();
      console.log(` SUCCESS! User "${user}" authenticated successfully. Server: ${info.agent}`);
      await driver.close();
      return;
    } catch (err) {
      console.error(` Failed for user "${user}": ${err.message}`);
      await driver.close();
    }
  }
}

test();
