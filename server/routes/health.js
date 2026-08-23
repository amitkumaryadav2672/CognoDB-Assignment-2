import express from 'express';
import { verifyConnection, getConnectionStatus } from '../db/neo4j.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const status = await verifyConnection();
    res.json({
      success: true,
      mode: status.isConnected ? 'CognoDB Live Graph' : 'Demo / Fallback Mode (In-Memory Graph)',
      ...getConnectionStatus(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mode: 'Demo / Fallback Mode (In-Memory Graph)',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
