import {type ChangeEventHandler, type KeyboardEventHandler, useRef} from 'react';
import {useAtom} from 'jotai';
import * as todosModel from '../models/Todos';

export default function TodoList() {
  const [todos, setTodos] = useAtom(todosModel.data);
  const newTodoText = useRef<HTMLInputElement>(null);

  const addTodo: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      todosModel.addTodo(e.currentTarget.value, setTodos);

      if (newTodoText.current) {
        newTodoText.current.value = '';
      }
    }
  };

  const toggleTodo = (id: number) => {
    todosModel.toggleTodo(id, setTodos);
  };

  const changeNewTodo: ChangeEventHandler<HTMLInputElement> = (e) => {
    todosModel.changeNewTodoText(e.currentTarget.value);
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
