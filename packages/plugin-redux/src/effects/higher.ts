import {ActionCreatorWithPayload, PayloadAction} from '@reduxjs/toolkit';
import {
  ArrayOr,
  SagaIterator,
  SagaOrFn,
  createSaga,
  isSagaIterator,
  throwIfNotAborted,
} from '@promise-saga/core';
import {SagaReduxHigherEffectsScope} from '../types';

export function takeEvery<P = any, T extends string = string, RT = any, PS extends any[] = any[]>(
  this: SagaReduxHigherEffectsScope,
  actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
  saga: SagaOrFn<RT, [PayloadAction<P, T>, ...PS]>,
  ...args: PS
) {
  return this.fork(createSaga(async function(this: SagaReduxHigherEffectsScope) {
    while (true) {
      const action = await this.take(actionCreator);
      const maybeIter = saga.call(this, action, ...args);
      if (isSagaIterator(maybeIter)) {
        maybeIter.catch(throwIfNotAborted);
      }
    }
  }.bind(this)));
}

export function takeLeading<P = any, T extends string = string, RT = any, PS extends any[] = any[]>(
  this: SagaReduxHigherEffectsScope,
  actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
  saga: SagaOrFn<RT, [PayloadAction<P, T>, ...PS]>,
  ...args: PS
) {
  return this.fork(createSaga(async function(this: SagaReduxHigherEffectsScope) {
    while (true) {
      const action = await this.take(actionCreator);
      await saga.call(this, action, ...args);
    }
  }.bind(this)));
}

export function takeLatest<P = any, T extends string = string, RT = any, PS extends any[] = any[]>(
  this: SagaReduxHigherEffectsScope,
  actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
  saga: SagaOrFn<RT, [PayloadAction<P, T>, ...PS]>,
  ...args: PS
) {
  return this.fork(createSaga(async function(this: SagaReduxHigherEffectsScope) {
    let iter: SagaIterator<RT> | undefined;
    while (true) {
      const action = await this.take(actionCreator);
      iter?.cancel();
      const maybeIter = saga.call(this, action, ...args);
      if (isSagaIterator(maybeIter)) {
        iter = maybeIter;
        iter.catch(throwIfNotAborted);
      }
    }
  }.bind(this)));
}

export function debounce<P = any, T extends string = string, RT = any, PS extends any[] = any[]>(
  this: SagaReduxHigherEffectsScope,
  ms: number,
  actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
  saga: SagaOrFn<RT, [PayloadAction<P, T>, ...PS]>,
  withCancel = false,
  ...args: PS
) {
  return this.fork(createSaga(async function(this: SagaReduxHigherEffectsScope) {
    let iter: SagaIterator<RT> | undefined;

    while (true) {
      let action = await this.take(actionCreator);

      while (true) {
        const [lastAction] = await this.race([
          this.take(actionCreator),
          this.delay(ms),
        ]);

        if (lastAction) {
          action = lastAction;
        } else {
          if (withCancel) iter?.cancel();
          const maybeIter = saga.call(this, action, ...args);
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

export function throttle<P = any, T extends string = string, RT = any, PS extends any[] = any[]>(
  this: SagaReduxHigherEffectsScope,
  ms: number,
  actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
  saga: SagaOrFn<RT, [PayloadAction<P, T>, ...PS]>,
  withCancel = false,
  ...args: PS
) {
  return this.fork(createSaga(async function(this: SagaReduxHigherEffectsScope) {
    let action: PayloadAction<P, T> | undefined;
    let iter: SagaIterator<RT> | undefined;
    let timeout: NodeJS.Timeout | undefined;
    const open = this.observable(true);

    while (true) {
      const [lastAction] = await this.race([
        this.take(actionCreator),
        open.onValue(true).catch(() => {}),
      ]);
      if (lastAction) action = lastAction;

      if (open.value && action) {
        if (withCancel) iter?.cancel();
        const maybeIter = saga.call(this, action, ...args);
        if (isSagaIterator(maybeIter)) {
          iter = maybeIter;
          iter.catch(throwIfNotAborted);
        }
        action = undefined;

        open.setValue(false);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          open.setValue(true);
        }, ms);
      }
    }
  }.bind(this)));
}
