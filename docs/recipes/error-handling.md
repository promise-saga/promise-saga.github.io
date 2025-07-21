# Error Handling

### Handling errors in specific saga

You can use classic `try..catch` in sagas:

```ts
const watcher = createSaga(async function() {
    try {
        await this.call(worker, 'test');
    } catch (err) {
        console.error(err.message); // test error
    }
});

const worker = createSaga(async function(text: string) {
    throw Error('test error');
    console.log(text);
});
```

But here comes a possible inconvenience. Cancellation is done by throwing an error (specifically, an AbortError), and it can be performed manually (via [cancel](../api.md#cancel) effect calls) and automatically ([useSaga](../api.md#useSaga) calls [cancel](../api.md#cancel) on React component unmount as well). This type of error can be refined with [isAbortError](../api.md#isAbortError) helper like shown below:
- Refine the Aborted error manually with [isAbortError](../api.md#isAbortError)

```ts
import {isAbortError} from '@promise-saga/core';

export const saga = createSaga(async function () {
  try {
    await this.call(inner);
  } catch (err) {
    if (!isAbortError(err)) { // refine the Aborted error manually
      // handle error
    }
  }
});
```

### Logging all saga errors

You can specify the [createCreateSaga](../api.md#createCreateSaga) `onError` handler, but note the following about this handler:
- It runs in parallel with the main saga error handling, meaning it **does not** prevent you from refining an error, as shown in the previous section.
- It triggers every time **any** saga at **any** [level](../glossary.md#tree) throws an error upward. Even if the error is caught at a higher level, this will not prevent the `onError` handler from being fired.

```ts
import {createCreateSaga} from '@promise-saga/core';

export const createSaga = createCreateSaga({
  plugin,

  onError(err, node) {
    if (node.level === 1 && isSagaError(err)) {
      console.error(err.node, node);
    }
  },
});
```

In the example above, we want to log only top-level errors (`node.level = 1`), which are not handled by any sagas at other levels.

Every error occurring within a saga has a `node` property of type [SagaTreeNode](../glossary.md#treeNode). Additionally, the `node` is passed into the handler function immediately after the error object. These nodes might be identical, but not always.

For instance, if an error occurs at level 2 (SagaA calls SagaB, and SagaB throws an error), `err.node.level` will equal 2. However, the error handler in the example above is designed to log uncaught errors only at `node.level = 1`. In this case, the error bubbles up similarly to an event in a browser, so `err.node.level` is comparable to [Event.target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target), where node represents the node where the error occurred, and `node.level` is comparable to [Event.currentTarget](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget), where node is the node listening for the errors.

Check error handling within [non-blocking calls](non-blocking-calls.md#error-handling) for more information.
