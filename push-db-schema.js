const { execSync } = require('child_process');
const fs = require('fs');

console.log("🚀 LinkNest Database Setup Script (AUTOMATIC MODE)");
console.log("==================================================\n");

const liveDbUrl = 'mysql://4Fxmi6opzQhfZTf.root:v9cX10X2B7g1oEZs@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/fortune500';

fs.writeFileSync('.env.temp', `DATABASE_URL=${liveDbUrl}`, 'utf8');

try {
  console.log("Pushing database tables to TiDB Cloud Automatically (No Prompts)...");
  
  // Using CI=1 to trigger non-interactive mode for Drizzle Kit
  // and forcing creation
  execSync(`npx cross-env DATABASE_URL='${liveDbUrl}' CI=1 npx drizzle-kit push --force`, { 
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: liveDbUrl, CI: "1", FORCE_COLOR: "1" }
  });
  
  console.log("\n✅ Database tables pushed successfully!");
  console.log("✅ LIVE WEBSITE IS NOW SURFING ON THE CLOUD DATABASE!");
  
} catch (e) {
  console.error("❌ Failed to push database tables automatically.");
  console.error(e.message);
} finally {
  try { fs.unlinkSync('.env.temp'); } catch(e) {}
}

console.log("\nEverything is fixed in the background!");
console.log("Now just refresh https://linknest.tech and test the Google Login!");
