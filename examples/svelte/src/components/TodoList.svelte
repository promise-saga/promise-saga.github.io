<script lang="ts">
  import * as model from '../models/Todos.svelte';

  const {newTodoText, todos} = model;

  const addTodo = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const text = (e.currentTarget as HTMLInputElement).value;
      model.addTodo(text);
      newTodoText.value = '';
    }
  };

  const toggleTodo = (id: number) => {
    model.toggleTodo(id);
  };

  const changeNewTodo = (e: Event) => {
    model.changeNewTodoText((e.currentTarget as HTMLInputElement).value);
  };
</script>

<h4>Todos</h4>

<input
        type="text"
        placeholder="New todo"
        value={newTodoText.value}
        oninput={changeNewTodo}
        onkeydown={addTodo}
/>

<ol>
    {#each todos as todo(todo.id)}
        <li>
            <label style:text-decoration={todo.isCompleted ? 'line-through' : 'none' }>
                <input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onchange={() => toggleTodo(todo.id)}
                />
                {todo.text}
            </label>
        </li>
    {/each}
</ol>
