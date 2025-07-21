# Troubleshooting

### 1. Can't find needed effect inside createSaga?

The plugin might not be connected properly. Try to check [Plugin basics](basics.md#plugins), and how to [merge plugins](api.md#mergePlugins).

### 2. Effect not working?

There could be a mismatch in using `await` with effects. Try to check the [api reference](api.md) for more information. Note that there are:
- Effects typically called with `await`, like [take](api.md#take), [call](api.md#call), or [delay](api.md#delay).
- Effects called without `await`, like [select](api.md#select), [fork](api.md#fork), or [spawn](api.md#spawn).

### 3. Can't catch an error?

Using sagas in a non-blocking way (without `await`) can result in difficulties catching errors outside such effect calls. Try to check non-blocking calls [error handling](recipes/non-blocking-calls.md#error-handling).

### 4. Getting an 'Aborted' error in try..catch?

Cancellation is implemented by throwing an error (specifically, an AbortError), and it can be performed manually (via [cancel](api.md#cancel) effect calls) and automatically (for instance, [useSaga](api.md#useSaga) calls [cancel](api.md#cancel) on React component unmount as well).

### 5. Saga not getting cancelled instantly?

Sagas get cancelled through the effects you use. This usually works well since many effects call [this.throwIfCancelled](api.md#throwIfCancelled) under the hood. However, large synchronous blocks of code without effect calls inside cannot be aborted during their execution, except manually. Check the [error handling](recipes/error-handling.md) recipes, which suggest using effects more frequently. For further details, see [this.throwIfCancelled](api.md#throwIfCancelled).

### Tell us about your problem

Feel free to [create an issue](https://github.com/promise-saga/promise-saga.github.io/issues/new) on GitHub.
