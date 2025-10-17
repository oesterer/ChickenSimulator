export default class BackgroundRenderer {
  constructor({ world, tiles }) {
    this.world = world;
    this.tiles = tiles;
  }

  draw(ctx) {
    const { camera, canvas } = ctx;
    this.world.forEachTile(({ tile, x, y }) => {
      const screenX = x - camera.view.x;
      const screenY = y - camera.view.y;
      if (screenX + this.world.tileSize < 0 || screenY + this.world.tileSize < 0) {
        return;
      }
      if (screenX > camera.size.w || screenY > camera.size.h) {
        return;
      }
      const sprite = this.selectTileSprite(tile);
      if (!sprite) return;
      canvas.drawImage(sprite, 1, 1, 232, 232, screenX, screenY, this.world.tileSize, this.world.tileSize);
    });
  }

  selectTileSprite(tile) {
    switch (tile) {
      case 0:
        return this.tiles.grass;
      case 1:
        return this.tiles.dirt;
      case 2:
        return this.tiles.water;
      default:
        return this.tiles.grass;
    }
  }
}
