export default class SoundManager {
  constructor({ assets }) {
    this.assets = assets;
    this.active = new Map();
  }

  play(key) {
    const audio = this.assets.getAudio(key);
    if (!audio) return;
    this.stop(key);
    audio.play();
    this.active.set(key, audio);
  }

  stop(key) {
    const audio = this.active.get(key);
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    this.active.delete(key);
  }
}
