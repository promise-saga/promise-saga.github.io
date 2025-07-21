# Overview

Promise Saga is a side effects orchestrator boasting several competitive qualities:

1. **Strongly typed** - we embrace [Typescript](https://www.typescriptlang.org) for its strong typing capabilities.
2. **Agnostic but pluggable** - while Promise Saga is agnostic to specific libraries, it has a set of plugins for popular libraries like [Redux](https://redux.js.org), [Zustand](https://zustand-demo.pmnd.rs) and others.
3. **In-component saga usage** - sagas can be manually cancelled or automatically cancelled upon the unmount of a [React](https://react.dev) component.
4. **Cancellable network requests out of the box** - we provide plugins for [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) and [Axios](https://axios-http.com) that support cancellable network requests.

Use the command below to install:

```bash
npm install promise-saga
```

And you're ready to write sagas like this:

```tsx
// create saga by wrapping an async function
export const listenTodoToggles = createSaga(async function() {
    for (let i = 1; ; i++) {
        // use effects inside to control its flow
        await this.take(Todos.actions.toggleTodo); // wait for Redux action to happen

        if (i % 3 === 0) {
            const todos = this.select(getTodos); // select from Redux store
            const isAllCompleted = todos.every((todo) => todo.isCompleted);

            await this.delay(500);
            console.log(`Toggled ${i} todos!`, {isAllCompleted});
            await this.dispatch(doneAction()); // dispatch Redux action
        }
    }
});

export function TodosContainer() {
    // call sagas within a component
    const saga = useSaga(listenTodoToggles);

    return (
      <>
        <input
          type="checkbox"
          onChange={saga.toggle}
          checked={saga.isRunning}
        />
        
        Todos
      </>
    );
}
```

Interested? See the following sections for more information.
