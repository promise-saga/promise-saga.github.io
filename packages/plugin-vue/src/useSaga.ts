import {onMounted, onUnmounted, ref} from 'vue';
import {AnyRecord, SagaIterator, throwIfNotAborted} from '@promise-saga/core';
import {UseSagaConfig, UseSagaReturn, UseSagaOrWithConfig, UseSagaWithConfig} from './types';

export const withConfig = <T, P extends any[], ET extends AnyRecord>(
  saga: UseSagaOrWithConfig<T, P, ET>,
): UseSagaWithConfig<T, P, ET> => (
  typeof saga === 'object' ? saga : {saga}
);

export function useSaga<
  T = void,
  P extends any[] = any[],
  ET extends AnyRecord = AnyRecord,
>(sagaOrConfig: UseSagaOrWithConfig<T, P, ET>, ...args: P): UseSagaReturn<T> {
  const {saga, config = {}} = withConfig(sagaOrConfig);
  let iterRef: SagaIterator<T> | undefined;
  const result = ref<T>();
  const isRunning = ref(false);
  const isDone = ref(false);
  const isCancelled = ref(false);

  const finish = () => {
    iterRef?.cancel();
    iterRef = undefined;
    isRunning.value = false;
    isDone.value = true;
  };

  const run = () => {
    iterRef = saga(...args);
    iterRef
      .then((value) => result.value = value)
      .catch(throwIfNotAborted)
      .finally(finish);
    isDone.value = false;
    isCancelled.value = false;
    isRunning.value = true;
  };

  const cancel = () => {
    finish();
    isCancelled.value = true;
  };

  const toggle = () => {
    iterRef ? cancel() : run();
  };

  onMounted(() => {
    if (config.runOnMount ?? true) run();
  });

  onUnmounted(() => {
    if (config.cancelOnUnmount ?? true) cancel();
  });

  return {
    result,
    isDone,
    isRunning,
    isCancelled,
    run,
    cancel,
    toggle,
  };
}

export const createUseSaga = (defaultConfig: UseSagaConfig = {}) => <
  T = void,
  P extends any[] = any[],
  ET extends AnyRecord = AnyRecord,
>(
  sagaOrConfig: UseSagaOrWithConfig<T, P, ET>,
  ...args: P
) => {
  const {saga, config} = withConfig(sagaOrConfig);

  return useSaga<T, P, ET>({
    saga,
    config: {
      ...defaultConfig,
      ...config,
    },
  }, ...args);
};
