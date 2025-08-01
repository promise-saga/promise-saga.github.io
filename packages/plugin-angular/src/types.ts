import {WritableSignal} from '@angular/core';
import {AnyRecord, Saga} from '@promise-saga/core';

export type Class = { new(...args: any[]): any; };

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
export type UseSagaReturn<T> = {
  result: WritableSignal<T | undefined>,
  isDone: WritableSignal<boolean>,
  isRunning: WritableSignal<boolean>,
  isCancelled: WritableSignal<boolean>,
  run: () => void,
  cancel: () => void,
  toggle: () => void,
};
