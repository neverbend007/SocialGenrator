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
  const dev = process.env.NODE_ENV !== 'production';
  const port = await findAvailablePort(3000);

  console.log('Starting server with config:', {
    port,
    nodeEnv: process.env.NODE_ENV,
    dev,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
  });

  const app = next({ dev });
  const handle = app.getRequestHandler();

  try {
    await app.prepare();
    console.log('Next.js app prepared, setting up Express...');
    
    const server = express();

    // Serve static files from the public directory
    server.use(express.static(path.join(__dirname, 'public')));

    // Health check endpoint
    server.get('/health', (req, res) => {
      console.log('Health check requested');
      res.status(200).json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
      });
    });

    // Let Next.js handle all other routes
    server.all('*', (req, res) => {
      console.log(`Request received: ${req.method} ${req.url}`);
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) {
        console.error('Error starting server:', err);
        throw err;
      }
      console.log(`> Ready on http://localhost:${port}`);
      console.log('Server environment:', {
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      });
    });
  } catch (err) {
    console.error('Error during server setup:');
    console.error(err);
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
  console.error('Uncaught Exception:');
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:');
  console.error(err);
  process.exit(1);
}); 