// tests/utils/mock-db-connect.ts
import { connectDB, isDBConnected } from "@/tests/config/db-integration";

// This function holds the logic that was causing the hoisting issue
export async function mockDbConnectWrapper() {
  if (!isDBConnected()) {
    await connectDB();
  }
}
