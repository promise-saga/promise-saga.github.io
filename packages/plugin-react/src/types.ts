import {Saga, AnyRecord} from '@promise-saga/core';

export type UseSagaConfig = {
  runOnMount?: boolean,
  cancelOnUnmount?: boolean,
};
export type UseSagaWithConfig<T, P extends any[], ET extends AnyRecord> = {
  saga: Saga<T, P, ET>,
  config?: UseSagaConfig,
};
export type UseSagaOrWithConfig<T, P extends any[], ET extends AnyRecord> =
  | Saga<T, P, ET>
  | UseSagaWithConfig<T, P, ET>;
export type UseSagaReturn<T = any> = {
  result?: T,
  isDone: boolean,
  isRunning: boolean,
  isCancelled: boolean,
  run: () => void,
  cancel: () => void,
  toggle: () => void,
};
