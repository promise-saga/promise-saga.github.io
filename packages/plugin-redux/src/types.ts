import {MiddlewareAPI} from '@reduxjs/toolkit';
import {
  EventEmitter,
  SagaHigherEffectsScope,
  SagaLowerEffects,
  SagaLowerEffectsScope,
} from '@promise-saga/core';
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

export type SagaReduxScope = {
  getStore(): MiddlewareAPI,
  channel: EventEmitter,
};
export type SagaReduxLowerEffects = {
  take: typeof take,
  put: typeof put,
  dispatch: typeof put,
  select: typeof select,
};
export type SagaReduxHigherEffects = {
  takeEvery: typeof takeEvery,
  takeLatest: typeof takeLatest,
  takeLeading: typeof takeLeading,
  debounce: typeof debounce,
  throttle: typeof throttle,
};

export type SagaReduxLowerEffectsScope =
  & SagaReduxScope
  & SagaLowerEffectsScope
  & SagaLowerEffects;
export type SagaReduxHigherEffectsScope =
  & SagaHigherEffectsScope
  & SagaReduxLowerEffectsScope
  & SagaReduxLowerEffects;
