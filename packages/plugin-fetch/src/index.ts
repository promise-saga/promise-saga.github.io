import {SagaLowerEffectsScope} from '@promise-saga/core';

export const fetchFn: typeof fetch = async function(this: SagaLowerEffectsScope, url, params) {
  this.throwIfCancelled();
  const result = await fetch(url, {
    signal: this.abortController.signal,
    ...params,
  });
  this.throwIfCancelled();
  return result;
};

export const plugin = {
  main: {
    fetch: fetchFn,
  },
};
