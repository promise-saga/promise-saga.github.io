import {PiniaPlugin} from 'pinia';
import {createAction} from '@promise-saga/core';

export const piniaPlugin: PiniaPlugin = ({options}) => (
  Object.entries(options.actions)
    .reduce<Record<string, unknown>>((res, [actionName, action]) => {
      res[actionName] = createAction(action);
      return res;
    }, {})
);
