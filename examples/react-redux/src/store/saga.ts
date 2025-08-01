import {createCreateSaga} from '@promise-saga/core';
import {plugin, createHigherHooks} from '@promise-saga/plugin-redux';

export const createSaga = createCreateSaga({plugin});

export const {
  useTakeEvery,
  useTakeLeading,
  useTakeLatest,
  useDebounce,
  useThrottle,
} = createHigherHooks(createSaga);
