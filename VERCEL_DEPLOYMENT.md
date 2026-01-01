# Vercel Deployment Guide for Nuntia

## Prerequisites
- Vercel CLI installed: `npm install -g vercel`
- Firebase project set up (for authentication)

## Environment Variables Setup

### Required Environment Variables
You need to set these environment variables in Vercel:

#### Firebase Configuration (Required)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Optional Configuration
```bash
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b
DATABASE_URL=sqlite.db
```

### Adding Environment Variables

#### Method 1: Using Vercel CLI
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Enter the value when prompted
# Select environments: Production, Preview, Development
```

#### Method 2: Using Vercel Dashboard
1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with appropriate values

## Important Notes

### Database Limitation
⚠️ **Important**: This project uses SQLite (better-sqlite3) which **does not work on Vercel** serverless functions because:
- Vercel's serverless functions run in read-only file systems
- SQLite requires write access to the database file
- Each function invocation is stateless

### Solutions for Database:
1. **Recommended**: Migrate to a cloud database:
   - Vercel Postgres (built-in integration)
   - Turso (SQLite compatible, edge-ready)
   - PlanetScale (MySQL compatible)
   - Neon (Postgres)

2. **Alternative**: Use Vercel's experimental edge runtime with Turso

## Deployment Steps

### 1. Login to Vercel
```bash
vercel login
```

### 2. Deploy to Preview
```bash
vercel
```

### 3. Deploy to Production
```bash
vercel --prod
```

## Quick Deploy Script

Run this script to deploy with all environment variables:

```bash
# Set environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

# Deploy
vercel --prod
```

## Files Created
- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude from deployment

## Troubleshooting

### SQLite Error
If you see database errors, the SQLite database won't work on Vercel. You'll need to:
1. Migrate to a cloud database
2. Update `lib/db.ts` to use the new database
3. Update the Drizzle configuration

### Environment Variables Not Working
- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy after adding environment variables
- Check Vercel Dashboard > Settings > Environment Variables

## Post-Deployment
1. Verify all environment variables are set
2. Test authentication functionality
3. Monitor logs: `vercel logs`
4. Check deployment status: `vercel ls`
