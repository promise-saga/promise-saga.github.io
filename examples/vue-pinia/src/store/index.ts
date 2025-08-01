import {createPinia} from 'pinia';
import {piniaPlugin} from '@promise-saga/plugin-vue';

export default createPinia().use(piniaPlugin);
