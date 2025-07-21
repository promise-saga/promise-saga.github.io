### Introduction

Handling side effects in React applications can be tricky. Initially, you may start by using side effects or promises directly within components. For example, if you’re building in 2024 and using [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), your code might look like this:

```tsx
function Bookmarks({ category }) {
  const [data, setData] = useState([])
  const [error, setError] = useState()

  useEffect(() => {
    fetch(`${endpoint}/${category}`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => setError(e))
  }, [category])

  // Return JSX based on data and error state
}
```

While this works in simple cases, real-world applications often introduce complex challenges, such as race conditions and cancellation issues, well explained in [this article](https://tkdodo.eu/blog/why-you-want-react-query). Although the goal here isn’t to convince you to use [react-query](https://tanstack.com/query/latest/docs/framework/react/overview), it offers valuable features like solving race conditions and proper cancellation through `AbortController`.

#### Understanding Race Conditions

Race conditions occur when asynchronous tasks compete to complete, leading to inconsistent outcomes. In client-server communication, even though HTTP ensures that requests are sent in order, **responses may arrive out of order**, potentially causing outdated data to overwrite more recent updates. When multiple fetch jobs run concurrently, it becomes crucial to cancel or invalidate outdated requests. Libraries like react-query address this with queryKey-based invalidation:

```tsx
function Bookmarks({ category }) {
  const { isLoading, data, error } = useQuery({
    queryKey: ['bookmarks', category],
    queryFn: ({ signal }) =>
      fetch(`${endpoint}/${category}`, { signal }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch')
        }
        return res.json()
      }),
  })

  // Return JSX based on data and error state
}
```

`React-query` is ideal for network requests but lacks flexibility for more complex side effects. If your side effects extend beyond simple fetch operations, Sagas might be a better fit.

### Deep dive into Sagas

Sagas were presumably first described in [1987](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf) as reversible transactions and later found their way into software development. [Redux Saga](https://redux-saga.js.org) is one of the most well-known implementations for managing side effects in React applications. It uses ES6 generators, enabling non-blocking calls, cancellations, and Redux action orchestration.

Here’s an example of a Redux Saga in action:

```ts
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import Api from '...';

// worker saga will be fired on USER_FETCH_REQUESTED action
function* fetchUser(action) {
   try {
      const user = yield call(Api.fetchUser, action.payload.userId); // `call` effect: invoke Api.fetchUser function in a blocking way
      yield put({type: 'USER_FETCH_SUCCEEDED', user: user}); // `put` effect: invoke store.dispatch logic
   } catch (e) {
      yield put({type: 'USER_FETCH_FAILED', message: e.message});
   }
}

// starts `fetchUser` on each dispatched USER_FETCH_REQUESTED action, `takeEvery` allows concurrent sagas triggering
function* mySaga() {
  yield takeEvery('USER_FETCH_REQUESTED', fetchUser); // `takeEvery` effect: bind action and saga to trigger
}
```

Redux Saga performs well in large, complex applications. However, it has a significant drawback - it struggles with **TypeScript type inference**. This issue arises from its reliance on ES6 generators, which introduce design limitations. Let’s take a look at the ES6 generator type in WebStorm, for instance (`lib.es2015.generator.d.ts`):

```ts
interface Generator<T = unknown, TReturn = any, TNext = unknown> extends Iterator<T, TReturn, TNext> {
    // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
    next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
    return(value: TReturn): IteratorResult<T, TReturn>;
    throw(e: any): IteratorResult<T, TReturn>;
    [Symbol.iterator](): Generator<T, TReturn, TNext>;
}
```

At first glance, this structure looks promising. However, the first generic parameter T serves as the sole type for all yield results within a saga. This design poses challenges when you want to yield different types - such as the result of a selector or another saga - because they must share the same type, which isn’t always feasible.

Though Redux Saga offers TypeScript support, it isn’t always practical. Here’s an example:

```ts
import { select } from 'redux-saga/effects';
import { State } from '...';

const getCounter = (state: State): number => ...; // simple selector returning `number`

function* saga() {
  const user: any = yield select<typeof getCounter>(getCounter); // pass selector type to generic parameter
}
```

In this example, TypeScript verifies that the selector type matches the generic parameter type. However, this does not provide meaningful type inference - the inferred type of `user` variable will still be `any`. To ensure correct typing, you would need to explicitly define the type:

```ts
const user: number = yield select(getCounter);
```

This approach involves tedious manual typing and creates a disconnect between the selector’s actual return type and the saga’s logic. If the selector changes over time, TypeScript won’t catch the mismatch, requiring manual updates throughout your code. This lack of seamless type inference can become frustrating in large-scale applications.

### Promise Saga

- Use promises instead of ES6 generators to achieve full TypeScript type inference.
- Adopt Redux Saga’s familiar API while prioritizing TypeScript compatibility.
- Leverage AbortController for cancellation, ensuring network requests can be cancelled out of the box.
- Enable in-component saga usage to automatically start sagas on React component mount and cancel them on unmount.
- Design an pluggable, framework-agnostic solution, with Redux support as just one plugin among many potential implementations.

Promise Saga preserves the intuitive structure of Redux Saga while solving the type inference limitations, making it easier to maintain and scale applications. Stay tuned for the next article, where we dive deeper into the implementation of these ideas.
