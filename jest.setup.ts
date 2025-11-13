import "@testing-library/jest-dom";
import { mockToast, mockUseRouter } from "./tests/mocks";

jest.mock("@/lib/actions/auth.action.ts", () => ({
  signInWithCredentials: jest.fn().mockResolvedValue({ success: true }),
  signUpWithCredentials: jest.fn().mockResolvedValue({ success: true })
}));

jest.mock("next/navigation", () => ({ useRouter: mockUseRouter }));
jest.mock("sonner", () => ({ toast: mockToast }));
