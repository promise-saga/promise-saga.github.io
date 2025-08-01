import {lazyInject} from '@promise-saga/plugin-angular';
import {createSaga} from '../saga';
import {TodosStateService} from './todos-state.service';

const context = {
  TodosStateService: lazyInject<TodosStateService>(TodosStateService),
};

export const listenTodoToggles = createSaga(async function () {
  const {toggleTodo, todos$} = this.TodosStateService();

  for (let i = 1; ; i++) {
    await this.take(toggleTodo);

    if (i % 3 === 0) {
      const isAllCompleted = todos$().every((todo) => todo.isCompleted);

      console.log(`Toggled ${i} todos!`, {isAllCompleted});
    }
  }
}, {this: context});
