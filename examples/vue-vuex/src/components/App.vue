<script setup lang="ts">
import {FnAction} from '@promise-saga/core';
import {useSaga} from '@promise-saga/plugin-vue';
import {useDebounce} from '@/store/saga';
import Todos from '@/models/Todos';
import {listenTodoToggles} from '@/models/Todos.sagas';
import SagaCheckbox from '@/components/SagaCheckbox.vue';
import TodoList from './TodoList.vue';

const listenTogglesFlow = useSaga(listenTodoToggles);
const logNewTodoFlow = useDebounce(1000, Todos.mutations?.changeNewTodoText as FnAction, console.log);
</script>

<template>
  <div>
    <label>
      <SagaCheckbox :flow="logNewTodoFlow" />
      Log new todo text, debounce 1000ms
    </label>
  </div>

  <div>
    <label>
      <SagaCheckbox :flow="listenTogglesFlow" />
      Log todos toggling, count by 3
    </label>
  </div>

  <TodoList />
</template>
