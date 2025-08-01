import {computed, signal} from '@preact/signals-react';
import {createAction} from '@promise-saga/core';

type ITodo = {
  id: number;
  text: string;
  isCompleted?: boolean;
};

export const todos = signal<ITodo[]>([
  {id: 1, text: 'Implement RTK', isCompleted: true},
  {id: 2, text: 'Play with coroutines'},
]);

export const addTodo = createAction((text: string) => {
  todos.value = [
    ...todos.value,
    { id: Date.now(), text, isCompleted: false },
  ];
});

export const toggleTodo = createAction((id: number) => {
  todos.value = todos.value.map((todo) =>
    todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
  );
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const changeNewTodoText = createAction((text: string) => {});

export const getTodos = computed(() => todos.value);
