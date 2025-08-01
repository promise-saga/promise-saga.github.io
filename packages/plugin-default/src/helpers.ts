import {ArrayOr, FnAction, toArray} from '@promise-saga/core';

export const getActionType = <T = any, P extends any[] = any[]>(
  action: FnAction<T, P> | string,
) => (
  typeof action === 'string' ? action : action.type
);

export const getActionTypes = <T = any, P extends any[] = any[]>(
  action: ArrayOr<FnAction<T, P> | string> | '*',
) => (
  typeof action === 'string' ? action : toArray(action).map(getActionType)
);
