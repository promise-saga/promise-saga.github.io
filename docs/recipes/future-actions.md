# Waiting for Future Actions

Since actions are a bit different in [Redux](#redux) and no-state environments, consider the following differences:

### Redux

In Redux, you are more likely to use RTK's `createAction` or `createSlice` to create actions:
```ts
import {createAction} from '@reduxjs/toolkit';

const testAction = createAction('actions/test');
```

After that, you can suspend sagas execution by waiting for such an action:
```ts
const saga = createSaga(async function() {
    const action = await this.take(testAction);
    console.log('done!', action); // testAction: { type: "actions/test" }
});
```

You can wait for one of the defined actions in an array:
```ts
const saga = createSaga(async function() {
    const action = await this.take([
        testAction1,
        testAction2,
    ]);
    console.log('done!', action); // testAction1 or testAction2
});
```

Or wait for any action to happen as well:
```ts
const saga = createSaga(async function() {
    const action = await this.take('*');
    console.log('done!', action); // any action
});
```

Described methods provide custom handling of actions. Though most of the time, you'd likely want to just "bind" actions to sagas like this:
```ts
// common watcher saga
const main = createSaga(async function() {
    this.takeEvery(testAction1, saga1);
    this.takeLatest(testAction2, saga2);
    this.takeLeading(testAction3, saga3);
});
```

Effect [takeEvery](../api.md#takeEvery) assumes that many saga instances can run concurrently since every saga might execute long, and new actions might be spammed quickly enough.

Effect [takeLatest](../api.md#takeLatest) cancels the previous saga instance when the next action happens and then starts the next saga instance immediately.

Effect [takeLeading](../api.md#takeLeading) blocks the next saga instance from executing until the previous saga instance ends and the action happens again.

See the [debouncing and throttling](debouncing-and-throttling.md) guide for more advanced approaches. And remember the [higher effects hooks](../basics.md#higher-effect-hooks) to be even more awesome.

### No-state environments

For example, in Zustand, you can use the Promise Saga `createAction` helper to create actions inside the Zustand model:
```ts
import {create} from 'zustand';
import {createAction} from '@promise-saga/plugin-default';

export const useTodosStore = create()((set, get) => ({
    // wrap a model method
    toggleTodo: createAction((id: string) => {
        set((state) => {
            // ...
        });
    }),

    // or create an empty one
    changeNewTodoText: createAction(),

    // ...
}));
```

After that, you can suspend sagas execution by waiting for such an action:
```ts
export const useTodosStore = create()((set, get) => ({
    // ...

    listenTodoToggles: createSaga(async function() {
        const action = await this.take(get().toggleTodo);
        console.log('done!', action); // toggleTodo: {result: void, args: [string]}
    }),
}));
```

As a no-state action is just a fact of a model method being called, the action result is an object with `result` (method return result) and `args` (method arguments). In the example above, the `toggleTodo` method is called with `id: string` arguments, so you can intercept that `id` of string type.

Promise Saga `createAction` uses [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) under the hood, making it non-serializable and harder to debug. However, you might know the [Zustand Redux Dev Tools](https://github.com/pmndrs/zustand?tab=readme-ov-file#redux-devtools) section, which tells how to bind the Zustand `set` call to a string action name. Note the `withSagas` helper usage to enable that:
```ts
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {withSagas} from '@promise-saga/plugin-zustand';

export const useTodosStore = create()(devtools(withSagas((set, get) => ({
    toggleTodo(id: string) {
        set((state) => {
            // ...
        }, false, 'todos/toggle');
    },

    // ...
}))));
```

Since you give a name to a `set` action, you can wait for them as well:
```ts
export const useTodosStore = create()(devtools(withSagas((set, get) => ({
    // ...

    listenTodoToggles: createSaga(async function() {
        const action = await this.take('todos/toggle');
        console.log('done!', action); // toggleTodo: {result: any, args: any[]}
    }),
}))));
```

**Note:** As Promise Saga can't recognize the correct types of such string actions, `any` result is returned. Please use explicit parameterized `take` calls to fix that.
```ts
export const useTodosStore = create()(devtools(withSagas((set, get) => ({
    // ...

    listenTodoToggles: createSaga(async function() {
        const action = await this.take<void, [string]>('todos/toggle');
        console.log('done!', action); // toggleTodo: {result: void, args: [string]}
    }),
}))));
```

Described methods provide custom handling of actions. Though most of the time, you'd likely want to just "bind" actions to sagas like this:
```ts
export const useTodosStore = create()((set, get) => ({
    // ...

    main: createSaga(async function() {
        this.takeEvery(get().changeNewTodoText, get().logNewTodo);
        this.takeLatest(get().changeNewTodoText, get().logNewTodo);
        this.takeLeading(get().changeNewTodoText, get().logNewTodo);
    }),
}));
```
Effect [takeEvery](../api.md#takeEvery) assumes that many saga instances can run concurrently since every saga might execute long, and new actions might be spammed quickly enough.

Effect [takeLatest](../api.md#takeLatest) cancels the previous saga instance when the next action happens and then starts the next saga instance immediately.

Effect [takeLeading](../api.md#takeLeading) blocks the next saga instance from executing until the previous saga instance ends and the action happens again.

See the [debouncing and throttling](debouncing-and-throttling.md) guide for more advanced approaches. And remember the [higher effects hooks](../basics.md#higher-effect-hooks) to be even more awesome.
