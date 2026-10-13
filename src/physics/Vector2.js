export class Vector2 {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  add(v) { return new Vector2(this.x + v.x, this.y + v.y); }
  sub(v) { return new Vector2(this.x - v.x, this.y - v.y); }
  scale(s) { return new Vector2(this.x * s, this.y * s); }
  get length() { return Math.hypot(this.x, this.y); }
  normalized() {
    const len = this.length;
    return len === 0 ? new Vector2() : this.scale(1 / len);
  }
  static distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
}