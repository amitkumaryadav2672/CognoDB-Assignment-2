import neo4j from 'neo4j-driver';

const candidates = [
  "a5da3589e051333410db79a22c5ce3df",
  "a5da3589e05133410db79a22c5ce3df",
  "a5da3589e0513333410db79a22c5ce3df",
  "A5DA3589E051333410DB79A22C5CE3DF",
  "a5da3589e051333410db79a22c5ce3df "
];

async function test() {
  const uri = 'bolt+s://db-1dd427e3.databases.cognodb.com';
  for (const pwd of candidates) {
    const driver = neo4j.driver(uri, neo4j.auth.basic("cognodb", pwd));
    try {
      await driver.verifyConnectivity();
      console.log(`\n SUCCESS WITH PASSWORD: "${pwd}"`);
      await driver.close();
      return pwd;
    } catch (err) {
      process.stdout.write('.');
      await driver.close();
    }
  }
  console.log('\nNone of the candidate variations connected.');
}

test();
