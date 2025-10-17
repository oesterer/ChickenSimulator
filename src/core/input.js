import Vector from '../util/vector.js';

const KEY_MAP = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
};

export default class Input {
  constructor() {
    this.state = new Map();
    this._onKeyDown = this.onKeyDown.bind(this);
    this._onKeyUp = this.onKeyUp.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
  }

  onKeyDown(event) {
    const direction = KEY_MAP[event.code];
    if (direction) {
      event.preventDefault();
      this.state.set(direction, true);
    }
  }

  onKeyUp(event) {
    const direction = KEY_MAP[event.code];
    if (direction) {
      event.preventDefault();
      this.state.set(direction, false);
    }
  }

  getMovementVector() {
    let x = 0;
    let y = 0;
    if (this.state.get('left')) x -= 1;
    if (this.state.get('right')) x += 1;
    if (this.state.get('up')) y -= 1;
    if (this.state.get('down')) y += 1;

    const vector = new Vector(x, y);
    if (x !== 0 || y !== 0) {
      return vector.normalize();
    }
    return vector;
  }
}
