import { Vector2 } from '../physics/Vector2.js';

export class Entity {
  constructor(x, y, radius) {
    this.pos = new Vector2(x, y);
    this.vel = new Vector2(0, 0);
    this.radius = radius;
    this.alive = true;
  }
  update(dt) { this.pos = this.pos.add(this.vel.scale(dt)); }
  draw(ctx) {}
}