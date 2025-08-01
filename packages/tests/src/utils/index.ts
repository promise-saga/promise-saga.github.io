import {expect} from 'vitest';
import {_sagaListeners, defaultTree, Saga} from '@promise-saga/core';
import {_testConsole} from './testConsole';

export const errNeverHappen = 'err! never happen';

export const _ = (n: number) => {
  _testConsole.log();
  expect(_testConsole.log).toHaveBeenCalledTimes(n);
};

export const _start = async (saga: Saga) => {
  expect(defaultTree.children.size).toBe(0);
  expect(_sagaListeners.listenersCount).toBe(0);
  await saga();
};

export const _end = (n: number, cb?: () => void) => {
  expect(_testConsole.log).not.toHaveBeenCalledWith(errNeverHappen);
  expect(_testConsole.log).toHaveBeenCalledTimes(n);
  expect(defaultTree.children.size).toBe(0);
  expect(_sagaListeners.listenersCount).toBe(0);
  cb?.();
};

export const _throw = (message: string) => {
  const err = Error(message);
  _testConsole.throw(err);
  throw err;
};

export const _never = () => {
  console.log(errNeverHappen);
  _testConsole.log(errNeverHappen);
  process.exit(1);
};

export const _delay = (ms: number) => (
  new Promise(resolve => setTimeout(resolve, ms))
);
