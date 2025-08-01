import {onMount} from 'svelte';
import {writable} from 'svelte/store';
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
  let result = writable<T | undefined>();
  let isRunning = writable(false);
  let isDone = writable(false);
  let isCancelled = writable(false);

  const finish = () => {
    iterRef?.cancel();
    iterRef = undefined;
    isRunning.set(false);
    isDone.set(true);
  };

  const run = () => {
    iterRef = saga(...args);
    iterRef
      .then(result.set)
      .catch(throwIfNotAborted)
      .finally(finish);
    isDone.set(false);
    isCancelled.set(false);
    isRunning.set(true);
  };

  const cancel = () => {
    finish();
    isCancelled.set(true);
  };

  const toggle = () => {
    iterRef ? cancel() : run();
  };

  onMount(() => {
    if (config.runOnMount ?? true) run();

    return () => {
      if (config.cancelOnUnmount ?? true) cancel();
    };
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
