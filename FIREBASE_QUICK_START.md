# 🚀 Firebase Google Sign-In - Quick Start

## ✅ Setup Complete!

Your Google login is now powered by Firebase. Here's what to do next:

---

## 📋 Required Steps (Do This Now)

### 1️⃣ Enable Google Sign-In in Firebase (2 minutes)

**Click here:** [Firebase Console - Authentication](https://console.firebase.google.com/project/linknest-4d873/authentication/providers)

1. Click **Authentication**
2. Click **Sign-in method** tab
3. Click **Google**
4. Toggle **Enable** ✅
5. Add your support email
6. Click **Save**

### 2️⃣ Add Authorized Domains (1 minute)

**Click here:** [Firebase Console - Settings](https://console.firebase.google.com/project/linknest-4d873/settings/general)

1. Go to **Authentication** → **Settings**
2. Scroll to **Authorized domains**
3. Add these domains:
   - ✅ `localhost` (for testing)
   - ✅ `linknest.tech` (your production site)

### 3️⃣ Get Admin Credentials (1 minute)

**Click here:** [Service Accounts](https://console.firebase.google.com/project/linknest-4d873/settings/serviceaccounts/adminsdk)

1. Go to **Project Settings** ⚙️
2. Click **Service accounts** tab
3. Click **Generate new private key**
4. Download the JSON file

**Choose ONE method:**

#### Method 1: JSON File (Recommended - Easier) ⭐

1. Save the downloaded JSON file to your project root
2. Rename it to: `linknest-4d873-firebase-adminsdk.json`
3. Add this line to `.env.local`:

```env
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./linknest-4d873-firebase-adminsdk.json
```

**Done!** ✅ That's it!

#### Method 2: Environment Variables (For Production)

Open the downloaded JSON file and copy these values to `.env.local`:

```env
FIREBASE_PROJECT_ID=linknest-4d873
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@linknest-4d873.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 🧪 Test It (1 minute)

```bash
# Start the dev server
npm run dev

# Open browser
http://localhost:3000/login

# Click "Google Account" button
```

✅ If a Google popup appears → **Working!**  
✅ After signing in, you reach dashboard → **Perfect!**

---

## 🎯 What Changed

### Before:
- ❌ Google login wasn't working
- ❌ Users couldn't create accounts
- ❌ Complex OAuth flow

### Now:
- ✅ Firebase handles Google login automatically
- ✅ Accounts are created on first sign-in
- ✅ Email is auto-verified for Google users
- ✅ Simple, secure popup flow

---

## 📁 Files Created/Modified

1. **`lib/firebase.ts`** - Firebase configuration
2. **`lib/firebase-auth.ts`** - Auth helper functions
3. **`app/api/auth/firebase/verify/route.ts`** - Token verification
4. **`app/login/page.tsx`** - Updated Google login button
5. **`.env.example`** - Added Firebase variables

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Popup blocked | Allow popups in browser settings |
| "Firebase Admin credentials not configured" | Add credentials to `.env.local` |
| "auth/unauthorized-domain" | Add domain to Firebase Console |
| Users still can't sign up | Check database connection (`DATABASE_URL`) |

---

## 📖 Full Documentation

For complete setup instructions, see: **`FIREBASE_GOOGLE_AUTH_SETUP.md`**

---

## ✨ How It Works

```
User clicks "Google Account"
        ↓
Firebase opens Google popup
        ↓
User selects Google account
        ↓
Firebase returns user data + token
        ↓
Backend verifies token (server-side)
        ↓
Creates/updates user in database
        ↓
Creates session cookie
        ↓
Redirects to dashboard ✅
```

---

**Need help?** Check the full setup guide or Firebase Console for error logs.
