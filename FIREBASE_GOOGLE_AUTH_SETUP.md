# 🔥 Firebase Google Sign-In Setup Guide

## ✅ What's Already Done

1. ✅ Firebase SDK installed (`firebase` and `firebase-admin`)
2. ✅ Firebase configuration created with your credentials
3. ✅ Google Sign-In button integrated in login page
4. ✅ Server-side token verification endpoint created
5. ✅ Auto-creation of user accounts on first Google sign-in

## 🚀 Steps to Complete Setup

### Step 1: Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/project/linknest-4d873/authentication/providers)
2. Click on **Authentication** in the left sidebar
3. Click on **Sign-in method** tab
4. Find **Google** in the list and click on it
5. Toggle **Enable** to turn it on
6. Enter your **Project support email** (required by Google)
7. Click **Save**

### Step 2: Add Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings**
2. Scroll to **Authorized domains**
3. Make sure these are added:
   - `localhost` (for development)
   - `linknest-4d873.firebaseapp.com` (auto-added)
   - Your production domain (e.g., `linknest.tech`)

### Step 3: Get Firebase Admin Credentials

For server-side token verification, you need a service account key:

1. Go to [Firebase Console](https://console.firebase.google.com/project/linknest-4d873/settings/serviceaccounts/adminsdk)
2. Click on **Project Settings** (gear icon)
3. Go to **Service accounts** tab
4. Click **Generate new private key**
5. Download the JSON file
6. **Keep this file secure!** Never commit it to Git

### Step 4: Configure Environment Variables

Create or update your `.env.local` file with the Firebase Admin credentials from the downloaded JSON file:

```env
# Firebase Admin SDK Credentials
FIREBASE_PROJECT_ID=linknest-4d873
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@linknest-4d873.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Important:** 
- Copy the values from the downloaded service account JSON file
- The `FIREBASE_PRIVATE_KEY` must include the quotes and `\n` characters
- Keep the private key secure - never commit to version control

### Step 5: Configure OAuth Consent Screen (Google Cloud)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent)
2. Select the `linknest-4d873` project
3. Fill in the **OAuth consent screen**:
   - **App name**: LinkNest
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (if in testing mode)
6. Click **Save and Continue**

### Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to the login page: `http://localhost:3000/login`

3. Click on **Google Account** button

4. You should see a Google sign-in popup

5. After successful authentication:
   - A user account will be created automatically (if first time)
   - You'll be redirected to the dashboard
   - The user will be marked as email-verified

## 🎯 How It Works

### Client-Side Flow:
1. User clicks "Google Account" button
2. Firebase opens Google sign-in popup
3. User selects/signs in to their Google account
4. Firebase returns user data and ID token
5. ID token is sent to your backend for verification

### Server-Side Flow:
1. Backend receives Firebase ID token
2. Verifies token using Firebase Admin SDK
3. Extracts user information (email, name, uid)
4. Checks if user exists in database:
   - **If exists**: Updates last sign-in time
   - **If new**: Creates account with verified email
5. Creates session cookie
6. Returns success to client
7. Client redirects to dashboard

## 🔒 Security Features

- ✅ ID tokens are verified server-side
- ✅ Tokens expire after 1 hour
- ✅ Email is automatically verified for Google users
- ✅ Soft-deleted accounts are blocked
- ✅ Session cookies are httpOnly and secure

## 🐛 Troubleshooting

### Error: "Firebase Admin credentials not configured"
**Solution**: Add the Firebase Admin credentials to your `.env.local` file

### Error: "Popup blocked by browser"
**Solution**: Allow popups for your site in browser settings

### Error: "auth/unauthorized-domain"
**Solution**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Error: "Invalid Firebase token"
**Solution**: The token may have expired. Try signing in again.

### Users can't create accounts
**Common causes**:
1. Database connection issues - check your `DATABASE_URL`
2. Missing Firebase Admin credentials - check `.env.local`
3. Google Sign-In not enabled in Firebase Console - enable it
4. Domain not authorized - add it to Firebase Console

## 📝 Testing Checklist

- [ ] Firebase Google Sign-In is enabled
- [ ] Authorized domains are configured
- [ ] Firebase Admin credentials are in `.env.local`
- [ ] Google OAuth consent screen is configured
- [ ] Test login with a Google account
- [ ] Verify user is created in database
- [ ] Verify session is created
- [ ] Verify redirect to dashboard works
- [ ] Test logout and re-login

## 🔄 Migration from Old Google OAuth

The old Google OAuth (using `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`) is still in place but no longer used by the login page. You can:

1. **Keep both**: Firebase is now the primary method
2. **Remove old OAuth**: Delete the `/api/auth/google/*` endpoints if not needed
3. **Use Firebase only**: Recommended for simpler setup

## 📚 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google Sign-In Setup](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

## ✨ Next Steps

After Google login is working, you can:
1. Add profile picture from Google (`picture` field in Firebase user)
2. Sync Google account info with user profile
3. Add account linking (connect Google to existing email account)
4. Enable other Firebase auth providers (GitHub, Facebook, etc.)

---

**Need Help?**
Check the Firebase Console for real-time authentication logs and error details.
