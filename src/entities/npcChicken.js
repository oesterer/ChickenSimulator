import Entity from './entity.js';
import Vector from '../util/vector.js';

export default class NpcChicken extends Entity {
  constructor({ name, position, sprite, program } = {}) {
    super({
      position: position ?? new Vector(),
      size: { w: 80, h: 80 },
      tags: ['npc'],
    });
    this.name = name;
    this.sprite = sprite;
    this.target = position ?? new Vector();
    this.pauseTimer = Math.random() * 1.5;
    this.bobPhase = Math.random() * Math.PI * 2;
    this.moveSpeed = this.randomSpeed();
    this.cornEaten = 0;
    this.program = program;
    this.fearTimer = 0;
  }

  update(ctx) {
    if (this.pauseTimer > 0) {
      this.pauseTimer = Math.max(0, this.pauseTimer - ctx.delta);
    }

    if (this.fearTimer > 0) {
      this.fearTimer = Math.max(0, this.fearTimer - ctx.delta);
    }

    if (!this.target || this.position.sub(this.target).length() < 12) {
      this.chooseNextTarget(ctx);
    }

    if (ctx.dog) {
      const toDog = ctx.dog.position.sub(this.position);
      const dogDistance = toDog.length();
      if (dogDistance < 250) {
        this.runFromDog(ctx, toDog, dogDistance);
      }
    }

    if (this.pauseTimer <= 0 && this.target) {
      const toTarget = this.target.sub(this.position);
      const distance = toTarget.length();
      if (distance > 1) {
        const direction = toTarget.normalize();
        const travel = Math.min(distance, this.moveSpeed * ctx.delta);
        const nextPosition = this.position.add(direction.mul(travel));
        this.position = ctx.world.clampToBounds(nextPosition, this.size);
        this.velocity = direction.mul(this.moveSpeed);
      }
    }
    this.bobPhase = (this.bobPhase + ctx.delta * (2 + this.moveSpeed / 30)) % (Math.PI * 2);
  }

  draw(ctx) {
    if (!this.sprite) return;
    const bobOffset = Math.sin(this.bobPhase) * 3;
    const screenPos = ctx.camera.worldToScreen(
      new Vector(this.position.x, this.position.y + bobOffset),
    );
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

  chooseNextTarget(ctx) {
    if (this.fearTimer > 0) {
      this.target = ctx.world.randomPointNear(this.position, 400);
    } else if (this.program && this.program.length) {
      const nextStep = this.program[Math.floor(Math.random() * this.program.length)];
      if (nextStep?.target instanceof Vector) {
        this.target = nextStep.target;
      } else {
        this.target = ctx.world.randomPoint();
      }
    } else if (Math.random() < 0.4) {
      this.target = ctx.waypoints.random();
    } else {
      this.target = ctx.world.randomPointNear(this.position, 400);
    }
    this.moveSpeed = this.randomSpeed();
    this.pauseTimer = 0.3 + Math.random() * 1.2;
  }

  randomSpeed() {
    return 40 + Math.random() * 45;
  }

  onCornConsumed() {
    this.cornEaten += 1;
    this.pauseTimer = 0.1 + Math.random() * 0.6;
    this.target = null;
  }

  runFromDog(ctx, toDog, dogDistance) {
    const directionAway = toDog.mul(-1).normalize();
    const desiredDistance = Math.min(350, dogDistance + 120);
    const retreatTarget = this.position.add(directionAway.mul(desiredDistance));
    this.target = ctx.world.clampToBounds(retreatTarget, this.size);
    this.fearTimer = 1.5 + Math.random();
    this.moveSpeed = 70 + Math.random() * 55;
    this.pauseTimer = 0;
  }
}
