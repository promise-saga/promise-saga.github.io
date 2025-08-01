<script setup lang="ts">
import {computed} from 'vue';
import {useStore} from 'vuex';

const store = useStore();
const todos = computed(() => store.state.todos.todos);
const newTodoText = computed(() => store.state.todos.newTodoText);

const addTodo = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    store.commit('todos/addTodo', (e.currentTarget as HTMLInputElement).value);
    store.commit('todos/changeNewTodoText', '');
  }
};

const toggleTodo = (id: number) => {
  store.commit('todos/toggleTodo', id);
};

const changeNewTodo = (e: Event) => {
  store.commit('todos/changeNewTodoText', (e.currentTarget as HTMLInputElement).value);
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
