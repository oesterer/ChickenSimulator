import Vector from '../util/vector.js';
import tileMap from './worldMap.js';

export default class World {
  constructor({ tileSize = 100 } = {}) {
    this.tileMap = tileMap;
    this.tileSize = tileSize;
    this.width = this.tileMap[0].length * this.tileSize;
    this.height = this.tileMap.length * this.tileSize;
  }

  clampToBounds(position, size) {
    const x = Math.max(0, Math.min(position.x, this.width - size.w));
    const y = Math.max(0, Math.min(position.y, this.height - size.h));
    return new Vector(x, y);
  }

  clampView(view, size) {
    const x = Math.max(0, Math.min(view.x, this.width - size.w));
    const y = Math.max(0, Math.min(view.y, this.height - size.h));
    return new Vector(x, y);
  }

  forEachTile(callback) {
    for (let row = 0; row < this.tileMap.length; row++) {
      for (let col = 0; col < this.tileMap[row].length; col++) {
        const tileX = col * this.tileSize;
        const tileY = row * this.tileSize;
        callback({
          tile: this.tileMap[row][col],
          x: tileX,
          y: tileY,
        });
      }
    }
  }

  randomPoint() {
    return new Vector(
      Math.random() * (this.width - 1),
      Math.random() * (this.height - 1),
    );
  }

  randomPointNear(position, radius = 250) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;
    const offset = new Vector(
      Math.cos(angle) * distance,
      Math.sin(angle) * distance,
    );
    const target = position.add(offset);
    return this.clampToBounds(target, { w: 0, h: 0 });
  }
}
