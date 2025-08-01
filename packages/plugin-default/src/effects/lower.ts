import {ArrayOr, FnAction, FnActionResult} from '@promise-saga/core';
import {SagaDefaultLowerEffectsScope} from '../types';
import {getActionTypes} from '../helpers';

export function put(
  this: SagaDefaultLowerEffectsScope,
  action: FnAction,
  value?: any,
) {
  this.throwIfCancelled();
  this.channel.emit(action.type, value);
  this.throwIfCancelled();
}

export async function take<T = any, P extends any[] = any[]>(
  this: SagaDefaultLowerEffectsScope,
  action: ArrayOr<FnAction<T, P> | string> | '*',
) {
  this.throwIfCancelled();
  const types = getActionTypes(action);
  let watcher: (action: FnActionResult<T, P>) => void;

  return this.cancellable<FnActionResult<T, P>>(new Promise((resolve) => {
    watcher = (result: FnActionResult<T, P>) => {
      this.throwIfCancelled();
      resolve(result);
    };
    this.channel.once(types, watcher);
  }), () => {
    this.channel.off(types, watcher);
  });
}
