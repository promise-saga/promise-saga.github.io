import {SagaTreeNode} from './TreeNode';
import {AbortError} from './AbortError';
import {throwIfCancelled} from './effects/throwIfCancelled';
import {cancel, cancelled} from './effects/canceling';
import {observable} from './effects/observable';
import {cancellable} from './effects/cancellable';
import {
  all,
  call,
  callFn,
  callPromise,
  delay,
  fork,
  race,
  spawn,
} from './effects/lower';

export type Optional<T> = {[P in keyof T]?: T[P]};
export type PromiseMapResult<T> = {[P in keyof T]: Awaited<T[P]>};
export type AnyRecord = Record<string, any>;

export type FnActionInput<T = void, P extends any[] = any[]> = (...args: P) => T;
export type FnAction<T = void, P extends any[] = any[]> = {(...args: P): T, type: symbol};
export type FnActionResult<T = void, P extends any[] = any[]> = {type: symbol, result: T, args: P};

export type SagaCancelApi = {
  cancel: (err?: AbortError) => void,
  cancelled: () => boolean,
};
export type SagaIterator<T = any> = Promise<T> & SagaCancelApi;
export type SagaIteratorLike<T = any> = Promise<T> & Partial<SagaCancelApi>;
export type SagaInput<T = void, P extends any[] = any[], S extends AnyRecord = AnyRecord> =
  (this: SagaScope & S, ...args: P) => Promise<T>;
export type Saga<T = void, P extends any[] = any[], ET extends AnyRecord = AnyRecord> =
  (this: SagaNodeScope & ET | void, ...args: P) => SagaIterator<T>;
export type SagaFn<T = void, P extends any[] = any[], ET extends AnyRecord = AnyRecord> =
  (this: SagaNodeScope & ET | void, ...args: P) => T;
export type SagaOrFn<T = void, P extends any[] = any[], ET extends AnyRecord = AnyRecord> =
  (this: SagaNodeScope & ET | void, ...args: P) => T | SagaIterator<T>;

export interface SagaError extends Error {
  node: SagaTreeNode,
}
export type SagaThrowCancelledEffects = {
  throwIfCancelled: typeof throwIfCancelled,
};
export type SagaCancelingEffects = {
  cancel: typeof cancel,
  cancelled: typeof cancelled,
};
export type SagaCancellableEffects = {
  cancellable: typeof cancellable,
};
export type SagaObservableEffects = {
  observable: typeof observable,
};
export type SagaLowerEffects = {
  delay: typeof delay,
  call: typeof call,
  callFn: typeof callFn,
  callPromise: typeof callPromise,
  fork: typeof fork,
  spawn: typeof spawn,
  all: typeof all,
  race: typeof race,
};

export type SagaNodeScope = {
  node: SagaTreeNode,
  abortController: AbortController,
};
export type SagaLowerEffectsScope =
  & SagaNodeScope
  & SagaThrowCancelledEffects
  & SagaObservableEffects
  & SagaCancellableEffects;
export type SagaHigherEffectsScope =
  & SagaLowerEffects
  & SagaLowerEffectsScope;
export type SagaScope =
  & SagaHigherEffectsScope
  & SagaCancelingEffects;

export type CancellableFinallyHandler = () => void;
export type CancellableConfig<T> = {
  node?: SagaTreeNode<T>,
  abortController?: AbortController,
  onFinally?: CancellableFinallyHandler,
  onError?: (err: unknown) => void,
};
export type CancellableOrConfig<T> =
  | CancellableFinallyHandler
  | CancellableConfig<T>;

export type SagaConfig<
  ET extends AnyRecord,
  S1 extends AnyRecord,
  S2 extends AnyRecord,
  S3 extends AnyRecord,
> = {
  plugin?: SagaPlugin<S1, S2, S3>,
  tree?: SagaTreeNode,
  onError?: (err: unknown, node: SagaTreeNode) => void;
  this?: ET,
};
export type SagaPlugin<
  S1 extends AnyRecord = AnyRecord,
  S2 extends AnyRecord = AnyRecord,
  S3 extends AnyRecord = AnyRecord,
> = {
  main?: S1,
  lower?: S2,
  higher?: S3,
};
