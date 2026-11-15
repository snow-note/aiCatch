import { CLEAR_BAR_FILL, OBJECT_H, OBJECT_W, PLAY_H, PLAY_W, START_LIVES, VICTORY_RESTORE_END } from '../game/config';
import { ENDING_LINES } from './ending';
import type { GameEvent, GameView, ObjectKind } from '../game/types';
import {
  barFill,
  blinkOn,
  hudTexts,
  endingView,
  noiseLines,
  reachedLine,
  timerText,
  timerVisible,
  victoryBarFill,
  victoryStep,
} from './screen-timing';
import {
  AI_FACE_BROKEN,
  AI_FACE_RESTORED,
  FLOPPY,
  FONT,
  FONT_H,
  FONT_W,
  HUMAN,
  LIFE,
  MAINFRAME,
  OBJECT_SPRITES,
  SEVEN_SEGMENT,
  TAPE,
  type Bitmap,
} from './sprites';

/** Every kind has its own sprite; an unknown kind falls back to the LLM chip and never throws (BR2.2). */
function spriteFor(kind: ObjectKind): Bitmap {
  switch (kind) {
    case 'mainframe':
      return MAINFRAME;
    case 'tape':
      return TAPE;
    case 'floppy':
      return FLOPPY;
    case 'gpu':
      return OBJECT_SPRITES.gpu;
    case 'robot':
      return OBJECT_SPRITES.robot;
    case 'virus':
      return OBJECT_SPRITES.virus;
    default:
      return OBJECT_SPRITES.llm;
  }
}

/** Two-tone LCD palette: dark segments on a pale green-grey background (FR9.1). */
const BG = '#b7c3a5';
const INK = '#1f2a1c';
const GHOST = 'rgba(31, 42, 28, 0.10)';

const DIGIT_W = 5;
const DIGIT_H = 9;
const SCORE_DIGITS = 6;

/** Ending message text area: 12 lines at an 8 px pitch from y 6 (FR2.2). */
const ENDING_WINDOW = 12;
const ENDING_TOP = 6;
const ENDING_PITCH = 8;

/** AI bar geometry (shared part): 160 x 6 outline at x 40. */
const BAR_X = 40;
const BAR_W = 160;
const BAR_H = 6;
const BAR_LABEL_X = 26;
const BAR_PERCENT_X = 204;

/** Label and number columns used by the score lines. */
const LABEL_X = 56;
const VALUE_X = 94;
const NEW_X = 136;

/** HUD columns (mockups.md). */
const HUD_NAME_X = 2;
const HUD_AI_X = 34;
const HUD_SCORE_X = 66;
const HUD_PROGRESS_X = 108;
const HUD_TIMER_X = 132;
const HUD_LIVES_X = 202;

/** Victory noise changes position this many times per second. */
const NOISE_HZ = 10;

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
      case 'run-start':
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

  /** Draws the whole LCD screen for the current state. `now` is in seconds. Reads GameView only (BR1.1). */
  draw(state: GameView, now: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, PLAY_W, PLAY_H);

    switch (state.phase) {
      case 'title':
        this.drawTitle(ctx, state);
        break;
      case 'stage-intro':
        this.drawStageIntro(ctx, state);
        break;
      case 'playing':
        this.drawPlaying(ctx, state, now);
        break;
      case 'stage-clear':
        this.drawStageClear(ctx, state);
        break;
      case 'victory':
        this.drawVictory(ctx, state);
        break;
      case 'game-over':
        this.drawGameOver(ctx, state, now);
        break;
    }
  }

  // ---- screens -------------------------------------------------------------

  /** SC-1 (BR1.2). */
  private drawTitle(ctx: CanvasRenderingContext2D, state: GameView): void {
    this.drawText(ctx, 'AI CATCH', PLAY_W / 2, 16, 3, INK, true);
    const row: Bitmap[] = [MAINFRAME, TAPE, FLOPPY, OBJECT_SPRITES.llm, OBJECT_SPRITES.virus];
    row.forEach((s, i) => this.drawBitmap(ctx, s, 24 + i * 44, 44, INK, OBJECT_W, OBJECT_H));
    this.drawText(ctx, '2045. A VIRUS BROKE THE AI.', PLAY_W / 2, 72, 1, INK, true);
    this.drawText(ctx, 'RECOVER COMPUTING HISTORY.', PLAY_W / 2, 80, 1, INK, true);
    this.drawText(ctx, 'SAVE IT.', PLAY_W / 2, 88, 1, INK, true);
    this.drawScoreLine(ctx, 'HI-SCORE', state.best, 104);
    if (blinkOn(state.phaseTime)) this.drawText(ctx, 'PRESS START', PLAY_W / 2, 132, 1, INK, true);
  }

  /** SC-2 (BR1.3). */
  private drawStageIntro(ctx: CanvasRenderingContext2D, state: GameView): void {
    const stage = state.stage;
    this.drawText(ctx, `STAGE ${stage.stageNumber}`, PLAY_W / 2, 20, 2, INK, true);
    this.drawText(ctx, stage.name, PLAY_W / 2, 36, 2, INK, true);

    this.drawText(ctx, 'COLLECT', 20, 69, 1, INK, false);
    let x = 54;
    for (const kind of stage.collectibles) {
      this.drawBitmap(ctx, spriteFor(kind), x, 64, INK, OBJECT_W, OBJECT_H);
      x += 18;
    }
    const total = stage.collectibles.length > 1 ? ' TOTAL' : '';
    this.drawText(ctx, `X ${stage.requiredCount}${total}`, x + 4, 69, 1, INK, false);

    this.drawText(ctx, 'AVOID', 20, 93, 1, INK, false);
    this.drawBitmap(ctx, OBJECT_SPRITES.virus, 54, 88, INK, OBJECT_W, OBJECT_H);

    this.drawAiBar(ctx, state.aiRestoration, 124);
  }

  /** SC-3 (BR2.1-BR2.3). */
  private drawPlaying(ctx: CanvasRenderingContext2D, state: GameView, now: number): void {
    const hud = hudTexts(state);
    this.drawText(ctx, hud.name, HUD_NAME_X, 4, 1, INK, false);
    this.drawText(ctx, hud.ai, HUD_AI_X, 4, 1, INK, false);
    this.drawNumber(ctx, state.score, HUD_SCORE_X, 3);
    this.drawText(ctx, hud.progress, HUD_PROGRESS_X, 4, 1, INK, false);
    if (timerVisible(state.timeLeft, state.phaseTime)) {
      this.drawText(ctx, timerText(state.timeLeft), HUD_TIMER_X, 4, 1, INK, false);
    }
    this.drawLives(ctx, state, now);
    ctx.fillStyle = INK;
    ctx.fillRect(0, 14, PLAY_W, 1);
    ctx.fillRect(0, PLAY_H - 1, PLAY_W, 1);

    for (const o of state.objects) {
      this.drawBitmap(ctx, spriteFor(o.kind), Math.round(o.x), Math.round(o.y), INK, o.w, o.h);
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

  /** SC-4 (BR1.4). */
  private drawStageClear(ctx: CanvasRenderingContext2D, state: GameView): void {
    const t = state.phaseTime;
    this.drawText(ctx, state.stage.name, PLAY_W / 2, 28, 2, INK, true);
    this.drawText(ctx, 'RECOVERED', PLAY_W / 2, 44, 2, INK, true);
    this.drawAiBar(ctx, barFill(t, state.aiRestoration), 76);
    if (t >= CLEAR_BAR_FILL) this.drawText(ctx, '+25%', PLAY_W / 2, 88, 1, INK, true);
    this.drawText(ctx, `BONUS +${state.stage.clearBonus}`, PLAY_W / 2, 108, 1, INK, true);
    this.drawScoreLine(ctx, 'SCORE', state.score, 124);
  }

  /** SC-5 (BR1.5). */
  private drawGameOver(ctx: CanvasRenderingContext2D, state: GameView, now: number): void {
    const t = state.phaseTime;
    this.drawText(ctx, 'GAME OVER', PLAY_W / 2, 20, 3, INK, true);
    if (state.gameOverReason === 'time') this.drawText(ctx, 'TIME UP', PLAY_W / 2, 42, 1, INK, true);
    this.drawAiBar(ctx, state.aiRestoration, 56);
    this.drawText(ctx, reachedLine(state), PLAY_W / 2, 68, 1, INK, true);
    this.drawScoreLine(ctx, 'SCORE', state.score, 88);
    this.drawScoreLine(ctx, 'HI-SCORE', state.best, 104);
    if (state.newHighScore && blinkOn(t)) this.drawText(ctx, 'NEW!', NEW_X, 104, 1, INK, false);
    if (state.canReturnToTitle && blinkOn(t)) this.drawText(ctx, 'PRESS ANY KEY', PLAY_W / 2, 136, 1, INK, true);
    if (this.glitch > 0) this.applyGlitch(ctx, now);
  }

  /** SC-6 (BR1.6): reboot, restore, messages, hold. */
  private drawVictory(ctx: CanvasRenderingContext2D, state: GameView): void {
    const t = state.phaseTime;
    const step = victoryStep(t);

    if (step === 'reboot' || step === 'restore') {
      this.drawBitmap(ctx, step === 'reboot' ? AI_FACE_BROKEN : AI_FACE_RESTORED, (PLAY_W - 24) / 2, 8, INK);
      this.drawAiBar(ctx, step === 'reboot' ? victoryBarFill(t) : 100, 58);
      if (step === 'reboot') this.drawNoise(ctx, t);
    } else {
      // FR1.3, FR2.1, FR2.2: the message types in line by line and scrolls once the text area is full.
      const view = endingView(t - VICTORY_RESTORE_END, ENDING_LINES, ENDING_WINDOW);
      view.visible.forEach((line, i) => {
        if (line !== '') this.drawText(ctx, line, PLAY_W / 2, ENDING_TOP + i * ENDING_PITCH, 1, INK, true);
      });
    }
    if (step === 'reboot') return;

    if (step === 'hold') {
      this.drawScoreLine(ctx, 'SCORE', state.score, 108);
      this.drawScoreLine(ctx, 'HI-SCORE', state.best, 122);
      if (state.newHighScore && blinkOn(t)) this.drawText(ctx, 'NEW!', NEW_X, 122, 1, INK, false);
      if (state.canReturnToTitle && blinkOn(t)) this.drawText(ctx, 'PRESS ANY KEY', PLAY_W / 2, 144, 1, INK, true);
    }
  }

  // ---- parts ---------------------------------------------------------------

  /** Shared AI bar: outline, fill, label and percent text (SC-2, SC-4, SC-5, SC-6). */
  private drawAiBar(ctx: CanvasRenderingContext2D, percent: number, y: number): void {
    const p = Math.min(100, Math.max(0, Number.isFinite(percent) ? percent : 0));
    this.drawText(ctx, 'AI', BAR_LABEL_X, y, 1, INK, false);
    ctx.fillStyle = INK;
    ctx.fillRect(BAR_X, y, BAR_W, 1);
    ctx.fillRect(BAR_X, y + BAR_H - 1, BAR_W, 1);
    ctx.fillRect(BAR_X, y, 1, BAR_H);
    ctx.fillRect(BAR_X + BAR_W - 1, y, 1, BAR_H);
    const fill = Math.round(((BAR_W - 2) * p) / 100);
    if (fill > 0) ctx.fillRect(BAR_X + 1, y + 1, fill, BAR_H - 2);
    this.drawText(ctx, `${Math.round(p)}%`, BAR_PERCENT_X, y, 1, INK, false);
  }

  /** A label with a seven-segment number; `y` is the label's top. */
  private drawScoreLine(ctx: CanvasRenderingContext2D, label: string, value: number, y: number): void {
    this.drawText(ctx, label, LABEL_X, y, 1, INK, false);
    this.drawNumber(ctx, value, VALUE_X, y - 2);
  }

  /** Noise lines that fall in number as the reboot ends; positions change NOISE_HZ times a second. */
  private drawNoise(ctx: CanvasRenderingContext2D, t: number): void {
    const frame = Math.floor(t * NOISE_HZ);
    const count = noiseLines(t);
    ctx.fillStyle = INK;
    for (let i = 0; i < count; i++) {
      const y = Math.floor(hash(frame * 7 + i) * PLAY_H);
      const x = Math.floor(hash(frame * 13 + i) * 100);
      const w = 40 + Math.floor(hash(frame * 17 + i) * 100);
      ctx.fillRect(x, y, w, 1);
    }
  }

  private drawLives(ctx: CanvasRenderingContext2D, state: GameView, now: number): void {
    const w = LIFE[0]?.length ?? 7;
    const gap = 3;
    let x = HUD_LIVES_X;
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

  /** Draws text in the 3 x 5 font; a character missing from the font draws as a space. */
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
