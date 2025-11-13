export * from "./router.mock";
export * from "./toast.mock";

//Prevent test pollution
export const resetAllMocks = () => {
  jest.clearAllMocks();
};
