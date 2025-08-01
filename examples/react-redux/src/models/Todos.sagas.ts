import {createSaga} from '../store/saga';
import Todos from './Todos';

export const listenTodoToggles = createSaga(async function () {
  for (let i = 1; ; i++) {
    await this.take(Todos.actions.toggleTodo);

    if (i % 3 === 0) {
      const todos = this.select(Todos.selectors.getTodos);
      const isAllCompleted = todos.every((todo) => todo.isCompleted);

      console.log(`Toggled ${i} todos!`, {isAllCompleted});
    }
  }
});
