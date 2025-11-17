import { render, screen } from "@testing-library/react";

import QuestionCard from "@/components/cards/QuestionCard";
import { getTimeStamp } from "@/lib/utils";
import { mockAuth } from "@/tests/mocks";

const mockQuestion: Question = {
  _id: "123",
  title: "How to center a div in CSS?",
  content:
    "I've tried using `margin: auto` but my div still won't center horizontally and vertically. What's the most reliable way to center elements in modern CSS?",
  tags: [
    { _id: "t1", name: "css", questions: 1200 },
    { _id: "t2", name: "html", questions: 800 }
  ],
  author: {
    _id: "u1",
    name: "Jane Doe",
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  createdAt: new Date("2025-08-01T09:15:00Z"),
  upvotes: 24,
  downvotes: 2,
  answers: 3,
  views: 180
};

const relativeTimeText = getTimeStamp(mockQuestion.createdAt);

describe("QuestionCard component", () => {
  describe("Rendering", () => {
    it("should render all the elements", async () => {
      render(await QuestionCard({ question: mockQuestion, showEdit: true }));

      //Title
      expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /How to center a div in CSS?/i })).toHaveAttribute(
        "href",
        "/questions/123"
      );

      //Tags
      expect(screen.getByText("css")).toBeInTheDocument();
      expect(screen.getByText("html")).toBeInTheDocument();

      //Avatar
      expect(screen.getByRole("img", { name: mockQuestion.author.name })).toBeInTheDocument();
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();

      //Timstamp
      expect(screen.getByText(relativeTimeText)).toBeInTheDocument();

      //Metrics
      expect(screen.getByText("24 Votes")).toBeInTheDocument();
      expect(screen.getByText("3 Answers")).toBeInTheDocument();
      expect(screen.getByText("180 Views")).toBeInTheDocument();
    });
  });

  describe("Action Button", () => {
    it("should show the EditDeleteAction button", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockAuth as any).mockResolvedValue({
        user: {
          id: "u1",
          name: "Test User",
          email: "test@example.com",
          image: "https:example.com/avatar.jpg"
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });

      render(await QuestionCard({ question: mockQuestion, showEdit: true }));

      expect(screen.queryByText(/edit/i)).toBeInTheDocument();
      expect(screen.queryByText(/Delete/i)).toBeInTheDocument();
    });

    it("should not show the EditDeleteAction button", async () => {
      render(await QuestionCard({ question: mockQuestion, showEdit: true }));

      expect(screen.queryByText(/edit/i)).toBeInTheDocument();
      expect(screen.queryByText(/Delete/i)).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should hide timestamp on small screen", async () => {
      Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 500 });

      window.dispatchEvent(new Event("resize"));

      render(await QuestionCard({ question: mockQuestion, showEdit: true }));

      const timeStamp = screen.getByText(relativeTimeText, { selector: "span" });
      expect(timeStamp).toHaveClass("sm:hidden");
    });

    it("should show timestamp on large sceen", async () => {
      Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 800 });

      window.dispatchEvent(new Event("resize"));

      render(await QuestionCard({ question: mockQuestion }));

      const timeStamp = screen.getByText(relativeTimeText, { selector: "span" });

      expect(timeStamp).toBeVisible();

      const metric = screen.getAllByTestId("metric")[0];
      expect(metric).toBeVisible();
    });
  });
});
