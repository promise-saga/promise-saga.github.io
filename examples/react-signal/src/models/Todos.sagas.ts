import {createSaga} from '../store/saga';
import * as Todos from './Todos';

export const listenTodoToggles = createSaga(async function () {
  for (let i = 1; ; i++) {
    await this.take(Todos.toggleTodo);

    if (i % 3 === 0) {
      const todos = Todos.todos.value;
      const isAllCompleted = todos.every((todo) => todo.isCompleted);

      console.log(`Toggled ${i} todos!`, {isAllCompleted});
    }
  }
});
