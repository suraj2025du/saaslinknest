const { execSync } = require('child_process');
const fs = require('fs');

function addEnv(key, value) {
  console.log(`Setting ${key} in Vercel...`);
  fs.writeFileSync('temp_val.txt', value, 'utf8');
  
  // Try to remove existing first (silently ignore if it fails)
  try {
    execSync(`npx vercel env rm ${key} production -y`, { stdio: 'pipe' });
  } catch (e) { }

  // Add the new one
  try {
    execSync(`type temp_val.txt | npx vercel env add ${key} production`, { stdio: 'inherit' });
    console.log(`✅ ${key} Added!`);
  } catch (e) {
    console.error(`❌ Failed to add ${key}`);
  }
}

// 1. Database URL
const dbUrl = 'mysql://4Fxmi6opzQhfZTf.root:v9cX10X2B7g1oEZs@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/fortune500?ssl={"rejectUnauthorized":true}';
addEnv('DATABASE_URL', dbUrl);

// 2. Auth Secret
const authSecret = 'linknest-super-secret-auth-key-2026';
addEnv('AUTH_SECRET', authSecret);

// 3. App URL
const appUrl = 'https://linknest.tech';
addEnv('NEXT_PUBLIC_APP_URL', appUrl);

// Clean up temp file
try {
  fs.unlinkSync('temp_val.txt');
} catch(e) {}

console.log('');
console.log('✅ Final Environment Variables Successfully Updated!');
console.log('Now deploying your database connection to live production...');

try {
  execSync('npx vercel --prod', { stdio: 'inherit' });
} catch(e) {
  console.error("Vercel deployment failed:", e);
}
