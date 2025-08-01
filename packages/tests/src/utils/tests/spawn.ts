import {afterAll, afterEach, beforeAll, describe, expect, test, vi} from 'vitest';
import {_sagaListeners} from '@promise-saga/core';
import {TestsConfig} from '../types';
import {_testConsole} from '../testConsole';
import {_, _delay, _end, _never, _start, _throw} from '..';

export const runTests = ({createSaga, canTake}: TestsConfig) => describe('spawn', () => {
  afterEach(vi.clearAllMocks);

  beforeAll(() => {
    _sagaListeners.maxListenersCount = 0;
  });

  afterAll(() => {
    vi.resetAllMocks();
    console.log(_sagaListeners.maxListenersCount); // = 7
  });

  test('simple', async () => {
    const sagaA = createSaga(async function () {
      try {
        _(1);
        this.spawn(sagaB);
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
    await _start(sagaA);
    await _delay(100);
    expect(_testConsole.throw).not.toHaveBeenCalled();
    _end(10);
  });

  test('throw error from the inside', async () => {
    const sagaA = createSaga(async function () {
      try {
        _(1);
        this.spawn(sagaB);
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
    await _start(sagaA);
    await _delay(100);
    expect(_testConsole.throw).toHaveBeenCalledTimes(1);
    _end(9);
  });

  describe('canceling', () => {
    test('simple', async () => {
      const sagaA = createSaga(async function () {
        try {
          _(1);
          const task = this.spawn(sagaB);
          _(3);
          await this.delay(10);
          _(4);
          this.cancel(task);
          _(5);
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
        } finally {
          _never();
        }
      });
      await _start(sagaA);
      await _delay(100);
      expect(_testConsole.throw).not.toHaveBeenCalled();
      _end(7);
    });

    test('inner finally, delay cancelled', async () => {
      const sagaA = createSaga(async function () {
        try {
          _(1);
          const task = this.spawn(sagaB);
          _(3);
          await this.delay(30);
          _(4);
          this.cancel(task);
          _(5);
        } finally {
          expect(this.cancelled()).toEqual(false);
          _(6);
        }
      });
      const sagaB = createSaga(async function () {
        try {
          _(2);
          await this.delay(70);
          _never();
        } finally {
          expect(this.cancelled()).toEqual(true);
          _(7);
        }
      });
      await _start(sagaA);
      await _delay(100);
      expect(_testConsole.throw).not.toHaveBeenCalled();
      _end(7);
    });

    if (canTake) {
      test('inner finally, take cancelled', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            const task = this.spawn(sagaB);
            _(3);
            await this.delay(25);
            _(4);
            this.cancel(task);
            _(5);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.take('unknown action' as any);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(7);
          }
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(7);
      });

      test('inner finally, race with take cancelled', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            const task = this.spawn(sagaB);
            _(3);
            await this.delay(25);
            _(4);
            this.cancel(task);
            _(5);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.race([
              this.take('unknown action' as any),
            ]);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(7);
          }
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(7);
      });

      test('inner finally, all with take cancelled', async () => {
        const sagaA = createSaga(async function () {
          try {
            _(1);
            const task = this.spawn(sagaB);
            _(3);
            await this.delay(25);
            _(4);
            this.cancel(task);
            _(5);
          } finally {
            expect(this.cancelled()).toEqual(false);
            _(6);
          }
        });
        const sagaB = createSaga(async function () {
          try {
            _(2);
            await this.all([
              this.take('unknown action' as any),
            ]);
            _never();
          } finally {
            expect(this.cancelled()).toEqual(true);
            _(7);
          }
        });
        await _start(sagaA);
        await _delay(100);
        expect(_testConsole.throw).not.toHaveBeenCalled();
        _end(7);
      });
    }
  });

  describe('canceling parent', () => {
    test('simple', async () => {
      const sagaA = createSaga(async function () {
        try {
          _(1);
          const task = this.spawn(sagaB);
          _(3);
          await this.delay(30);
          _(6);
          this.cancel(task);
          _(7);
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
        } finally {
          expect(this.cancelled()).toEqual(true);
          _(9);
        }
      });
      await _start(sagaA);
      await _delay(100);
      expect(_testConsole.throw).not.toHaveBeenCalled();
      _end(10);
    });

    test('2 levels', async () => {
      const sagaA = createSaga(async function () {
        try {
          _(1);
          const task = this.spawn(sagaB);
          _(3);
          await this.delay(30);
          _(8);
          this.cancel(task);
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
          _(4);
          this.spawn(sagaC);
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
          _(11);
        } finally {
          expect(this.cancelled()).toEqual(false);
          _(12);
        }
      });
      await _start(sagaA);
      await _delay(100);
      expect(_testConsole.throw).not.toHaveBeenCalled();
      _end(12);
    });
  });
});
