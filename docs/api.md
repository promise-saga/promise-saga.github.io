# API reference

## Defaults

### defaultChannel
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

The `defaultChannel` is the default [EventEmitter](glossary.md#eventEmitter) used to emit [Actions](glossary.md#action), which can then be awaited.

### defaultTree
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

The `defaultTree` is the default [Tree](glossary.md#tree) object used to maintain the parent-child relationships of [Sagas](glossary.md#saga).

## Helpers
### createAction
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`createAction(fn?, channel?)` creates an [Action](glossary.md#action), which can be either empty or a wrapper for a function or model method. When this function is called, an action is dispatched to the [defaultChannel](#defaults). Such actions can be awaited with [take](#take), for instance.

**Arguments:**
1. `fn?: FnActionInput` - Function
2. `channel?: EventEmitter` - Channel to dispatch an action, defaults to [defaultChannel](#defaults).

**Returns:** `FnAction` - Function action.

**Example:**
```ts
const changeNewTodoText = createAction(); // create an empty action

const addTodo = createAction((text: string) => { // wrap an existing function
    // ...
});
```

See [examples](examples.md) or even [Zustand tutorial](tutorials/zustand.md) for more information.

### createAsyncAction
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`createAsyncAction(fn?, channel?)` creates an [Action](glossary.md#action) by wrapping an existing async function. It works the same as [createAction](#createAction), but `await`s the async function's return result.

**Arguments:**

1. `fn?: FnActionInput` - Async function
2. `channel?: EventEmitter` - Channel to dispatch an action, defaults to [defaultChannel](#defaults).

**Returns:** `FnAction<Promise>` - Async function action.

**Example:**
```ts
const addTodo = createAsyncAction(async (text: string) => { // wrap an existing function
    await Promise.resolve((resolve) => setTimeout(500, resolve));
    // ...
});
```

### createCreateSaga
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`createCreateSaga(config?)` creates a [createSaga](#createSaga) function with a bound `plugin` and `tree`.

**Arguments:**
- `config: SagaConfig:`
  - `plugin?: SagaPlugin` - Plugin with effects to inject into a wrapping async function. [Merge](#mergePlugins) plugins if you need more than one.
  - `tree?: SagaTreeNode` - [Tree node](glossary.md#tree) object to maintain sagas' parent-child relationships.
  - `onError?: (err: unknown, node: SagaTreeNode) => void` - `onError` handler. Refer to [error handling](recipes/error-handling.md) for more information.

**Returns:** [createSaga](#createSaga) function.

**Example:**
```ts
import {createCreateSaga} from '@promise-saga/core';
import {plugin} from '@promise-saga/plugin-redux';

// bind an plugin
export const createSaga = createCreateSaga({plugin});

const saga = createSaga(async function() {
    await this.delay(500);
    // dispatch a Redux action
    await this.dispatch({type: 'actions/test'});
});
```

[Merge](#mergePlugins) plugins, if you need more than one. See tutorials and [examples](examples.md) for more information.

### createHigherHooks
![Angular](https://img.shields.io/badge/angular-DD0031.svg?style=flat&logo=angular&logoColor=white)
![React](https://img.shields.io/badge/react-20232a.svg?style=flat&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)
![Svelte](https://img.shields.io/badge/svelte-FF3E00.svg?style=flat&logo=svelte&logoColor=white)
![Vue](https://img.shields.io/badge/vue-4FC08D.svg?style=flat&logo=vue.js&logoColor=white)

`createHigherHooks(createSaga?, useSaga?)` creates a set of higher hooks.

**Arguments:**
- `createSaga: CreateSagaFunction` - `createSaga` function. [createCreateSaga](#createCreateSaga) creates its customized instance.
- `useSaga: UseSagaHook` - `useSaga` hook. [createUseSaga](#createUseSaga) creates its customized instance.

**Returns:** Set of higher hooks.

**Example:**
```ts
import {createCreateSaga} from '@promise-saga/core';
import {createUseSaga} from '@promise-saga/plugin-react';
import {plugin, createHigherHooks} from '@promise-saga/plugin-redux';

export const createSaga = createCreateSaga({plugin});
export const useSaga = createUseSaga({
  runOnMount: false,
});

export const {
  useTakeEvery,
  useTakeLeading,
  useTakeLatest,
  useDebounce,
  useThrottle,
} = createHigherHooks(createSaga, useSaga);
```

### createSaga
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`createSaga(saga, config?)` creates a saga.

**Arguments:**
- `saga: SagaInput` - Async function to wrap and produce a Saga. This function will eventually get all [plugins](glossary.md#plugin) and [effects](glossary.md#effect) in `this`.
- `config: SagaConfig:`
  - `plugin?: SagaPlugin` - Plugin with effects to inject into the wrapping async function. [Merge](#mergePlugins) plugins if you need more than one.
  - `tree?: SagaTreeNode` - [Tree node](glossary.md#tree) object to maintain sagas' parent-child relationships.
  - `onError?: (err: unknown, node: SagaTreeNode) => void` - `onError` handler. Refer to [error handling](recipes/error-handling.md) for more information.

**Returns:** [Saga](glossary.md#saga)

**Example:**
```ts
const saga = createSaga(async function() {
    await this.delay(500);
    // ...
});
```

See tutorials and [examples](examples.md) for more information.

### createUseSaga
![Angular](https://img.shields.io/badge/angular-DD0031.svg?style=flat&logo=angular&logoColor=white)
![React](https://img.shields.io/badge/react-20232a.svg?style=flat&logo=react&logoColor=61DAFB)
![Svelte](https://img.shields.io/badge/svelte-FF3E00.svg?style=flat&logo=svelte&logoColor=white)
![Vue](https://img.shields.io/badge/vue-4FC08D.svg?style=flat&logo=vue.js&logoColor=white)

`createUseSaga(config?)` creates a [useSaga](#useSaga) hook with preset configurations.

**Arguments:**
- `config: UseSagaConfig:`
  - `runOnMount?: boolean` - Whether to run Saga on React component mount, defaults to `true`.
  - `cancelOnUnmount?: boolean` - Whether to cancel Saga on React component unmount, defaults to `true`.

**Returns:** [useSaga](#useSaga) hook.

**Example:**
```ts
import {createUseSaga} from '@promise-saga/plugin-react';
import {plugin} from '@promise-saga/plugin-redux';

export const useSaga = createUseSaga({
  runOnMount: false,
  cancelOnUnmount: false,
});
```

### isAbortError
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

**Arguments:**
- `err: unknown` - Presumed Error instance.

**Returns:** `boolean`

Helper to commonly refine errors from being handled. See the example in [error handling](recipes/error-handling.md).
```ts
import {isAbortError} from '@promise-saga/core';

export const saga = createSaga(async function () {
  try {
    await this.call(inner);
  } catch (err) {
    if (!isAbortError(err)) {
      // handle error
    }
  }
});
```

### mergePlugins
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`mergePlugins(...plugins)` merges multiple plugins into a single one.

**Arguments:**
- `...plugins: Plugin[]` - Plugins with effects to inject.

**Returns:** [Plugin](glossary.md#plugin) object.

**Example:**
```ts
import {createCreateSaga, mergePlugins} from '@promise-saga/core';
import reduxPlugin from '@promise-saga/plugin-redux';
import fetchPlugin from '@promise-saga/plugin-fetch';

const plugin = mergePlugins(reduxPlugin, fetchPlugin);
export const createSaga = createCreateSaga({plugin});
```

## Effects

### all
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`await this.all(iter[])` - runs several tasks concurrently until all of them succeed.

**Arguments:**
- `iter[]: SagaIterator[]` - Concurrent [SagaIterators](glossary.md#sagaIterator).

**Returns:** `SagaIterator<iterResult[]>` - `await`s and returns a results array.

**Example:**

```ts
export const fetchAllPokemons = createSaga(async function() {
    const [pikachu, raichu] = await this.all([
        getPokemonData('pikachu'),
        getPokemonData('raichu'),
    ]);
    console.log({pikachu, raichu});
});
```

See [concurrency](recipes/concurrency.md) for more information.

### [axios](https://axios-http.com)
![Axios](https://img.shields.io/badge/axios-5A29E4.svg?style=flat&logo=axios&logoColor=white)

`await this.get(url, options)` - Fetches response by URL. Works similarly to `post`, `put`, `delete`, and others.

**Arguments:**
- `url: string` - URL to fetch.
- `options: RequestConfig` - Axios RequestConfig.

**Returns:**: AxiosResponse

**Example:**
```ts
import {createCreateSaga} from '@promise-saga/core';
import {plugin} from '@promise-saga/plugin-axios';

const createSaga = createCreateSaga({plugin});

export const getPokemonData = createSaga(async function(pokemon: string) {
    const resp = await this.get<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    return resp.data;
});
```

### call
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`await this.call(saga, ...args)` - Calls a [Saga](glossary.md#saga) in a blocking way.

**Arguments:**
- `saga: Saga` - Saga to call.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

See [composing](recipes/composing.md) and [non-blocking calls](recipes/non-blocking-calls.md) for more information.

**Example:**
```ts
const saga = createSaga(async function() {
    return 2;
});

const main = createSaga(async function() {
    // call saga in a blocking way
    const result = await this.call(saga);
    console.log(result); // 2
});
```

See [composing](recipes/composing.md) and [non blocking calls](recipes/non-blocking-calls.md) for more information.

### callFn
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`this.callFn(sagaFn, ...args)` - Calls a function.

**Arguments:**
- `sagaFn: Function` - Function to be called.

**Returns:** Function return result.

**Example:**
```ts
const fn = () => 2;

const main = createSaga(async function() {
    const result = this.callFn(fn); // 2
    // ...
});
```

See [composing](recipes/composing.md) for more information.

### callPromise
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`await this.callPromise(promise)` - Calls a promise.

**Arguments:**
- `promise: Promise` - Promise to be called.

**Returns:** Promise return result.

**Example:**
```ts
const promise = Promise.resolve(2);

const main = createSaga(async function() {
    const result = await this.callPromise(promise); // 2
    // ...
});
```

See [composing](recipes/composing.md) for more information.

### cancel
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`this.cancel(iter?)` - Cancels a non-blocking task or the current saga.

**Arguments:**
- `iter?: SagaIterator` - [SagaIterator](glossary.md#sagaIterator) or simply a task to be cancelled.

**Example:**
```ts
const saga = createSaga(async function() {
    // call child saga in a non-blocking way
    const task = this.fork(childSaga);
    // ...perform saga logic
    this.cancel(task); // cancel task
});
```

See [non blocking calls](recipes/non-blocking-calls.md) for more information.

### cancellable
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`this.cancellable(promise, config?)` - Creates a cancellable promise, primarily used to create custom effects. For example:

**Arguments:**
- `promise: Promise` - Input promise.
- `config: CancellableConfig:`
  - `onFinally?: () => void` - Function called on success, error, and cancellation. Can be used to teardown and unsubscribe from everything.
  - `onError?: (err: unknown) => void` - Function called on error.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

**Example:** delay effect on [github](https://github.com/promise-saga/promise-saga.github.io/blob/main/packages/core/src/effects/lower.ts#L78)

```ts
export async function delay(this: SagaLowerEffectsScope, ms?: number) {
    this.throwIfCancelled();
    let timeout: NodeJS.Timeout;

    // create a cancellable setTimeout
    return this.cancellable<void>(new Promise((resolve) => {
        timeout = setTimeout(() => {
            this.throwIfCancelled();
            resolve();
        }, ms);
    }), {
        onFinally: () => clearTimeout(timeout), // finally clearTimeout
    });
}
```

### cancelled
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`this.cancelled(iter?)` - Checks if a non-blocking task or the current saga has already been cancelled.

**Arguments:**
- `iter?: SagaIterator` - [SagaIterator](glossary.md#sagaIterator) or simply a task to be cancelled.

**Returns:** `boolean`.

**Example:**
```ts
const parentSaga = createSaga(async function() {
    // call child saga in a non-blocking way
    const task = this.fork(childSaga);
    // ...
    await this.delay(1500); // perform saga logic
    this.cancel(task); // cancel task after 1500ms
});

const childSaga = createSaga(async function() {
    try {
        await this.delay(3000); // perform saga logic for 3000ms
        console.log('success!');
    } finally {
        console.log('finally', this.cancelled()); // true
    }
});
```

See [non blocking calls](recipes/non-blocking-calls.md) for more information.

### debounce
![Default](https://img.shields.io/badge/default-777.svg?style=flat&logoColor=white)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)

`this.debounce(ms, action, saga, ...args)` - Delays the execution of a [Saga](glossary.md#saga) until the user stops performing an action for a specified amount of time.

**Arguments:**
- `ms: number` - Amount of time in milliseconds.
- `action: Action` - Action to wait for.
- `saga: Saga` - Saga to call.
- `args: any[]` - Additional saga arguments to call with. The first saga incoming argument is the action that triggered it.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

**Example:**
```ts
const saga = createSaga(async function() {
    this.debounce(500, Todos.actions.toggleTodo, toggleTodo);
});

const toggleTodo = createSaga(async function() {
    // ...
});
```

See [debouncing and throttling](recipes/debouncing-and-throttling.md) for more information.

### delay
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`await this.delay(ms?)` - Waits for a specified amount of time in milliseconds.

**Arguments:**
- `ms?: number` - Amount of time in milliseconds.

**Example:**
```ts
const saga = createSaga(async function() {
    await this.delay(500);
    console.log('done');
});
```

### dispatch
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)

`this.dispatch(action)` - Dispatches a Redux action into a Store.

**Arguments:**
- `action: Action` - Redux action.

**Example:**
```ts
import {createAction} from '@reduxjs/toolkit';

export const addTodo = createAction<string>('todos/add');

export const startPokemonsRace = createSaga(async function() {
    this.dispatch(addTodo('new todo'));
    // ...
});
```

See [redux tutorial](tutorials/redux.md) for more information.

### [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
![Fetch](https://img.shields.io/badge/fetch-2196F3.svg?style=flat&logoColor=white)

`await this.fetch(url, options)` - Fetches a response by URL.

**Arguments:**
- `url: string` - URL to fetch.
- `options: RequestInit` - Fetch [request options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options).

**Returns:** `Promise<T>`.

**Example:**
```ts
export const getPokemonData = createSaga(async function(pokemon: string) {
    const resp = await this.fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data: PokemonData = await resp.json();
    return data;
});
```

### fork
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`this.fork(saga, ...args)` - Forks a [Saga](glossary.md#saga) in a detached non-blocking way.

**Arguments:**
- `saga: Saga` - Saga to fork.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

**Example:**
```ts
const saga = createSaga(async function() {
    // ...
});

const main = createSaga(async function() {
    const task = this.fork(saga);
    // returned task can be cancelled, when you need it
    this.cancel(task);
});
```

See [non blocking calls](recipes/non-blocking-calls.md) for more information.

### getStore
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)

`this.getStore()` - Returns a Redux Store inside a [Saga](glossary.md#saga). It may allow you some special usage of the Redux Store API.

**Returns:** [Store](https://redux.js.org/api/store).

**Example:**
```ts
import {Selector} from '@reduxjs/toolkit';

export const getTodos: Selector<RootState, Todo[]> = (state) => state.todos.todos;

const saga = createSaga(async function() {
    // manual selector usage
    const todos = getTodos(this.getStore().getState());
});
```

### observable
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`this.observable(value)` - Observes a `value` for its changes and provides a listener.

**Arguments:**
- `value: any` - Observing value.

**Returns:** `Observable`.

**Example:**
```ts
const saga = createSaga(async function() {
    const isOpen = this.observable(false); // create a boolean observable

    setTimeout(() => {
        isOpen.setValue(true); // set isOpen to true after 100ms
    }, 100);

    await this.race([
        isOpen.onValue(true), // wait isOpen to become true
        this.delay(500), // within timeout 500ms
    ]);
});
```

### race
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`await this.race(iter[])` - Runs several tasks concurrently until one of them succeeds.

**Arguments:**
- `iter[]: SagaIterator[]` - Concurrent [SagaIterators](glossary.md#sagaIterator).

**Returns:** `SagaIterator<(iterResult | undefined)[]>` - `await`s and returns a results array with multiple `undefined`s and a single result filled in.

**Example:**

```ts
import {createAction} from '@reduxjs/toolkit';

export const cancelAction = createAction('action/cancel');

export const startPokemonsRace = createSaga(async function() {
    const [pikachu, raichu] = await this.race([
        getPokemonData('pikachu'),
        getPokemonData('raichu'),
        this.delay(500), // automatic cancel in 500 ms
        this.take(cancelAction), // manual cancel on action dispatch
    ]);
    console.log({pikachu, raichu});
});
```

See [concurrency](recipes/concurrency.md) for more information.

### select
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)

`this.select(selector)` - Returns a Redux selector result.

**Arguments:**
- `selector: Selector` - Selector to be applied.

**Returns:** Selector result.

**Example:**
```ts
import {Selector} from '@reduxjs/toolkit';

export const getTodos: Selector<RootState, Todo[]> = (state) => state.todos.todos;

const saga = createSaga(async function() {
    const todos = this.select(getTodos);
    // ...
});
```

See [redux tutorial](tutorials/redux.md) for more information.

### spawn
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`this.spawn(saga, ...args)` - Calls a [Saga](glossary.md#saga) in a non-blocking detached way. Canceling the parent will not cause the cancellation of itself.

**Arguments:**
- `saga: Saga` - Saga to call.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

**Example:**
```ts
const saga = createSaga(async function() {
    const task = this.spawn(childSaga);
    // ...perform saga logic
    this.cancel(task);
});
```

See [non blocking calls](recipes/non-blocking-calls.md) for more information.

### take
![Default](https://img.shields.io/badge/default-777.svg?style=flat&logoColor=white)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)

`await this.take(action)` - Waits for a Redux/Zustand action to happen.

**Arguments:**
- `action: Action` - Redux action to wait for.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

**Example:**
```ts
import {createAction} from '@reduxjs/toolkit';

const testAction = createAction('actions/test');

const saga = createSaga(async function() {
    const action = await this.take(testAction);
    console.log('done!', action); // { type: "actions/test" }
});
```

See [future actions](recipes/future-actions.md) for more information.

### takeEvery
![Default](https://img.shields.io/badge/default-777.svg?style=flat&logoColor=white)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)

`this.takeEvery(action, saga, ...args)` - Binds a saga call to every action happening.

**Arguments:**
- `action: Action` - Action to wait for.
- `saga: Saga` - Saga to call.
- `args: any[]` - Additional saga arguments to call with. The first saga incoming argument is the action that triggered it.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

**Example:**
```ts
// common watcher saga
const main = createSaga(async function() {
    this.takeEvery(testAction1, saga1);
    this.takeLatest(testAction2, saga2);
    this.takeLeading(testAction3, saga3);
});
```

See [future actions](recipes/future-actions.md) for more information.

### takeLeading
![Default](https://img.shields.io/badge/default-777.svg?style=flat&logoColor=white)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)

`this.takeLeading(action, saga, ...args)` - Binds a saga call to the leading action happening.

**Arguments:**
- `action: Action` - Action to wait for.
- `saga: Saga` - Saga to call.
- `args: any[]` - Additional saga arguments to call with. The first saga incoming argument is the action that triggered it.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

See [takeEvery](#takeEvery) example and [future actions](recipes/future-actions.md) for more information.

### takeLatest
![Default](https://img.shields.io/badge/default-777.svg?style=flat&logoColor=white)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)

`this.takeLatest(action, saga, ...args)` - Binds a saga call to the latest action happening.

**Arguments:**
- `action: Action` - Action to wait for.
- `saga: Saga` - Saga to call.
- `args: any[]` - Additional saga arguments to call with. The first saga incoming argument is the action that triggered it.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

See [takeEvery](#takeEvery) example and [future actions](recipes/future-actions.md) for more information.

### throttle
![Default](https://img.shields.io/badge/default-777.svg?style=flat&logoColor=white)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)

`this.throttle(ms, action, saga, ...args)` - Limits the execution of a [Saga](glossary.md#saga) to once in every specified time interval.

**Arguments:**
- `ms: number` - Time interval in milliseconds.
- `action: Action` - Action to wait for.
- `saga: Saga` - Saga to call.
- `args: any[]` - Additional saga arguments to call with. The first saga incoming argument is the action that triggered it.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

**Example:**
```ts
const saga = createSaga(async function() {
    this.throttle(500, Todos.actions.addTodo, addTodo);
});

const addTodo = createSaga(async function() {
    // ...
});
```

See [debouncing and throttling](recipes/debouncing-and-throttling.md) for more information.
### throwIfCancelled
![Core](https://img.shields.io/badge/core-007ACC.svg?style=flat&logoColor=white)

`this.throwIfCancelled()` - Throws an error with a reason, custom or default. This effect is similar to [AbortSignal throwIfCancelled](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/throwIfCancelled) and is often used.

It can be used manually to cancel some heavy synchronous logic without effects in the process. For example:
```ts
const getHeavyResult = createSaga(async function() {
    let i = 0;

    while (i < 1e8) { // heavy task
        i++;

        if (i % 1e2 === 0) { // check if aborted each 100 iterations
            this.throwIfCancelled();
        }
    }

    return i;
});
```

## Hooks

### useDebounce
![Angular](https://img.shields.io/badge/angular-DD0031.svg?style=flat&logo=angular&logoColor=white)
![React](https://img.shields.io/badge/react-20232a.svg?style=flat&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)
![Svelte](https://img.shields.io/badge/svelte-FF3E00.svg?style=flat&logo=svelte&logoColor=white)
![Vue](https://img.shields.io/badge/vue-4FC08D.svg?style=flat&logo=vue.js&logoColor=white)

`useDebounce(ms, action, saga, ...args)` - Wraps [debounce](#debounce) into a hook.

**Arguments:**
- `ms: number` - Amount of time in milliseconds.
- `action: Action` - Action to wait for.
- `saga: Saga` - Saga to call.
- `args: any[]` - Additional saga arguments to call with. The first saga incoming argument is the action that triggered it.

See [debouncing and throttling](recipes/debouncing-and-throttling.md) for more information.

**Example:**
```tsx
import React, {useState} from 'react';
import {createAction} from '@promise-saga/plugin-default';
import {createSaga, useDebounce} from '../zustandSaga';

// create an empty action to trigger manually on search text changed
const searchAction = createAction<void, [string]>();

export function SearchBlock() {
    // create a React state
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    // debounce searchAction with 500ms delay and call a saga
    useDebounce(500, searchAction, createSaga(async function({args: [pattern]}) {
        // mutate a React state
        setSearchResults(searchRegistry.search(pattern));
    }));

    // ...
}
```

See [debouncing and throttling](recipes/debouncing-and-throttling.md) for more information.

### useSaga
![Angular](https://img.shields.io/badge/angular-DD0031.svg?style=flat&logo=angular&logoColor=white)
![React](https://img.shields.io/badge/react-20232a.svg?style=flat&logo=react&logoColor=61DAFB)
![Svelte](https://img.shields.io/badge/svelte-FF3E00.svg?style=flat&logo=svelte&logoColor=white)
![Vue](https://img.shields.io/badge/vue-4FC08D.svg?style=flat&logo=vue.js&logoColor=white)

`useSaga(saga, ...args)` - Calls a [Saga](glossary.md#saga), previously created with [createSaga](#createSaga), with arguments within a React component. This way, the saga runs on component mount and is cancelled on unmount.

**Example:**
```tsx
const SagaCheckbox = ({flow}: {flow: ReturnType<typeof useSaga>}) => (
    <input type="checkbox" onChange={flow.toggle} checked={flow.isRunning} />
);

export default function App() {
    const listenTogglesFlow = useSaga(listenTodoToggles);

    return (
        <label>
            <SagaCheckbox flow={listenTogglesFlow} />
            Log todos toggling, count by 3
        </label>
    );
}
```

### useTakeEvery
![Angular](https://img.shields.io/badge/angular-DD0031.svg?style=flat&logo=angular&logoColor=white)
![React](https://img.shields.io/badge/react-20232a.svg?style=flat&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)
![Svelte](https://img.shields.io/badge/svelte-FF3E00.svg?style=flat&logo=svelte&logoColor=white)
![Vue](https://img.shields.io/badge/vue-4FC08D.svg?style=flat&logo=vue.js&logoColor=white)

`useTakeEvery(action, saga, ...args)` - Wraps [takeEvery](#takeEvery) into a hook.

**Arguments:**
- `action: Action` - Action to wait for.
- `saga: Saga` - Saga to call.
- `args: any[]` - Additional saga arguments to call with. The first saga incoming argument is the action that triggered it.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

See [future actions](recipes/future-actions.md) for more information.

**Example:**
```tsx
import React, {useState} from 'react';
import {createAction} from '@promise-saga/plugin-default';
import {createSaga, useDebounce} from '../zustandSaga';

// create an empty action to trigger manually on search text changed
const searchAction = createAction<void, [string]>();

export function SearchBlock() {
    // create a React state
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    // take every searchAction and call a saga
    useTakeEvery(searchAction, createSaga(async function({args: [pattern]}) {
        // mutate a React state
        setSearchResults(searchRegistry.search(pattern));
    }));

    // ...
}
```

See [future actions](recipes/future-actions.md) for more information.

### useTakeLeading
![Angular](https://img.shields.io/badge/angular-DD0031.svg?style=flat&logo=angular&logoColor=white)
![React](https://img.shields.io/badge/react-20232a.svg?style=flat&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)
![Svelte](https://img.shields.io/badge/svelte-FF3E00.svg?style=flat&logo=svelte&logoColor=white)
![Vue](https://img.shields.io/badge/vue-4FC08D.svg?style=flat&logo=vue.js&logoColor=white)

`useTakeLeading(action, saga, ...args)` - Wraps [takeLeading](#takeLeading) into a hook.

**Arguments:**
- `action: Action` - Action to wait for.
- `saga: Saga` - Saga to call.
- `args: any[]` - Additional saga arguments to call with. The first saga incoming argument is the action that triggered it.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

See [useTakeEvery](#useTakeEvery) example and [future actions](recipes/future-actions.md) for more information.

### useTakeLatest
![Angular](https://img.shields.io/badge/angular-DD0031.svg?style=flat&logo=angular&logoColor=white)
![React](https://img.shields.io/badge/react-20232a.svg?style=flat&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)
![Svelte](https://img.shields.io/badge/svelte-FF3E00.svg?style=flat&logo=svelte&logoColor=white)
![Vue](https://img.shields.io/badge/vue-4FC08D.svg?style=flat&logo=vue.js&logoColor=white)

`useTakeLatest(action, saga, ...args)` - Wraps [takeLatest](#takeLatest) into a hook.

**Arguments:**
- `action: Action` - Action to wait for.
- `saga: Saga` - Saga to call.
- `args: any[]` - Additional saga arguments to call with. The first saga incoming argument is the action that triggered it.

**Returns:** [SagaIterator](glossary.md#sagaIterator).

See [useTakeEvery](#useTakeEvery) example and [future actions](recipes/future-actions.md) for more information.

### useThrottle
![Angular](https://img.shields.io/badge/angular-DD0031.svg?style=flat&logo=angular&logoColor=white)
![React](https://img.shields.io/badge/react-20232a.svg?style=flat&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/redux-764ABC.svg?style=flat&logo=redux&logoColor=white)
![Svelte](https://img.shields.io/badge/svelte-FF3E00.svg?style=flat&logo=svelte&logoColor=white)
![Vue](https://img.shields.io/badge/vue-4FC08D.svg?style=flat&logo=vue.js&logoColor=white)

`useThrottle(ms, action, saga, ...args)` - Wraps [throttle](#throttle) into a hook.

**Arguments:**
- `ms: number` - Time interval in milliseconds.
- `action: Action` - Action to wait for.
- `saga: Saga` - Saga to call.
- `args: any[]` - Additional saga arguments to call with. The first saga incoming argument is the action that triggered it.

See [useDebounce](#useDebounce) example and [future actions](recipes/future-actions.md) for more information.
