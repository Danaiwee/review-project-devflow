import { Tag } from "@/database";
import { getTags } from "@/lib/actions/tag.action";

describe("getTags actions", () => {
  describe("Validation", () => {
    it("should return error if invalid params", async () => {
      const invalidParams = { page: "invalid", pageSize: -5 } as unknown as PaginatedSearchParams;

      const result = await getTags(invalidParams);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error && result.error.message).toContain(
        "Invalid input: expected number, received string, Page size is required"
      );
    });
  });

  describe("Pagination and Sorting", () => {
    beforeEach(async () => {
      const testTags = [
        { name: "javascript", questions: 100, createdAt: "2025-01-01" },
        { name: "react", questions: 20, createdAt: "2025-02-01" },
        { name: "typescript", questions: 50, createdAt: "2025-03-01" }
      ];

      await Tag.insertMany(testTags);
    });

    afterEach(async () => {
      await Tag.deleteMany({});
    });

    it("should return the first page of tags sorted by question count(default behavior", async () => {
      const { success, data } = await getTags({ page: 1, pageSize: 2 });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(2);
      expect(data?.tags[0].name).toBe("javascript");
      expect(data?.tags[1].name).toBe("typescript");
      expect(data?.isNext).toBe(true);
    });

    it("should return the second page of tags when paginated", async () => {
      const { success, data } = await getTags({ page: 2, pageSize: 2 });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(1);
      expect(data?.tags[0].name).toBe("react");
      expect(data?.isNext).toBe(false);
    });
  });

  describe("Search functionality", () => {
    beforeEach(async () => {
      const testTags = [
        { name: "javascript", questions: 100, createdAt: "2025-01-01" },
        { name: "java", questions: 20, createdAt: "2025-02-01" },
        { name: "typescript", questions: 50, createdAt: "2025-03-01" }
      ];

      await Tag.insertMany(testTags);
    });

    afterEach(async () => {
      await Tag.deleteMany({});
    });

    it("should filter tags by partial name match (case sentitive)", async () => {
      const { success, data } = await getTags({ page: 1, pageSize: 10, query: "jav" });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(2);
      expect(data?.tags.map((tag) => tag.name)).toEqual(expect.arrayContaining(["javascript", "java"]));
    });

    it("should return an empty array when no tags match query", async () => {
      const { success, data } = await getTags({ page: 1, pageSize: 10, query: "react" });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(0);
      expect(data?.tags).toEqual(expect.arrayContaining([]));
    });

    it("should sort tags by recent (newest creation date)", async () => {
      const { success, data } = await getTags({ page: 1, pageSize: 10, filter: "recent" });

      expect(success).toBe(true);
      expect(data?.tags.map((tag) => tag.name)).toEqual(["typescript", "java", "javascript"]);
    });

    it("should sort tags by oldest (oldest creation date)", async () => {
      const { success, data } = await getTags({ page: 1, pageSize: 10, filter: "oldest" });

      expect(success).toBe(true);
      expect(data?.tags.map((tag) => tag.name)).toEqual(["javascript", "java", "typescript"]);
    });

    it("should sort tags by name", async () => {
      const { success, data } = await getTags({ page: 1, pageSize: 10, filter: "name" });

      expect(success).toBe(true);
      expect(data?.tags.map((tag) => tag.name)).toEqual(["java", "javascript", "typescript"]);
    });

    it("should filter by query and sort by recent", async () => {
      const { success, data } = await getTags({ page: 1, pageSize: 10, filter: "recent", query: "ja" });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(2);
      expect(data?.tags.map((tag) => tag.name)).toEqual(["java", "javascript"]);
    });
  });
});
