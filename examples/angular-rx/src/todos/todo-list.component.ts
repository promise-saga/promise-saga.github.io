import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {ITodo, TodosStateService} from './todos-state.service';

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-list.component.html',
})
export class TodoList {
  todos$: Observable<ITodo[]>;
  newTodoText$: Observable<string>;

  constructor(private todosState: TodosStateService) {
    this.todos$ = this.todosState.todos$;
    this.newTodoText$ = this.todosState.newTodoText$;
  }

  onToggle(todoId: number) {
    this.todosState.toggleTodo(todoId);
  }

  onAddTodo(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (value) {
      this.todosState.addTodo(value);
      input.value = '';
    }
  }

  changeNewTodo(event: Event) {
    const input = event.target as HTMLInputElement;
    this.todosState.changeNewTodo(input.value);
  }
}
