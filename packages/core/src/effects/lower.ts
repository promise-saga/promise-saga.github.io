import {throwIfNotAborted} from '../helpers';
import {
  Optional,
  PromiseMapResult,
  SagaLowerEffectsScope,
  Saga,
  SagaFn,
  SagaIterator,
  SagaIteratorLike,
} from '../types';

export function callFn<T = any, P extends any[] = any[]>(
  this: SagaLowerEffectsScope,
  saga: SagaFn<T, P>,
  ...args: P
) {
  this.throwIfCancelled();
  const result = saga.apply(this, args);
  this.throwIfCancelled();
  return result;
}

export async function callPromise<T = any, P extends Promise<T> = Promise<T>>(
  this: SagaLowerEffectsScope,
  promise: P,
) {
  this.throwIfCancelled();
  const result = await promise;
  this.throwIfCancelled();
  return result;
}

export async function call<T = any, P extends any[] = any[]>(
  this: SagaLowerEffectsScope,
  saga: Saga<T, P>,
  ...args: P
) {
  this.throwIfCancelled();
  const result = await saga.apply(this, args);
  this.throwIfCancelled();
  return result;
}

export function fork<T = any, P extends any[] = any[]>(
  this: SagaLowerEffectsScope,
  saga: Saga<T, P>,
  ...args: P
): SagaIterator<T> {
  this.throwIfCancelled();
  const iter = saga.apply(this, args);

  iter.then((result) => {
    this.throwIfCancelled();
    return result;
  }).catch((err) => {
    this.node.iter?.cancel(err);
  });

  return iter;
}

export function spawn<T = any, P extends any[] = any[]>(
  this: SagaLowerEffectsScope,
  saga: Saga<T, P>,
  ...args: P
): SagaIterator<T> {
  this.throwIfCancelled();
  const iter = saga(...args);

  iter.then((result) => {
    this.throwIfCancelled();
    return result;
  }).catch(() => {});

  return iter;
}

export async function delay(
  this: SagaLowerEffectsScope,
  ms?: number,
) {
  this.throwIfCancelled();
  let timeout: NodeJS.Timeout;

  return this.cancellable<void>(new Promise((resolve) => {
    timeout = setTimeout(() => {
      this.throwIfCancelled();
      resolve();
    }, ms);
  }), () => {
    clearTimeout(timeout)
  });
}

export async function all<T extends SagaIteratorLike[] | []>(
  this: SagaLowerEffectsScope,
  iters: T,
) {
  this.throwIfCancelled();
  return this.cancellable<PromiseMapResult<T>>(new Promise((resolve) => {
    let count = 0;

    const results = iters.map((iter, i) => {
      iter.then((taskResult) => {
        this.throwIfCancelled();

        results[i] = taskResult;
        count++;

        if (count === iters.length) {
          resolve(results as PromiseMapResult<T>);
        }
      }).catch(throwIfNotAborted);
    });
  }));
}

export async function race<T extends Array<SagaIteratorLike | undefined> | []>(
  this: SagaLowerEffectsScope,
  iters: T,
  withCancel = true,
) {
  this.throwIfCancelled();
  return this.cancellable<Optional<PromiseMapResult<T>>>(new Promise((resolve) => {
    let done = false;

    const results = iters.map((iter, i) => {
      iter?.then((taskResult) => {
        this.throwIfCancelled();
        if (done) return;

        results[i] = taskResult;
        done = true;

        if (withCancel) {
          for (const iterToCancel of iters) {
            if (iterToCancel !== iter) {
              iterToCancel?.cancel?.();
            }
          }
        }

        resolve(results as Optional<PromiseMapResult<T>>);
      }).catch(throwIfNotAborted);
    });
  }));
}
