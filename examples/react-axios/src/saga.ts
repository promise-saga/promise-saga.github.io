import {createCreateSaga} from '@promise-saga/core';
import {plugin} from '@promise-saga/plugin-axios';

export const createSaga = createCreateSaga({plugin});
