import './style.css';
import { SoundPlayer, type SoundName } from './audio/sound';
import { HighScoreStore, type StorageLike } from './game/highscore';
import { GameState, type GameEvent } from './game/state';
import { CASING_H, CASING_W, fitCasing } from './render/layout';
import { Renderer } from './render/renderer';

const STEP = 1 / 60;
const MAX_FRAME = 0.25;

/** localStorage can throw just by being touched (private browsing), so guard the lookup (FR6.6). */
function getStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

function start(): void {
  const consoleEl = el<HTMLDivElement>('console');
  const canvas = el<HTMLCanvasElement>('screen');
  const powerButton = el<HTMLButtonElement>('power-button');
  const startButton = el<HTMLButtonElement>('start-button');

  const sound = new SoundPlayer();
  const renderer = new Renderer(canvas);
  const state = new GameState({ highScore: new HighScoreStore(getStorage()) });

  // ---- fit the casing to the visible area (FR9.5, FR9.6) -------------------
  const refit = (): void => {
    const vv = window.visualViewport;
    const w = vv?.width ?? window.innerWidth;
    const h = vv?.height ?? window.innerHeight;
    const fit = fitCasing(w, h);
    consoleEl.style.width = `${CASING_W}px`;
    consoleEl.style.height = `${CASING_H}px`;
    consoleEl.style.transform = `translate(${fit.offsetX}px, ${fit.offsetY}px) scale(${fit.scale})`;
  };
  refit();
  window.addEventListener('resize', refit);
  window.addEventListener('orientationchange', refit);
  window.visualViewport?.addEventListener('resize', refit);

  // ---- buttons -------------------------------------------------------------
  const power = (): void => {
    sound.unlock();
    state.pressPower();
  };
  powerButton.addEventListener('click', () => {
    power();
    powerButton.blur();
  });
  startButton.addEventListener('click', () => {
    sound.unlock();
    state.pressStart();
    startButton.blur();
  });

  // ---- keyboard ------------------------------------------------------------
  const keyDir = (code: string): -1 | 1 | null =>
    code === 'ArrowLeft' ? -1 : code === 'ArrowRight' ? 1 : null;
  const isActionKey = (code: string): boolean => code === 'Enter' || code === 'Space';

  window.addEventListener('keydown', (e) => {
    const handled = keyDir(e.code) !== null || isActionKey(e.code);
    if (handled) e.preventDefault();
    if (e.repeat) return;
    const id = `key:${e.code}`;
    state.inputDown(id, keyDir(e.code));
    if (isActionKey(e.code)) {
      if (state.phase === 'power-off') power();
      else state.pressStart();
    }
  });
  window.addEventListener('keyup', (e) => {
    if (isActionKey(e.code)) e.preventDefault();
    state.inputUp(`key:${e.code}`);
  });
  window.addEventListener('blur', () => {
    // Forget held keys if the window loses focus, so nothing sticks.
    for (const code of ['ArrowLeft', 'ArrowRight']) state.inputUp(`key:${code}`);
  });

  // ---- touch: left or right half of the screen (FR2.2) ---------------------
  const onButton = (target: EventTarget | null): boolean =>
    target instanceof Element && target.closest('button') !== null;

  window.addEventListener(
    'pointerdown',
    (e) => {
      if (onButton(e.target)) return;
      if (e.pointerType === 'mouse') {
        // A mouse click is a direction-less press: it can only restart after GAME OVER.
        state.inputDown(`mouse:${e.pointerId}`, null);
        return;
      }
      const dir = e.clientX < window.innerWidth / 2 ? -1 : 1;
      state.inputDown(`touch:${e.pointerId}`, dir);
    },
    { passive: true },
  );
  const touchEnd = (e: PointerEvent): void => {
    state.inputUp(`touch:${e.pointerId}`);
    state.inputUp(`mouse:${e.pointerId}`);
  };
  window.addEventListener('pointerup', touchEnd);
  window.addEventListener('pointercancel', touchEnd);

  // Block page gestures (scroll, pinch, context menu) while playing.
  document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // ---- events to sound and effects -----------------------------------------
  const soundFor = (e: GameEvent): SoundName | null => {
    switch (e.type) {
      case 'power-on':
        return 'startup';
      case 'game-start':
        return 'game-start';
      case 'catch':
        return e.kind === 'gpu' ? 'catch-gpu' : e.kind === 'robot' ? 'catch-robot' : 'catch-llm';
      case 'virus-hit':
        return 'virus-hit';
      case 'game-over':
        return 'game-over';
      default:
        return null;
    }
  };

  const flushEvents = (): void => {
    for (const e of state.drainEvents()) {
      renderer.onEvent(e);
      const name = soundFor(e);
      if (name) sound.play(name);
    }
  };

  // ---- main loop: fixed time step, never paused by resize or rotation ------
  let last = performance.now();
  let acc = 0;
  const frame = (nowMs: number): void => {
    const dt = Math.min(MAX_FRAME, Math.max(0, (nowMs - last) / 1000));
    last = nowMs;
    acc += dt;
    while (acc >= STEP) {
      state.update(STEP);
      renderer.update(STEP);
      flushEvents();
      acc -= STEP;
    }
    flushEvents();
    renderer.draw(state, nowMs / 1000);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

start();
