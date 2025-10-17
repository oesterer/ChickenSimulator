export default class GameLoop {
  constructor({ update, render }) {
    this.update = update;
    this.render = render;
    this.lastTime = 0;
    this.rafId = null;
  }

  start() {
    this.lastTime = performance.now();
    const tick = (time) => {
      const delta = (time - this.lastTime) / 1000;
      this.lastTime = time;
      this.update(delta);
      this.render();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
