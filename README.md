# TaskFlow - Ultimate Google Tasks Desktop Client

TaskFlow is a powerful, open-source Progressive Web App (PWA) designed to bring the full power of Google Tasks to your desktop. Experience a seamless, productivity-focused interface that integrates directly with your Google account, allowing you to manage tasks, subtasks, and deadlines efficiently.

With improved **SEO** and **performance**, TaskFlow offers a premium user experience with features like dark mode, offline support, and advanced calendar integration.

## Key Features

- **✅ Seamless Google Tasks Sync**: Real-time synchronization with your Google Tasks.
- **📅 Smart Calendar Integration**: Automatically sync tasks with start and end times to your **Google Calendar**.
- **🔒 Secure Authentication**: Uses official Google OAuth 2.0 for secure login and data access.
- **⚡ Offline Demo Mode**: Try the app without signing in.
- **☾ Dark Mode**: sleek, eye-friendly dark theme.
- **💻 Cross-Platform**: Runs on Windows, macOS, and Linux as a PWA.
- **📂 Hierarchical Tasks**: Full support for subtasks and nested lists.

## Quick Start

### Demo Mode (No Setup Required)

1. Run `npm start`
2. Click "Demo Mode (Offline)" on the landing page
3. Start managing tasks locally!

### Google Sign-In Setup

To enable Google OAuth sign-in and Calendar integration, you need to configure the Google Cloud Console:

#### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "TaskFlow" and click "Create"

#### Step 2: Enable APIs

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Enable the following APIs:
   - **Google Tasks API**
   - **Google Calendar API** (Required for calendar sync features)

#### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Configure the OAuth consent screen:
   - User Type: **External**
   - App name: **TaskFlow**
   - Scopes:
     - `https://www.googleapis.com/auth/tasks`
     - `https://www.googleapis.com/auth/calendar` (For calendar features)
     - `https://www.googleapis.com/auth/userinfo.profile`
     - `https://www.googleapis.com/auth/userinfo.email`
   - Add your email as a **Test User**
4. Create OAuth client ID:
   - Application type: **Web application**
   - Authorized redirect URIs:
     - `http://localhost:3000`
     - `http://localhost:3000/`

#### Step 4: Configure Environment Variables

For better security and easier configuration, we use environment variables.

1. Create a file named `.env` in the root directory (same level as `package.json`).
2. Add your Google Client ID to the file:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

> **Note**: This keeps your credentials separate from the codebase.

#### Step 5: Test It

1. Run `npm start`
2. Click **Sign in with Google**
3. Authorize the app (ensure you grant Calendar permissions if prompted)
4. Your tasks and calendar events should sync!

## Calendar Authentication & Privacy

TaskFlow requests access to your **Google Calendar** to provide advanced scheduling features. This allows the app to:

- Create calendar events for tasks with specific times.
- Sync changes between your tasks and your calendar.

We prioritize your privacy and security. TaskFlow uses your existing Google credentials and does not store your password.

## Troubleshooting

### "Failed to Load - API Error: Forbidden"

Ensure both **Google Tasks API** and **Google Calendar API** are enabled in your Google Cloud Console.

### "Unauthorized redirect_uri"

Check that `http://localhost:3000` is listed in your OAuth credentials.

## Development

```bash
npm start          # Run development server
npm run build      # Build for production
npm test          # Run tests
```

## Architecture

```
src/
├── services/      # Google Tasks & Calendar Services
├── hooks/        # useAuth hook & Context
├── components/   # Reusable UI components
├── pages/       # LandingPage & AppPage
└── App.jsx      # Main app router
```

## License

MIT - Open Source
