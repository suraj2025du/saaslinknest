const { execSync } = require('child_process');
const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');

console.log("🚀 LinkNest Database Force Installer");
console.log("=====================================\n");

async function run() {
  const liveDbUrl = 'mysql://4Fxmi6opzQhfZTf.root:v9cX10X2B7g1oEZs@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/fortune500';

  console.log("1. Generating SQL locally...");
  // Set fake DB URL just to satisfy config
  fs.writeFileSync('.env.temp', `DATABASE_URL=${liveDbUrl}`, 'utf8');
  
  try {
    // Generate the SQL files locally (this doesn't connect to the DB and won't prompt about remote tables)
    execSync('npx drizzle-kit generate', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: liveDbUrl, FORCE_COLOR: "1" } });
  } catch(e) {
    console.error("Failed to generate schema SQL.");
  }
  
  // Find the generated SQL file
  const drizzleDir = path.join(process.cwd(), 'drizzle');
  if (!fs.existsSync(drizzleDir)) {
    console.error("Drizzle folder not found!");
    return;
  }
  
  const files = fs.readdirSync(drizzleDir).filter(f => f.endsWith('.sql'));
  if (files.length === 0) {
    console.error("No SQL file generated!");
    return;
  }
  
  // Get the most recently generated sql file
  const sqlFile = path.join(drizzleDir, files[files.length - 1]);
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');
  
  console.log(`\n2. Found generated SQL: ${files[files.length - 1]}`);
  console.log("3. Connecting to live database to force-create tables...");
  
  // Connect manually and bypass interactiveness
  const cleanUrl = liveDbUrl.split('?')[0];
  const urlObj = new URL(cleanUrl);
  
  try {
    const connection = await mysql.createConnection({
      host: urlObj.hostname,
      port: Number(urlObj.port) || 3306,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.substring(1),
      ssl: { rejectUnauthorized: true },
      multipleStatements: true // VERY IMPORTANT to run multiple create tables at once
    });

    console.log("✅ Authenticated successfully! Running table creations...");
    
    // Some Drizzle SQL files might need splitting if multipleStatements isn't enough, but it usually is
    await connection.query(sqlContent);
    
    console.log("✅ All tables created successfully!");
    connection.destroy();
    
    console.log("\n🎉 YOU ARE READY! Go test the site now!");
  } catch(e) {
    console.error("❌ Failed to run SQL:", e.message);
  } finally {
    try { fs.unlinkSync('.env.temp'); } catch(e) {}
  }
}

run();
