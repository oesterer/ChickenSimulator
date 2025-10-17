import Entity from './entity.js';
import Vector from '../util/vector.js';

export default class Player extends Entity {
  constructor(options = {}) {
    super({
      position: options.position ?? new Vector(),
      size: { w: 80, h: 80 },
      tags: ['player'],
    });
    this.speed = options.speed ?? 6;
    this.sprite = options.sprite;
    this.world = options.world;
  }

  update(ctx) {
    const inputDir = ctx.input.getMovementVector();
    const frameSpeed = this.speed * ctx.delta * 60;
    this.velocity = inputDir.mul(frameSpeed);
    this.position = this.position.add(this.velocity);
    this.position = this.world.clampToBounds(this.position, this.size);
  }

  draw(ctx) {
    if (!this.sprite) return;
    const screenPos = ctx.camera.worldToScreen(this.position);
    ctx.canvas.drawImage(
      this.sprite,
      0,
      0,
      32,
      32,
      screenPos.x,
      screenPos.y,
      this.size.w,
      this.size.h,
    );
  }
}
