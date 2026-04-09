import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

  
  const dbUrl = process.env.DATABASE_URL || 'mysql://default:default@localhost:3306/db';
  const cleanUrl = dbUrl.split('?')[0]; 
  const urlObj = new URL(cleanUrl);

  export default defineConfig({
    out: './drizzle',
    schema: './lib/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
      host: urlObj.hostname,
      port: Number(urlObj.port) || 3306,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.substring(1),
      ssl: urlObj.hostname.includes('tidbcloud.com') ? { rejectUnauthorized: true } : undefined,
    },
  });
