import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AnswerForm from "@/components/forms/AnswerForm";
import { createAnswer } from "@/lib/actions/answer.action";
import { api } from "@/lib/api";
import { MockEditor, mockSession, mockToast, mockUseSession, resetAllMocks } from "@/tests/mocks";

const user = userEvent.setup();

jest.mock("@/components/editor/Editor", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <MockEditor {...props} />
}));
jest.mock("@/lib/actions/answer.action.ts", () => ({
  createAnswer: jest.fn()
}));
jest.mock("@/lib/api", () => ({
  api: { ai: { AIAnswer: jest.fn() } }
}));

const mockCreateAnswer = createAnswer as jest.Mock;
const mockApiAiAnswer = api.ai.AIAnswer as jest.Mock;

describe("Answer Form Component", () => {
  beforeAll(() => {
    resetAllMocks();
  });

  describe("Rendering", () => {
    it("sgould render the form field and buttons", async () => {
      render(<AnswerForm questionId="123" questionTitle="Test title" questionContent="Test content" />);

      expect(await screen.findByTestId("mdx-editor")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Generate AI Answer/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Post Answer/i }));
    });
  });

  describe("Validation", () => {
    it("should show the validation error when submit the empty form", async () => {
      render(<AnswerForm questionId="123" questionTitle="Test title" questionContent="Test content" />);

      const submitButton = screen.getByRole("button", { name: /Post answer/i });
      await user.click(submitButton);

      expect(screen.getByText("You have to provide mininum of 100 characters")).toBeInTheDocument();
    });
  });

  describe("AI Generation", () => {
    it("should generate an AI answer for an authenticated user", async () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn()
      });

      mockApiAiAnswer.mockResolvedValue({
        success: true,
        data: "This is an AI-generated answer"
      });

      render(<AnswerForm questionId="123" questionTitle="Test title" questionContent="Test content" />);

      await user.click(screen.getByRole("button", { name: /Generate AI Answer/i }));

      expect(mockApiAiAnswer).toHaveBeenCalledWith({
        questionTitle: "Test title",
        questionContent: "Test content",
        userAnswer: ""
      });
      expect(mockToast).toHaveBeenCalledWith("Success", { description: "AI geerated answer successfully" });
    });

    it("should show the error message when user click generate ai answer when they are not authenticated", async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: jest.fn()
      });

      render(<AnswerForm questionId="123" questionTitle="Test title" questionContent="Test content" />);

      await user.click(screen.getByRole("button", { name: /Generate AI Answer/i }));

      expect(mockToast).toHaveBeenCalledWith("Error", { description: "Please log in to use AI generate" });
      expect(mockApiAiAnswer).not.toHaveBeenCalled();
    });
  });

  describe("Submission", () => {
    it("should disable submit button when submitting", async () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn()
      });

      mockCreateAnswer.mockImplementation(() => new Promise(() => {}));

      render(<AnswerForm questionId="123" questionTitle="Test title" questionContent="Test content" />);

      const answer =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis, justo nec eleifend tempus, nisi magna posuere turpis, non molestie libero justo bibendum mauris. Sed aliquam vestibulum velit eu hendrerit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent vitae tincidunt sem. Cras sit amet odio quis metus euismod rhoncus a a eros. Cras at neque risus. Phasellus a turpis eu nunc tristique vulputate. Ut sollicitudin tincidunt urna, vitae malesuada nibh. Sed eu feugiat massa, volutpat cursus urna. Suspendisse auctor dolor ac lectus viverra, vel vulputate nunc iaculis. Pellentesque enim sapien, imperdiet a tempus eget, malesuada.";

      const editorTextarea = await screen.findByTestId("mdx-editor");
      fireEvent.change(editorTextarea, { target: { value: answer } });

      const submitButton = screen.getByRole("button", { name: /Post Answer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("should should submit form successfully with valid data", async () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn()
      });
      mockCreateAnswer.mockResolvedValue({ success: true, data: { _id: "456" } });

      render(<AnswerForm questionId="123" questionTitle="Test title" questionContent="Test content" />);

      const answer =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis, justo nec eleifend tempus, nisi magna posuere turpis, non molestie libero justo bibendum mauris. Sed aliquam vestibulum velit eu hendrerit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent vitae tincidunt sem. Cras sit amet odio quis metus euismod rhoncus a a eros. Cras at neque risus. Phasellus a turpis eu nunc tristique vulputate. Ut sollicitudin tincidunt urna, vitae malesuada nibh. Sed eu feugiat massa, volutpat cursus urna. Suspendisse auctor dolor ac lectus viverra, vel vulputate nunc iaculis. Pellentesque enim sapien, imperdiet a tempus eget, malesuada.";

      const editorTextarea = await screen.findByTestId("mdx-editor");
      fireEvent.change(editorTextarea, { target: { value: answer } });

      const submitButton = screen.getByRole("button", { name: /Post Answer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateAnswer).toHaveBeenCalledWith({
          content: answer,
          questionId: "123"
        });

        expect(mockToast).toHaveBeenCalledWith("Success", { description: "Created answer successfully" });
      });
    });

    it("should show the error message when submit failed", async () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn()
      });

      mockCreateAnswer.mockResolvedValue({ success: false });

      render(<AnswerForm questionId="123" questionTitle="Test title" questionContent="Test content" />);

      const answer =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis, justo nec eleifend tempus, nisi magna posuere turpis, non molestie libero justo bibendum mauris. Sed aliquam vestibulum velit eu hendrerit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent vitae tincidunt sem. Cras sit amet odio quis metus euismod rhoncus a a eros. Cras at neque risus. Phasellus a turpis eu nunc tristique vulputate. Ut sollicitudin tincidunt urna, vitae malesuada nibh. Sed eu feugiat massa, volutpat cursus urna. Suspendisse auctor dolor ac lectus viverra, vel vulputate nunc iaculis. Pellentesque enim sapien, imperdiet a tempus eget, malesuada.";

      const editorTextarea = await screen.findByTestId("mdx-editor");
      fireEvent.change(editorTextarea, { target: { value: answer } });

      const submitButton = screen.getByRole("button", { name: /Post Answer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(createAnswer).toHaveBeenCalledWith({
          content: answer,
          questionId: "123"
        });

        expect(mockToast).toHaveBeenCalledWith("Error", { description: "An unexpected error occurred" });
      });
    });
  });
});
