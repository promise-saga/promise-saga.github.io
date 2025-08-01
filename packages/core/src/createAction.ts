import {defaultChannel} from './defaults/channel';
import {FnActionInput, FnAction} from './types';

export const createAction = <T = void, P extends any[] = any[]>(
  fn?: FnActionInput<T, P>,
  channel = defaultChannel,
): FnAction<T, P> => {
  const type = Symbol();
  return Object.assign((...args: P) => {
    let result;
    if (fn) result = fn.apply(this, args);
    channel.emit(type, {type, result, args});
    return result as T;
  }, {type});
};

export const createAsyncAction = <T = void, P extends any[] = any[]>(
  fn?: FnActionInput<T, P>,
  channel = defaultChannel,
): FnAction<Promise<T>, P> => {
  const type = Symbol();
  return Object.assign(async (...args: P) => {
    let result;
    if (fn) result = await fn.apply(this, args);
    channel.emit(type, {type, result, args});
    return result as T;
  }, {type});
};
