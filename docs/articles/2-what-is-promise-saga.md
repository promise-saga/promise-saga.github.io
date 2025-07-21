### Introduction
Promise Saga is an implementation of the saga pattern, developed with the following guiding principles:
- Use promises instead of ES6 generators to achieve full TypeScript type inference.
- Adopt Redux Saga’s familiar API while prioritizing TypeScript compatibility.
- Leverage AbortController for cancellation, ensuring network requests can be cancelled out of the box.
- Enable in-component saga usage to automatically start sagas on React component mount and cancel them on unmount.
- Design a pluggable, framework-agnostic solution, with Redux support as just one plugin among many potential implementations.

Promise Saga uses several abstractions and features to function effectively.

#### Action
An action is typically a simple Redux action, though you can also wrap a function with Promise Saga’s `createAction` helper:
```ts
import {createAction as createReduxAction} from '@reduxjs/toolkit';
import {createAction, createAsyncAction} from '@promise-saga/plugin-default';

// simple Redux action
const reduxAction = createReduxAction<string>('actions/changeNewTodo');

// wrapping a synchronous function
const fnAction = createAction((text: string) => text.trim());

// wrapping an asynchronous function
const fnAsyncAction = createAsyncAction(async (url: string) => {
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
});
```
Actions serve as essential application triggers, used to interact with reducers and initiate sagas. String actions, specifically, enable integration with Redux DevTools, allowing time-travel debugging, which is invaluable for maintaining large applications.

#### Saga and SagaIterator
`SagaIterator` represents an abstraction for a cancellable Promise, while `Saga` is an abstraction for a cancellable async function that returns a `SagaIterator` instead of a Promise. Internally, `AbortController` facilitates cancellation, with effects (called within sagas) checking the controller’s state to cancel the saga as needed by throwing an `AbortError`.

#### Effect
Promise Saga supports various modifiers, similar to Redux Saga, to control how sagas execute. Effects can be called in a blocking manner, forked or spawned to run asynchronously, or modified further with debouncing, throttling, and other control mechanisms:
```ts
import {createSaga} from '...';

const workerSaga = createSaga(async function() {
  await this.delay(500); // `delay` effect
  const result = await this.call(workerSaga2); // `call` saga in a blocking way
  console.log('done', result);
});

const watcherSaga = createSaga(async function() {
  this.takeLatest(action1, workerSaga); // `takeLatest` cancels any ongoing saga for the specified action and starts a new instance each time the action occurs
  this.debounce(500, action2, workerSaga); // use `debounce` to delay the saga execution by a specified time (in milliseconds) after the last action
  this.throttle(1000, action3, workerSaga); // use `throttle` to limit saga execution by allowing it to run only once within a specified time window
});
```
Effects are categorized into *lower-level* (`delay`, `call`, `fork`, `spawn`, `cancel`, and others) and *higher-level* (`takeLatest`, `debounce`, `throttle`). Higher-level effects operate by using lower-level effects internally, accessible via `this`. For example, `debounce` is implemented using lower-level effects like `fork`, `take`, `race`, and `delay`.

#### Plugin
Plugins are collections of effects grouped by functionality. Effects become accessible in a Saga’s `this` context and often come from plugins, although some default effects are also available. To use plugins, you can create a custom `createSaga` helper function pre-configured with plugins. For example:

```ts
import {createCreateSaga, mergePlugins} from '@promise-saga/core';
import reduxPlugin from '@promise-saga/plugin-redux';
import fetchPlugin from '@promise-saga/plugin-fetch';

const plugin = mergePlugins(reduxPlugin, fetchPlugin);

// create your own createSaga helper with preset plugins
export const createSaga = createCreateSaga({plugin});
```

#### In-Component Saga Usage
Promise Saga allows you to manually invoke and cancel sagas within a component. Sagas will be automatically canceled when the component unmounts:
```tsx
import {useSaga} from '@promise-saga/core';

export function TodosContainer() {
    const listenTogglesFlow = useSaga(listenTodoToggles); // utilize a saga for handling asynchronous operations

    // render a checkbox to control the cancellation of the saga
    return (
        <input
            type="checkbox"
            onChange={listenTogglesFlow.toggle}
            checked={listenTogglesFlow.isRunning}
        />
    );
}
```
Sagas used with the `useSaga` hook run on React component mount and are canceled on component unmount by default. However, you might also want to configure this behavior by creating your own `useSaga` helper:
```ts
import {createUseSaga} from '@promise-saga/plugin-react';
import {plugin} from '@promise-saga/plugin-redux';

export const useSaga = createUseSaga({
  runOnMount: false,
  cancelOnUnmount: false,
});
```

#### Higher Effect Hooks
Redux Saga proposed the concept of treating sagas as workers and watchers:
```ts
// implement a worker saga to perform specific tasks
const workerSaga = createSaga(async function() {
  await this.delay(1000);
  console.log('done');
});

// establish a watcher saga to observe actions and trigger worker sagas
const watcherSaga = createSaga(async function() {
  this.takeLatest(action1, workerSaga);
  this.debounce(500, action2, workerSaga);
  this.throttle(1000, action3, workerSaga);
});
```

Promise Saga enables you to run every saga within a React component using the `useSaga` hook. Additionally, Promise Saga provides hooks for each matching higher effect, allowing you to skip the creation of `watcher` sagas altogether:
```tsx
import {useDebounce, useTakeLatest, useThrottle} from '...';

export function TodosContainer() {
    // employ higher-level effect hooks to manage saga behavior effectively
    useTakeLatest(action1, workerSaga);
    useDebounce(500, action2, workerSaga);
    useThrottle(1000, action3, workerSaga);

    return <Todos />;
}
```
And these hooks are also easy to configure.

Please feel free to refer to the documentation and GitHub for more information.
