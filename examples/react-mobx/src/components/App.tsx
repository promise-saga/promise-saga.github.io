import {observer} from 'mobx-react-lite';
import {useSaga} from '@promise-saga/plugin-react';
import {useDebounce} from '../saga';
import Todos from '../models/Todos';
import TodoList from './TodoList';

const SagaCheckbox = ({flow}: {flow: ReturnType<typeof useSaga>}) => (
  <input type="checkbox" onChange={flow.toggle} checked={flow.isRunning} />
);

const App = observer(() => {
  const listenTogglesFlow = useSaga(Todos.listenTodoToggles);
  const logNewTodoFlow = useDebounce(1000, Todos.changeNewTodoText, console.log);

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
});

export default App;
