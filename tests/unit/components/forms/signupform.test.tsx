import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";

import SignUpForm from "@/components/forms/SignupForm";
import { ROUTES } from "@/constants/routes";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { mockRouter, mockToast, resetAllMocks } from "@/tests/mocks";

const user = userEvent.setup();

describe("SignUp Form Component", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Rendering", () => {
    it("should display all the required fields", () => {
      render(<SignUpForm defaultValues={{ username: "", name: "", email: "", password: "" }} />);

      //Query the fields
      expect(screen.getByLabelText("username")).toBeInTheDocument();
      expect(screen.getByLabelText("name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(screen.getByLabelText("password")).toBeInTheDocument();

      //Query the button
      expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();

      //Query the link
      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show the error for form input", async () => {
      render(<SignUpForm defaultValues={{ username: "", name: "", email: "", password: "" }} />);

      const usernameInput = screen.getByLabelText("username");
      const nameInput = screen.getByLabelText("name");
      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "Sign up" });

      //Invalid data
      await user.type(usernameInput, "Dana!");
      await user.type(nameInput, "Danai Wee");
      await user.type(emailInput, "test@email");
      await user.type(passwordInput, "132");
      await user.click(submitButton);

      expect(screen.getByText("Username can only contain letters, numbers, and underscores.")).toBeInTheDocument();
      expect(screen.getByText("Please provide a valid email address.")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 6 characters long.")).toBeInTheDocument();

      //Clear input, check required message
      await user.clear(usernameInput);
      await user.clear(nameInput);
      await user.clear(emailInput);
      await user.clear(passwordInput);

      expect(screen.getByText("Username must be at least 3 characters long.")).toBeInTheDocument();
      expect(screen.getByText("Name is required.")).toBeInTheDocument();
      expect(screen.getByText("Please provide a valid email address.")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 6 characters long.")).toBeInTheDocument();
    });

    it("should show validation error for weak password", async () => {
      render(<SignUpForm defaultValues={{ username: "", name: "", email: "", password: "" }} />);

      const usernameInput = screen.getByLabelText("username");
      const nameInput = screen.getByLabelText("name");
      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "Sign up" });

      await user.type(usernameInput, "danaiwee");
      await user.type(nameInput, "Danai wee");
      await user.type(emailInput, "danai@email.com");

      //case 1 Password must contain uppercase
      await user.type(passwordInput, "123456p!");
      await user.click(submitButton);
      expect(screen.getByText("Password must contain at least one uppercase letter."));

      //case 2 Password must contain lowercase
      await user.clear(passwordInput);
      await user.type(passwordInput, "123456P!");
      expect(screen.getByText("Password must contain at least one lowercase letter."));

      //case 3 Password must contain special character
      await user.clear(passwordInput);
      await user.type(passwordInput, "123456Pp");
      expect(screen.getByText("Password must contain at least one special character."));
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmit with valid data", async () => {
      (signUpWithCredentials as jest.Mock).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );

      render(<SignUpForm defaultValues={{ username: "", name: "", email: "", password: "" }} />);

      const usernameInput = screen.getByLabelText("username");
      const nameInput = screen.getByLabelText("name");
      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "Sign up" });

      await user.type(usernameInput, "danaiwee");
      await user.type(nameInput, "Danai Wee");
      await user.type(emailInput, "danaiwee@email.com");
      await user.type(passwordInput, "123456Pp!");
      await user.click(submitButton);

      expect(screen.getByText("Signing up...")).toBeInTheDocument();
      expect(signUpWithCredentials).toHaveBeenCalled();
      expect(signUpWithCredentials).toHaveBeenCalledWith({
        username: "danaiwee",
        name: "Danai Wee",
        email: "danaiwee@email.com",
        password: "123456Pp!"
      });
    });
  });

  describe("Form Success Handling", () => {
    it("should show success toast and redirect to homepage", async () => {
      render(<SignUpForm defaultValues={{ username: "", name: "", email: "", password: "" }} />);

      const usernameInput = screen.getByLabelText("username");
      const nameInput = screen.getByLabelText("name");
      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "Sign up" });

      await user.type(usernameInput, "danaiwee");
      await user.type(nameInput, "Danai Wee");
      await user.type(emailInput, "danaiwee@email.com");
      await user.type(passwordInput, "123456Pp!");
      await user.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith("Success", { description: "Sign up successfully" });
      expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.HOME);
    });
  });

  describe("Form Failure Handling", () => {
    it("should show error toast when submission failed", async () => {
      (signUpWithCredentials as jest.Mock).mockResolvedValueOnce({
        success: false,
        status: 401,
        error: { message: "Invalid credentials" }
      });

      render(<SignUpForm defaultValues={{ username: "", name: "", email: "", password: "" }} />);

      const usernameInput = screen.getByLabelText("username");
      const nameInput = screen.getByLabelText("name");
      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "Sign up" });

      await user.type(usernameInput, "danaiwee");
      await user.type(nameInput, "Danai Wee");
      await user.type(emailInput, "danaiwee@email.com");
      await user.type(passwordInput, "123456Pp!");
      await user.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith("Error", { description: "Invalid credentials" });
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});
