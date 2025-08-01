import {AbortError} from '../AbortError';
import {SagaIterator, SagaNodeScope} from '../types';

export function cancel<T>(this: SagaNodeScope, iter?: SagaIterator<T>) {
  if (!iter) throw new AbortError(this.node);
  iter.cancel();
}

export function cancelled<T>(this: SagaNodeScope, iter?: SagaIterator<T>) {
  return (iter || this.node.iter)?.cancelled() ?? false;
}
