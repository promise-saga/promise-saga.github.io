import {type ChangeEventHandler, type KeyboardEventHandler, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Todos from '../models/Todos';

export default function TodoList() {
  const dispatch = useDispatch();
  const todos = useSelector(Todos.selectors.getTodos);
  const newTodoText = useRef<HTMLInputElement>(null);

  const addTodo: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      dispatch(Todos.actions.addTodo(e.currentTarget.value));

      if (newTodoText.current) {
        newTodoText.current.value = '';
      }
    }
  };

  const toggleTodo = (id: number) => {
    dispatch(Todos.actions.toggleTodo(id));
  };

  const changeNewTodo: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(Todos.actions.changeNewTodoText(e.currentTarget.value));
  };

  return (
    <>
      <h4>Todos</h4>

      <input
        type="text"
        placeholder="New todo"
        ref={newTodoText}
        onKeyDown={addTodo}
        onChange={changeNewTodo}
      />

      <ol>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label style={{textDecoration: todo.isCompleted ? 'line-through' : 'none'}}>
              <input
                type="checkbox"
                checked={todo.isCompleted || false}
                onChange={() => toggleTodo(todo.id)}
              />

              {todo.text}
            </label>
          </li>
        ))}
      </ol>
    </>
  );
}
