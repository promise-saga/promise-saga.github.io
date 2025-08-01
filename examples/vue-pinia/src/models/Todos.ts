import {ref} from 'vue';
import {defineStore} from 'pinia';

export type ITodo = {
  id: number;
  text: string;
  isCompleted?: boolean;
};

export const useTodosStore = defineStore('todos', () => {
  const newTodoText = ref('');
  const todos = ref<ITodo[]>([
    { id: 1, text: 'Implement RTK', isCompleted: true },
    { id: 2, text: 'Play with coroutines' },
  ]);

  function addTodo(text: string) {
    todos.value.push({ id: Date.now(), text });
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id);
    if (todo) todo.isCompleted = !todo.isCompleted;
  }

  function changeNewTodoText(text: string) {
    newTodoText.value = text;
  }

  return {
    todos,
    newTodoText,
    addTodo,
    toggleTodo,
    changeNewTodoText,
  };
});
