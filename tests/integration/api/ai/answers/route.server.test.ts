import { generateText } from "ai";
import { testApiHandler } from "next-test-api-route-handler";

import { POST } from "@/app/api/ai/answers/route";
import { resetAllMocks } from "@/tests/mocks";

jest.mock("ai", () => ({
  generateText: jest.fn()
}));

const mockGenerateText = generateText as jest.Mock;
const validQuestion = "Explain Next.js in details".repeat(5);
const validContent = "Next.js is a framework of React...".repeat(20);

describe("POST /api/ai/answers", () => {
  afterEach(() => {
    resetAllMocks();
  });

  describe("Success", () => {
    it("should return 200 and generated text when the request is valid", async () => {
      const mockResponse = "This is the generated markdown response";
      mockGenerateText.mockResolvedValue({ text: mockResponse });

      const requestBody = {
        questionTitle: validQuestion,
        questionContent: validContent,
        userAnswer: "A framework for React".repeat(30)
      };

      await testApiHandler({
        appHandler: { POST },
        async test({ fetch }) {
          const res = await fetch({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
          });

          const json = await res.json();

          expect(res.status).toBe(200);
          expect(json).toEqual({ success: true, data: mockResponse });

          expect(mockGenerateText).toHaveBeenCalledTimes(1);
          expect(mockGenerateText.mock.calls[0][0].prompt).toContain(requestBody.questionTitle);
          expect(mockGenerateText.mock.calls[0][0].prompt).toContain(requestBody.questionContent);
          expect(mockGenerateText.mock.calls[0][0].prompt).toContain(requestBody.userAnswer);
        }
      });
    });
  });
});
