import {FnAction} from '@promise-saga/core';
import {createSaga} from '@/store/saga';
import store from '@/store';
import Todos from './Todos';

export const listenTodoToggles = createSaga(async function () {
  for (let i = 1; ; i++) {
    await this.take(Todos.mutations?.toggleTodo as FnAction);

    if (i % 3 === 0) {
      const {todos} = store.state.todos;
      const isAllCompleted = todos.every((todo) => todo.isCompleted);

      console.log(`Toggled ${i} todos!`, {isAllCompleted});
    }
  }
});
