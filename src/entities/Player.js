import { Entity } from './Entity.js';
import { CONFIG } from '../game/constants.js';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, CONFIG.PLAYER.RADIUS);
    this.energy = CONFIG.FIELD.ENERGY_MAX;
    this.mode = 'idle'; // 'attract' | 'repel' | 'idle'
    this.health = 100;
    this.tier = 0;
  }

  handleInput(input, dt) {
    const move = input.moveVector;
    this.vel.x += move.x * CONFIG.PLAYER.ACCEL * dt;
    this.vel.y += move.y * CONFIG.PLAYER.ACCEL * dt;
    this.vel = this.vel.scale(CONFIG.PLAYER.FRICTION);

    const speed = this.vel.length;
    if (speed > CONFIG.PLAYER.MAX_SPEED) {
      this.vel = this.vel.normalized().scale(CONFIG.PLAYER.MAX_SPEED);
    }

    const wantsAttract = input.mouse.left;
    const wantsRepel = input.mouse.right;

    if ((wantsAttract || wantsRepel) && this.energy > 0) {
      this.mode = wantsAttract ? 'attract' : 'repel';
      this.energy = Math.max(0, this.energy - CONFIG.FIELD.ENERGY_DRAIN * dt);
    } else {
      this.mode = 'idle';
      this.energy = Math.min(CONFIG.FIELD.ENERGY_MAX, this.energy + CONFIG.FIELD.ENERGY_REGEN * dt);
    }
  }

  update(dt, bounds) {
    super.update(dt);
    this.pos.x = Math.max(bounds.left + this.radius, Math.min(bounds.right - this.radius, this.pos.x));
    this.pos.y = Math.max(bounds.top + this.radius, Math.min(bounds.bottom - this.radius, this.pos.y));
  }

  draw(ctx) {
    ctx.save();
    if (this.mode !== 'idle') {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, CONFIG.FIELD.RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = this.mode === 'attract' ? 'rgba(78,240,255,0.35)' : 'rgba(255,100,80,0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 10]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.shadowBlur = CONFIG.PLAYER.GLOW;
    ctx.shadowColor = CONFIG.PLAYER.COLOR;
    ctx.fillStyle = CONFIG.PLAYER.COLOR;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}