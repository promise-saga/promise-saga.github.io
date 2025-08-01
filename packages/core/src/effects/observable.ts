import {Observable} from '../Observable';
import {SagaNodeScope} from '../types';

export function observable<T>(this: SagaNodeScope, value: T): Observable<T> {
  return new Observable(value, this.abortController);
}
