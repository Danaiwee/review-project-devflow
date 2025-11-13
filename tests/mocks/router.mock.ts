const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn()
};

const mockUseRouter = jest.fn(() => mockRouter);

export { mockRouter, mockUseRouter };
