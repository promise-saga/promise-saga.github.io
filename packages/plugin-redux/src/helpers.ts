import {Action, ActionCreatorWithPayload} from '@reduxjs/toolkit';
import {ArrayOr} from '@promise-saga/core';

export const getActionType = <P = any, T extends string = string>(
  action: ActionCreatorWithPayload<P,T> | string,
) => (
  typeof action === 'string' ? action : action.type
);

export const getActionTypes = <P = any, T extends string = string>(
  actionCreator: ArrayOr<ActionCreatorWithPayload<P, T>> | '*',
) => {
  if (actionCreator === '*') return actionCreator;
  if (!Array.isArray(actionCreator)) return getActionType(actionCreator);
  return actionCreator.map(getActionType);
};

export const isAction = (
  action: unknown,
): action is Action => (
  action instanceof Object && 'type' in action
);
