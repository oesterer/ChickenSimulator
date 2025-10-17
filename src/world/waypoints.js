import Vector from '../util/vector.js';

const DEFAULT_LOCATIONS = [
  new Vector(50, 50),
  new Vector(100, 100),
  new Vector(100, 1002),
  new Vector(200, 502),
  new Vector(300, 803),
  new Vector(300, 504),
  new Vector(500, 105),
];

export default class Waypoints {
  constructor(points = DEFAULT_LOCATIONS) {
    this.points = points;
  }

  random() {
    return this.points[Math.floor(Math.random() * this.points.length)];
  }
}
