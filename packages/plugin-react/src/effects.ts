import {
  createSaga as createSagaOriginal,
  ArrayOr,
  FnAction,
  FnActionResult,
  SagaOrFn,
  AnyRecord,
} from '@promise-saga/core';
import {SagaDefaultHigherEffects, SagaDefaultLowerEffects, SagaDefaultScope} from '@promise-saga/plugin-default';
import {useSaga as useSagaOriginal} from './useSaga';

export const createHigherHooks = <
  ET extends AnyRecord = AnyRecord,
  S1 extends SagaDefaultScope = any,
  S2 extends SagaDefaultLowerEffects = any,
  S3 extends SagaDefaultHigherEffects = any,
>(
  createSaga: typeof createSagaOriginal<void, [], ET, S1, S2, S3> = createSagaOriginal,
  useSaga: typeof useSagaOriginal<void, [], ET> = useSagaOriginal,
) => {
  const useTakeEvery = <T = any, P extends any[] = any[], RT = any, PS extends any[] = any[]>(
    action: ArrayOr<FnAction<T, P> | string>,
    saga: SagaOrFn<RT, [FnActionResult<T, P>, ...PS]>,
    ...args: PS
  ) => useSaga(createSaga(async function() {
    this.takeEvery(action, saga, ...args);
  }));

  const useTakeLeading = <T = any, P extends any[] = any[], RT = any, PS extends any[] = any[]>(
    action: ArrayOr<FnAction<T, P> | string>,
    saga: SagaOrFn<RT, [FnActionResult<T, P>, ...PS]>,
    ...args: PS
  ) => useSaga(createSaga(async function() {
    this.takeLeading(action, saga, ...args);
  }));

  const useTakeLatest = <T = any, P extends any[] = any[], RT = any, PS extends any[] = any[]>(
    action: ArrayOr<FnAction<T, P> | string>,
    saga: SagaOrFn<RT, [FnActionResult<T, P>, ...PS]>,
    ...args: PS
  ) => useSaga(createSaga(async function() {
    this.takeLatest(action, saga, ...args);
  }));

  const useDebounce = <T = any, P extends any[] = any[], RT = any, PS extends any[] = any[]>(
    ms: number,
    action: ArrayOr<FnAction<T, P> | string>,
    saga: SagaOrFn<RT, [FnActionResult<T, P>, ...PS]>,
    withCancel = false,
    ...args: PS
  ) => useSaga(createSaga(async function() {
    this.debounce(ms, action, saga, withCancel, ...args);
  }));

  const useThrottle = <T = any, P extends any[] = any[], RT = any, PS extends any[] = any[]>(
    ms: number,
    action: ArrayOr<FnAction<T, P> | string>,
    saga: SagaOrFn<RT, [FnActionResult<T, P>, ...PS]>,
    withCancel = false,
    ...args: PS
  ) => useSaga(createSaga(async function() {
    this.throttle(ms, action, saga, withCancel, ...args);
  }));

  return {
    useTakeEvery,
    useTakeLeading,
    useTakeLatest,
    useDebounce,
    useThrottle,
  };
};
