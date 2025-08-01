import {cancellable as cancellableFn} from './cancellable';
import {createSagaScope} from './createSagaScope';
import {onControllerAbort, onNodeChildrenFinish} from './helpers';
import {defaultTree} from './defaults/tree';
import {AnyRecord, Saga, SagaConfig, SagaInput} from './types';
import {SagaTreeNode} from './TreeNode';

export const createSaga = <
  T = void,
  P extends any[] = any[],
  ET extends AnyRecord = AnyRecord,
  S1 extends AnyRecord = AnyRecord,
  S2 extends AnyRecord = AnyRecord,
  S3 extends AnyRecord = AnyRecord,
>(
  saga: SagaInput<T, P, S1 & S2 & S3 & ET>,
  config: SagaConfig<ET, S1, S2, S3> = {},
): Saga<T, P, ET> => function (...args: P) {
  const {
    plugin,
    onError,
    this: extraThis,
    tree = defaultTree,
  } = config;

  const parent = this?.node || tree;
  const node = new SagaTreeNode(saga, parent);
  parent.addChild(node);

  const abortController = new AbortController();
  const scope = createSagaScope({node, abortController}, plugin);

  const handleError = onError
    ? (err: unknown) => onError(err, node)
    : undefined

  const handleFinally = async () => {
    try {
      if (!abortController.signal.aborted) {
        await Promise.race([
          onNodeChildrenFinish(node),
          onControllerAbort(abortController),
        ]);

        scope.throwIfCancelled();
      }
    } finally {
      node.cancelAll();
      parent.removeChild(node);
    }
  };

  return node.iter = cancellableFn(
    saga.apply({...scope, ...extraThis as ET}, args),
    {
      node,
      abortController,
      onError: handleError,
      onFinally: handleFinally,
    },
  );
};

export const createCreateSaga = <
  S1 extends AnyRecord = AnyRecord,
  S2 extends AnyRecord = AnyRecord,
  S3 extends AnyRecord = AnyRecord,
>(defaultConfig: SagaConfig<any, S1, S2, S3> = {}) => <
  T = void,
  P extends any[] = any[],
  ET extends AnyRecord = AnyRecord,
>(
  saga: SagaInput<T, P, S1 & S2 & S3 & ET>,
  config: SagaConfig<ET, S1, S2, S3> = {},
) => createSaga<T, P, ET, S1, S2, S3>(saga, {
  ...defaultConfig,
  ...config,
});
