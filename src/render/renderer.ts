import { PLAY_H, PLAY_W, START_LIVES, STARTUP_DURATION } from '../game/config';
import type { GameEvent, GameState } from '../game/state';
import {
  FONT,
  FONT_H,
  FONT_W,
  HUMAN,
  LIFE,
  OBJECT_SPRITES,
  SEVEN_SEGMENT,
  type Bitmap,
} from './sprites';

/** Two-tone LCD palette: dark segments on a pale green-grey background (FR9.1). */
const BG = '#b7c3a5';
const INK = '#1f2a1c';
const GHOST = 'rgba(31, 42, 28, 0.10)';
const OFF_SCREEN = '#8d9880';

const DIGIT_W = 5;
const DIGIT_H = 9;
const SCORE_DIGITS = 6;

interface Popup {
  text: string;
  x: number;
  y: number;
  age: number;
}

interface Spark {
  x: number;
  y: number;
  age: number;
}

const POPUP_LIFE = 0.8;
const SPARK_LIFE = 0.28;
const GLITCH_LIFE = 0.45;
const WARNING_LIFE = 1.0;
const FLASH_LIFE = 0.16;

/** Cheap deterministic hash so the glitch looks random but needs no state. */
function hash(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

export class Renderer {
  private readonly ctx: CanvasRenderingContext2D | null;
  private popups: Popup[] = [];
  private sparks: Spark[] = [];
  private glitch = 0;
  private warning = 0;
  private flash = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d');
    if (this.ctx) this.ctx.imageSmoothingEnabled = false;
  }

  /** Starts the effects that belong to a game event (FR7.3-FR7.6). */
  onEvent(e: GameEvent): void {
    switch (e.type) {
      case 'catch':
        this.popups.push({ text: `+${e.points}`, x: e.x, y: e.y, age: 0 });
        this.sparks.push({ x: e.x + 8, y: e.y + 8, age: 0 });
        this.flash = FLASH_LIFE;
        break;
      case 'virus-hit':
        this.glitch = GLITCH_LIFE;
        break;
      case 'life-lost':
        this.warning = WARNING_LIFE;
        break;
      case 'game-start':
        this.popups = [];
        this.sparks = [];
        this.glitch = 0;
        this.warning = 0;
        this.flash = 0;
        break;
      default:
        break;
    }
  }

  /** Ages the effects. */
  update(dt: number): void {
    for (const p of this.popups) p.age += dt;
    for (const s of this.sparks) s.age += dt;
    this.popups = this.popups.filter((p) => p.age < POPUP_LIFE);
    this.sparks = this.sparks.filter((s) => s.age < SPARK_LIFE);
    this.glitch = Math.max(0, this.glitch - dt);
    this.warning = Math.max(0, this.warning - dt);
    this.flash = Math.max(0, this.flash - dt);
  }

  /** Draws the whole LCD screen for the current state. `now` is in seconds. */
  draw(state: GameState, now: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.fillStyle = state.phase === 'power-off' ? OFF_SCREEN : BG;
    ctx.fillRect(0, 0, PLAY_W, PLAY_H);

    switch (state.phase) {
      case 'power-off':
        break;
      case 'startup':
        this.drawStartup(ctx, state.startupTime / STARTUP_DURATION);
        break;
      case 'title':
        this.drawTitle(ctx, state, now);
        break;
      case 'playing':
        this.drawPlaying(ctx, state, now);
        break;
      case 'game-over':
        this.drawGameOver(ctx, state, now);
        break;
    }
  }

  // ---- screens -------------------------------------------------------------

  private drawStartup(ctx: CanvasRenderingContext2D, p: number): void {
    const wipe = 0.4;
    if (p < wipe) {
      // Scan-line fill: the whole screen lights up from the top.
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, PLAY_W, Math.floor((p / wipe) * PLAY_H));
      return;
    }
    const q = Math.min(1, (p - wipe) / (1 - wipe));
    // Unlit segments show first, then the logo and the five characters appear one by one.
    this.drawText(ctx, 'AI CATCH', PLAY_W / 2, 40, 3, INK, true);
    const sprites: Bitmap[] = [
      HUMAN,
      OBJECT_SPRITES.llm,
      OBJECT_SPRITES.gpu,
      OBJECT_SPRITES.robot,
      OBJECT_SPRITES.virus,
    ];
    const shown = Math.floor(q * (sprites.length + 1));
    const total = sprites.reduce((w, s) => w + (s[0]?.length ?? 0) + 6, -6);
    let x = Math.floor((PLAY_W - total) / 2);
    sprites.forEach((s, i) => {
      this.drawBitmap(ctx, s, x, 80, i < shown ? INK : GHOST);
      x += (s[0]?.length ?? 0) + 6;
    });
  }

  private drawTitle(ctx: CanvasRenderingContext2D, state: GameState, now: number): void {
    this.drawText(ctx, 'AI CATCH', PLAY_W / 2, 18, 3, INK, true);
    const row: Bitmap[] = [
      OBJECT_SPRITES.llm,
      OBJECT_SPRITES.gpu,
      OBJECT_SPRITES.robot,
      OBJECT_SPRITES.virus,
    ];
    let x = 36;
    for (const s of row) {
      this.drawBitmap(ctx, s, x, 52, INK);
      x += 46;
    }
    this.drawText(ctx, 'HI', 70, 88, 1, INK, false);
    this.drawNumber(ctx, state.best, 82, 84);
    if (Math.floor(now * 2) % 2 === 0) {
      this.drawText(ctx, 'PRESS START', PLAY_W / 2, 124, 1, INK, true);
    }
  }

  private drawPlaying(ctx: CanvasRenderingContext2D, state: GameState, now: number): void {
    // HUD: score (seven-segment) and lives.
    this.drawNumber(ctx, state.score, 4, 3);
    this.drawLives(ctx, state, now);
    ctx.fillStyle = INK;
    ctx.fillRect(0, 14, PLAY_W, 1);
    ctx.fillRect(0, PLAY_H - 1, PLAY_W, 1);

    for (const o of state.objects) {
      this.drawBitmap(ctx, OBJECT_SPRITES[o.kind], Math.round(o.x), Math.round(o.y), INK, o.w, o.h);
    }

    // HUMAN, inverted for a moment after a catch.
    const hx = Math.round(state.human.x);
    const hy = Math.round(state.human.y);
    if (this.flash > 0) {
      ctx.fillStyle = INK;
      ctx.fillRect(hx - 1, hy - 1, state.human.w + 2, state.human.h + 2);
      this.drawBitmap(ctx, HUMAN, hx, hy, BG);
    } else {
      this.drawBitmap(ctx, HUMAN, hx, hy, INK);
    }

    for (const s of this.sparks) this.drawSpark(ctx, s);
    for (const p of this.popups) {
      const y = Math.round(p.y - p.age * 24);
      this.drawText(ctx, p.text, Math.round(Math.min(PLAY_W - 20, Math.max(2, p.x))), Math.max(16, y), 1, INK, false);
    }

    // Warning: blinking frame after a life is lost.
    if (this.warning > 0 && Math.floor(this.warning * 10) % 2 === 0) {
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, PLAY_W, 2);
      ctx.fillRect(0, PLAY_H - 2, PLAY_W, 2);
      ctx.fillRect(0, 0, 2, PLAY_H);
      ctx.fillRect(PLAY_W - 2, 0, 2, PLAY_H);
    }

    if (this.glitch > 0) this.applyGlitch(ctx, now);
  }

  private drawGameOver(ctx: CanvasRenderingContext2D, state: GameState, now: number): void {
    this.drawText(ctx, 'GAME OVER', PLAY_W / 2, 20, 3, INK, true);
    this.drawText(ctx, 'SCORE', 70, 60, 1, INK, false);
    this.drawNumber(ctx, state.score, 100, 56);
    if (state.newHighScore && Math.floor(now * 3) % 2 === 0) {
      this.drawText(ctx, 'NEW HIGH SCORE', PLAY_W / 2, 82, 1, INK, true);
    }
    this.drawText(ctx, 'HI', 70, 104, 1, INK, false);
    this.drawNumber(ctx, state.best, 82, 100);
    if (state.canRestart && Math.floor(now * 2) % 2 === 0) {
      this.drawText(ctx, 'PRESS ANY KEY', PLAY_W / 2, 132, 1, INK, true);
    }
    if (this.glitch > 0) this.applyGlitch(ctx, now);
  }

  // ---- parts ---------------------------------------------------------------

  private drawLives(ctx: CanvasRenderingContext2D, state: GameState, now: number): void {
    const w = LIFE[0]?.length ?? 7;
    const gap = 3;
    const total = START_LIVES * (w + gap) - gap;
    let x = PLAY_W - total - 4;
    const blinkOff = this.warning > 0 && Math.floor(now * 8) % 2 === 0;
    for (let i = 0; i < START_LIVES; i++) {
      this.drawBitmap(ctx, LIFE, x, 4, GHOST);
      if (i < state.lives && !(blinkOff && i === state.lives - 1)) {
        this.drawBitmap(ctx, LIFE, x, 4, INK);
      }
      x += w + gap;
    }
  }

  private drawSpark(ctx: CanvasRenderingContext2D, s: Spark): void {
    const r = 6 + (s.age / SPARK_LIFE) * 10;
    ctx.fillStyle = INK;
    const cx = Math.round(s.x);
    const cy = Math.round(s.y);
    const d = Math.round(r);
    ctx.fillRect(cx - d, cy, 3, 1);
    ctx.fillRect(cx + d - 2, cy, 3, 1);
    ctx.fillRect(cx, cy - d, 1, 3);
    ctx.fillRect(cx, cy + d - 2, 1, 3);
  }

  /** Shifted horizontal slices and noise lines (FR7.5). */
  private applyGlitch(ctx: CanvasRenderingContext2D, now: number): void {
    const frame = Math.floor(now * 30);
    for (let i = 0; i < 6; i++) {
      const y = Math.floor(hash(frame * 7 + i) * (PLAY_H - 12));
      const h = 2 + Math.floor(hash(frame * 11 + i) * 8);
      const dx = Math.round((hash(frame * 13 + i) - 0.5) * 24);
      ctx.drawImage(this.canvas, 0, y, PLAY_W, h, dx, y, PLAY_W, h);
    }
    ctx.fillStyle = INK;
    for (let i = 0; i < 3; i++) {
      const y = Math.floor(hash(frame * 17 + i) * PLAY_H);
      ctx.fillRect(Math.floor(hash(frame * 19 + i) * 100), y, 40 + Math.floor(hash(frame + i) * 80), 1);
    }
  }

  private drawBitmap(
    ctx: CanvasRenderingContext2D,
    bm: Bitmap,
    x: number,
    y: number,
    color: string,
    boxW?: number,
    boxH?: number,
  ): void {
    const w = bm[0]?.length ?? 0;
    // Centre the bitmap inside its hit box when a box is given.
    const ox = boxW === undefined ? 0 : Math.floor((boxW - w) / 2);
    const oy = boxH === undefined ? 0 : Math.floor((boxH - bm.length) / 2);
    ctx.fillStyle = color;
    for (let r = 0; r < bm.length; r++) {
      const row = bm[r] as string;
      let c = 0;
      while (c < row.length) {
        if (row[c] === '#') {
          let end = c;
          while (end < row.length && row[end] === '#') end++;
          ctx.fillRect(x + ox + c, y + oy + r, end - c, 1);
          c = end;
        } else {
          c++;
        }
      }
    }
  }

  private textWidth(text: string, scale: number): number {
    return Math.max(0, text.length * (FONT_W + 1) * scale - scale);
  }

  private drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    scale: number,
    color: string,
    centered: boolean,
  ): void {
    let cx = centered ? Math.round(x - this.textWidth(text, scale) / 2) : x;
    ctx.fillStyle = color;
    for (const ch of text.toUpperCase()) {
      const glyph = FONT[ch] ?? FONT[' '];
      if (glyph) {
        for (let r = 0; r < FONT_H; r++) {
          const row = glyph[r] ?? '';
          for (let c = 0; c < FONT_W; c++) {
            if (row[c] === '#') ctx.fillRect(cx + c * scale, y + r * scale, scale, scale);
          }
        }
      }
      cx += (FONT_W + 1) * scale;
    }
  }

  /** Seven-segment number with faint unlit segments behind it (FR6.1). */
  private drawNumber(ctx: CanvasRenderingContext2D, value: number, x: number, y: number): void {
    const v = Math.min(10 ** SCORE_DIGITS - 1, Math.max(0, Math.floor(Number.isFinite(value) ? value : 0)));
    const text = String(v).padStart(SCORE_DIGITS, '0');
    for (let i = 0; i < SCORE_DIGITS; i++) {
      const dx = x + i * (DIGIT_W + 1);
      this.drawDigit(ctx, '8', dx, y, GHOST);
      this.drawDigit(ctx, text[i] ?? '0', dx, y, INK);
    }
  }

  private drawDigit(
    ctx: CanvasRenderingContext2D,
    digit: string,
    x: number,
    y: number,
    color: string,
  ): void {
    const segs = SEVEN_SEGMENT[digit] ?? '';
    const w = DIGIT_W;
    const rects: Record<string, [number, number, number, number]> = {
      a: [x + 1, y, w - 2, 1],
      b: [x + w - 1, y + 1, 1, 3],
      c: [x + w - 1, y + 5, 1, 3],
      d: [x + 1, y + DIGIT_H - 1, w - 2, 1],
      e: [x, y + 5, 1, 3],
      f: [x, y + 1, 1, 3],
      g: [x + 1, y + 4, w - 2, 1],
    };
    ctx.fillStyle = color;
    for (const s of segs) {
      const r = rects[s];
      if (r) ctx.fillRect(r[0], r[1], r[2], r[3]);
    }
  }
}
