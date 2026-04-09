import { signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

/**
 * Sign in with Google using Firebase Auth
 * Opens a popup window for Google OAuth
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Get the ID token to send to your backend
    const idToken = await user.getIdToken();
    
    return {
      success: true,
      user,
      idToken,
    };
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign in with Google',
    };
  }
}

/**
 * Sign out from Firebase
 */
export async function signOutFromFirebase() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign out',
    };
  }
}

/**
 * Get current Firebase user
 */
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

/**
 * Verify Firebase ID token with your backend
 * This sends the token to your API to create a session
 */
export async function verifyFirebaseToken(idToken: string) {
  try {
    const response = await fetch('/api/auth/firebase/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    if (data.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: data.error || 'Failed to verify token',
      };
    }
  } catch (error: any) {
    console.error('Error verifying Firebase token:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify token',
    };
  }
}

/**
 * Complete Google Sign-In flow
 * 1. Open Google popup
 * 2. Get Firebase user
 * 3. Verify with backend
 * 4. Create session
 */
export async function handleGoogleSignIn() {
  // Step 1: Sign in with Google
  const signInResult = await signInWithGoogle();
  
  if (!signInResult.success || !signInResult.idToken) {
    return {
      success: false,
      error: signInResult.error || 'Failed to sign in with Google',
    };
  }

  // Step 2: Verify token with backend
  const verifyResult = await verifyFirebaseToken(signInResult.idToken);
  
  if (!verifyResult.success) {
    return {
      success: false,
      error: verifyResult.error || 'Failed to create session',
    };
  }

  return { success: true };
}
