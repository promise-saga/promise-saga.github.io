import {FnAction} from '@promise-saga/core';
import {createSaga} from '@/store/saga';
import {useTodosStore} from './Todos';

export const listenTodoToggles = createSaga(async function () {
  const todosStore = useTodosStore();

  for (let i = 1; ; i++) {
    await this.take(todosStore.toggleTodo as FnAction);

    if (i % 3 === 0) {
      const {todos} = todosStore;
      const isAllCompleted = todos.every((todo) => todo.isCompleted);

      console.log(`Toggled ${i} todos!`, {isAllCompleted});
    }
  }
});
