import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {createAction} from '@promise-saga/core';

export type ITodo = {
  id: number,
  text: string,
  isCompleted?: boolean,
};

@Injectable({
  providedIn: 'root'
})
export class TodosStateService {
  todosSubject = new BehaviorSubject<ITodo[]>([
    {id: 1, text: 'Implement RTK', isCompleted: true},
    {id: 2, text: 'Play with coroutines'},
  ]);
  todos$ = this.todosSubject.asObservable();

  newTodoTextSubject = new BehaviorSubject<string>('');
  newTodoText$ = this.newTodoTextSubject.asObservable();

  addTodo = createAction((text: string) => {
    const current = this.todosSubject.getValue();
    const newTodo: ITodo = {
      id: Date.now(),
      text,
      isCompleted: false,
    };
    this.todosSubject.next([...current, newTodo]);
  });

  toggleTodo = createAction((id: number) => {
    const current = this.todosSubject.getValue();
    const updated = current.map(todo =>
      todo.id === id ? {...todo, isCompleted: !todo.isCompleted} : todo
    );
    this.todosSubject.next(updated);
  });

  changeNewTodo = createAction((text: string) => {
    this.newTodoTextSubject.next(text);
  });
}
