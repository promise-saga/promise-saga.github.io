# Glossary

## Action

An **Action** is essentially a well-known [Redux action](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#actions) or a simple function wrapper. Methods from the "models" like Zustand can also be wrapped as actions. These actions serve as potential triggers for [Sagas](#saga). We wait for an action to occur and then call a saga. For example:

```ts
import {createAction} from '@reduxjs/toolkit';

// create Redux action
const reduxAction = createAction<string>('actions/changeNewTodo');

// watcher saga
const watcher = createSaga(async function() {
    // listen for action to happen and trigger `testSaga`
    this.takeLatest(reduxAction, testSaga);
});

const testSaga = createSaga(async function() {
    // ...
});
```

```ts
import {create} from 'zustand';
import {createAction} from '@promise-saga/plugin-default';

// create an outside action
const action = createAction<void, [string]>();

export const useTodosStore = create()((set, get) => ({
    zustandEmptyAction: createAction(), // create an empty action

    zustandAction: createAction((text: string) => { // wrap an existing function
        set((state) => ({
            // ...
        }));
    }),

    // ...

    // watcher saga
    watcher: createSaga(async function() {
        // listen for action to happen and trigger `testSaga`
        this.takeLatest(get().zustandEmptyAction, get().testSaga);
    }),

    testSaga: createSaga(async function(action) {
        // ...
    }),
}));
```

See [createAction](api.md#createAction), [createAsyncAction](api.md#createAsyncAction) for more information.

## Plugin

An **Plugin** is an object that aggregates all the [Effects](#effect) you wish to be injected into the `this` context of a [Saga](#saga).

There are now 9 plugins available: `default`, `angular`, `axios`, `fetch`, `redux`, `react`, `react-query`, `svelte`, and `zustand`. Although the `react` plugin does not inject any effects, it provides helpers like `useSaga`. It is still referred to as an plugin to externalize the dependency.

For example, plugins may look like this:

```ts
// fetch plugin
export const plugin = {
    higher: {
        fetch: fetchFn,
    },
};

// redux plugin
export const createPlugin = (channel = defaultChannel) => ({
    main: {
        getStore,
        channel,
    },

    lower: {
        dispatch,
        select,
        take,
    },

    higher: {
        debounce,
        takeEvery,
        takeLatest,
        takeLeading,
        throttle,
    },
});

export const plugin = createPlugin();
```

Effect implementations inside Promise Saga also have access to `this`, enabling higher effects to utilize lower effects within the `this` context to implement more advanced logic. Lower effects receive main effects in `this`.

Additionally, Promise Saga includes several out-of-the-box effects like [call](api.md#call) and [callFn](api.md#callfn), among others. These are defined at specific levels; for example, they are considered lower effects. Consequently, every plugin's higher effects will have access to lower effects such as `call` and `callFn` in their `this`.

For instructions on setting up sagas with plugins, see the [basics section](basics.md#plugins).

## Effect

An **Effect** is a special function used to perform [Saga](#saga) logic, accessible through `this` inside `createSaga`. A basic effect is an asynchronous function. For instance, the implementation of the [delay](api.md#delay) effect is similar to the following example:

```ts
export const delay = (ms?: number) => (
    new Promise((resolve, reject) => setTimeout(resolve, ms))
);
```

and can used inside `createSaga` like this:

```ts
const saga = createSaga(async function() {
    await this.delay(500); // simple effect called
    console.log('done');
});
```

See more about effects in the [basics section](basics.md#effects).

## EventEmitter

EventEmitter emits [Actions](#action) and thus enables waiting for actions within a [Saga](#saga).

Typically, it is advisable to use a single EventEmitter object for a project, referred to as [defaultChannel](api.md#defaults). However, it can be customized, allowing you to have different `createSaga` instances with various channels operating underneath. For more detailed information, refer to [createSaga](api.md#createSaga) and [createCreateSaga](api.md#createCreateSaga).

## Higher Effect Hook

A Higher Effect Hook is a higher [Effect](#effect) wrapper, represented as a hook. Plugins for Angular, React, Redux, Svelte and Vue offer the following hooks: [useTakeEvery](api.md#useTakeEvery), [useTakeLatest](api.md#useTakeLatest), [useTakeLeading](api.md#useTakeLeading), [useDebounce](api.md#useDebounce), and [useThrottle](api.md#useThrottle). For example:

```tsx
export function TodosContainer() {
    useDebounce(500, Todos.actions.toggleTodo, toggleTodo); // higher effect hook

    return <>Todos</>;
}
```

See more about higher effect hooks in the [basics section](basics.md#higher-effect-hooks).

## Saga

A **Saga** is a cancellable asynchronous function that takes arguments and can be cancelled by effects invoked within it. It returns a [SagaIterator](#sagaIterator), which is a cancellable promise.

```ts
export type Saga<T = void, P extends any[] = any[]> =
    (...args: P) => SagaIterator<T>;
```

## SagaIterator

A **SagaIterator** is a cancellable promise returned from each [Saga](#saga) and nearly every effect, as almost all of them are asynchronous and cancellable.

```ts
export type SagaIterator<T = any> = Promise<T> & {
    cancel(): void;
    cancelled(): boolean;
};
```

## Tree

A **Tree** is an object used to maintain the parent-child relationships of [Sagas](#saga). Every saga call generates a new TreeNode at the next level in the Tree, starting from the Root (level = 0).

```
Level 0             Root
                   /    \
Level 1:       SagaA    SagaSpawn
               /   \
Level 2:   SagaB   SagaC
                   /    \
Level 3:       SagaD    SagaE
```

Almost every [Effect](#effect) attaches a child saga to its parent within a Tree, except for [spawn](recipes/non-blocking-calls.md#spawn) - this effect attaches the child saga directly to the Root. If a saga is cancelled, all its children, as defined in the Tree, are also cancelled.

Typically, it is advisable to use a single Tree object for a project - see [defaultTree](api.md#defaults). However, this is not a strict rule; you can have different `createSaga` instances with different Trees operating underneath. For more detailed information, refer to [createSaga](api.md#createSaga) and [createCreateSaga](api.md#createCreateSaga).

## TreeNode

**SagaTreeNode** is an object containing:
- `iter?: SagaIterator` - The promise, which runs instantly. It is `undefined` at the root level.
- `saga?: Saga` - The async function that produced the promise. It is `undefined` at the root level.
- `parent?: SagaTreeNode` - A link to the parent `SagaTreeNode`. It is `undefined` at the root level.
- `children: Set<SagaTreeNode>` - Links to child `SagaTreeNodes`.
- `level: number` - The level. It is `0` at the root level.

Normally, you would want to access the `SagaTreeNode` API while [handling errors](recipes/error-handling.md) in sagas.
