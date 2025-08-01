import {createCreateSaga} from '@promise-saga/core';
import {plugin} from '@promise-saga/plugin-fetch';

export const createSaga = createCreateSaga({plugin});
