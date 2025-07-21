# Basic concepts
### Sagas

Sagas were presumably first described in [1987](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf) as a concept and were further nicely discussed in [2015](https://youtu.be/xDuwrtwYHu8?si=UmyQFqn8X2XyTdkt) as reversible long-lived transactions in databases. Within the React community, [Redux Saga](https://redux-saga.js.org) has long been the dominant approach, providing great inspiration for handling side effects in applications.

Promise Saga introduces a set of simplified requirements:

#### Sagas are cancellable
We use [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) under the hood to achieve cancellation. Sagas can call each other, forming a tree structure where they become parents or children to one another. If a Saga is cancelled, all of its child Sagas are also cancelled.

#### Sagas are cancellable on time
There are instances when you may need to execute the `finally` block of a `try..finally` structure immediately after a Saga has been errored or cancelled. Promise Saga ensures that this is handled correctly and promptly.

### Effects

We provide many built-in functions to control the flow of sagas. Using these functions, you can:

- Call another saga, function, or promise using [call](api.md#call), [callFn](api.md#callFn) and [callPromise](api.md#callPromise).
- Wait for actions to occur and continue saga execution using [take](api.md#take), [takeLatest](api.md#takeLatest), [debounce](api.md#debounce), [throttle](api.md#throttle), and others.
- Introduce delays using the [delay](api.md#delay) effect.
- Perform a race between effects or wait for all sagas to complete using [race](api.md#race) and [all](api.md#all).

See the usage examples below and refer to the [API reference](api.md#effects) for a full list of effects.

```ts
import {createSaga} from '...';

export const listenTodoToggles = createSaga(async function() {
    // wait for Redux action to happen
    await this.take(Todos.actions.toggleTodo);
    // ...
});
```

```ts
export const listenTodoToggles = createSaga(async function() {
    // apply 500ms debouncing to a `toggleTodo` action to call `toggleTodo` saga
    this.debounce(500, Todos.actions.toggleTodo, toggleTodo);
    // ...
});
```

Effects are divided into lower-level and higher-level effects. For example, the higher-level [debounce](api.md#debounce) effect is based on a combination of lower-level effects, such as [call](api.md#call), [delay](api.md#delay), [race](api.md#race), and [take](api.md#take).

Refer to the recipes section for examples.

### Plugins

Promise Saga provides a set of plugins, such as those for [Redux](https://redux.js.org/) and [Zustand](https://zustand-demo.pmnd.rs/). These plugins can be used to seamlessly integrate Promise Saga with different state management libraries.

```ts
import {createCreateSaga} from '@promise-saga/core';
import {plugin} from '@promise-saga/plugin-redux';

// Here we create a `createSaga` wrapper to apply plugins to every sagas created
export const createSaga = createCreateSaga({plugin});
```

Use `mergePlugins` to apply multiple plugins simultaneously:

```ts
import {createCreateSaga, mergePlugins} from '@promise-saga/core';
import reduxPlugin from '@promise-saga/plugin-redux';
import fetchPlugin from '@promise-saga/plugin-fetch';

const plugin = mergePlugins(reduxPlugin, fetchPlugin);
export const createSaga = createCreateSaga({plugin});
```

Most of the plugins introduce new effects within `createSaga`.

### In-component usage

Promise Saga allows you to manually call and cancel sagas within a component. Sagas will be automatically cancelled when the component unmounts:

```tsx
import {useSaga} from '@promise-saga/core';

export function TodosContainer() {
    const listenTogglesFlow = useSaga(listenTodoToggles); // use a saga

    // render a checkbox to control saga canceling
    return (
        <input
            type="checkbox"
            onChange={listenTogglesFlow.toggle}
            checked={listenTogglesFlow.isRunning}
        />
    );
}
```

### Higher Effect Hooks

Using Redux and Zustand plugins gives you the opportunity to call sagas like this:

```tsx
import {useDebounce} from '...';

export function TodosContainer() {
    useDebounce(500, Todos.actions.toggleTodo, toggleTodo); // higher effect hook

    return <Todos />;
}
```

This method might allow you to skip creating a separate watcher saga within a [watcher/worker](https://redux-saga.js.org/docs/Glossary/#watcherworker) pattern.
