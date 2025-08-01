import {Action, ActionCreatorWithPayload, PayloadAction, Selector} from '@reduxjs/toolkit';
import {ArrayOr} from '@promise-saga/core';
import {SagaReduxLowerEffectsScope} from '../types';
import {getActionTypes} from '../helpers';

export function put(
  this: SagaReduxLowerEffectsScope,
  action: Action,
) {
  this.throwIfCancelled();
  this.getStore().dispatch(action);
  this.throwIfCancelled();
}

export function select<S = any, T = any>(
  this: SagaReduxLowerEffectsScope,
  selector: Selector<S, T>,
  ...args: any[]
): T {
  this.throwIfCancelled();
  const result = selector(this.getStore().getState(), ...args);
  this.throwIfCancelled();
  return result;
}

export async function take<P = any, T extends string = string>(
  this: SagaReduxLowerEffectsScope,
  actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
) {
  this.throwIfCancelled();
  const types = getActionTypes(actionCreator);
  let watcher: (action: PayloadAction<P, T>) => void;

  return this.cancellable<PayloadAction<P, T>>(new Promise((resolve) => {
    watcher = (action) => {
      this.throwIfCancelled();
      resolve(action);
    };
    this.channel.once(types, watcher);
  }), () => {
    this.channel.off(types, watcher);
  });
}
