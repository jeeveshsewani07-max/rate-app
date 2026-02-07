# RateApp

A production-grade anonymous peer rating mobile application built with React Native and Expo.

## Features

- **Anonymous Daily Ratings** - Rate one person per day from your groups
- **Trait-based Feedback** - Select from predefined positive/neutral traits
- **Profile Analytics** - View aggregated feedback statistics
- **Group Management** - Join/leave groups (academic, housing, clubs)
- **Offline Support** - Queue ratings when offline, sync when connected
- **Push Notifications** - Daily reminders and new rating alerts

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo (managed) |
| Language | TypeScript (strict) |
| Navigation | React Navigation v7 |
| Server State | TanStack Query v5 |
| Client State | Zustand |
| API Client | Axios |
| Storage | expo-secure-store |
| Icons | @expo/vector-icons |

## Project Structure

```
src/
├── app/                    # App entry, providers, config
├── core/                   # Shared infrastructure
│   ├── api/               # API client, endpoints
│   ├── storage/           # Secure storage
│   ├── hooks/             # App state, network hooks
│   └── notifications/     # Push notification service
├── features/              # Feature modules
│   ├── auth/             # Authentication
│   ├── groups/           # Group management
│   ├── rating/           # Daily rating flow
│   ├── analytics/        # Profile analytics
│   └── settings/         # Settings & account
├── navigation/            # Navigation setup
├── shared/               # Shared components & theme
│   ├── components/       # Reusable UI
│   ├── theme/           # Colors, typography, spacing
│   └── utils/           # Validation, formatting
└── types/                # Global types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone and install
cd rate-app
npm install

# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run typecheck` | Run TypeScript check |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format with Prettier |
| `npm run validate` | Run all checks |
| `npm run build:dev` | Build development APK/IPA |
| `npm run build:preview` | Build preview (internal testing) |
| `npm run build:prod` | Build production release |

## Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  Screens • Components • Hooks • Navigation                   │
├─────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                            │
│  Entities • Use Cases • Repository Interfaces                │
├─────────────────────────────────────────────────────────────┤
│                       DATA LAYER                             │
│  Repositories • DTOs • Mappers • Data Sources                │
├─────────────────────────────────────────────────────────────┤
│                     SERVICES LAYER                           │
│  API Client • Secure Storage • Push Notifications            │
└─────────────────────────────────────────────────────────────┘
```

### State Management

- **Server State**: TanStack Query handles API data caching, background sync
- **Auth State**: Zustand store with secure token persistence
- **Offline Queue**: Zustand + AsyncStorage for pending ratings

### Key Features

1. **Token Refresh Queue** - Automatic token refresh with request queuing
2. **Offline Rating Sync** - Ratings stored locally, synced when online
3. **Typed Navigation** - Full TypeScript support for routes
4. **Deep Linking** - `rateapp://` scheme configured
5. **Error Boundary** - Graceful error handling with recovery

## Configuration

### Environment

Edit `src/app/config/env.ts`:

```typescript
development: {
  apiBaseUrl: 'http://localhost:3000/api/v1',
},
staging: {
  apiBaseUrl: 'https://staging-api.yourapp.com/api/v1',
},
production: {
  apiBaseUrl: 'https://api.yourapp.com/api/v1',
}
```

### EAS Build

Update `eas.json` with your credentials:

```json
{
  "extra": {
    "eas": {
      "projectId": "your-project-id"
    }
  }
}
```

## Component Library

Available in `src/shared/components`:

- `Button` - Primary, secondary, outline, ghost, danger variants
- `Card` - Elevated, outlined, filled with compound components
- `Input` - With labels, icons, password toggle, validation
- `Avatar` - Image or initials with color generation
- `Badge` - Status badges and notification dots
- `Skeleton` - Loading placeholders (text, avatar, card, list)
- `EmptyState` - Empty content placeholders
- `ErrorBoundary` - React error boundary with retry

## API Integration

### Connecting to Backend

1. Update API base URL in `src/app/config/env.ts`
2. Ensure backend implements endpoints in `src/core/api/endpoints.ts`
3. Update DTOs in feature `types/` folders to match API responses

### Authentication Flow

```typescript
// Login
const { mutate } = useLogin();
mutate({ email, password });

// Check auth state
const { isAuthenticated, user } = useAuthState();

// Logout
const { mutate: logout } = useLogout();
logout();
```

## Deployment

### Development Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for development
eas build --profile development --platform all
```

### Production Release

```bash
# Build for stores
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## License

Private - All rights reserved
