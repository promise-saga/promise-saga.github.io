# Debouncing and Throttling

**Debouncing** delays the execution of your code until the user stops performing a certain action for a specified amount of time.

**Throttling** limits the execution of your code to once in every specified time interval. [(source)](https://medium.com/@bs903944/debounce-and-throttling-what-they-are-and-when-to-use-them-eadd272fe0be)

Promise Saga provides effects to handle this behavior. For example:
```ts
const saga = createSaga(async function() {
    this.debounce(500, Todos.actions.toggleTodo, toggleTodo);
    this.throttle(500, Todos.actions.addTodo, addTodo);
});

const toggleTodo = createSaga(async function() {
    //
});

const addTodo = createSaga(async function() {
    //
});
```

Here, [debounce](../api.md#debounce) and [throttle](../api.md#throttle) are designed to act non-blocking. See error handling in [non-blocking calls](non-blocking-calls.md#error-handling) for more information on how to handle errors.

Since higher effects are built on lower ones, there are other ways to reimplement `debounce` and `throttle` with other effects. For example, you can use `takeLatest` with `delay`:
```ts
const saga = createSaga(async function() {
    this.takeLatest(Todos.actions.toggleTodo, toggleTodo);
});

const toggleTodo = createSaga(async function() {
    await this.delay(500);
    // saga logic
});
```
