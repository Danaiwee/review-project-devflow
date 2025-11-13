import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignInForm from "@/components/forms/SignInForm";
import { ROUTES } from "@/constants/routes";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { mockRouter, mockToast, resetAllMocks } from "@/tests/mocks";

const user = userEvent.setup();

describe("Sign In Form Component", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Rendering", () => {
    it("should display all required field", () => {
      render(<SignInForm defaultValues={{ email: "", password: "" }} />);

      //Query the field using the label text
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

      //Query the button
      expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();

      //Query the link
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show the validation error for invalid email", async () => {
      render(<SignInForm defaultValues={{ email: "", password: "" }} />);

      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      await user.type(emailInput, "test");
      await user.type(passwordInput, "1234567890");
      await user.click(submitButton);

      expect(screen.getByText(/Please provide a valid email address/i)).toBeInTheDocument();
    });

    it("should show validation error for short password", async () => {
      render(<SignInForm defaultValues={{ email: "", password: "" }} />);

      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      await user.type(emailInput, "test@email.com");
      await user.type(passwordInput, "123");
      await user.click(submitButton);

      expect(screen.getByText("Password must be at least 6 characters long.")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmit with valid data", async () => {
      (signInWithCredentials as jest.Mock).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );

      render(<SignInForm defaultValues={{ email: "", password: "" }} />);

      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      await user.type(emailInput, "test@email.com");
      await user.type(passwordInput, "123456Pp!");
      await user.click(submitButton);

      expect(screen.getByText("Signing in...")).toBeInTheDocument();
      expect(signInWithCredentials).toHaveBeenCalled();
      expect(signInWithCredentials).toHaveBeenCalledWith({
        email: "test@email.com",
        password: "123456Pp!"
      });
    });
  });

  describe("Form Success Handling", () => {
    it("should show success toast and redirect to homepage", async () => {
      render(<SignInForm defaultValues={{ email: "", password: "" }} />);

      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      await user.type(emailInput, "test@email.com");
      await user.type(passwordInput, "123456Pp!");
      await user.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith("Success", { description: "Sign in successfully" });
      expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.HOME);
    });
  });

  describe("Form Failure Handing", () => {
    it("should show error toast when submission failed", async () => {
      (signInWithCredentials as jest.Mock).mockResolvedValueOnce({
        success: false,
        status: 401,
        error: { message: "Invalid Credentials" }
      });

      render(<SignInForm defaultValues={{ email: "", password: "" }} />);

      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      await user.type(emailInput, "test@email.com");
      await user.type(passwordInput, "123456Pp!");
      await user.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith("Error", { description: "Please check your email or password" });
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});
