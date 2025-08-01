<script lang="ts">
  import {useSaga} from '@promise-saga/plugin-svelte';
  import {useDebounce} from '../saga';
  import {listenTodoToggles} from '../models/Todos.sagas';
  import {changeNewTodoText} from '../models/Todos.svelte';
  import TodoList from './TodoList.svelte';
  import SagaCheckbox from './SagaCheckbox.svelte';

  const listenTogglesFlow = useSaga(listenTodoToggles);
  const logNewTodoFlow = useDebounce(1000, changeNewTodoText, console.log);
</script>

<div>
    <label>
        <SagaCheckbox flow={logNewTodoFlow}/>
        Log new todo text, debounce 1000ms
    </label>
</div>

<div>
    <label>
        <SagaCheckbox flow={listenTogglesFlow}/>
        Log todos toggling, count by 3
    </label>
</div>

<TodoList/>
