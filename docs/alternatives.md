# Comparing to Alternatives

This project was created with the intention of improving certain async handling features that I found missing or insufficient in most commonly used scenarios:

|                    | Redux Saga | Redux Toolkit | React Use | React Query | Promise Saga |
|--------------------|------------|---------------|-----------|-------------|--------------|
| Pluggable          | ⚠️         | ⚠️            | ✅         | ✅           | ✅            |
| Cancellable        | ⚠️         | ⚠️            | ⚠️        | ⚠️          | ✅            |
| Type-checking      | ⚠️         | ✅             | ✅         | ✅           |  ✅           |
| In-component usage | ❌          | ❌             | ✅         | ✅           | ✅            |

---

### [Redux Saga](https://redux-saga.js.org/docs/introduction/GettingStarted)

Redux Saga offers a rich API and has proven itself over time in large-scale applications. However, it lacks proper type inference due to its use of [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*), and it is primarily designed for use with [Redux](https://redux.js.org/).

- ⚠️ **Pluggable** – While Redux Saga is tightly coupled with Redux, it can be extended using [channels](https://redux-saga.js.org/docs/advanced/Channels) to work with other event sources.
- ⚠️ **Cancellable** – Although cancellation is possible with additional `AbortController` logic, there’s no built-in support for canceling *all* tasks or effects like debouncing (you must substitute it with using `takeLatest`, `delay`) and others. Network requests are not canceled out of the box.
- ⚠️ **Type-checking** – All `yield` expressions default to `any` unless explicitly typed. Type inference for generator functions is limited.
- ❌ **In-component usage** – Redux Saga lacks built-in hooks, it is a pure side effect tool.

---

### [Redux Toolkit](https://redux-toolkit.js.org/api/createAsyncThunk)

Redux Toolkit is an official, powerful abstraction over Redux. It includes handy utilities like `createAsyncThunk` for handling async logic, but lacks advanced cancellation features.

- ⚠️ **Pluggable** – Designed for Redux by default, but can be adapted to various use cases, especially in debugging scenarios using time-traveling dev tools.
- ⚠️ **Cancellable** – Each thunk gets its own `AbortSignal` via `thunkAPI`, but signals aren't shared across nested contexts. Thunks cannot cancel other thunks natively, nor can they maintain a cancellation tree like Promise Saga. Network request cancellation must be implemented manually.
- ✅ **Type-checking** – Excellent TypeScript support and inference.
- ❌ **In-component usage** – No built-in hooks for direct use in components.

---

### [React Use](https://github.com/streamich/react-use/blob/master/docs/useDebounce.md)

[React Use](https://github.com/streamich/react-use/) provides a large set of utility hooks with strong typing. While excellent for small in-component logic, it lacks global coordination and action-based cancellation.

- ✅ **Pluggable** – Easily usable across the entire React ecosystem.
- ⚠️ **Cancellable** – Cancellable only through basic [sync mechanisms](https://github.com/streamich/react-use/blob/ad33f76dfff7ddb041a9ef74b80656a94affaa80/src/useTimeoutFn.ts); no support for cancelable async workflows.
- ✅ **Type-checking** – Solid TypeScript support.
- ✅ **In-component usage** – Fully supports component-based usage.

---

### [React Query](https://tanstack.com/query/latest/docs/framework/react/quick-start)

[React Query](https://tanstack.com/query/) is optimized for handling network requests, offering cache management, invalidation, and a powerful API. It doesn’t cover generalized side effects but does its job exceptionally well.

- ✅ **Pluggable** – Fully compatible across the React ecosystem.
- ⚠️ **Cancellable** – Queries receive `AbortSignal` support, but mutations do not. Cancellations must be handled explicitly.
- ✅ **Type-checking** – TypeScript support is robust and intuitive.
- ✅ **In-component usage** – Designed for seamless component integration.
