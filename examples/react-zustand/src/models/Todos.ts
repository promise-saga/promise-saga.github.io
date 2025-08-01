import {create} from 'zustand';
import {createAction, type FnAction, type SagaIterator} from '@promise-saga/core';
import {createSaga} from '../saga';

type ITodo = {
  id: number;
  text: string;
  isCompleted?: boolean;
};

type ITodosStore = {
  todos: ITodo[];
  addTodo: FnAction<void, [string]>;
  toggleTodo: FnAction<void, [number]>;
  changeNewTodoText: FnAction;
  listenTodoToggles(): SagaIterator;
};

export const useTodosStore = create<ITodosStore>()((set, get) => ({
  todos: [
    {id: 1, text: 'Implement RTK', isCompleted: true},
    {id: 2, text: 'Play with coroutines'},
  ],

  addTodo: createAction((text: string) => {
    set((state) => ({
      todos: state.todos.concat({
        id: Date.now(),
        text,
        isCompleted: false,
      }),
    }));
  }),

  toggleTodo: createAction((id: number) => {
    set((state) => ({
      todos: state.todos.map((todo) => ({
        ...todo,
        isCompleted: todo.id === id ? !todo.isCompleted : todo.isCompleted,
      })),
    }));
  }),

  changeNewTodoText: createAction(),

  listenTodoToggles: createSaga(async function () {
    for (let i = 1; ; i++) {
      await this.take(get().toggleTodo);

      if (i % 3 === 0) {
        const todos = get().todos;
        const isAllCompleted = todos.every((todo) => todo.isCompleted);

        console.log(`Toggled ${i} todos!`, {isAllCompleted});
      }
    }
  }),
}));
