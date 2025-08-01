import {CancellableConfig, CancellableOrConfig, SagaIterator} from './types';
import {AbortError} from './AbortError';
import {isAbortError} from './helpers';
import {_sagaListeners} from './helpers/tests/listeners';

export const withConfig = <T>(
  config: CancellableOrConfig<T>,
): CancellableConfig<T> => (
  typeof config === 'object' ? config : {onFinally: config}
);

export function cancellable<T>(
  promise: Promise<T>,
  config: CancellableOrConfig<T> = {},
): SagaIterator<T> {
  const {
    node,
    abortController = new AbortController(),
    onFinally,
    onError,
  } = withConfig(config);

  const abortPromise = new Promise<T>((_, reject) => {
    if (process.env.NODE_ENV === 'test') _sagaListeners.increaseCount();
    abortController.signal.addEventListener('abort', () => {
      if (process.env.NODE_ENV === 'test') _sagaListeners.decreaseCount();
      reject(abortController.signal.reason);
    }, {once: true});
  });

  const wrapper = Promise.race([
    abortPromise,
    promise.catch((err) => {
      abortController.abort(err);
      if (onError && !isAbortError(err)) {
        if (!err.node) err = Object.assign(err, {node});
        onError(err);
      }
    }),
  ]).finally(onFinally);

  return Object.assign(wrapper, {
    cancelled: () => abortController.signal.aborted,
    cancel: (err?: AbortError) => abortController.abort(err || new AbortError(node)),
  }) as SagaIterator<T>;
}
