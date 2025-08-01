import {vi} from 'vitest';

export const _testConsole = {
  log: vi.fn<(...args: any[]) => void>(),
  throw: vi.fn<(err: Error) => void>(),
};
