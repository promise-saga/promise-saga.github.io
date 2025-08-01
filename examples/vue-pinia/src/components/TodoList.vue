<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTodosStore} from '@/models/Todos';

const todosStore = useTodosStore();
const {todos, newTodoText} = storeToRefs(todosStore);

const addTodo = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    const text = (e.currentTarget as HTMLInputElement).value;
    todosStore.addTodo(text);
    todosStore.changeNewTodoText('');
  }
};

const toggleTodo = (id: number) => {
  todosStore.toggleTodo(id);
};

const changeNewTodo = (e: Event) => {
  todosStore.changeNewTodoText((e.currentTarget as HTMLInputElement).value);
};
</script>

<template>
  <h4>Todos</h4>

  <input
    type="text"
    placeholder="New todo"
    :value="newTodoText"
    @input="changeNewTodo"
    @keydown="addTodo"
  />

  <ol>
    <li v-for="todo in todos" v-bind:key="todo.id">
      <label :style="{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }">
        <input
          type="checkbox"
          :checked="todo.isCompleted || false"
          @change="toggleTodo(todo.id)"
        />

        {{ todo.text }}
      </label>
    </li>
  </ol>
</template>
