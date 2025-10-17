import AssetManager from './services/assetManager.js';
import SoundManager from './services/soundManager.js';
import Game from './core/game.js';

async function boot() {
  const canvas = document.getElementById('canvas');
  if (!canvas) {
    throw new Error('Canvas element with id="canvas" not found');
  }

  const assets = new AssetManager();
  await assets.loadAssets({
    images: {
      chicken: './assets/images/Chicken_Run.gif',
      corn: './assets/images/corn.png',
      dog: './assets/images/dog-removebg-preview.png',
      grass: './assets/images/grass.png',
      water: './assets/images/water.jpg',
      dirt: './assets/images/dirt.png',
      npc: './assets/images/npc.gif',
    },
    audio: {
      chicken: './assets/audio/chicken-sound.mp3',
    },
  });

  const sounds = new SoundManager({ assets });
  const game = new Game({ canvas, assets, sounds });
  game.start();
}

window.addEventListener('load', () => {
  boot().catch((error) => {
    console.error('Failed to boot game', error);
  });
});
