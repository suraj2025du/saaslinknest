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

// mysql2 doesn't support 'sslmode' in the connection string and throws a warning.
// However, its presence often indicates that SSL is required.
const hasSslMode = databaseUrl?.includes('sslmode=');
const cleanUri = databaseUrl?.replace(/(\?|&)sslmode=[^&]+/, '') || '';

// Diagnostic: Check if the host is reachable at all
if (cleanUri) {
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
  // If sslmode was present, we enable SSL with rejectUnauthorized: false
  // which is common for many cloud database providers.
  ssl: hasSslMode ? { rejectUnauthorized: false } : undefined,
  connectTimeout: 60000, // 60 seconds for very slow connections
  waitForConnections: true,
  connectionLimit: 5, // Reduced limit to be safer with small DB instances
  maxIdle: 5,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

// Test connection and log errors to help diagnose ETIMEDOUT
connection.getConnection()
  .then((conn) => {
    console.log('🚀 DATABASE: Successfully established a connection pool.');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ DATABASE CONNECTION ERROR:', err.message);
    if (err.code === 'ETIMEDOUT') {
      console.error('🛑 TIMEOUT ERROR: The database did not respond in time.');
      console.error('This is almost always a FIREWALL issue. Please check your database provider\'s access control settings.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🛑 AUTH ERROR: Invalid username or password.');
    } else if (err.code === 'ENOTFOUND') {
      console.error('🛑 HOST ERROR: The database host could not be found. Check your DATABASE_URL.');
    }
  });

export const db = drizzle(connection, { schema, mode: 'default' });
