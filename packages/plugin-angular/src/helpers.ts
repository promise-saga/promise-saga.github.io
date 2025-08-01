import {inject} from '@angular/core';
import {Class} from './types';

export const lazyOnce = <T>(fn: () => T) => {
  let result: T;
  return () => {
    if (!result) result = fn();
    return result;
  };
};

export const lazyInject = <T>(service: Class) => (
  lazyOnce<T>(() => inject(service))
);
