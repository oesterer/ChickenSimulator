export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v2) {
    return new Vector(this.x + v2.x, this.y + v2.y);
  }

  sub(v2) {
    return new Vector(this.x - v2.x, this.y - v2.y);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  mul(num) {
    return new Vector(this.x * num, this.y * num);
  }

  div(num) {
    return new Vector(this.x / num, this.y / num);
  }

  normalize() {
    const len = this.length();
    if (len === 0) {
      return new Vector(0, 0);
    }
    return this.div(len);
  }

  clamp(maxLength) {
    if (this.length() <= maxLength) {
      return new Vector(this.x, this.y);
    }
    return this.normalize().mul(maxLength);
  }

  toString() {
    return `[${this.x},${this.y}]`;
  }
}
