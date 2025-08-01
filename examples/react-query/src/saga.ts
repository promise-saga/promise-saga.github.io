import {createCreateSaga} from '@promise-saga/core';
import {createPlugin} from '@promise-saga/plugin-react-query';
import queryClient from './queryClient';

const plugin = createPlugin({queryClient});

export const createSaga = createCreateSaga({plugin});
