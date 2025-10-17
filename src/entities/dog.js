import Entity from './entity.js';
import Vector from '../util/vector.js';

export default class Dog extends Entity {
  constructor({ position, sprite, world }) {
    super({
      position: position ?? new Vector(),
      size: { w: 174, h: 130 },
      tags: ['dog'],
    });
    this.sprite = sprite;
    this.world = world;
    this.direction = new Vector(-1, 1).normalize();
    this.speed = 200;
    this.chasePriority = ['player', 'npc'];
    this.repathCooldown = 0;
    this.retaliationCooldown = 0;
    this.currentTarget = null;
    this.lastCaught = null;
    this.lastCatchCooldown = 0;
  }

  update(ctx) {
    this.updateCooldowns(ctx.delta);
    const target = this.findTarget(ctx);
    this.currentTarget = target;
    if (target) {
      const caught = this.chaseTarget(target, ctx.delta);
      if (caught) {
        this.currentTarget = null;
        this.repathCooldown = 0;
      }
    } else {
      this.wander(ctx.delta);
    }
  }

  draw(ctx) {
    if (!this.sprite) return;
    const screenPos = ctx.camera.worldToScreen(this.position);
    ctx.canvas.drawImage(
      this.sprite,
      0,
      0,
      348,
      261,
      screenPos.x,
      screenPos.y,
      this.size.w,
      this.size.h,
    );
  }

  updateCooldowns(delta) {
    if (this.retaliationCooldown > 0) {
      this.retaliationCooldown -= delta;
    }
    if (this.repathCooldown > 0) {
      this.repathCooldown -= delta;
    }
    if (this.lastCatchCooldown > 0) {
      this.lastCatchCooldown -= delta;
      if (this.lastCatchCooldown <= 0) {
        this.lastCaught = null;
      }
    }
  }

  findTarget(ctx) {
    const candidates = [];
    candidates.push({ entity: ctx.player, type: 'player' });
    ctx.npcs.forEach((npc) => {
      candidates.push({ entity: npc, type: 'npc' });
    });

    let bestTarget = null;
    let bestScore = Infinity;

    candidates.forEach(({ entity, type }) => {
      if (this.lastCaught && entity === this.lastCaught && this.lastCatchCooldown > 0) {
        return;
      }
      const distance = entity.position.sub(this.position).length();
      const typeBias = this.chasePriority.indexOf(type);
      const score = distance + (typeBias >= 0 ? typeBias * 50 : 200);
      if (distance < 1000 && score < bestScore) {
        bestScore = score;
        bestTarget = entity;
      }
    });

    return bestTarget;
  }

  chaseTarget(target, delta) {
    const toTarget = target.position.sub(this.position);
    const distance = toTarget.length();
    if (distance === 0) {
      this.recordCatch(target);
      return true;
    }

    if (this.repathCooldown <= 0 || distance < 120) {
      this.direction = toTarget.normalize();
      this.repathCooldown = 0.4 + Math.random() * 0.4;
    }

    const move = this.direction.mul(this.speed * delta);
    this.position = this.position.add(move);
    this.position = this.world.clampToBounds(this.position, this.size);

    const updatedDistance = target.position.sub(this.position).length();
    const captureRadius = Math.min(this.size.w, this.size.h) * 0.35 + Math.min(target.size.w, target.size.h) * 0.35;
    if (updatedDistance < captureRadius) {
      this.recordCatch(target);
      return true;
    }

    return false;
  }

  wander(delta) {
    const move = this.direction.mul(this.speed * 0.5 * delta);
    this.position = this.world.clampToBounds(this.position.add(move), this.size);

    const atEdge =
      this.position.x <= 0 ||
      this.position.x >= this.world.width - this.size.w ||
      this.position.y <= 0 ||
      this.position.y >= this.world.height - this.size.h;

    if (atEdge || Math.random() < 0.01) {
      const randomDirection = new Vector(Math.random() - 0.5, Math.random() - 0.5).normalize();
      this.direction = randomDirection;
    }
  }

  recordCatch(target) {
    this.lastCaught = target;
    this.lastCatchCooldown = 1.5;
  }
}
