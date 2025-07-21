# Testing

Promise Saga does not have any special testing suite, though you may find it useful to go for [asynchronous testing](https://jestjs.io/docs/asynchronous) in Jest or similar testing libraries.

Create a `testConsole` mock that can be extended for your needs:

```ts
export const testConsole = {
    log: jest.fn<void, any[]>(),
    throw: jest.fn<void, [Error]>(),
};
```

Write a test, for example: default `call` effect test on [GitHub](https://github.com/promise-saga/promise-saga.github.io/blob/main/packages/tests/src/utils/tests/call.ts#L7).
```ts
/* eslint-disable jest/no-conditional-expect */
import {createSaga} from './utils/saga/redux';
import {testConsole} from './utils/testConsole';

describe('call', () => {
    test('default', (finishTest) => {
        // create main saga
        const mainSaga = createSaga(async function() {
            // call `testConsole` methods
            testConsole.log('start main');
            expect(testConsole.log).toHaveBeenCalledTimes(1);
            expect(testConsole.log).toHaveBeenCalledWith('start main');

            await this.call(logSaga, 'test879');

            // expect `testConsole` to be called regularly
            testConsole.log('finish main');
            expect(testConsole.log).toHaveBeenCalledTimes(3);
            expect(testConsole.log).toHaveBeenCalledWith('finish main');
        });

        // create child saga
        const logSaga = createSaga(async function(text: string) {
            testConsole.log('log:', text);
            expect(testConsole.log).toHaveBeenCalledTimes(2);
            expect(testConsole.log).toHaveBeenCalledWith('log:', text);
        });

        mainSaga().then(() => {
            setTimeout(() => {
                expect(testConsole.log).toHaveBeenCalledTimes(3);
                expect(testConsole.throw).not.toHaveBeenCalled();
                finishTest();
            }, 100); // timeout to listen for `testConsole` methods calls
        });
    });
    
    // ...
});
```

This is the way to test actual sagas logic.
