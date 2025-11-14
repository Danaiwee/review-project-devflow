export * from "./router.mock";
export * from "./toast.mock";
export * from "./editor.mock";
export * from "./nextauth.mock";

//Prevent test pollution
export const resetAllMocks = () => {
  jest.clearAllMocks();
};
