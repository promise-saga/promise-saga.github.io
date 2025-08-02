import {Component, inject} from '@angular/core';
import {useSaga, UseSagaReturn} from '@promise-saga/plugin-angular';
import {TodoList} from '../todos/todo-list.component';
import {SagaCheckbox} from '../saga-checkbox/saga-checkbox.component';
import {listenTodoToggles} from '../todos/todos-state.sagas';
import {TodosStateService} from '../todos/todos-state.service';
import {useDebounce} from '../saga';

@Component({
  selector: 'app-root',
  imports: [TodoList, SagaCheckbox],
  templateUrl: './app.component.html',
  standalone: true,
})
export class AppComponent {
  listenTogglesFlow: UseSagaReturn;
  logNewTodoFlow: UseSagaReturn;

  constructor() {
    const {changeNewTodo} = inject(TodosStateService);

    this.listenTogglesFlow = useSaga(listenTodoToggles);
    this.logNewTodoFlow = useDebounce(1000, changeNewTodo, console.log);
  }
}
