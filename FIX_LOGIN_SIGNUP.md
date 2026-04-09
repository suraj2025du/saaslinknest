# 🔧 LinkNest Login/Signup Fix Guide

## ✅ What I Fixed:

1. **Cookie Secure Flag** - Fixed sessions not working on localhost
2. **Profile Creation** - Fixed signup now creates user profiles
3. **Better Environment Variable Comments** - Clearer instructions

## ⚠️ What YOU Need To Do:

### Step 1: Database Setup (CRITICAL)

Your `DATABASE_URL` in `.env.local` is still a placeholder. You MUST have a real MySQL database.

**Options:**
- **Local MySQL**: If you have MySQL installed, create a database:
  ```bash
  mysql -u root -p
  CREATE DATABASE linknest;
  ```
  Then update `.env.local`:
  ```
  DATABASE_URL=mysql://root:YOUR_PASSWORD@localhost:3306/linknest
  ```

- **Cloud Database (Recommended)**: Use a free service like:
  - [TiDB Cloud](https://tidbcloud.com/) (Free tier available)
  - [PlanetScale](https://planetscale.com/) (Free tier)
  - [Aiven](https://aiven.io/) (Free MySQL)

  After creating, copy the connection string to `.env.local`.

### Step 2: Generate AUTH_SECRET

Replace the placeholder in `.env.local` with a real random string:

**Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**Or use online generator:** https://generate-random.org/

Then paste it in `.env.local`:
```
AUTH_SECRET=your_generated_64_character_string
```

### Step 3: Firebase Google Sign-In (Optional)

If you want Google login to work:

1. Go to: https://console.firebase.google.com/project/linknest-4d873/settings/serviceaccounts/adminsdk
2. Click "Generate new private key"
3. Save the JSON file as: `linknest-4d873-firebase-adminsdk.json` in this folder
4. In `.env.local`, uncomment this line:
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./linknest-4d873-firebase-adminsdk.json
   ```

**OR** copy values from the JSON file to:
```
FIREBASE_CLIENT_EMAIL=your-email@linknest-4d873.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Step 4: Run Database Migrations

```bash
npm run db:push
```

### Step 5: Restart Your Dev Server

```bash
npm run dev
```

## 🧪 Test It:

1. Open http://localhost:3000
2. Try signing up with email/password
3. Try logging in
4. If using Firebase, try Google Sign-In

## 🐛 Still Having Issues?

Check the console for error messages and share them with me!
