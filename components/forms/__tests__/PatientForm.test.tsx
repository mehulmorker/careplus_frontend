import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientForm } from '../PatientForm';

// Mock the useAuth hook
const mockRegister = vi.fn();
vi.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({
    register: mockRegister,
    user: null,
    isAuthenticated: false,
    loading: false,
  }),
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock Form component from ui
vi.mock('@/components/ui/form', () => ({
  Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  FormField: ({ render, name }: any) => {
    const field = { value: '', onChange: vi.fn(), onBlur: vi.fn(), name };
    return render({ field });
  },
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormMessage: () => null,
}));

// Mock CustomFormField
vi.mock('@/components/CustomFormField', () => ({
  default: ({ label, name, placeholder }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        data-testid={`field-${name}`}
      />
    </div>
  ),
  FormFieldType: {
    INPUT: 'input',
    PASSWORD: 'password',
    PHONE_INPUT: 'phoneInput',
  },
}));

// Mock SubmitButton
vi.mock('@/components/SubmitButton', () => ({
  default: ({ children, isLoading }: any) => (
    <button type="submit" disabled={isLoading} data-testid="submit-button">
      {isLoading ? 'Loading...' : children}
    </button>
  ),
}));

describe('PatientForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields', () => {
    render(<PatientForm />);

    expect(screen.getByText('Full name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone number')).toBeInTheDocument();
    // Password field was removed as part of guest user flow refactoring
  });

  it('should render header text', () => {
    render(<PatientForm />);

    expect(screen.getByText('Hi there 👋')).toBeInTheDocument();
    expect(screen.getByText('Get started with appointments.')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<PatientForm />);

    const button = screen.getByTestId('submit-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Get Started');
  });

  it('should have submit button enabled initially', () => {
    render(<PatientForm />);

    const button = screen.getByTestId('submit-button');
    expect(button).not.toBeDisabled();
  });
});

/**
 * Note: Full integration tests would require:
 * - Proper form submission handling
 * - GraphQL mocking with MSW
 * - Complete validation testing
 * 
 * These tests focus on component rendering and basic structure.
 * More comprehensive tests should be added as the application grows.
 */

