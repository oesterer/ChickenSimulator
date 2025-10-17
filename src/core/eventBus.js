export default class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    const list = this.listeners.get(event) ?? [];
    list.push(handler);
    this.listeners.set(event, list);
  }

  emit(event, payload) {
    const list = this.listeners.get(event);
    if (!list) return;
    list.forEach((handler) => handler(payload));
  }
}
