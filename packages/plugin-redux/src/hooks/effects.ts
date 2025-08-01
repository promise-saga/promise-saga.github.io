import {ActionCreatorWithPayload, PayloadAction} from '@reduxjs/toolkit';
import {
  createSaga as createSagaOriginal,
  ArrayOr,
  AnyRecord,
  SagaOrFn,
} from '@promise-saga/core';
import {useSaga as useSagaOriginal} from '@promise-saga/plugin-react';
import {SagaReduxHigherEffects, SagaReduxLowerEffects, SagaReduxScope} from '../types';

export const createHigherHooks = <
  ET extends AnyRecord = AnyRecord,
  S1 extends SagaReduxScope = any,
  S2 extends SagaReduxLowerEffects = any,
  S3 extends SagaReduxHigherEffects = any,
>(
  createSaga: typeof createSagaOriginal<void, [], ET, S1, S2, S3> = createSagaOriginal,
  useSaga: typeof useSagaOriginal<void, [], ET> = useSagaOriginal,
) => {
  const useTakeEvery = <P = any, T extends string = string, RT = any, PS extends any[] = any[]>(
    actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
    saga: SagaOrFn<RT, [PayloadAction<P, T>, ...PS]>,
    ...args: PS
  ) => useSaga(createSaga(async function() {
    this.takeEvery(actionCreator, saga, ...args);
  }));

  const useTakeLeading = <P = any, T extends string = string, RT = any, PS extends any[] = any[]>(
    actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
    saga: SagaOrFn<RT, [PayloadAction<P, T>, ...PS]>,
    ...args: PS
  ) => useSaga(createSaga(async function() {
    this.takeLeading(actionCreator, saga, ...args);
  }));

  const useTakeLatest = <P = any, T extends string = string, RT = any, PS extends any[] = any[]>(
    actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
    saga: SagaOrFn<RT, [PayloadAction<P, T>, ...PS]>,
    ...args: PS
  ) => useSaga(createSaga(async function() {
    this.takeLatest(actionCreator, saga, ...args);
  }));

  const useDebounce = <P = any, T extends string = string, RT = any, PS extends any[] = any[]>(
    ms: number,
    actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
    saga: SagaOrFn<RT, [PayloadAction<P, T>, ...PS]>,
    withCancel = false,
    ...args: PS
  ) => useSaga(createSaga(async function() {
    this.debounce(ms, actionCreator, saga, withCancel, ...args);
  }));

  const useThrottle = <P = any, T extends string = string, RT = any, PS extends any[] = any[]>(
    ms: number,
    actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
    saga: SagaOrFn<RT, [PayloadAction<P, T>, ...PS]>,
    withCancel = false,
    ...args: PS
  ) => useSaga(createSaga(async function() {
    this.throttle(ms, actionCreator, saga, withCancel, ...args);
  }));

  return {
    useTakeEvery,
    useTakeLeading,
    useTakeLatest,
    useDebounce,
    useThrottle,
  };
};
