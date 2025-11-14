import "@testing-library/jest-dom";
import { mockToast, mockUseRouter } from "./tests/mocks";

jest.mock("next/navigation", () => ({ useRouter: mockUseRouter }));
jest.mock("sonner", () => ({ toast: mockToast }));
