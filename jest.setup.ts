import "@testing-library/jest-dom";
import { mockToast, mockUseRouter, mockUseSession } from "./tests/mocks";

jest.mock("next/navigation", () => ({ useRouter: mockUseRouter }));
jest.mock("sonner", () => ({ toast: mockToast }));
jest.mock("next-auth/react", () => ({ useSession: mockUseSession }));
