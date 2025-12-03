# TaskFlow - Google Tasks Desktop App

A Progressive Web App (PWA) for managing Google Tasks on your desktop.

## Quick Start

### Demo Mode (No Setup Required)

1. Run `npm start`
2. Click "Demo Mode (Offline)" on the landing page
3. Start managing tasks locally!

### Google Sign-In Setup

To enable Google OAuth sign-in, you need to configure the Google Cloud Console:

#### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "TaskFlow" and click "Create"

#### Step 2: Enable Google Tasks API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Tasks API"
3. Click on it and press **Enable**

#### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:

   - User Type: **External**
   - App name: **TaskFlow**
   - User support email: _your email_
   - Developer contact: _your email_
   - Click **Save and Continue**
   - Scopes: Click **Add or Remove Scopes**
     - Add: `https://www.googleapis.com/auth/tasks`
     - Add: `https://www.googleapis.com/auth/userinfo.profile`
     - Add: `https://www.googleapis.com/auth/userinfo.email`
   - Click **Save and Continue**
   - Test users: Add your Gmail address
   - Click **Save and Continue**

4. Back in Credentials, create OAuth client ID:

   - Application type: **Web application**
   - Name: **TaskFlow Web Client**
   - Authorized redirect URIs:
     - `http://localhost:3000`
     - `http://localhost:3000/`
     - (Add production URL when deploying, e.g., `https://taskflow.example.com`)
   - Click **Create**

5. Copy the **Client ID** that appears

#### Step 4: Add Client ID to App

1. Open `src/hooks/useAuth.js`
2. Replace the `GOOGLE_CLIENT_ID` value:
   ```javascript
   const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com";
   ```

#### Step 5: Test It

1. Run `npm start`
2. Click **Sign in with Google**
3. Authorize the app
4. Your tasks should load!

## Troubleshooting

### "Failed to Load - API Error: Forbidden"

This means the Google Tasks API is not enabled. Follow **Step 2** above.

### "Unauthorized redirect_uri"

Your redirect URI doesn't match. Make sure:

- `http://localhost:30 00` is listed in OAuth credentials
- No trailing slashes mismatch
- URL matches exactly (including protocol)

### "Access Denied" during sign-in

Add your Google account as a test user in the OAuth consent screen (see Step 3).

## Development

```bash
npm start          # Run development server
npm run build      # Build for production
npm test          # Run tests
```

## Architecture

```
src/
├── services/      # Google Tasks API & Mock service
├── hooks/        # useAuth hook for OAuth
├── components/   # Reusable UI components
├── pages/       # LandingPage & AppPage
└── App.jsx      # Main app router
```

## Features

- ✅ Google Tasks sync
- ✅ Offline demo mode
- ✅ PWA installable
- ✅ Dark mode
- ✅ Cross-platform (Windows, macOS, Linux)
- ✅ Task lists and tasks CRUD
- ✅ Completion tracking

## License

MIT - Open Source
