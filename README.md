# 🏥 CarePulse Frontend

Next.js 15 frontend application for the CarePulse Healthcare Management System.

## 📸 Screenshots

<div align="center">
  <img src="/assets/images/1.png" alt="CarePulse Homepage" width="800"/>
  <br/><br/>
  <img src="/assets/images/2.png" alt="Patient Registration" width="800"/>
  <br/><br/>
  <img src="/assets/images/3.png" alt="Appointment Booking" width="800"/>
  <br/><br/>
  <img src="/assets/images/4.png" alt="Admin Dashboard" width="800"/>
  <br/><br/>
  <img src="/assets/images/5.png" alt="Appointment Management" width="800"/>
</div>

---

## 🎥 Inspiration

This project was inspired by the [Next.js Healthcare App Tutorial](https://www.youtube.com/watch?v=lEflo_sc82g&t=5541s&pp=ygUSbmV4dCBqcyBoZWFsdGhjYXJl) on YouTube.

### Key Differences from Original

While the original tutorial used:
- **Twilio SMS** for notifications
- **Appwrite** for backend and database

This implementation uses:
- **SendGrid Email** for notifications instead of SMS
- **GraphQL Node.js Backend** with Express and Apollo Server instead of Appwrite
- **Neon DB (PostgreSQL)** for database instead of Appwrite DB
- **Render** for backend deployment

### Backend Repository

The backend is a separate repository. You can find it here:
- **Backend Repo:** [https://github.com/mehulmorker/careplus_backend](https://github.com/mehulmorker/careplus_backend)

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Cloning and Setup](#cloning-and-setup)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Production Credentials](#production-credentials)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** 18.0 or higher ([Download](https://nodejs.org/))
- **npm:** 9.0 or higher (comes with Node.js)
- **Git:** For cloning the repository

### Backend Requirements

- The backend server must be running for the frontend to work properly
- See the [backend repository](https://github.com/mehulmorker/careplus_backend) for backend setup instructions

---

## Getting Started

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd careplus/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Edit .env.local with your backend URL
   nano .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## Cloning and Setup

### Step-by-Step Setup Guide

#### 1. Clone the Repository

```bash
# Clone the frontend repository
git clone <frontend-repository-url>
cd careplus/frontend

# Clone the backend repository (in a separate directory)
cd ..
git clone https://github.com/mehulmorker/careplus_backend
cd careplus_backend
```

#### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

#### 3. Install Backend Dependencies

```bash
cd ../careplus_backend
npm install
```

#### 4. Configure Frontend Environment

Create a `.env.local` file in the `frontend` directory:

```bash
cd frontend
touch .env.local
```

Add the following content:

```env
# Backend API URL
# For local development, use:
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

# For production, use your deployed backend URL:
# NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/graphql
```

#### 5. Configure Backend Environment

Follow the backend repository's README to set up:
- Database connection (Neon PostgreSQL)
- SendGrid email configuration
- JWT secrets
- Other required environment variables

#### 6. Start Backend Server

```bash
cd careplus_backend
npm run dev
```

The backend should start on `http://localhost:4000`

#### 7. Start Frontend Server

```bash
cd frontend
npm run dev
```

The frontend should start on `http://localhost:3000`

#### 8. Verify Setup

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should see the CarePulse homepage
3. Try registering a new patient to verify the connection

---

## Available Scripts

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run dev:port` | Start on port 3001 (if 3000 is busy) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run type-check` | Run TypeScript type checking |
| `npm run check` | Run lint + type-check |

### Testing

| Command | Description |
|---------|-------------|
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI mode) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:watch` | Run tests in watch mode |
| `npm run verify` | Run lint + type-check + tests |

---

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── api/               # API routes
│   │   └── graphql/       # GraphQL proxy route
│   ├── patients/          # Patient routes
│   │   └── [userId]/
│   │       ├── register/
│   │       └── new-appointment/
│   └── admin/             # Admin routes
│
├── components/            # React components
│   ├── ui/               # Shadcn/Radix UI components
│   ├── forms/            # Form components
│   │   └── __tests__/    # Form tests
│   └── table/            # Table components
│
├── lib/                   # Utilities & configurations
│   ├── apollo/           # Apollo Client setup
│   ├── graphql/          # GraphQL queries/mutations
│   ├── hooks/            # Custom React hooks
│   ├── validations/      # Zod schemas
│   └── utils.ts          # Utility functions
│
├── types/                 # TypeScript type definitions
│
├── public/               # Static assets
│   └── assets/
│       ├── gifs/
│       ├── icons/
│       └── images/
│
├── middleware.ts         # Next.js middleware for route protection
├── vitest.config.ts      # Test configuration
├── vitest.setup.ts       # Test setup
└── package.json
```

---

## Development

### Component Development

Components follow this pattern:

```tsx
// components/forms/PatientForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema } from '@/lib/validations/patient.validation';

export const PatientForm = () => {
  const form = useForm({
    resolver: zodResolver(patientSchema),
  });
  
  // ... component implementation
};
```

### GraphQL Operations

All GraphQL operations are in `lib/graphql/`:

```tsx
// lib/graphql/mutations/auth.mutations.ts
import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      user { id email }
      errors { message }
    }
  }
`;
```

### Using GraphQL in Components

```tsx
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '@/lib/graphql/mutations/auth.mutations';

const MyComponent = () => {
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);
  
  // ... use mutation
};
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- PatientForm

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

### Writing Component Tests

```tsx
// components/forms/__tests__/PatientForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PatientForm } from '../PatientForm';

describe('PatientForm', () => {
  it('should render form fields', () => {
    render(<PatientForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should show validation errors for invalid input', async () => {
    render(<PatientForm />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });
});
```

### Test Coverage Goals

| Area | Minimum | Target |
|------|---------|--------|
| Components | 70% | 80% |
| Hooks | 80% | 90% |
| Utilities | 90% | 100% |

---

## Environment Variables

### Required Variables

Create a `.env.local` file in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

### All Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | - | GraphQL API endpoint URL |

### Environment File Setup

```bash
# Copy example file (if exists)
cp .env.example .env.local

# Or create manually
touch .env.local

# Add your configuration
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/graphql" > .env.local
```

---

## Production Credentials

### Admin Login Credentials

For production/admin access, use the following credentials:

- **Email:** `admin@careplus.com`
- **Password:** `Careplus123!`

> ⚠️ **Security Note:** These credentials are for demonstration purposes. Change them in production!

### Accessing Admin Dashboard

1. Navigate to the homepage
2. Click the "Admin" button in the bottom right corner
3. Enter the credentials above
4. You will be redirected to the admin dashboard

---

## Troubleshooting

### Common Issues

#### 1. Port 3000 Already in Use

```bash
# Option 1: Use different port
npm run dev:port  # Uses port 3001

# Option 2: Kill process on port 3000
# On Linux/Mac:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then restart
npm run dev
```

#### 2. GraphQL Connection Error

**Symptoms:** Network errors or "Failed to fetch" in console

**Solutions:**

```bash
# Check if backend is running
curl http://localhost:4000/graphql?query=%7B__typename%7D

# If not running, start backend first
cd ../careplus_backend
npm run dev

# Verify backend is accessible
# Should return: {"data":{"__typename":"Query"}}
```

**Check your `.env.local` file:**
- Ensure `NEXT_PUBLIC_API_URL` is set correctly
- For local: `http://localhost:4000/graphql`
- No trailing slash

#### 3. Type Errors After Changes

```bash
# Run type checking
npm run type-check

# Clear TypeScript cache
rm -rf .next
rm -rf tsconfig.tsbuildinfo

# Restart dev server
npm run dev
```

#### 4. Module Not Found Errors

```bash
# Clear Next.js cache
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json

# Reinstall dependencies
npm install

# Restart dev server
npm run dev
```

#### 5. Test Failures

```bash
# Run tests with verbose output
npm test -- --reporter=verbose

# Run specific failing test
npm test -- PatientForm --reporter=verbose

# Clear test cache
rm -rf node_modules/.vite
```

#### 6. Authentication Issues

**Symptoms:** Redirect loops, unable to login

**Solutions:**

1. **Clear browser cookies:**
   - Open DevTools (F12)
   - Application → Cookies
   - Delete all cookies for localhost

2. **Check backend authentication:**
   - Verify backend is running
   - Check backend logs for errors
   - Verify JWT secrets are configured

3. **Check environment variables:**
   - Ensure `NEXT_PUBLIC_API_URL` points to correct backend
   - Restart frontend after changing env vars

### Health Check Commands

```bash
# Full verification
npm run verify

# Individual checks
npm run lint          # Check code style
npm run type-check    # Check TypeScript types
npm run test:run      # Run tests
npm run build         # Verify production build
```

### Manual Integration Verification

#### Check Frontend Is Working

```bash
# 1. Build succeeds
npm run build

# 2. No TypeScript errors
npm run type-check

# 3. No lint errors
npm run lint

# 4. Tests pass
npm run test:run
```

#### Check Backend Connection

1. Start frontend: `npm run dev`
2. Open browser dev tools (F12)
3. Go to Network tab
4. Navigate to a page that makes API calls
5. Verify GraphQL requests to `localhost:4000/graphql` (or your backend URL)
6. Check for 200 status codes

#### Verify Authentication Flow

1. Open homepage
2. Click "Admin" button
3. Enter admin credentials
4. Should redirect to `/admin` dashboard
5. Check browser cookies - should see `accessToken` and `refreshToken`

---

## Learn More

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev/)
- [Zod Validation](https://zod.dev/)

### Related Resources

- [Backend Repository](https://github.com/mehulmorker/careplus_backend)
- [Original Tutorial Video](https://www.youtube.com/watch?v=lEflo_sc82g&t=5541s&pp=ygUSbmV4dCBqcyBoZWFsdGhjYXJl)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is part of the CarePulse Healthcare Management System.

---

**Part of the CarePulse Healthcare Management System**
