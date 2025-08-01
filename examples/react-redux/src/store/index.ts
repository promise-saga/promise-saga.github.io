import {configureStore} from '@reduxjs/toolkit';
import {createSagaMiddleware} from '@promise-saga/plugin-redux';
import Todos from '../models/Todos';

export default configureStore({
  reducer: {
    todos: Todos.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createSagaMiddleware()),
});
