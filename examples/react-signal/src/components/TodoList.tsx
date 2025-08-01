import {type ChangeEventHandler, type KeyboardEventHandler, useRef} from 'react';
import {useSignals} from '@preact/signals-react/runtime';
import * as Todos from '../models/Todos';

export default function TodoList() {
  useSignals();

  const newTodoText = useRef<HTMLInputElement>(null);

  const addTodo: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      Todos.addTodo(e.currentTarget.value);

      if (newTodoText.current) {
        newTodoText.current.value = '';
      }
    }
  };

  const toggleTodo = (id: number) => {
    Todos.toggleTodo(id);
  };

  const changeNewTodo: ChangeEventHandler<HTMLInputElement> = (e) => {
    Todos.changeNewTodoText(e.currentTarget.value);
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
        {Todos.getTodos.value.map((todo) => (
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
