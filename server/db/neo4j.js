import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

let driver = null;
let isConnected = false;
let connectionError = null;

/**
 * Get or initialize the Neo4j/CognoDB driver
 */
export function getDriver() {
  const uri = process.env.COGNO_DB_URI || 'bolt+s://demo.databases.cognodb.com';
  const user = process.env.COGNO_DB_USER || 'cognodb';
  const password = process.env.COGNO_DB_PASSWORD || '';

  if (!driver) {
    try {
      driver = neo4j.driver(
        uri,
        neo4j.auth.basic(user, password),
        {
          maxConnectionLifetime: 3 * 60 * 1000,
          maxConnectionPoolSize: 50,
          connectionAcquisitionTimeout: 5000,
          disableLosslessIntegers: true
        }
      );
    } catch (err) {
      console.error('Failed to initialize Neo4j driver:', err.message);
      connectionError = err.message;
    }
  }
  return driver;
}

/**
 * Verify connectivity to CognoDB
 */
export async function verifyConnection() {
  const activeDriver = getDriver();
  if (!activeDriver) {
    isConnected = false;
    connectionError = 'Driver initialization failed.';
    return { isConnected: false, error: connectionError };
  }

  try {
    await activeDriver.verifyConnectivity();
    const serverInfo = await activeDriver.getServerInfo();
    isConnected = true;
    connectionError = null;
    console.log(` Connected to CognoDB/Neo4j database at ${process.env.COGNO_DB_URI}`);
    console.log(`   Agent Version: ${serverInfo.agent}`);
    return { isConnected: true, serverInfo };
  } catch (err) {
    isConnected = false;
    connectionError = err.message;
    console.warn(` CognoDB connection unavailable (${err.message}). Application running in Demo/Fallback Mode.`);
    return { isConnected: false, error: err.message };
  }
}

/**
 * Execute a read Cypher query using parameterisation
 */
export async function runQuery(cypher, params = {}) {
  const activeDriver = getDriver();
  
  if (!activeDriver || !isConnected) {
    // Attempt one reconnect check
    const status = await verifyConnection();
    if (!status.isConnected) {
      throw new Error(`Database Unreachable: ${status.error || 'Please configure valid COGNO_DB_URI and COGNO_DB_PASSWORD in .env'}`);
    }
  }

  const session = activeDriver.session();
  try {
    const result = await session.run(cypher, params);
    return result;
  } catch (error) {
    console.error(`Cypher Query Execution Error: ${error.message}`);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Close driver connection gracefully on shutdown
 */
export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
    isConnected = false;
    console.log('Neo4j/CognoDB driver connection closed.');
  }
}

export function getConnectionStatus() {
  return {
    isConnected,
    connectionError,
    uri: process.env.COGNO_DB_URI || 'Unconfigured',
    user: process.env.COGNO_DB_USER || 'Unconfigured'
  };
}
