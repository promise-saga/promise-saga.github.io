import {makeObservable, observable} from 'mobx';
import {createAction} from '@promise-saga/core';
import {createSaga} from '../saga';

type ITodo = {
  id: number;
  text: string;
  isCompleted?: boolean;
};

class TodosStore {
  data: ITodo[] = [
    {id: 1, text: 'Implement RTK', isCompleted: true},
    {id: 2, text: 'Play with coroutines'},
  ];

  constructor() {
    makeObservable(this, {
      data: observable,
    });
  }

  getData = () => this.data;

  changeNewTodoText = createAction();

  addTodo = createAction((text: string) => {
    this.data.push({
      id: Date.now(),
      text,
      isCompleted: false,
    });
  });

  toggleTodo = createAction((id: number) => {
    const todo = this.data.find((todo) => todo.id === id);
    if (todo) todo.isCompleted = !todo.isCompleted;
  });

  listenTodoToggles = createSaga(async function () {
    for (let i = 1; ; i++) {
      await this.take(this.toggleTodo);

      if (i % 3 === 0) {
        const todos = this.getData();
        const isAllCompleted = todos.every((todo) => todo.isCompleted);

        console.log(`Toggled ${i} todos!`, {isAllCompleted});
      }
    }
  }, {this: this});
}

export default new TodosStore();
