# Firebase Configuration for Vercel Deployment

## Issue Fixed
✅ Added missing `NEXT_PUBLIC_FIREBASE_APP_ID` environment variable to Vercel

## Additional Configuration Required in Firebase Console

### Step 1: Enable Google Sign-In Method

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **nuntia-27505**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Toggle **Enable** to ON
6. Add a support email (your email)
7. Click **Save**

### Step 2: Authorize Your Vercel Domain

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain**
3. Add your Vercel domains:
   - `nuntia-ebon.vercel.app`
   - `nuntia-bdv1lpvlz-chillirogers-projects.vercel.app` (or any other deployment URLs)
4. Click **Add**

### Step 3: Verify Environment Variables

All these should now be set in Vercel (✅ = configured):

- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_APP_ID`

### Step 4: Test Authentication

1. Visit: https://nuntia-ebon.vercel.app
2. Click "Sign In" or "Sign Up"
3. Try Google Sign-In
4. Should now work without errors

## Common Issues & Solutions

### "auth/unauthorized-domain"
**Solution:** Add your Vercel domain to Firebase Authorized Domains (Step 2 above)

### "auth/popup-blocked"
**Solution:** Allow popups in browser settings for your domain

### "auth/operation-not-allowed"
**Solution:** Enable Google provider in Firebase Console (Step 1 above)

### Still getting "An error occurred"
**Solution:** Check browser console (F12) for specific error codes, then match with Firebase error codes

## Verify Configuration

Run this in your browser console on the deployed site:

```javascript
// Check if Firebase is configured
console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing',
});
```

## Next Deployment

For future deployments, just run:
```bash
vercel --prod
```

All environment variables are now persisted in Vercel.
