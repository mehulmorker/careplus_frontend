# 🏥 CarePulse Frontend

Next.js 15 frontend application for the CarePulse Healthcare Management System.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js:** 18.0 or higher
- **npm:** 9.0 or higher
- **Backend:** CarePulse backend server running (see `../backend/README.md`)

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local

# Edit with your settings
nano .env.local
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Open Browser

Visit [http://localhost:3000](http://localhost:3000)

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

```env
# .env.local

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

### All Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | - | GraphQL API endpoint |

---

## Troubleshooting

### Common Issues

#### 1. Port 3000 Already in Use

```bash
# Option 1: Use different port
npm run dev:port  # Uses port 3001

# Option 2: Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

#### 2. GraphQL Connection Error

```bash
# Check if backend is running
curl http://localhost:4000/graphql?query=%7B__typename%7D

# If not running, start backend first
cd ../backend && npm run dev
```

#### 3. Type Errors After Changes

```bash
# Run type checking
npm run type-check

# If Apollo types outdated, regenerate
# (After backend schema changes)
```

#### 4. Module Not Found Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 5. Test Failures

```bash
# Run tests with verbose output
npm test -- --reporter=verbose

# Run specific failing test
npm test -- PatientForm --reporter=verbose
```

### Health Check Commands

```bash
# Full verification
npm run verify

# Individual checks
npm run lint
npm run type-check
npm run test:run
```

---

## Manual Integration Verification

### Check Frontend Is Working

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

### Check Backend Connection

1. Start frontend: `npm run dev`
2. Open browser dev tools (F12)
3. Go to Network tab
4. Navigate to a page that makes API calls
5. Verify GraphQL requests to `localhost:4000/graphql`

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev/)

---

**Part of the CarePulse Healthcare Management System**

