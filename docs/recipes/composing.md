# Composing Sagas

Use [call](../api.md#call) to call another saga:
```ts
const saga = createSaga(async function() {
    return 2;
});

const main = createSaga(async function() {
    const result = await this.call(saga);
    console.log(result); // 2
});
```

Use [callFn](../api.md#callFn) to call another function:
```ts
const fn = () => 2;

const main = createSaga(async function() {
    const result = this.callFn(fn);
    console.log(result); // 2
});
```

Use [callPromise](../api.md#callPromise) to call another promise:
```ts
const promise = Promise.resolve(2);

const main = createSaga(async function() {
    const result = await this.callPromise(promise);
    console.log(result); // 2
});
```
