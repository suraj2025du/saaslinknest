/**
 * Firebase Configuration Test Script
 * Run this to verify your Firebase setup is working
 * 
 * Usage: node test-firebase.js
 */

const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config({ path: '.env.local' });

console.log('\n🔥 Testing Firebase Configuration...\n');

// Test 1: Check Firebase SDK is installed
try {
  require('firebase/app');
  console.log('✅ Firebase SDK installed');
} catch (error) {
  console.log('❌ Firebase SDK not installed. Run: npm install firebase firebase-admin');
  process.exit(1);
}

// Test 2: Check Firebase Admin SDK is installed
try {
  require('firebase-admin');
  console.log('✅ Firebase Admin SDK installed');
} catch (error) {
  console.log('❌ Firebase Admin SDK not installed. Run: npm install firebase-admin');
  process.exit(1);
}

// Test 3: Check environment variables
console.log('\n📋 Checking environment variables...');

const requiredVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

// Check for JSON file method first (recommended)
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

let jsonMethodWorking = false;
if (serviceAccountPath && serviceAccountPath !== './linknest-4d873-firebase-adminsdk.json') {
  const fullPath = path.join(__dirname, serviceAccountPath.replace('./', ''));
  if (fs.existsSync(fullPath)) {
    console.log('✅ Firebase service account JSON file found');
    jsonMethodWorking = true;
  } else {
    console.log('⚠️  Firebase service account JSON file not found at:', serviceAccountPath);
  }
} else if (serviceAccountPath === './linknest-4d873-firebase-adminsdk.json') {
  console.log('⚠️  Firebase service account JSON file path is set, but file not found yet');
}

let envVarsPresent = true;
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value && value !== 'your-service-account@linknest-4d873.iam.gserviceaccount.com') {
    console.log(`✅ ${varName} is set`);
  } else {
    console.log(`⚠️  ${varName} is not configured`);
    envVarsPresent = false;
  }
});

if (jsonMethodWorking) {
  console.log('\n✅ Using JSON file method (recommended)');
} else if (envVarsPresent) {
  console.log('\n✅ Using environment variables method');
} else {
  console.log('\n⚠️  No Firebase Admin method configured');
}

// Test 4: Check Firebase config in lib/firebase.ts
console.log('\n📄 Checking Firebase configuration file...');

const firebaseConfigPath = path.join(__dirname, 'lib', 'firebase.ts');
if (fs.existsSync(firebaseConfigPath)) {
  console.log('✅ lib/firebase.ts exists');

  const content = fs.readFileSync(firebaseConfigPath, 'utf8');
  if (content.includes('AIzaSyBCWZC4TgcRu0S7At4vNhHoSwqevmZMbn0')) {
    console.log('✅ Firebase API key is configured');
  } else {
    console.log('⚠️  Firebase API key might be missing');
  }

  if (content.includes('linknest-4d873')) {
    console.log('✅ Firebase project ID is correct');
  } else {
    console.log('❌ Firebase project ID is missing or incorrect');
  }
} else {
  console.log('❌ lib/firebase.ts not found');
}

// Test 5: Check API endpoint
const verifyEndpoint = path.join(__dirname, 'app', 'api', 'auth', 'firebase', 'verify', 'route.ts');
if (fs.existsSync(verifyEndpoint)) {
  console.log('✅ Firebase verify endpoint exists');
} else {
  console.log('❌ Firebase verify endpoint not found');
}

// Test 6: Check login page
const loginPage = path.join(__dirname, 'app', 'login', 'page.tsx');
if (fs.existsSync(loginPage)) {
  const loginContent = fs.readFileSync(loginPage, 'utf8');
  if (loginContent.includes('handleGoogleSignIn')) {
    console.log('✅ Login page uses Firebase Google Sign-In');
  } else {
    console.log('⚠️  Login page might still use old OAuth method');
  }
}

// Summary
console.log('\n' + '='.repeat(50));
if (jsonMethodWorking || envVarsPresent) {
  console.log('\n✅ Firebase setup looks good!');
  console.log('\n📝 Next steps:');
  console.log('   1. Enable Google Sign-In in Firebase Console');
  console.log('   2. Add authorized domains');
  console.log('   3. Run: npm run dev');
  console.log('   4. Test login at http://localhost:3000/login\n');
} else {
  console.log('\n⚠️  Some configuration is missing.');
  console.log('\n📝 To complete setup (choose one method):');
  console.log('\n   Option 1 (Recommended - Easier):');
  console.log('   1. Download service account JSON file from Firebase Console');
  console.log('   2. Place it in project root as: linknest-4d873-firebase-adminsdk.json');
  console.log('   3. Add to .env.local: FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./linknest-4d873-firebase-adminsdk.json');
  console.log('\n   Option 2 (Environment Variables):');
  console.log('   1. Copy .env.example to .env.local');
  console.log('   2. Fill in Firebase Admin credentials from JSON file');
  console.log('   3. Run this test again\n');
}

console.log('📖 For full instructions, see: FIREBASE_GOOGLE_AUTH_SETUP.md\n');
