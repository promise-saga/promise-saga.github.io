import {useSaga} from '@promise-saga/plugin-react';
import {useDebounce} from '../saga';
import {useTodosStore} from '../models/Todos';
import TodoList from './TodoList';

const SagaCheckbox = ({flow}: {flow: ReturnType<typeof useSaga>}) => (
  <input type="checkbox" onChange={flow.toggle} checked={flow.isRunning} />
);

export default function App() {
  const todos = useTodosStore();
  const listenTogglesFlow = useSaga(todos.listenTodoToggles);
  const logNewTodoFlow = useDebounce(1000, todos.changeNewTodoText, console.log);

  return (
    <>
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
    </>
  );
}
