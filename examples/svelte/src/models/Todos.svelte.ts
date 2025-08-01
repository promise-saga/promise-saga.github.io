import {createAction} from '@promise-saga/core';

export type ITodo = {
  id: number;
  text: string;
  isCompleted?: boolean;
};

export const newTodoText = $state({value: ''});
export const todos = $state<ITodo[]>([
  {id: 1, text: 'Implement RTK', isCompleted: true},
  {id: 2, text: 'Play with coroutines'},
]);

export const addTodo = createAction((text: string) => {
  todos.push({id: Date.now(), text});
});

export const toggleTodo = createAction((id: number) => {
  const index = todos.findIndex(t => t.id === id);
  todos[index] = {
    ...todos[index],
    isCompleted: !todos[index].isCompleted,
  };
});

export const changeNewTodoText = createAction((text: string) => {
  newTodoText.value = text;
});
