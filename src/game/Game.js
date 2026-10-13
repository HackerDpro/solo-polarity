import { Player } from '../entities/Player.js';
import { InputManager } from './InputManager.js';
import { CONFIG } from './constants.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = new InputManager(canvas);

    this.state = 'start'; // start | playing | paused | gameover
    this.lastTime = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
    this.bots = [];
    this.particles = [];

    this._bindUI();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  get bounds() {
    const p = CONFIG.ARENA_PADDING;
    return { left: p, top: p, right: this.canvas.width - p, bottom: this.canvas.height - p };
  }

  _bindUI() {
    document.getElementById('start-btn').addEventListener('click', () => this.start());
    document.getElementById('restart-btn').addEventListener('click', () => this.start());
  }

  start() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    this.state = 'playing';
    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
  }

  loop(timestamp) {
    const dt = Math.min(0.033, (timestamp - this.lastTime) / 1000 || 0);
    this.lastTime = timestamp;
    this.update(dt);
    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    if (this.state !== 'playing') return;
    this.player.handleInput(this.input, dt);
    this.player.update(dt, this.bounds);
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.fillStyle = CONFIG.CANVAS_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const b = this.bounds;
    ctx.strokeStyle = 'rgba(78,240,255,0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(b.left, b.top, b.right - b.left, b.bottom - b.top);

    if (this.state === 'playing' || this.state === 'paused') {
      this.player.draw(ctx);
    }
  }

  run() { requestAnimationFrame((t) => this.loop(t)); }
}