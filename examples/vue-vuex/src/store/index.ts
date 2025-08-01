import {createStore} from 'vuex';
import todos, {ITodosState} from '@/models/Todos';

export type IState = {
  todos: ITodosState,
};

export default createStore<IState>({
  modules: {
    todos,
  },
});
