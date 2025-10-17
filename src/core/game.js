import GameLoop from './gameLoop.js';
import Camera from './camera.js';
import EventBus from './eventBus.js';
import Input from './input.js';
import Player from '../entities/player.js';
import Dog from '../entities/dog.js';
import NpcChicken from '../entities/npcChicken.js';
import Corn from '../entities/corn.js';
import World from '../world/world.js';
import Waypoints from '../world/waypoints.js';
import BackgroundRenderer from '../systems/backgroundRenderer.js';
import { intersects } from '../systems/collision.js';
import Vector from '../util/vector.js';

export default class Game {
  constructor({ canvas, assets, sounds }) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.assets = assets;
    this.sounds = sounds;

    this.world = new World();
    this.input = new Input();
    this.events = new EventBus();
    this.camera = new Camera({ viewWidth: canvas.width, viewHeight: canvas.height, world: this.world });
    this.waypoints = new Waypoints();

    this.background = new BackgroundRenderer({
      world: this.world,
      tiles: {
        grass: this.assets.getImage('grass'),
        dirt: this.assets.getImage('dirt'),
        water: this.assets.getImage('water'),
      },
    });

    this.player = new Player({
      position: new Vector(30, 30),
      sprite: this.assets.getImage('chicken'),
      world: this.world,
    });

    this.dog = new Dog({
      position: new Vector(700, 30),
      sprite: this.assets.getImage('dog'),
      world: this.world,
    });

    this.npcs = [
      new NpcChicken({ name: 'Miso', position: new Vector(0, 0), sprite: this.assets.getImage('npc') }),
      new NpcChicken({ name: 'Inari', position: new Vector(100, 100), sprite: this.assets.getImage('npc') }),
      new NpcChicken({ name: 'Omlet', position: new Vector(150, 200), sprite: this.assets.getImage('npc') }),
      new NpcChicken({ name: 'Boba', position: new Vector(250, 150), sprite: this.assets.getImage('npc') }),
    ];

    this.cornField = this.createCornField(200);

    this.score = 0;
    this.chickenSoundTimer = 0;
    this.dogDamageCooldown = 0;

    this.loop = new GameLoop({
      update: (delta) => this.step(delta),
      render: () => this.draw(),
    });
  }

  start() {
    this.input.attach();
    this.loop.start();
  }

  stop() {
    this.loop.stop();
    this.input.detach();
  }

  step(delta) {
    const updateCtx = {
      delta,
      input: this.input,
      world: this.world,
      player: this.player,
      npcs: this.npcs,
      dog: this.dog,
      events: this.events,
      waypoints: this.waypoints,
    };

    this.player.update(updateCtx);
    this.dog.update(updateCtx);
    this.npcs.forEach((npc) => npc.update(updateCtx));

    this.camera.follow(this.player);

    this.resolveCornCollisions();
    this.resolveDogCollision(delta);
    this.updateSoundTimer(delta);
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const drawCtx = {
      canvas: this.context,
      camera: this.camera,
      world: this.world,
    };

    this.background.draw(drawCtx);
    this.cornField.forEach((corn) => corn.draw(drawCtx));
    this.npcs.forEach((npc) => npc.draw(drawCtx));
    this.player.draw(drawCtx);
    this.dog.draw(drawCtx);

    this.context.font = '48px serif';
    this.context.fillStyle = '#000';
    this.context.fillText(`Points: ${this.score}`, this.canvas.width - 240, 50);
  }

  createCornField(count) {
    const cornSprite = this.assets.getImage('corn');
    const corns = [];
    for (let i = 0; i < count; i++) {
      corns.push(
        new Corn({
          position: Corn.random(this.world),
          sprite: cornSprite,
        }),
      );
    }
    return corns;
  }

  resolveCornCollisions() {
    const colliders = [
      {
        entity: this.player,
        onCollect: () => {
          this.score += 1;
          this.sounds.play('chicken');
          this.chickenSoundTimer = 0.75;
        },
      },
      ...this.npcs.map((npc) => ({
        entity: npc,
        onCollect: () => npc.onCornConsumed(),
      })),
    ];

    this.cornField.forEach((corn) => {
      const bounds = corn.getBounds();
      for (const collider of colliders) {
        if (intersects(collider.entity.getBounds(), bounds)) {
          corn.position = Corn.random(this.world);
          collider.onCollect();
          break;
        }
      }
    });
  }

  resolveDogCollision(delta) {
    if (this.dogDamageCooldown > 0) {
      this.dogDamageCooldown -= delta;
    }
    if (intersects(this.player.getBounds(), this.dog.getBounds()) && this.dogDamageCooldown <= 0) {
      this.score -= 1;
      this.dogDamageCooldown = 0.35;
    }
  }

  updateSoundTimer(delta) {
    if (this.chickenSoundTimer > 0) {
      this.chickenSoundTimer -= delta;
      if (this.chickenSoundTimer <= 0) {
        this.sounds.stop('chicken');
      }
    }
  }
}
