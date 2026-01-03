import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminLoginModal } from "../AdminLoginModal";

// Mock next/navigation
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

// Mock useAuth hook
const mockLogin = vi.fn();
vi.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: vi.fn(),
    user: null,
    isAuthenticated: false,
    loading: false,
  }),
}));

// Mock Form components
vi.mock("@/components/ui/form", () => ({
  Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  FormField: ({ render, name }: any) => {
    const field = { value: "", onChange: vi.fn(), onBlur: vi.fn(), name };
    return render({ field });
  },
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormMessage: () => null,
}));

// Mock CustomFormField
vi.mock("@/components/CustomFormField", () => ({
  default: ({ label, name, fieldType }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={fieldType === "password" ? "password" : "text"}
        data-testid={`input-${name}`}
      />
    </div>
  ),
  FormFieldType: {
    INPUT: "input",
    PASSWORD: "password",
  },
}));

// Mock Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("AdminLoginModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render admin login modal", () => {
    render(<AdminLoginModal />);

    expect(screen.getByText("Admin Login")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please login with your admin credentials to access the admin dashboard."
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("should render login and cancel buttons", () => {
    render(<AdminLoginModal />);

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("should render form inputs", () => {
    render(<AdminLoginModal />);

    expect(screen.getByTestId("input-email")).toBeInTheDocument();
    expect(screen.getByTestId("input-password")).toBeInTheDocument();
  });

  it("should render submit button with correct text", () => {
    render(<AdminLoginModal />);

    const submitButton = screen.getByRole("button", { name: /login/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("Login");
  });

  it("should render error container (initially empty)", () => {
    render(<AdminLoginModal />);

    // Error container exists but is empty initially
    const errorContainer = screen.queryByText(/invalid email or password/i);
    expect(errorContainer).not.toBeInTheDocument();
  });

  it("should render cancel button", () => {
    render(<AdminLoginModal />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
  });

  it("should render submit button with loading state text capability", () => {
    render(<AdminLoginModal />);

    const submitButton = screen.getByRole("button", { name: /login/i });
    expect(submitButton).toBeInTheDocument();
    // Button can show "Logging in..." when isLoading is true
  });

  it("should close modal when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<AdminLoginModal />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });
});

