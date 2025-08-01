import {
  FnAction,
  FnActionResult,
  SagaIterator,
  SagaOrFn,
  ArrayOr,
  createSaga,
  isSagaIterator,
  throwIfNotAborted,
} from '@promise-saga/core';
import {SagaDefaultHigherEffectsScope} from '../types';

export function takeEvery<T = any, P extends any[] = any[], RT = any, PS extends any[] = any[]>(
  this: SagaDefaultHigherEffectsScope,
  action: ArrayOr<FnAction<T, P> | string> | '*',
  saga: SagaOrFn<RT, [FnActionResult<T, P>, ...PS]>,
  ...args: PS
) {
  return this.fork(createSaga(async function(this: SagaDefaultHigherEffectsScope) {
    while (true) {
      const result = await this.take(action);
      const maybeIter = saga.call(this, result, ...args);
      if (isSagaIterator(maybeIter)) {
        maybeIter.catch(throwIfNotAborted);
      }
    }
  }.bind(this)));
}

export function takeLeading<T = any, P extends any[] = any[], RT = any, PS extends any[] = any[]>(
  this: SagaDefaultHigherEffectsScope,
  action: ArrayOr<FnAction<T, P> | string> | '*',
  saga: SagaOrFn<RT, [FnActionResult<T, P>, ...PS]>,
  ...args: PS
) {
  return this.fork(createSaga(async function(this: SagaDefaultHigherEffectsScope) {
    while (true) {
      const result = await this.take(action);
      await saga.call(this, result, ...args);
    }
  }.bind(this)));
}

export function takeLatest<T = any, P extends any[] = any[], RT = any, PS extends any[] = any[]>(
  this: SagaDefaultHigherEffectsScope,
  action: ArrayOr<FnAction<T, P> | string> | '*',
  saga: SagaOrFn<RT, [FnActionResult<T, P>, ...PS]>,
  ...args: PS
) {
  return this.fork(createSaga(async function(this: SagaDefaultHigherEffectsScope) {
    let iter: SagaIterator<RT> | undefined;
    while (true) {
      const result = await this.take(action);
      iter?.cancel();
      const maybeIter = saga.call(this, result, ...args);
      if (isSagaIterator(maybeIter)) {
        iter = maybeIter;
        iter.catch(throwIfNotAborted);
      }
    }
  }.bind(this)));
}

export function debounce<T = any, P extends any[] = any[], RT = any, PS extends any[] = any[]>(
  this: SagaDefaultHigherEffectsScope,
  ms: number,
  action: ArrayOr<FnAction<T, P> | string> | '*',
  saga: SagaOrFn<RT, [FnActionResult<T, P>, ...PS]>,
  withCancel = false,
  ...args: PS
) {
  return this.fork(createSaga(async function(this: SagaDefaultHigherEffectsScope) {
    let iter: SagaIterator<RT> | undefined;

    while (true) {
      let result = await this.take(action);

      while (true) {
        const [lastAction] = await this.race([
          this.take(action),
          this.delay(ms),
        ]);

        if (lastAction) {
          result = lastAction;
        } else {
          if (withCancel) iter?.cancel();
          const maybeIter = saga.call(this, result, ...args);
          if (isSagaIterator(maybeIter)) {
            iter = maybeIter;
            iter.catch(throwIfNotAborted);
          }
          break;
        }
      }
    }
  }.bind(this)));
}

export function throttle<T = any, P extends any[] = any[], RT = any, PS extends any[] = any[]>(
  this: SagaDefaultHigherEffectsScope,
  ms: number,
  action: ArrayOr<FnAction<T, P> | string> | '*',
  saga: SagaOrFn<RT, [FnActionResult<T, P>, ...PS]>,
  withCancel = false,
  ...args: PS
) {
  return this.fork(createSaga(async function(this: SagaDefaultHigherEffectsScope) {
    let result: FnActionResult<T, P> | undefined;
    let iter: SagaIterator<RT> | undefined;
    let timeout: NodeJS.Timeout | undefined;
    const open = this.observable(true);

    while (true) {
      const [lastAction] = await this.race([
        this.take(action),
        open.onValue(true).catch(() => {}),
      ]);
      if (lastAction) result = lastAction;

      if (open.value && result) {
        if (withCancel) iter?.cancel();
        const maybeIter = saga.call(this, result, ...args);
        if (isSagaIterator(maybeIter)) {
          iter = maybeIter;
          iter.catch(throwIfNotAborted);
        }
        result = undefined;

        open.setValue(false);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          open.setValue(true);
        }, ms);
      }
    }
  }.bind(this)));
}
