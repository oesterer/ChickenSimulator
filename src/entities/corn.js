import Entity from './entity.js';
import Vector from '../util/vector.js';

export default class Corn extends Entity {
  constructor({ position, sprite }) {
    super({
      position,
      size: { w: 25, h: 100 },
      tags: ['corn'],
    });
    this.sprite = sprite;
  }

  draw(ctx) {
    if (!this.sprite) return;
    const screenPos = ctx.camera.worldToScreen(this.position);
    ctx.canvas.drawImage(
      this.sprite,
      0,
      0,
      214,
      854,
      screenPos.x,
      screenPos.y,
      this.size.w,
      this.size.h,
    );
  }

  static random(world) {
    const x = Math.floor(Math.random() * (world.width - 25));
    const y = Math.floor(Math.random() * (world.height - 100));
    return new Vector(x, y);
  }
}
