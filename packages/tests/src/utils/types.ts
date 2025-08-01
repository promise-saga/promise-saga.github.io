import {AnyRecord, createSaga} from '@promise-saga/core';

export type TestsConfig = {
  createSaga: typeof createSaga<void, [], AnyRecord, any, any, any>,
  canTake?: boolean,
};
