import {Middleware, MiddlewareAPI} from '@reduxjs/toolkit';
import {defaultChannel} from '@promise-saga/core';
import {isAction} from './helpers';

let store: MiddlewareAPI;

export const getStore = () => store;

export const createSagaMiddleware = (
  channel = defaultChannel,
): Middleware => (api) => {
  store = api;
  return (next) => (action) => {
    if (isAction(action)) channel.emit(action.type, action);
    next(action);
  };
}
