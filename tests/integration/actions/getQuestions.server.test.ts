import { Question } from "@/database";
import Tag, { ITagDoc } from "@/database/tag.model";
import User, { IUserDoc } from "@/database/user.model";
import { getQuestions } from "@/lib/actions/question.action";

describe("getQuestion action", () => {
  describe("Validation", () => {
    it("should return the error for invalid params", async () => {
      const invalidParams = { page: "invalid", pageSize: -5 } as unknown as PaginatedSearchParams;
      const result = await getQuestions(invalidParams);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error && result.error.message).toContain(
        "Invalid input: expected number, received string, Page size is required"
      );
    });

    describe("Pagination and Sorting", () => {
      let testUser: IUserDoc;
      let testTags: ITagDoc[];

      beforeEach(async () => {
        testUser = await User.create({
          name: "Test User",
          username: "testuser",
          email: "test@example.com"
        });

        testTags = await Tag.insertMany([
          { name: "javascript", questions: 0 },
          { name: "react", question: 0 },
          { name: "node", question: 0 }
        ]);

        const testQuestion = [
          {
            title: "How to use React hooks?",
            content: "I need help with React hooks",
            author: testUser._id,
            tags: [testTags[1]._id],
            views: 100,
            upvotes: 50,
            answers: 5,
            createdAt: new Date("2024-01-01")
          },
          {
            title: "JavaScript async/await explained",
            content: "Can someone explain async/await?",
            author: testUser._id,
            tags: [testTags[0]._id],
            views: 200,
            upvotes: 100,
            answers: 0,
            createdAt: new Date("2024-02-01")
          },
          {
            title: "Node.js best practices",
            content: "What are the best practices for Node.js?",
            author: testUser._id,
            tags: [testTags[2]._id],
            views: 150,
            upvotes: 75,
            answers: 3,
            createdAt: new Date("2024-03-01")
          }
        ];
        await Question.insertMany(testQuestion);
      });

      afterEach(async () => {
        await Question.deleteMany({});
        await Tag.deleteMany({});
        await User.deleteMany({});
      });

      it("should return the first page of questions sorted by creation data (default behavior)", async () => {
        const result = await getQuestions({ page: 1, pageSize: 2 });

        expect(result.success).toBe(true);
        expect(result.data?.questions).toHaveLength(2);
        expect(result.data?.questions[0].title).toBe("Node.js best practices");
        expect(result.data?.questions[1].title).toBe("JavaScript async/await explained");
        expect(result.data?.isNext).toBe(true);
      });

      it("should return the second page of questions when paginated", async () => {
        const result = await getQuestions({ page: 2, pageSize: 2 });

        expect(result.success).toBe(true);
        expect(result.data?.questions).toHaveLength(1);
        expect(result.data?.questions[0].title).toBe("How to use React hooks?");
        expect(result.data?.isNext).toBe(false);
      });

      it('should sort questions by newest when the filter is "newest"', async () => {
        const result = await getQuestions({ page: 1, pageSize: 10, filter: "newest" });

        expect(result.success).toBe(true);
        expect(result.data?.questions).toHaveLength(3);
        expect(result.data?.questions[0].title).toBe("Node.js best practices");
        expect(result.data?.questions[1].title).toBe("JavaScript async/await explained");
        expect(result.data?.questions[2].title).toBe("How to use React hooks?");
      });

      it("should sort unanswered questions when filter is 'unanswered'", async () => {
        const result = await getQuestions({ page: 1, pageSize: 10, filter: "unanswered" });

        expect(result.success).toBe(true);
        expect(result.data?.questions).toHaveLength(1);
        expect(result.data?.questions[0].title).toBe("JavaScript async/await explained");
        expect(result.data?.isNext).toBe(false);
      });

      it("should sort questions by upvotes when filter is popular", async () => {
        const result = await getQuestions({
          page: 1,
          pageSize: 10,
          filter: "popular"
        });

        expect(result.success).toBe(true);
        expect(result.data?.questions).toHaveLength(3);
        expect(result.data?.questions[0].title).toBe("JavaScript async/await explained");
        expect(result.data?.questions[1].title).toBe("Node.js best practices");
        expect(result.data?.questions[2].title).toBe("How to use React hooks?");
        expect(result.data?.isNext).toBe(false);
      });
    });
  });

  describe("Search Functionality", () => {
    let testUser: IUserDoc;
    let testTag: ITagDoc;

    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        username: "testuser",
        email: "test@example.com"
      });

      testTag = await Tag.create({ name: "javascript", questions: 0 });

      await Question.insertMany([
        {
          title: "JavaScript array methods",
          content: "How to use map, filter, and reduce?",
          author: testUser._id,
          tags: [testTag._id],
          upvotes: 100
        },
        {
          title: "React hooks tutorial",
          content: "Learn about useState and useEffect",
          author: testUser._id,
          tags: [testTag._id],
          upvotes: 10
        },
        {
          title: "Python data structures",
          content: "Understanding lists and dictionaries",
          author: testUser._id,
          tags: [testTag._id],
          upvotes: 50
        }
      ]);
    });

    afterEach(async () => {
      await Question.deleteMany({});
      await Tag.deleteMany({});
      await User.deleteMany({});
    });

    it("should filter questions by title match (case-insensitive)", async () => {
      const result = await getQuestions({ page: 1, pageSize: 10, query: "ja" });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(1);
      expect(result.data?.questions[0].title).toBe("JavaScript array methods");
      expect(result.data?.isNext).toBe(false);
    });

    it("should filter question by content match (case-insensitive)", async () => {
      const result = await getQuestions({ page: 1, pageSize: 10, query: "Understanding lists and dictionaries" });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(1);
      expect(result.data?.questions[0].title).toBe("Python data structures");
      expect(result.data?.isNext).toBe(false);
    });

    it("should return an empty array when no questions match query", async () => {
      const result = await getQuestions({ page: 1, pageSize: 10, query: "I love javascript" });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(0);
      expect(result.data?.questions).toEqual([]);
      expect(result.data?.isNext).toBe(false);
    });

    it("should search and filter together", async () => {
      const result = await getQuestions({ page: 1, pageSize: 10, query: "react", filter: "popular" });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(1);
      expect(result.data?.questions[0].title).toBe("React hooks tutorial");
      expect(result.data?.isNext).toBe(false);
    });
  });
});
