import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import healthRoutes from './routes/health.js';
import graphRoutes from './routes/graph.js';
import { verifyConnection, closeDriver } from './db/neo4j.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/graph', graphRoutes);

// API overview endpoint
app.get('/api', (req, res) => {
  res.json({
    service: 'NexusGraph REST API Backend',
    version: '1.0.0',
    status: 'Active',
    database: 'CognoDB (openCypher / Bolt)'
  });
});

// Check if client production build exists
const clientDistPath = path.join(__dirname, '../client/dist');
const isClientBuilt = fs.existsSync(clientDistPath);

if (isClientBuilt) {
  // Serve static assets from built Vite client
  app.use(express.static(clientDistPath));

  // SPA Fallback handler for all non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Development REST API overview endpoint when client is not pre-built
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

  // 404 Handler for Non-API Routes in Dev Mode
  app.use((req, res) => {
    res.status(404).json({
      error: 'Endpoint Not Found',
      message: `NexusGraph Backend operating on port ${PORT}. Run 'npm run build' to bundle and serve Web UI directly.`
    });
  });
}

// Start Backend API Server (Only when not running in serverless environment like Vercel)
if (!process.env.VERCEL) {
  const server = app.listen(PORT, async () => {
    console.log(`\n======================================================`);
    console.log(` NexusGraph Server active on port ${PORT}`);
    if (isClientBuilt) {
      console.log(` Web Application UI served directly at port ${PORT}`);
    } else {
      console.log(` REST API Server running at http://localhost:${PORT}`);
      console.log(` Vite Dev Server active at http://localhost:3000`);
    }
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
}

export default app;
