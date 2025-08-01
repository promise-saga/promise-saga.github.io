import {EventEmitter} from './EventEmitter';
import {SagaIterator} from './types';
import {cancellable} from './cancellable';

export class Observable<T> extends EventEmitter<T> {
  private _value: T;
  private readonly abortController: AbortController;

  constructor(value: T, abortController: AbortController) {
    super();
    this._value = value;
    this.abortController = abortController;
  }

  get value() {
    return this._value;
  }

  setValue(value: T): Observable<T> {
    this._value = value;
    this.emit('value', value);
    return this;
  }

  onValue(value: T): SagaIterator<T> {
    let handleNext: (value: T) => void;

    return cancellable<T>(new Promise((resolve) => {
      handleNext = (nextValue: T) => {
        if (nextValue === value) {
          resolve(value);
        }
      };
      this.once('value', handleNext);
    }), {
      abortController: this.abortController,
      onFinally: () => {
        this.off('value', handleNext);
      },
    });
  }
}
