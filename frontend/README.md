# AI Customer Intelligence Platform - Frontend

A modern React + Vite frontend for the AI Customer Intelligence Platform. This application provides a user-friendly interface to interact with a FastAPI backend for customer churn prediction, segmentation, and analytics.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons

## Features

- **Authentication** - Email/password login with JWT tokens
- **Dashboard** - Real-time metrics and KPIs
- **Churn Prediction** - Predict customer churn risk
- **Customer Segmentation** - Automatically segment customers
- **Data Upload** - Import CSV datasets
- **Settings** - Configure preferences
- **Responsive Design** - Works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-customer-intelligence-frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your FastAPI backend URL:
```
VITE_API_BASE_URL=http://localhost:8000
```

### Development

Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, Input, Toast)
│   ├── Header.tsx      # Page header component
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── ProtectedRoute.tsx # Route protection wrapper
├── context/            # React Context (Auth)
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── ChurnPrediction.tsx
│   ├── Segmentation.tsx
│   ├── Upload.tsx
│   └── Settings.tsx
├── services/           # API integration
│   └── api.ts         # Axios instance and API calls
├── App.tsx            # Main app component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles and Tailwind
```

## API Integration

The frontend communicates with the FastAPI backend through REST APIs. All API calls are centralized in `src/services/api.ts`.

### Expected FastAPI Endpoints

#### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

#### Dashboard
- `GET /api/dashboard/overview` - Get overview metrics
- `GET /api/dashboard/metrics` - Get detailed metrics
- `GET /api/dashboard/churn-risk` - Get churn risk data

#### Predictions
- `POST /api/predictions/churn` - Predict churn
- `POST /api/predictions/segment` - Segment customers

#### Datasets
- `POST /api/datasets/upload` - Upload CSV file
- `GET /api/datasets` - List datasets
- `DELETE /api/datasets/{id}` - Delete dataset

## Authentication

The app uses JWT-based authentication:
1. User logs in with email/password
2. Backend returns a JWT token
3. Token is stored in localStorage
4. Token is sent with every API request via Authorization header
5. If token expires, user is redirected to login

## Styling

The app uses Tailwind CSS v4 with a custom dark theme. All theme colors are defined in `src/index.css`:

- Background colors
- Text colors
- Primary/accent colors
- Border colors

Customize these values to match your brand.

## Development Guidelines

- Use TypeScript for type safety
- Keep components small and focused
- Use custom hooks for reusable logic
- All API calls go through `services/api.ts`
- Use the `useToast` hook for notifications
- Follow the existing folder structure

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT
