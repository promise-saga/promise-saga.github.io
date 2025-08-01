import {cancellable as cancellableFn, withConfig} from '../cancellable';
import {CancellableOrConfig, SagaIterator, SagaNodeScope} from '../types';

export function cancellable<T>(
  this: SagaNodeScope,
  promise: Promise<T>,
  config: CancellableOrConfig<T> = {},
): SagaIterator<T> {
  return cancellableFn<T>(promise, {
    node: this.node,
    abortController: this.abortController,
    ...withConfig(config),
  });
}
