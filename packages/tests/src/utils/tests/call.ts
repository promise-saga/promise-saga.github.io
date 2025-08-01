import {afterAll, afterEach, beforeAll, describe, expect, test, vi} from 'vitest';
import {_sagaListeners, isAbortError} from '@promise-saga/core';
import {TestsConfig} from '../types';
import {_testConsole} from '../testConsole';
import {_, _delay, _end, _never, _start, _throw} from '..';

export const runTests = ({createSaga, canTake}: TestsConfig) => describe('call', () => {
  afterEach(vi.clearAllMocks);

  beforeAll(() => {
    _sagaListeners.maxListenersCount = 0;
  });

  afterAll(() => {
    vi.resetAllMocks();
    console.log(_sagaListeners.maxListenersCount); // = 11
  });

  describe('without error', () => {
    describe('3 levels', () => {
      test('call, call', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          await this.call(sagaB);
          _(7);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(3);
          await this.call(sagaC);
          _(6);
        });
        const sagaC = createSaga(async function () {
          _(4);
          await this.delay(20);
          _(5);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(7);
      });

      test('call, fork', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          await this.call(sagaB);
          _(7);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(3);
          this.fork(sagaC);
          _(5);
        });
        const sagaC = createSaga(async function () {
          _(4);
          await this.delay(20);
          _(6);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(7);
      });

      test('fork, call', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          this.fork(sagaB);
          _(3);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(4);
          await this.call(sagaC);
          _(7);
        });
        const sagaC = createSaga(async function () {
          _(5);
          await this.delay(20);
          _(6);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(7);
      });

      test('fork, fork', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          this.fork(sagaB);
          _(3);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(4);
          this.fork(sagaC);
          _(6);
        });
        const sagaC = createSaga(async function () {
          _(5);
          await this.delay(20);
          _(7);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(7);
      });
    });

    describe('4 levels', () => {
      test('call, call, call', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          await this.call(sagaB);
          _(10);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(3);
          await this.call(sagaC);
          _(9);
        });
        const sagaC = createSaga(async function () {
          _(4);
          await this.delay(20);
          _(5);
          await this.call(sagaD);
          _(8);
        });
        const sagaD = createSaga(async function () {
          _(6);
          await this.delay(20);
          _(7);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(10);
      });

      test('call, fork, call', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          await this.call(sagaB);
          _(10);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(3);
          this.fork(sagaC);
          _(5);
        });
        const sagaC = createSaga(async function () {
          _(4);
          await this.delay(20);
          _(6);
          await this.call(sagaD);
          _(9);
        });
        const sagaD = createSaga(async function () {
          _(7);
          await this.delay(20);
          _(8);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(10);
      });

      test('call, call, fork', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          await this.call(sagaB);
          _(10);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(3);
          await this.call(sagaC);
          _(9);
        });
        const sagaC = createSaga(async function () {
          _(4);
          await this.delay(20);
          _(5);
          this.fork(sagaD);
          _(7);
        });
        const sagaD = createSaga(async function () {
          _(6);
          await this.delay(20);
          _(8);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(10);
      });

      test('call, fork, fork', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          await this.call(sagaB);
          _(10);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(3);
          this.fork(sagaC);
          _(5);
        });
        const sagaC = createSaga(async function () {
          _(4);
          await this.delay(20);
          _(6);
          this.fork(sagaD);
          _(8);
        });
        const sagaD = createSaga(async function () {
          _(7);
          await this.delay(20);
          _(9);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(10);
      });

      test('fork, call, call', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          this.fork(sagaB);
          _(3);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(4);
          await this.call(sagaC);
          _(10);
        });
        const sagaC = createSaga(async function () {
          _(5);
          await this.delay(20);
          _(6);
          await this.call(sagaD);
          _(9);
        });
        const sagaD = createSaga(async function () {
          _(7);
          await this.delay(20);
          _(8);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(10);
      });

      test('fork, fork, call', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          this.fork(sagaB);
          _(3);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(4);
          this.fork(sagaC);
          _(6);
        });
        const sagaC = createSaga(async function () {
          _(5);
          await this.delay(20);
          _(7);
          await this.call(sagaD);
          _(10);
        });
        const sagaD = createSaga(async function () {
          _(8);
          await this.delay(20);
          _(9);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(10);
      });

      test('fork, call, fork', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          this.fork(sagaB);
          _(3);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(4);
          await this.call(sagaC);
          _(10);
        });
        const sagaC = createSaga(async function () {
          _(5);
          await this.delay(20);
          _(6);
          this.fork(sagaD);
          _(8);
        });
        const sagaD = createSaga(async function () {
          _(7);
          await this.delay(20);
          _(9);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(10);
      });

      test('fork, fork, fork', async () => {
        const sagaA = createSaga(async function () {
          _(1);
          this.fork(sagaB);
          _(3);
        });
        const sagaB = createSaga(async function () {
          _(2);
          await this.delay(20);
          _(4);
          this.fork(sagaC);
          _(6);
        });
        const sagaC = createSaga(async function () {
          _(5);
          await this.delay(20);
          _(7);
          this.fork(sagaD);
          _(9);
        });
        const sagaD = createSaga(async function () {
          _(8);
          await this.delay(20);
          _(10);
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(10);
      });
    });
  });

  describe('with error', () => {
    describe('simple', () => {
      test('call, call, throw', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            await this.call(sagaB);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(3);
            await this.call(sagaC);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(7);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(4);
            await this.delay(20);
            _(5);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(8);
          }
        }
      });

      test('call, fork, throw', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            await this.call(sagaB);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(9);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(3);
            this.fork(sagaC);
            _(5);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(4);
            await this.delay(20);
            _(7);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(9);
          }
        }
      });

      test('fork, call, throw', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            this.fork(sagaB);
            _(3);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(4);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(5);
            await this.call(sagaC);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(9);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(6);
            await this.delay(20);
            _(7);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(9);
          }
        }
      });

      test('fork, fork, throw', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            this.fork(sagaB);
            _(3);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(4);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(5);
            this.fork(sagaC);
            _(7);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(6);
            await this.delay(20);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(9);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(9);
          }
        }
      });
    });

    describe('complex', () => {
      test('call, throw call', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            await this.call(sagaB);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(5);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(3);
            _throw('err');
            _never();
            await this.call(sagaC);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(4);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
          } finally {
            _never();
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(5);
          }
        }
      });

      test('call, call throw', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            await this.call(sagaB);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(9);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(3);
            await this.call(sagaC);
            _(7);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(4);
            await this.delay(20);
            _(5);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(9);
          }
        }
      });

      test('call, throw fork', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            await this.call(sagaB);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(5);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(3);
            _throw('err');
            _never();
            this.fork(sagaC);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(4);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
          } finally {
            _never();
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(5);
          }
        }
      });

      test('call, fork throw', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            await this.call(sagaB);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(7);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(3);
            this.fork(sagaC);
            _(5);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(4);
            await this.delay(20);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(8);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(8);
          }
        }
      });

      test('fork, throw call', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            this.fork(sagaB);
            _(3);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(4);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(5);
            _throw('err');
            _never();
            await this.call(sagaC);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
          } finally {
            _never();
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(6);
          }
        }
      });

      test('fork, call throw', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            this.fork(sagaB);
            _(3);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(4);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(5);
            await this.call(sagaC);
            _(9);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(10);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(6);
            await this.delay(20);
            _(7);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(10);
          }
        }
      });

      test('fork, throw fork', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            this.fork(sagaB);
            _(3);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(4);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(5);
            _throw('err');
            _never();
            this.fork(sagaC);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
          } finally {
            _never();
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(6);
          }
        }
      });

      test('fork, fork throw', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            this.fork(sagaB);
            _(3);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(4);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(5);
            this.fork(sagaC);
            _(7);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(6);
            await this.delay(20);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(9);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(9);
          }
        }
      });

      test('call throw, call', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            await this.call(sagaB);
            _(9);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(10);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(3);
            await this.call(sagaC);
            _(7);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(4);
            await this.delay(20);
            _(5);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(10);
          }
        }
      });

      test('throw call, call', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            _throw('err');
            _never();
            await this.call(sagaB);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(2);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
            await this.call(sagaC);
            _never();
          } finally {
            _never();
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
          } finally {
            _never();
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(2);
          }
        }
      });

      test('call throw, fork', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            await this.call(sagaB);
            _(9);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(10);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(3);
            this.fork(sagaC);
            _(5);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(4);
            await this.delay(20);
            _(7);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(10);
          }
        }
      });

      test('throw call, fork', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            _throw('err');
            _never();
            await this.call(sagaB);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(2);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
            this.fork(sagaC);
            _never();
          } finally {
            _never();
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
          } finally {
            _never();
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(2);
          }
        }
      });

      test('fork throw, call', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            this.fork(sagaB);
            _(3);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(4);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _never();
            await this.call(sagaC);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(5);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
          } finally {
            _never();
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(5);
          }
        }
      });

      test('throw fork, call', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            _throw('err');
            _never();
            this.fork(sagaB);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(2);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
            await this.call(sagaC);
            _never();
          } finally {
            _never();
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
          } finally {
            _never();
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(2);
          }
        }
      });

      test('fork throw, fork', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            this.fork(sagaB);
            _(3);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(4);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _never();
            this.fork(sagaC);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(5);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
          } finally {
            _never();
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(5);
          }
        }
      });

      test('throw fork, fork', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            _throw('err');
            _never();
            this.fork(sagaB);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(2);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
            this.fork(sagaC);
            _never();
          } finally {
            _never();
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _never();
            await this.delay(20);
            _never();
          } finally {
            _never();
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(2);
          }
        }
      });
    });

    describe('with delay', () => {
      test('call delay throw, call', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            await this.call(sagaB);
            _(9);
            await this.delay(30);
            _(10);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(11);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(3);
            await this.call(sagaC);
            _(7);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(4);
            await this.delay(20);
            _(5);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(11);
          }
        }
      });

      test('call delay throw, fork', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            await this.call(sagaB);
            _(9);
            await this.delay(30);
            _(10);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(11);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(3);
            this.fork(sagaC);
            _(5);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(4);
            await this.delay(20);
            _(7);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(11);
          }
        }
      });

      test('fork delay throw, call', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            this.fork(sagaB);
            _(3);
            await this.delay(30);
            _(6);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(7);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(4);
            await this.call(sagaC);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(8);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(5);
            await this.delay(20);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(9);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(9);
          }
        }
      });

      test('fork delay throw, fork', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            this.fork(sagaB);
            _(3);
            await this.delay(30);
            _(8);
            _throw('err');
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(9);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(4);
            this.fork(sagaC);
            _(6);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(7);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(5);
            await this.delay(20);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(10);
          }
        });
        try {
          await _start(sagaA);
        } catch (err) {
          await _delay(100);
          if (err instanceof Error) {
            expect(err.message).toEqual('err');
            expect(_testConsole.throw).toHaveBeenCalledTimes(1);
            _end(10);
          }
        }
      });
    });

    describe('with catch', () => {
      describe('call call', () => {
        test('call, call, catch throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              await this.call(sagaB);
              _(10);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(11);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(3);
              await this.call(sagaC);
              _(8);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(9);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(4);
              await this.delay(20);
              _(5);
              _throw('err');
              _never();
            } catch (err) {
              _(6);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(7);
            }
          });
          await _start(sagaA);
          await _delay(100);
          expect(_testConsole.throw).toHaveBeenCalledTimes(1);
          _end(11);
        });

        test('call, catch call, throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              await this.call(sagaB);
              _(9);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(10);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(3);
              await this.call(sagaC);
              _never();
            } catch (err) {
              _(7);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(8);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(4);
              await this.delay(20);
              _(5);
              _throw('err');
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(6);
            }
          });
          await _start(sagaA);
          await _delay(100);
          expect(_testConsole.throw).toHaveBeenCalledTimes(1);
          _end(10);
        });

        test('catch call, call, throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              await this.call(sagaB);
              _never();
            } catch (err) {
              _(8);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(9);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(3);
              await this.call(sagaC);
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(7);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(4);
              await this.delay(20);
              _(5);
              _throw('err');
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(6);
            }
          });
          await _start(sagaA);
          await _delay(100);
          expect(_testConsole.throw).toHaveBeenCalledTimes(1);
          _end(9);
        });
      });

      describe('call fork', () => {
        test('call, fork, catch throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              await this.call(sagaB);
              _(10);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(11);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(3);
              this.fork(sagaC);
              _(5);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(6);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(4);
              await this.delay(20);
              _(7);
              _throw('err');
              _never();
            } catch (err) {
              _(8);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(9);
            }
          });
          await _start(sagaA);
          await _delay(100);
          expect(_testConsole.throw).toHaveBeenCalledTimes(1);
          _end(11);
        });

        test('call, catch fork, throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              await this.call(sagaB);
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(9);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(3);
              this.fork(sagaC);
              _(5);
            } catch (err) {
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(6);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(4);
              await this.delay(20);
              _(7);
              _throw('err');
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(8);
            }
          });
          try {
            await _start(sagaA);
          } catch (err) {
            await _delay(100);
            if (err instanceof Error) {
              expect(err.message).toEqual('err');
              expect(_testConsole.throw).toHaveBeenCalledTimes(1);
              _end(9);
            }
          }
        });

        test('catch call, fork, throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              await this.call(sagaB);
              _never();
            } catch (err) {
              _(9);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(10);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(3);
              this.fork(sagaC);
              _(5);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(6);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(4);
              await this.delay(20);
              _(7);
              _throw('err');
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(8);
            }
          });
          await _start(sagaA);
          await _delay(100);
          expect(_testConsole.throw).toHaveBeenCalledTimes(1);
          _end(10);
        });
      });

      describe('fork call', () => {
        test('fork, call, catch throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              this.fork(sagaB);
              _(3);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(4);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(5);
              await this.call(sagaC);
              _(10);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(11);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(6);
              await this.delay(20);
              _(7);
              _throw('err');
              _never();
            } catch (err) {
              _(8);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(9);
            }
          });
          await _start(sagaA);
          await _delay(100);
          expect(_testConsole.throw).toHaveBeenCalledTimes(1);
          _end(11);
        });

        test('fork, catch call, throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              this.fork(sagaB);
              _(3);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(4);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(5);
              await this.call(sagaC);
              _never();
            } catch (err) {
              _(9);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(10);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(6);
              await this.delay(20);
              _(7);
              _throw('err');
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(8);
            }
          });
          await _start(sagaA);
          await _delay(100);
          expect(_testConsole.throw).toHaveBeenCalledTimes(1);
          _end(10);
        });

        test('catch fork, call, throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              this.fork(sagaB);
              _(3);
            } catch (err) {
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(4);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(5);
              await this.call(sagaC);
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(9);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(6);
              await this.delay(20);
              _(7);
              _throw('err');
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(8);
            }
          });
          try {
            await _start(sagaA);
          } catch (err) {
            await _delay(100);
            if (err instanceof Error) {
              expect(err.message).toEqual('err');
              expect(_testConsole.throw).toHaveBeenCalledTimes(1);
              _end(9);
            }
          }
        });
      });

      describe('fork fork', () => {
        test('fork, fork, catch throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              this.fork(sagaB);
              _(3);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(4);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(5);
              this.fork(sagaC);
              _(7);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(8);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(6);
              await this.delay(20);
              _throw('err');
              _never();
            } catch (err) {
              _(9)
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(10);
            }
          });
          await _start(sagaA);
          await _delay(100);
          expect(_testConsole.throw).toHaveBeenCalledTimes(1);
          _end(10);
        });

        test('fork, catch fork, throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              this.fork(sagaB);
              _(3);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(4);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(5);
              this.fork(sagaC);
              _(7);
            } catch (err) {
              _never()
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(8);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(6);
              await this.delay(20);
              _throw('err');
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(9);
            }
          });
          try {
            await _start(sagaA);
          } catch (err) {
            await _delay(100);
            if (err instanceof Error) {
              expect(err.message).toEqual('err');
              expect(_testConsole.throw).toHaveBeenCalledTimes(1);
              _end(9);
            }
          }
        });

        test('catch fork, fork, throw', async () => {
          const sagaA = createSaga(async function () {
            try {
              _(1);
              this.fork(sagaB);
              _(3);
            } catch (err) {
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(4);
            }
          });
          const sagaB = createSaga(async function () {
            try {
              _(2);
              await this.delay(20);
              _(5);
              this.fork(sagaC);
              _(7);
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(8);
            }
          });
          const sagaC = createSaga(async function () {
            try {
              _(6);
              await this.delay(20);
              _throw('err');
              _never();
            } finally {
              expect(this.cancelled()).toEqual(false);
              _(9);
            }
          });
          try {
            await _start(sagaA);
          } catch (err) {
            await _delay(100);
            if (err instanceof Error) {
              expect(err.message).toEqual('err');
              expect(_testConsole.throw).toHaveBeenCalledTimes(1);
              _end(9);
            }
          }
        });
      });
    });
  });

  describe('canceling', () => {
    test('call catch, fork cancel', async () => {
      const sagaA = createSaga(async function () {
        try {
          _(1);
          await this.call(sagaB);
          _(9);
        } catch (err) {
          _never();
        } finally {
          expect(this.cancelled()).toEqual(false);
          _(10);
        }
      });
      const sagaB = createSaga(async function () {
        try {
          _(2);
          const task = this.fork(sagaC);
          _(4);
          await this.delay(20);
          _(5);
          this.cancel(task);
          _(6);
        } catch (err) {
          _never();
        } finally {
          expect(this.cancelled()).toEqual(false);
          _(7);
        }
      });
      const sagaC = createSaga(async function () {
        try {
          _(3);
          await this.delay(50);
          _never();
        } catch (err) {
          if (!isAbortError(err)) {
            _never();
          }
        } finally {
          expect(this.cancelled()).toEqual(true);
          _(8);
        }
      });
      await _start(sagaA);
      await _delay(100);
      expect(_testConsole.throw).not.toHaveBeenCalled();
      _end(10);
    });

    test('fork delay10 cancel catch, call, delay', async () => {
      const sagaA = createSaga(async function () {
        try {
          _(1);
          const task = this.fork(sagaB);
          _(3);
          await this.delay(10);
          _(4);
          this.cancel(task);
          _(5);
        } catch (err) {
          _never();
        } finally {
          expect(this.cancelled()).toEqual(false);
          _(6);
        }
      });
      const sagaB = createSaga(async function () {
        try {
          _(2);
          await this.delay(20);
          _never();
          await this.call(sagaC);
          _never();
        } catch (err) {
          if (!isAbortError(err)) {
            _never();
          }
        } finally {
          expect(this.cancelled()).toEqual(true);
          _(7);
        }
      });
      const sagaC = createSaga(async function () {
        try {
          _never();
          await this.delay(20);
          _never();
        } catch (err) {
          _never();
        } finally {
          _never();
        }
      });
      await _start(sagaA);
      await _delay(100);
      expect(_testConsole.throw).not.toHaveBeenCalled();
      _end(7);
    });

    test('fork cancel catch, call, delay', async () => {
      const sagaA = createSaga(async function () {
        try {
          _(1);
          const task = this.fork(sagaB);
          _(3);
          await this.delay(30);
          _(6);
          this.cancel(task);
          _(7);
        } catch (err) {
          _never();
        } finally {
          expect(this.cancelled()).toEqual(false);
          _(8);
        }
      });
      const sagaB = createSaga(async function () {
        try {
          _(2);
          await this.delay(20);
          _(4);
          await this.call(sagaC);
          _never();
        } catch (err) {
          if (!isAbortError(err)) {
            _never();
          }
        } finally {
          expect(this.cancelled()).toEqual(true);
          _(9);
        }
      });
      const sagaC = createSaga(async function () {
        try {
          _(5);
          await this.delay(20);
          _never();
        } catch (err) {
          if (!isAbortError(err)) {
            _never();
          }
        } finally {
          expect(this.cancelled()).toEqual(true);
          _(10);
        }
      });
      await _start(sagaA);
      await _delay(100);
      expect(_testConsole.throw).not.toHaveBeenCalled();
      _end(10);
    });

    if (canTake) {
      test('fork cancel catch, call, take', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            const task = this.fork(sagaB);
            _(3);
            await this.delay(30);
            _(6);
            this.cancel(task);
            _(7);
          } catch (err) {
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(4);
            await this.call(sagaC);
            _never();
          } catch (err) {
            if (!isAbortError(err)) {
              _never();
            }
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(9);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(5);
            await this.take('never happen' as any);
            _never();
          } catch (err) {
            if (!isAbortError(err)) {
              _never();
            }
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(10);
          }
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(10);
      });

      test('fork cancel catch, call, race take', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            const task = this.fork(sagaB);
            _(3);
            await this.delay(30);
            _(6);
            this.cancel(task);
            _(7);
          } catch (err) {
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(4);
            await this.call(sagaC);
            _never();
          } catch (err) {
            if (!isAbortError(err)) {
              _never();
            }
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(9);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(5);
            await this.race([
              this.take('-- never happen' as any),
            ]);
            _never();
          } catch (err) {
            if (!isAbortError(err)) {
              _never();
            }
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(10);
          }
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(10);
      });

      test('fork cancel catch, call, all take', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            const task = this.fork(sagaB);
            _(3);
            await this.delay(30);
            _(6);
            this.cancel(task);
            _(7);
          } catch (err) {
            _never();
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(8);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.delay(20);
            _(4);
            await this.call(sagaC);
            _never();
          } catch (err) {
            if (!isAbortError(err)) {
              _never();
            }
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(9);
          }
        });
        const sagaC = createSaga(async function () {
          try {
            _(5);
            await this.all([
              this.take('-- never happen' as any),
            ]);
            _never();
          } catch (err) {
            if (!isAbortError(err)) {
              _never();
            }
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(10);
          }
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(10);
      });
    }

    test('fork delay10 cancel catch, fork, delay', async () => {
      const sagaA = createSaga(async function () {
        try {
          _(1);
          const task = this.fork(sagaB);
          _(3);
          await this.delay(10);
          _(4);
          this.cancel(task);
          _(5);
        } catch (err) {
          _never();
        } finally {
          expect(this.cancelled()).toEqual(false);
          _(6);
        }
      });
      const sagaB = createSaga(async function () {
        try {
          _(2);
          await this.delay(20);
          _never();
          this.fork(sagaC);
          _never();
        } catch (err) {
          if (!isAbortError(err)) {
            _never();
          }
        } finally {
          expect(this.cancelled()).toEqual(true);
          _(7);
        }
      });
      const sagaC = createSaga(async function () {
        try {
          _never();
          await this.delay(20);
          _never();
        } catch (err) {
          _never();
        } finally {
          _never();
        }
      });
      await _start(sagaA);
      await _delay(100);
      expect(_testConsole.throw).not.toHaveBeenCalled();
      _end(7);
    });

    test('fork cancel catch, fork, delay', async () => {
      const sagaA = createSaga(async function () {
        try {
          _(1);
          const task = this.fork(sagaB);
          _(3);
          await this.delay(30);
          _(8);
          this.cancel(task);
          _(9);
        } catch (err) {
          _never();
        } finally {
          expect(this.cancelled()).toEqual(false);
          _(10);
        }
      });
      const sagaB = createSaga(async function () {
        try {
          _(2);
          await this.delay(20);
          _(4);
          this.fork(sagaC);
          _(6);
        } catch (err) {
          if (!isAbortError(err)) {
            _never();
          }
        } finally {
          expect(this.cancelled()).toEqual(false);
          _(7);
        }
      });
      const sagaC = createSaga(async function () {
        try {
          _(5);
          await this.delay(20);
          _never();
        } catch (err) {
          if (!isAbortError(err)) {
            _never();
          }
        } finally {
          expect(this.cancelled()).toEqual(true);
          _(11);
        }
      });
      await _start(sagaA);
      await _delay(100);
      expect(_testConsole.throw).not.toHaveBeenCalled();
      _end(11);
    });

    test('fork cancel catch, fork delay, delay', async () => {
      const sagaA = createSaga(async function () {
        try {
          _(1);
          const task = this.fork(sagaB);
          _(3);
          await this.delay(30);
          _(7);
          this.cancel(task);
          _(8);
        } catch (err) {
          _never();
        } finally {
          expect(this.cancelled()).toEqual(false);
          _(9);
        }
      });
      const sagaB = createSaga(async function () {
        try {
          _(2);
          await this.delay(20);
          _(4);
          this.fork(sagaC);
          _(6);
          await this.delay(20);
          _never();
        } catch (err) {
          if (!isAbortError(err)) {
            _never();
          }
        } finally {
          expect(this.cancelled()).toEqual(true);
          _(10);
        }
      });
      const sagaC = createSaga(async function () {
        try {
          _(5);
          await this.delay(20);
          _never();
        } catch (err) {
          if (!isAbortError(err)) {
            _never();
          }
        } finally {
          expect(this.cancelled()).toEqual(true);
          _(11);
        }
      });
      await _start(sagaA);
      await _delay(100);
      expect(_testConsole.throw).not.toHaveBeenCalled();
      _end(11);
    });
  });

  describe('canceling current', () => {
    test('fork cancel catch', async () => {
      const sagaA = createSaga(async function () {
        try {
          _(1);
          this.fork(sagaB);
          _(3);
          await this.delay(20);
          _(4);
          this.cancel();
          _never();
        } catch (err) {
          if (!isAbortError(err)) {
            _never();
          }
        } finally {
          expect(this.cancelled()).toEqual(false);
          _(6);
        }
      });
      const sagaB = createSaga(async function () {
        try {
          _(2);
          await this.delay(50);
          _never();
        } catch (err) {
          if (!isAbortError(err)) {
            _never();
          }
        } finally {
          expect(this.cancelled()).toEqual(true);
          _(5);
        }
      });
      try {
        await _start(sagaA);
      } catch (err) {
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(6);
      }
    });
  });
});
