import {ArrayOr} from './helpers/toArray';
import {_sagaListeners} from './helpers/tests/listeners';

export type EventAction = string | symbol;
export type EventListener<T> = (value: T, action: EventAction) => void;

export class EventEmitter<T = any> {
  private listenersMap = new Map<EventAction, Map<EventListener<T>, boolean>>();

  private addListener(action: EventAction, listener: EventListener<T>, once = false) {
    let listeners = this.listenersMap.get(action);
    if (!listeners) {
      listeners = new Map();
      this.listenersMap.set(action, listeners);
    }

    listeners.set(listener, once);
    if (process.env.NODE_ENV === 'test') _sagaListeners.increaseCount();
  }

  private removeListener(action: EventAction, listener: EventListener<T>) {
    const listeners = this.listenersMap.get(action);
    if (!listeners) return;

    listeners.delete(listener);
    if (process.env.NODE_ENV === 'test') _sagaListeners.decreaseCount();
  }

  private emitMap(action: EventAction, value: T) {
    const listeners = this.listenersMap.get(action);
    if (listeners) {
      for (const [listener, once] of listeners.entries()) {
        listener(value, action);
        if (once) this.removeListener(action, listener);
      }
    }
  }

  emit(action: EventAction, value: T) {
    this.emitMap(action, value);
    this.emitMap('*', value);
  }

  on(actions: ArrayOr<EventAction>, listener: EventListener<T>) {
    if (!Array.isArray(actions)) return this.addListener(actions, listener);
    for (const action of actions) this.addListener(action, listener);
  }

  once(actions: ArrayOr<EventAction>, listener: EventListener<T>) {
    if (!Array.isArray(actions)) return this.addListener(actions, listener, true);
    for (const action of actions) this.addListener(action, listener, true);
  }

  off(actions: ArrayOr<EventAction>, listener: EventListener<T>) {
    if (!Array.isArray(actions)) return this.removeListener(actions, listener);
    for (const action of actions) this.removeListener(action, listener);
  }
}
