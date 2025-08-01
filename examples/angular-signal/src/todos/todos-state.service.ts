import {Injectable, signal} from '@angular/core';
import {createAction} from '@promise-saga/core';

export type ITodo = {
  id: number;
  text: string;
  isCompleted?: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class TodosStateService {
  private todos = signal<ITodo[]>([
    {id: 1, text: 'Implement RTK', isCompleted: true},
    {id: 2, text: 'Play with coroutines'},
  ]);

  private newTodoText = signal<string>('');

  readonly todos$ = this.todos.asReadonly();
  readonly newTodoText$ = this.newTodoText.asReadonly();

  addTodo = createAction((text: string) => {
    this.todos.update((current) => [
      ...current,
      {
        id: Date.now(),
        text,
        isCompleted: false,
      },
    ]);
  });

  toggleTodo = createAction((id: number) => {
    this.todos.update((current) =>
      current.map((todo) =>
        todo.id === id ? {...todo, isCompleted: !todo.isCompleted} : todo
      )
    );
  });

  changeNewTodo = createAction((text: string) => {
    this.newTodoText.set(text);
  });
}
