# Minibunn Planner (Web)

## Local Run

```bash
npm install
npm run dev

# Test mobile
ngrok http 3000
```

## Environment Variables

```txt
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=dev

# Subscription prices
NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID=
NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID=

# Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Deploy to Firebase

```bash
firebase deploy --only hosting
```

## Release

1. Create an annotated tag

   ```bash
   git tag -a v1.0.0 -m "comment"
   git push origin v1.0.0
   ```

2. Draft a GitHub Release on that tag
   - Go to Releases → Draft a new release
   - Select your new tag
   - Fill in a “What’s changed” summary or changelog items
   - Publish
