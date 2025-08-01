import {createCreateSaga} from '@promise-saga/core';
import {createHigherHooks} from '@promise-saga/plugin-react';
import {plugin} from '@promise-saga/plugin-default';

export const createSaga = createCreateSaga({plugin});

export const {
  useTakeEvery,
  useTakeLeading,
  useTakeLatest,
  useDebounce,
  useThrottle,
} = createHigherHooks(createSaga);
