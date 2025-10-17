import Vector from '../util/vector.js';

export default class Entity {
  constructor({ position = new Vector(), size = { w: 0, h: 0 }, tags = [] } = {}) {
    this.position = position;
    this.size = size;
    this.tags = new Set(tags);
    this.velocity = new Vector();
  }

  update(_ctx) {}

  draw(_ctx) {}

  getBounds() {
    return {
      x: this.position.x,
      y: this.position.y,
      w: this.size.w,
      h: this.size.h,
    };
  }
}
