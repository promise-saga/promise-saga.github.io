import {useCallback, useEffect, useRef, useState} from 'react';
import {AnyRecord, SagaIterator, throwIfNotAborted} from '@promise-saga/core';
import {UseSagaConfig, UseSagaOrWithConfig, UseSagaReturn, UseSagaWithConfig} from './types';
import {useConstructor} from './useConstructor';

export const withConfig = <T, P extends any[], ET extends AnyRecord>(
  saga: UseSagaOrWithConfig<T, P, ET>,
): UseSagaWithConfig<T, P, ET> => (
  typeof saga === 'object' ? saga : {saga}
);

export const useSaga = <
  T = void,
  P extends any[] = any[],
  ET extends AnyRecord = AnyRecord,
>(sagaOrConfig: UseSagaOrWithConfig<T, P, ET>, ...args: P): UseSagaReturn<T> => {
  const {saga, config = {}} = withConfig(sagaOrConfig);
  const iterRef = useRef<SagaIterator<T>>(undefined);
  const [result, setResult] = useState<T>();
  const [isRunning, setRunning] = useState(false);
  const [isDone, setDone] = useState(false);
  const [isCancelled, setCancelled] = useState(false);

  const finish = useCallback(() => {
    iterRef.current?.cancel();
    iterRef.current = undefined;
    setRunning(false);
    setDone(true);
  }, [iterRef]);

  const run = useCallback(() => {
    iterRef.current = saga(...args);
    iterRef.current
      .then(setResult)
      .catch(throwIfNotAborted)
      .finally(finish);
    setDone(false);
    setCancelled(false);
    setRunning(true);
  }, [finish, iterRef, saga, args]);

  const cancel = useCallback(() => {
    finish();
    setCancelled(true);
  }, [finish]);

  const toggle = useCallback(() => {
    iterRef.current ? cancel() : run();
  }, [cancel, iterRef, run]);

  useConstructor(() => {
    if (config.runOnMount ?? true) run();
  });

  useEffect(() => () => {
    if (config.cancelOnUnmount ?? true) cancel();
  }, [cancel, config.cancelOnUnmount]);

  return {
    result,
    isDone,
    isRunning,
    isCancelled,
    run,
    cancel,
    toggle,
  };
};

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
