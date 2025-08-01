import {atom} from 'jotai';
import {createAction} from '@promise-saga/core';

export type SetAtom<T> = (fn: (t: T) => T) => void;

export type ITodo = {
  id: number;
  text: string;
  isCompleted?: boolean;
};

export const data = atom<ITodo[]>([
  {id: 1, text: 'Implement RTK', isCompleted: true},
  {id: 2, text: 'Play with coroutines'},
]);

export const getTodos = () => data;

export const changeNewTodoText = createAction();

export const addTodo = createAction(
  (text: string, set: SetAtom<ITodo[]>) => {
    set((todos) => todos.concat({
      id: Date.now(),
      text,
      isCompleted: false,
    }));
  },
);

export const toggleTodo = createAction(
  (id: number, set: SetAtom<ITodo[]>) => {
    set((todos) => todos.map((todo) => ({
      ...todo,
      isCompleted: todo.id === id ? !todo.isCompleted : todo.isCompleted,
    })));
  },
);
