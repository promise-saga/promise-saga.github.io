import {createSaga} from '../saga';
import {todos, toggleTodo} from './Todos.svelte';

export const listenTodoToggles = createSaga(async function () {
  for (let i = 1; ; i++) {
    await this.take(toggleTodo);

    if (i % 3 === 0) {
      const isAllCompleted = todos.every((todo) => todo.isCompleted);

      console.log(`Toggled ${i} todos!`, {isAllCompleted});
    }
  }
});
