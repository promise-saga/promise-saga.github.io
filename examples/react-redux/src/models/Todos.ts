import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

type ITodo = {
  id: number;
  text: string;
  isCompleted?: boolean;
};

type ITodosState = {
  todos: ITodo[];
};

export default createSlice({
  name: 'todos',

  initialState: {
    todos: [
      {id: 1, text: 'Implement RTK', isCompleted: true},
      {id: 2, text: 'Play with coroutines'},
    ],
  },

  reducers: {
    addTodo(state: ITodosState, action: PayloadAction<string>) {
      state.todos.push({
        id: Date.now(),
        text: action.payload,
      });
    },

    toggleTodo(state: ITodosState, action: PayloadAction<number>) {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) todo.isCompleted = !todo.isCompleted;
    },

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changeNewTodoText(state: ITodosState, action: PayloadAction<string>) { }
  },

  selectors: {
    getTodos: (state: ITodosState) => state.todos,
  },
});
