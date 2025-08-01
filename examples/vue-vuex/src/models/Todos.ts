import {Module} from 'vuex';
import {createAction} from '@promise-saga/core';
import {IState} from '@/store';

export type ITodo = {
  id: number;
  text: string;
  isCompleted?: boolean;
};

export type ITodosState = {
  newTodoText: string,
  todos: ITodo[],
};

const Todos: Module<ITodosState, IState> = {
  namespaced: true,

  state() {
    return {
      newTodoText: '',
      todos: [
        {id: 1, text: 'Implement RTK', isCompleted: true},
        {id: 2, text: 'Play with coroutines'},
      ],
    };
  },

  mutations: {
    addTodo: createAction((state, text: string) => {
      state.todos.push({id: Date.now(), text});
    }),

    toggleTodo: createAction((state, id: number) => {
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo) todo.isCompleted = !todo.isCompleted;
    }),

    changeNewTodoText: createAction((state, text: string) => {
      state.newTodoText = text;
    }),
  },
};

export default Todos;
