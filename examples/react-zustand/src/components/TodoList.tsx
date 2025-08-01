import {type ChangeEventHandler, type KeyboardEventHandler, useRef} from 'react';
import {useTodosStore} from '../models/Todos';

export default function TodoList() {
  const todos = useTodosStore();
  const newTodoText = useRef<HTMLInputElement>(null);

  const addTodo: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      todos.addTodo(e.currentTarget.value);

      if (newTodoText.current) {
        newTodoText.current.value = '';
      }
    }
  };

  const toggleTodo = (id: number) => {
    todos.toggleTodo(id);
  };

  const changeNewTodo: ChangeEventHandler<HTMLInputElement> = (e) => {
    todos.changeNewTodoText(e.currentTarget.value);
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
        {todos.todos.map((todo) => (
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
