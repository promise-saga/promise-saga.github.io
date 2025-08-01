import {
  EventEmitter,
  SagaHigherEffectsScope,
  SagaLowerEffects,
  SagaLowerEffectsScope,
} from '@promise-saga/core';
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

export type SagaDefaultScope = {
  channel: EventEmitter,
};
export type SagaDefaultLowerEffects = {
  take: typeof take,
  put: typeof put,
  dispatch: typeof put,
};
export type SagaDefaultHigherEffects = {
  takeEvery: typeof takeEvery,
  takeLatest: typeof takeLatest,
  takeLeading: typeof takeLeading,
  debounce: typeof debounce,
  throttle: typeof throttle,
};

export type SagaDefaultLowerEffectsScope =
  & SagaDefaultScope
  & SagaLowerEffectsScope
  & SagaLowerEffects;
export type SagaDefaultHigherEffectsScope =
  & SagaHigherEffectsScope
  & SagaDefaultLowerEffectsScope
  & SagaDefaultLowerEffects;
