import "@testing-library/jest-dom";
import { connectDB, disconnectDB, clearDB, isDBConnected } from "@/tests/config/db-integration";

import { mockDbConnectWrapper } from "./tests/utils/mock-db-conect";

jest.mock("@/auth", () => ({
  auth: jest.fn(() => Promise.resolve({ user: null }))
}));

jest.mock("@/lib/mongoose", () => ({
  __esModule: true,
  dbConnect: jest.fn(mockDbConnectWrapper),
  default: jest.fn(mockDbConnectWrapper)
}));

beforeAll(async () => {
  console.log("🛠️ Starting MongoMemoryServer and connecting DB...");
  await connectDB();
}, 30000);

beforeEach(async () => {
  if (isDBConnected()) await clearDB();
}, 10000);

afterAll(async () => {
  console.log("🧹 Disconnecting DB and stopping MongoMemoryServer...");
  await disconnectDB();
});

afterEach(async () => {
  await clearDB();
});

process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});
