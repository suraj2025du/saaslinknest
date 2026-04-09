import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import 'dotenv/config';
import net from 'net';
import dns from 'dns';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ CRITICAL ERROR: DATABASE_URL is not defined in your environment variables.');
  console.error('Please add DATABASE_URL to your secrets/env with the format: mysql://user:pass@host:port/db');
}

const hasSslMode = databaseUrl?.includes('sslmode=') || databaseUrl?.includes('ssl=');
// Strip any query parameters because mysql2 can crash if JSON is embedded in the URI
const cleanUri = databaseUrl?.split('?')[0] || '';

// Diagnostic: Only run network tests in development to avoid production log noise
if (cleanUri && process.env.NODE_ENV === 'development') {
  try {
    const url = new URL(cleanUri);
    const host = url.hostname;
    const port = parseInt(url.port || '3306');

    console.log(`🔍 DIAGNOSTIC: Testing network reachability to ${host}:${port}...`);

    // Check DNS resolution
    dns.lookup(host, (err, address, family) => {
      if (err) {
        console.error(`❌ DNS FAILURE: Could not resolve hostname ${host}: ${err.message}`);
      } else {
        console.log(`✅ DNS SUCCESS: Hostname ${host} resolved to ${address} (IPv${family})`);

        // Only test socket if DNS succeeded
        const socket = new net.Socket();
        socket.setTimeout(10000); // 10s for diagnostic

        socket.on('connect', () => {
          console.log(`✅ NETWORK SUCCESS: Successfully reached ${host}:${port} over the network.`);
          socket.destroy();
        }).on('timeout', () => {
          console.error(`❌ NETWORK FAILURE: Timeout reaching ${host}:${port}.`);
          console.error('👉 ACTION REQUIRED: Your database firewall is likely blocking this application.');
          console.error('👉 SOLUTION: In your database provider (Aiven, PlanetScale, etc.), set "Allow all IPs" (0.0.0.0/0) or allowlist this app\'s IP.');
          socket.destroy();
        }).on('error', (err) => {
          console.error(`❌ NETWORK FAILURE: Error reaching ${host}:${port}: ${err.message}`);
          socket.destroy();
        }).connect(port, host);
      }
    });

    if (host === 'localhost' || host === '127.0.0.1') {
      console.warn('⚠️ WARNING: You are trying to connect to localhost. This will NOT work in a cloud environment unless the DB is in the same container.');
    }
  } catch (e) {
    console.warn('⚠️ WARNING: Could not parse DATABASE_URL for diagnostic purposes.');
  }
}

const connection = mysql.createPool({
  uri: cleanUri,
  ssl: hasSslMode || cleanUri.includes('tidbcloud.com')
    ? { rejectUnauthorized: false }
    : undefined,
  connectTimeout: 60000,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 5,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

// Only test connection at runtime, not during build
if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV !== 'production') {
  connection.getConnection()
    .then((conn) => {
      console.log('✅ Database connection pool ready.');
      conn.release();
    })
    .catch((err) => {
      console.warn('⚠️ Database connection not available:', err.message);
    });
}

export const db = drizzle(connection, { schema, mode: 'default' });
