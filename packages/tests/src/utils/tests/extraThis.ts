import {afterAll, afterEach, describe, expect, test, vi} from 'vitest';
import {Saga} from '@promise-saga/core';
import {TestsConfig} from '../types';
import {_testConsole} from '../testConsole';
import {_delay, _end} from '..';

export const runTests = ({createSaga}: TestsConfig) => describe('extra this', () => {
  afterEach(vi.clearAllMocks);
  afterAll(vi.resetAllMocks);

  test('default', async () => {
    type Model = {
      prop: number,
      saga?: Saga<void, [], Model>,
    };

    const model: Model = {
      prop: 789,
    };

    model.saga = createSaga(async function () {
      expect(this.prop).toEqual(model.prop);
    }, {this: model});

    const {saga} = model;
    await saga()
    await _delay(100);
    expect(_testConsole.throw).not.toHaveBeenCalled();
    _end(0);
  });
});
