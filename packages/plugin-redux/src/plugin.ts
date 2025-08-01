import {defaultChannel, EventEmitter} from '@promise-saga/core';
import {getStore} from './middleware';
import {
  put,
  select,
  take,
} from './effects/lower';
import {
  debounce,
  takeEvery,
  takeLatest,
  takeLeading,
  throttle,
} from './effects/higher';

export type PluginConfig = {
  channel?: EventEmitter,
};

export const createPlugin = (
  {
    channel = defaultChannel,
  }: PluginConfig = {}
) => ({
  main: {
    getStore,
    channel,
  },

  lower: {
    put,
    take,
    select,
    dispatch: put,
  },

  higher: {
    debounce,
    takeEvery,
    takeLatest,
    takeLeading,
    throttle,
  },
});

export const plugin = createPlugin();
