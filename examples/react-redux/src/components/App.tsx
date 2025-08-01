import {Provider} from 'react-redux';
import {useSaga} from '@promise-saga/plugin-react';
import {listenTodoToggles} from '../models/Todos.sagas';
import TodoList from './TodoList';
import Todos from '../models/Todos';
import {useDebounce} from '../store/saga';
import store from '../store';

const SagaCheckbox = ({flow}: {flow: ReturnType<typeof useSaga>}) => (
  <input type="checkbox" onChange={flow.toggle} checked={flow.isRunning} />
);

export default function App() {
  const listenTogglesFlow = useSaga(listenTodoToggles);
  const logNewTodoFlow = useDebounce(1000, Todos.actions.changeNewTodoText, console.log);

  return (
    <Provider store={store}>
      <div>
        <label>
          <SagaCheckbox flow={logNewTodoFlow} />
          Log new todo text, debounce 1000ms
        </label>
      </div>

      <div>
        <label>
          <SagaCheckbox flow={listenTogglesFlow} />
          Log todos toggling, count by 3
        </label>
      </div>

      <TodoList />
    </Provider>
  );
}
