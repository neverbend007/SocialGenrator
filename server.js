const express = require('express');
const next = require('next');
const path = require('path');

const findAvailablePort = async (startPort) => {
  const net = require('net');
  
  const isPortAvailable = (port) => {
    return new Promise((resolve) => {
      const server = net.createServer();
      
      server.once('error', () => {
        resolve(false);
      });
      
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      
      server.listen(port);
    });
  };

  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
  }
  return port;
};

const startServer = async () => {
  const port = parseInt(process.env.PORT, 10) || 3000;
  const dev = process.env.NODE_ENV !== 'production';

  // Create express server first
  const server = express();

  // Enable trust proxy since we're behind Railway's proxy
  server.enable('trust proxy');

  // Add CORS headers
  server.use((req, res, next) => {
    // Allow requests from Railway's domain
    res.header('Access-Control-Allow-Origin', process.env.RAILWAY_STATIC_URL || '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Add request logging
  server.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url} from ${req.ip}`);
    next();
  });

  // Add health check endpoint immediately
  server.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  try {
    console.log('Initializing Next.js...');
    const app = next({ dev });
    const handle = app.getRequestHandler();

    await app.prepare();
    console.log('Next.js initialized');

    // Add Next.js request handler
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    // Start listening on all interfaces
    const httpServer = server.listen(port, '0.0.0.0', (err) => {
      if (err) {
        console.error('Error starting server:', err);
        throw err;
      }
      console.log(`> Server listening on all interfaces, port ${port}`);
      console.log('Server environment:', {
        nodeEnv: process.env.NODE_ENV,
        port: port,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        railwayUrl: process.env.RAILWAY_STATIC_URL,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      });
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down...');
      httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('Error during Next.js initialization:', err);
    process.exit(1);
  }
};

// Start the server
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
}); 