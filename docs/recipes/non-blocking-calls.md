# Non-blocking Calls

Non-blocking sagas execution can be primarily achieved with [concurrency](concurrency.md) effects. Though you can fork and spawn sagas as well.

### [Fork](../api.md#fork)

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
In the example given above, `console.log('success!')` is never executed since `childSaga` is cancelled sooner with the help of [cancel](../api.md#cancel).

As soon as `childSaga` is cancelled, its `finally` block gets executed. `this.cancelled()` inside returns `true` since the saga has been cancelled.

Forking comes with a sagas parent-child relationship. See a more advanced example demonstrating that:

```ts
const parentSaga = createSaga(async function() {
    const task = this.fork(childSaga);
    // ...
    await this.delay(1500); // perform saga logic for 1500ms
    this.cancel(task);
});

const childSaga = createSaga(async function() {
    await this.delay(1000); // perform saga logic for 1000ms
    this.fork(grandChildSaga);
});

const grandChildSaga = createSaga(async function() {
    await this.delay(1000); // perform saga logic for 1000ms
    console.log('success!');
});
```

In the example above, `console.log('success!')` could be executed after `1000ms` + `1000ms`, though `childSaga` and `grandChildSaga` will get cancelled sooner.

### [Spawn](../api.md#spawn)

Spawn might be useful to detach a saga from the parent and make it orphan. For example:

```ts
const parentSaga = createSaga(async function() {
    const task = this.spawn(childSaga);
    // ...
    await this.delay(1500); // perform saga logic for 1500ms
    this.cancel(task);
});

const childSaga = createSaga(async function() {
    await this.delay(1000); // perform saga logic for 1000ms
    this.spawn(grandChildSaga);
});

const grandChildSaga = createSaga(async function() {
    await this.delay(1000); // perform saga logic for 1000ms
    console.log('success!');
});
```

In the example above, `childSaga` gets detached from `parentSaga`, so `childSaga` is not going to be cancelled automatically when `parentSaga` gets cancelled. However, manual cancellation will work the same.

`grandChildSaga` gets detached from `childSaga` and is not going to be autocancelled as well. Knowing this, `childSaga` is going to be cancelled in `1500ms`, though `grandChildSaga` will finish and output `console.log('success!')` in `2000ms`.

### Error handling

Promise Saga allows you to `try..catch` children sagas called in a non-blocking way.

```ts
const parentSaga = createSaga(async function() {
    try {
        await this.call(childSaga);
    } catch (err) {
        console.error(err.message); // catched: test error
    }
});

const childSaga = createSaga(async function() {
    await this.delay(1000); // perform saga logic for 1000ms
    this.fork(grandChildSaga); // non-blocking
});

const grandChildSaga = createSaga(async function() {
    await this.delay(1000); // perform saga logic for 1000ms
    throw Error('test error');
    console.log('success!');
});
```

Since the parent saga always waits for children to complete, they listen to their errors as well. In the example above, sagas have a strong parent relationship: `parentSaga` > `childSaga` > `grandChildSaga`. So the error is properly caught by the `catch` block.

**Though some caveats exist:**

You can `try..catch` `await`'s only. In a similar example below, you might assume the error to be caught, though it is not possible due to the non-blocking way to call:

```ts
const parentSaga = createSaga(async function() {
    try {
        this.fork(childSaga); // skip await
    } catch (err) {
        console.error(err.message); // catching error doesn't work
    }
});

const childSaga = createSaga(async function() {
    await this.delay(1000); // perform saga logic for 1000ms
    this.fork(grandChildSaga); // non-blocking
});

const grandChildSaga = createSaga(async function() {
    await this.delay(1000); // perform saga logic for 1000ms
    throw Error('test error');
    console.log('success!');
});
```

You can't catch an error out of `spawn`. But you're always allowed to use `try..catch` inside `spawn`, on a `childSaga` level:

```ts
const saga = createSaga(async function() {
    this.spawn(childSaga).catch(console.error); // this won't work
});

const childSaga = createSaga(async function() {
    try {
        await this.delay(1000);
        console.log('success!');
    } catch (err) {
        console.error(err.message); // but this will!
    }
});
```
