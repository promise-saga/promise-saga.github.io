import {lazyInject} from '@promise-saga/plugin-angular';
import {TodosStateService} from './todos-state.service';
import {createSaga} from '../saga';

const context = {
  TodosStateService: lazyInject<TodosStateService>(TodosStateService),
};

export const listenTodoToggles = createSaga(async function () {
  const {toggleTodo, todosSubject} = this.TodosStateService();

  for (let i = 1; ; i++) {
    await this.take(toggleTodo);

    if (i % 3 === 0) {
      const isAllCompleted = todosSubject.getValue().every((todo) => todo.isCompleted);

      console.log(`Toggled ${i} todos!`, {isAllCompleted});
    }
  }
}, {this: context});
