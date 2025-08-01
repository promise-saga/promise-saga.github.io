import {createSaga, createCreateSaga} from '@promise-saga/core';
import {plugin as pluginDefault} from '@promise-saga/plugin-default';
import {plugin as pluginRedux} from '@promise-saga/plugin-redux';
import {_runTests} from './utils/runTests';

_runTests({
  createSaga,
});

_runTests({
  createSaga: createCreateSaga({
    plugin: pluginDefault,
  }),
  canTake: true,
});

_runTests({
  createSaga: createCreateSaga({
    plugin: pluginRedux,
  }),
  canTake: true,
});
