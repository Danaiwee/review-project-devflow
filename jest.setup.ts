import "@testing-library/jest-dom";
import {
  mockAuth,
  MockEditDeletAction,
  MockImage,
  MockLink,
  MockMetric,
  mockToast,
  mockUseRouter,
  mockUseSession
} from "./tests/mocks";

jest.mock("next/navigation", () => ({ useRouter: mockUseRouter }));
jest.mock("sonner", () => ({ toast: mockToast }));
jest.mock("next-auth/react", () => ({ useSession: mockUseSession }));
jest.mock("@/auth", () => ({ auth: mockAuth }));
jest.mock("next/link", () => MockLink);
jest.mock("next/image", () => MockImage);

jest.mock("@/components/cards/EditDeleteAction", () => MockEditDeletAction);
jest.mock("@/components/cards/Metric", () => MockMetric);
