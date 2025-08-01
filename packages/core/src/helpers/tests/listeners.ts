export const _sagaListeners = {
  listenersCount: 0,
  maxListenersCount: 0,

  increaseCount() {
    const next = ++this.listenersCount;
    if (next > this.maxListenersCount) this.maxListenersCount = next;
    return next;
  },

  decreaseCount() {
    --this.listenersCount;
  },
};
