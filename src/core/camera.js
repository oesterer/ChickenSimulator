import Vector from '../util/vector.js';

export default class Camera {
  constructor({ viewWidth, viewHeight, world }) {
    this.view = new Vector(0, 0);
    this.size = { w: viewWidth, h: viewHeight };
    this.world = world;
  }

  follow(target) {
    const focusX = target.position.x + target.size.w / 2;
    const focusY = target.position.y + target.size.h / 2;
    const desiredView = new Vector(
      focusX - this.size.w / 2,
      focusY - this.size.h / 2,
    );
    this.view = this.world.clampView(desiredView, this.size);
  }

  worldToScreen(position) {
    return new Vector(position.x - this.view.x, position.y - this.view.y);
  }
}
