import {defaultChannel, EventEmitter} from '@promise-saga/core';
import {
  put,
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
    channel,
  },

  lower: {
    put,
    take,
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
