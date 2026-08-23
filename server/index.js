import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.js';
import graphRoutes from './routes/graph.js';
import { verifyConnection, closeDriver } from './db/neo4j.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/graph', graphRoutes);

// Root REST API overview endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'NexusGraph REST API Backend',
    port: PORT,
    status: 'Active',
    database: 'CognoDB (openCypher / Bolt)',
    frontendUrl: 'http://localhost:3000',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/graph/full',
      'POST /api/graph/blast-radius',
      'GET /api/graph/bottlenecks',
      'POST /api/graph/query'
    ]
  });
});

app.get('/api', (req, res) => {
  res.json({
    service: 'NexusGraph REST API Backend',
    version: '1.0.0',
    status: 'Active'
  });
});

// 404 Handler for Non-API Routes (Pure REST API Server)
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint Not Found',
    message: 'NexusGraph Backend operates strictly as a REST API server on port 5000. Please access the Web Application UI on http://localhost:3000.'
  });
});

// Start Backend API Server
const server = app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(` NexusGraph REST API Backend running on http://localhost:${PORT}`);
  console.log(` Web Application UI active on http://localhost:3000`);
  console.log(`======================================================\n`);
  
  // Verify CognoDB connection on launch
  await verifyConnection();
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down backend API server...');
  await closeDriver();
  server.close(() => {
    console.log('Backend process terminated.');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  await closeDriver();
  server.close(() => process.exit(0));
});
