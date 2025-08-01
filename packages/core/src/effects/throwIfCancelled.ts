import {AbortError} from '../AbortError';
import {SagaNodeScope} from '../types';

export function throwIfCancelled(this: SagaNodeScope) {
  const {signal} = this.abortController;
  if (signal.aborted) {
    throw signal.reason || new AbortError(this.node);
  }
}
