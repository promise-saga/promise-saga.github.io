import {useAtom} from 'jotai';
import {useObservableRef, useSaga} from '@promise-saga/plugin-react';
import {createSaga, useDebounce} from '../saga';
import {changeNewTodoText, toggleTodo} from '../models/Todos';
import TodoList from './TodoList';
import * as todosModel from '../models/Todos';

const SagaCheckbox = ({flow}: {flow: ReturnType<typeof useSaga>}) => (
  <input type="checkbox" onChange={flow.toggle} checked={flow.isRunning} />
);

export default function App() {
  const [todos] = useAtom(todosModel.data);
  const todosRef = useObservableRef(todos);

  const listenTogglesFlow = useSaga(createSaga(async function () {
    for (let i = 1; ; i++) {
      await this.take(toggleTodo);

      if (i % 3 === 0) {
        const todos = todosRef.current;
        const isAllCompleted = todos.every((todo) => todo.isCompleted);

        console.log(`Toggled ${i} todos!`, {isAllCompleted});
      }
    }
  }));
  const logNewTodoFlow = useDebounce(1000, changeNewTodoText, console.log);

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
