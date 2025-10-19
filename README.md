# Cypilot - AI University Copilot

Cypilot is an AI-powered university copilot application designed specifically for Iowa State University students. It aggregates data from Canvas, Outlook, Workday, and CyRide services to provide a unified dashboard experience.

## Features

- **Canvas Integration**: View courses, assignments, grades, and announcements
- **Outlook Integration**: Access important emails and calendar events
- **Workday Integration**: Check notifications, tuition fees, and student records
- **CyRide Integration**: View bus routes, stops, and real-time trip information
- **Microsoft Authentication**: Secure login using Iowa State University credentials
- **Real-time Updates**: Automatic data refresh and notifications

## Architecture

This is a monorepo built with Turborepo containing:

- **Backend** (`apps/backend`): Node.js/Express API server with TypeScript
- **Mobile** (`apps/mobile`): React Native app with Expo
- **Shared** (`packages/shared`): Common TypeScript types and utilities
- **MCP Client** (`packages/mcp-client`): Model Context Protocol client library

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Microsoft OAuth (MSAL)
- MCP (Model Context Protocol) servers
- Redis for caching (optional)

### Mobile
- React Native with Expo
- TypeScript
- React Navigation
- React Query for data fetching
- Zustand for state management

### Development
- Turborepo for monorepo management
- pnpm for package management
- ESLint and Prettier for code quality
- TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- Iowa State University Microsoft account
- API keys for Canvas, Workday, and CyRide services

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cypilot
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Copy example environment file
cp apps/backend/.env.example apps/backend/.env

# Edit the environment file with your configuration
```

4. Configure Microsoft Authentication:
   - Register an app in Azure AD (Iowa State's tenant)
   - Update `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, and `MICROSOFT_TENANT_ID` in the backend `.env` file

5. Configure API keys:
   - Add Canvas API key
   - Add Workday credentials
   - Add CyRide API key (if available)

### Development

1. Start the backend server:
```bash
pnpm --filter @cypilot/backend dev
```

2. Start the mobile app:
```bash
pnpm --filter @cypilot/mobile start
```

3. Run on iOS:
```bash
pnpm --filter @cypilot/mobile ios
```

4. Run on Android:
```bash
pnpm --filter @cypilot/mobile android
```

### Building

Build all packages:
```bash
pnpm build
```

Build specific packages:
```bash
pnpm --filter @cypilot/backend build
pnpm --filter @cypilot/mobile build
```

## Project Structure

```
cypilot/
├── apps/
│   ├── backend/           # Express API server
│   │   ├── src/
│   │   │   ├── config/    # Configuration
│   │   │   ├── middleware/ # Express middleware
│   │   │   ├── routes/    # API routes
│   │   │   └── services/  # Business logic
│   │   └── package.json
│   └── mobile/           # React Native app
│       ├── src/
│       │   ├── components/ # Reusable components
│       │   ├── contexts/  # React contexts
│       │   ├── navigation/ # Navigation setup
│       │   ├── screens/   # App screens
│       │   └── services/  # API clients
│       └── package.json
├── packages/
│   ├── shared/           # Shared types and utilities
│   ├── mcp-client/       # MCP protocol client
│   └── tsconfig/         # TypeScript configurations
├── package.json          # Root package.json
├── turbo.json           # Turborepo configuration
└── pnpm-workspace.yaml  # Workspace configuration
```

## API Endpoints

### Authentication
- `POST /auth/login` - Initiate Microsoft OAuth login
- `POST /auth/callback` - Handle OAuth callback
- `POST /auth/refresh` - Refresh access tokens
- `GET /auth/me` - Get current user information

### Canvas
- `GET /api/canvas/courses` - Get enrolled courses
- `GET /api/canvas/courses/:id/assignments` - Get course assignments
- `GET /api/canvas/assignments/upcoming` - Get upcoming assignments
- `GET /api/canvas/announcements/recent` - Get recent announcements

### Outlook
- `GET /api/outlook/emails/important` - Get important emails
- `GET /api/outlook/events/upcoming` - Get upcoming calendar events
- `PATCH /api/outlook/emails/:id/read` - Mark email as read

### Workday
- `GET /api/workday/notifications` - Get notifications
- `GET /api/workday/action-items` - Get action items
- `GET /api/workday/tuition-fees` - Get tuition fees
- `GET /api/workday/student-record` - Get student record

### CyRide
- `GET /api/cyride/routes` - Get available routes
- `GET /api/cyride/stops/nearby` - Get nearby stops
- `GET /api/cyride/trips/upcoming` - Get upcoming trips
- `POST /api/cyride/route-plan` - Plan a route

### Dashboard
- `GET /api/dashboard` - Get aggregated dashboard data

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Roadmap

- [ ] Push notifications for important updates
- [ ] Offline mode support
- [ ] Advanced filtering and search
- [ ] Integration with additional university services
- [ ] AI-powered insights and recommendations
- [ ] Desktop application
- [ ] Web application