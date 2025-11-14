import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import QuestionForm from "@/components/forms/QuestionForm";
import { createQuestion } from "@/lib/actions/question.action";
import { MockEditor, mockRouter, mockToast, resetAllMocks } from "@/tests/mocks";

const user = userEvent.setup();

jest.mock("@/components/editor/Editor", () => ({
  // This is essential to correctly mock ES Modules used by dynamic()
  __esModule: true,
  // Ensure MockEditor is the default export component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <MockEditor {...props} />
}));
jest.mock("@/lib/actions/question.action.ts", () => ({
  createQuestion: jest.fn()
}));

const mockCreateQuestion = createQuestion as jest.Mock;

describe("Question Form", () => {
  beforeEach(() => {
    resetAllMocks();
    mockCreateQuestion.mockClear();
  });

  describe("Rendering", () => {
    it("should render all form fields", async () => {
      render(<QuestionForm />);

      expect(screen.getByText(/Question Title/i)).toBeInTheDocument();
      expect(await screen.findByText(/Detailed explanation of your problem/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Add tag.../i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Ask a question/i })).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("should show validation error when submit the empty form", async () => {
      render(<QuestionForm />);

      const submitButton = screen.getByRole("button", { name: /Ask a question/i });

      await user.click(submitButton);

      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Content must contain at least 100 characters")).toBeInTheDocument();
      expect(screen.getByText("You have to add at least 1 tag")).toBeInTheDocument();
    });
  });

  describe("Submission", () => {
    it("should submit form successfully with valid data", async () => {
      mockCreateQuestion.mockResolvedValue({ success: true, data: { _id: "123" } });

      render(<QuestionForm />);

      const testTitle = "Unit Testing question";
      const testContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis, justo nec eleifend tempus, nisi magna posuere turpis, non molestie libero justo bibendum mauris. Sed aliquam vestibulum velit eu hendrerit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent vitae tincidunt sem. Cras sit amet odio quis metus euismod rhoncus a a eros. Cras at neque risus. Phasellus a turpis eu nunc tristique vulputate. Ut sollicitudin tincidunt urna, vitae malesuada nibh. Sed eu feugiat massa, volutpat cursus urna. Suspendisse auctor dolor ac lectus viverra, vel vulputate nunc iaculis. Pellentesque enim sapien, imperdiet a tempus eget, malesuada.";

      // Fill title
      await user.type(screen.getByLabelText(/Question Title/i), testTitle);

      // Fill Content (Using explicit fireEvent.change for reliability with form libraries)
      const editorTextarea = await screen.findByTestId("mdx-editor");
      // Use fireEvent.change to reliably trigger the onChange/fieldChange prop in the mock
      fireEvent.change(editorTextarea, { target: { value: testContent } });

      // Add tag
      const tagInput = screen.getByPlaceholderText("Add tag...");
      fireEvent.change(tagInput, { target: { value: "react" } });
      fireEvent.keyDown(tagInput, { key: "Enter" });

      const submitButton = screen.getByRole("button", { name: /ask a question/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateQuestion).toHaveBeenCalledWith({
          title: testTitle,
          content: testContent,
          tags: ["react"]
        });

        expect(mockToast).toHaveBeenCalledWith("Success", {
          description: "Create question successfully"
        });

        expect(mockRouter.push).toHaveBeenCalledWith("/questions/123");
      });
    });

    it("should show the error message when the submit failed", async () => {
      mockCreateQuestion.mockResolvedValueOnce({
        success: false,
        status: 401,
        error: { message: "Something went wrong" }
      });

      render(<QuestionForm />);

      const testTitle = "Unit Testing question";
      const testContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis, justo nec eleifend tempus, nisi magna posuere turpis, non molestie libero justo bibendum mauris. Sed aliquam vestibulum velit eu hendrerit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent vitae tincidunt sem. Cras sit amet odio quis metus euismod rhoncus a a eros. Cras at neque risus. Phasellus a turpis eu nunc tristique vulputate. Ut sollicitudin tincidunt urna, vitae malesuada nibh. Sed eu feugiat massa, volutpat cursus urna. Suspendisse auctor dolor ac lectus viverra, vel vulputate nunc iaculis. Pellentesque enim sapien, imperdiet a tempus eget, malesuada.";

      //Fill Quetion title
      await user.type(screen.getByLabelText(/Question Title/i), testTitle);

      //Fill Question content
      const editorTextarea = await screen.getByTestId("mdx-editor");
      fireEvent.change(editorTextarea, { target: { value: testContent } });

      //Fill Tags input
      const tagInput = screen.getByPlaceholderText("Add tag...");
      fireEvent.change(tagInput, { target: { value: "react" } });
      fireEvent.keyDown(tagInput, { key: "Enter" });

      const submitButton = screen.getByRole("button", { name: /Ask a question/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateQuestion).toHaveBeenCalledWith({
          title: testTitle,
          content: testContent,
          tags: ["react"]
        });

        expect(mockToast).toHaveBeenCalledWith("Error", { description: "Failed to create question" });
        expect(mockRouter.push).not.toHaveBeenCalled();
      });
    });
  });
});
