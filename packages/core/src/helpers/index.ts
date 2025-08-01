import {AbortError} from '../AbortError';
import {SagaTreeNode} from '../TreeNode';
import {SagaError, SagaIterator} from '../types';
import {_sagaListeners} from './tests/listeners';

export const isAbortError = (err: unknown): err is AbortError => (
  err instanceof Error && 'type' in err && err.type === 'abort'
);

export const isSagaError = (err: unknown): err is SagaError => (
  err instanceof Error && 'node' in err && typeof err.node === 'object'
);

export const isSagaIterator = <T>(obj: unknown): obj is SagaIterator<T> => (
  obj instanceof Object && 'cancel' in obj && typeof obj.cancel === 'function'
);

export const onNodeChildrenFinish = (node: SagaTreeNode) => {
  const iters: SagaIterator[] = [];

  for (const child of node.children) {
    if (child.iter) iters.push(child.iter);
  }

  return Promise.allSettled(iters);
};

export const onControllerAbort = (abortController: AbortController) => (
  new Promise((resolve) => {
    if (process.env.NODE_ENV === 'test') _sagaListeners.increaseCount();
    abortController.signal.addEventListener('abort', (err) => {
      if (process.env.NODE_ENV === 'test') _sagaListeners.decreaseCount();
      resolve(err);
    }, {once: true});
  })
);

export const throwIfNotAborted = (err: unknown) => {
  if (!isAbortError(err)) {
    throw err;
  }
};
