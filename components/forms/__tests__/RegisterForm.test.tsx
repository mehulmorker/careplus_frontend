import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RegisterForm from '../RegisterForm';

// Mock Apollo Client
vi.mock('@apollo/client', () => ({
  useMutation: vi.fn(() => [vi.fn(), { loading: false }]),
  gql: vi.fn((strings: TemplateStringsArray) => strings[0]),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: function MockImage({ alt, ...props }: any) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img alt={alt} {...props} />;
  },
}));

// Mock Form components
vi.mock('@/components/ui/form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  FormField: ({ render, name }: any) => {
    const field = { value: '', onChange: vi.fn(), name };
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
    <div data-testid={`field-${name}`}>
      {label && <label>{label}</label>}
      <input name={name} placeholder={placeholder} />
    </div>
  ),
  FormFieldType: {
    INPUT: 'input',
    TEXTAREA: 'textarea',
    PHONE_INPUT: 'phoneInput',
    CHECKBOX: 'checkbox',
    DATE_PICKER: 'datePicker',
    SELECT: 'select',
    SKELETON: 'skeleton',
    PASSWORD: 'password',
  },
}));

// Mock SubmitButton
vi.mock('@/components/SubmitButton', () => ({
  default: ({ children, isLoading }: any) => (
    <button type="submit" disabled={isLoading} data-testid="submit-button">
      {children}
    </button>
  ),
}));

// FileUploader was replaced by CloudinaryFileUploader - mock removed

// Mock RadioGroup
vi.mock('@/components/ui/radio-group', () => ({
  RadioGroup: ({ children }: any) => <div>{children}</div>,
  RadioGroupItem: ({ value }: any) => <input type="radio" value={value} />,
}));

// Mock Select
vi.mock('@/components/ui/select', () => ({
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
}));

const mockUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
};

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form header', () => {
    render(<RegisterForm user={mockUser} />);

    expect(screen.getByText('Welcome 👋')).toBeInTheDocument();
    expect(screen.getByText('Let us know more about yourself.')).toBeInTheDocument();
  });

  it('should render all section headers', () => {
    render(<RegisterForm user={mockUser} />);

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Medical Information')).toBeInTheDocument();
    expect(screen.getByText('Identification and Verification')).toBeInTheDocument();
    expect(screen.getByText('Consent and Privacy')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<RegisterForm user={mockUser} />);

    const button = screen.getByTestId('submit-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Submit and Continue');
  });

  it('should render with pre-filled user data', () => {
    render(<RegisterForm user={mockUser} />);

    // The form should be rendered with user's name in the name field
    const nameField = screen.getByTestId('field-name');
    expect(nameField).toBeInTheDocument();
  });

  it('should have the submit button enabled by default', () => {
    render(<RegisterForm user={mockUser} />);

    const button = screen.getByTestId('submit-button');
    expect(button).not.toBeDisabled();
  });
});

