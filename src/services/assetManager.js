export default class AssetManager {
  constructor() {
    this.images = new Map();
    this.audio = new Map();
  }

  async loadAssets(spec) {
    const imagePromises = Object.entries(spec.images ?? {}).map(([key, path]) =>
      this._loadImage(path).then((image) => this.images.set(key, image)),
    );

    const audioPromises = Object.entries(spec.audio ?? {}).map(([key, path]) =>
      this._loadAudio(path).then((sound) => this.audio.set(key, sound)),
    );

    await Promise.all([...imagePromises, ...audioPromises]);
  }

  getImage(key) {
    return this.images.get(key);
  }

  getAudio(key) {
    const original = this.audio.get(key);
    if (!original) return undefined;
    return original.cloneNode(true);
  }

  _loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', () => reject(new Error(`Image failed: ${src}`)));
      image.src = src;
    });
  }

  _loadAudio(src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
      audio.addEventListener('error', () => reject(new Error(`Audio failed: ${src}`)));
      audio.src = src;
      audio.load();
    });
  }
}
