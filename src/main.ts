import './style.css';
import { SoundPlayer, soundForEvent } from './audio/sound';
import { screenAnnouncement } from './game/announcer';
import { HighScoreStore, type StorageLike } from './game/highscore';
import { GameState } from './game/state';
import {
  CASING_H,
  CASING_W,
  SETTLE_DELAY_MS,
  chooseFit,
  fitArea,
  orientationOf,
  placeCasing,
  touchSide,
  type Fit,
  type Insets,
  type ViewportRect,
} from './render/layout';
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
  const startButton = el<HTMLButtonElement>('start-button');

  const sound = new SoundPlayer();
  const renderer = new Renderer(canvas);
  const state = new GameState({ highScore: new HighScoreStore(getStorage()) });

  // ---- fit the casing to the visible area (FR9.5, FR9.6) -------------------
  const stageEl = el<HTMLElement>('stage');
  let lastFit: Fit | null = null;
  let lastArea: ViewportRect | null = null;
  let lastOrientation: 'portrait' | 'landscape' | null = null;

  const readViewport = (): ViewportRect => {
    const vv = window.visualViewport;
    if (vv && vv.width > 0 && vv.height > 0) {
      return { x: vv.offsetLeft, y: vv.offsetTop, width: vv.width, height: vv.height };
    }
    return { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
  };

  const readInsets = (): Insets => {
    const cs = getComputedStyle(stageEl);
    return {
      top: parseFloat(cs.paddingTop),
      right: parseFloat(cs.paddingRight),
      bottom: parseFloat(cs.paddingBottom),
      left: parseFloat(cs.paddingLeft),
    };
  };

  const refit = (): void => {
    const viewport = readViewport();
    // Release held input only when portrait/landscape flips (FR5.1). A transient
    // empty size says nothing about orientation, so it is ignored here.
    if (viewport.width > 0 && viewport.height > 0) {
      const orientation = orientationOf(viewport.width, viewport.height);
      if (lastOrientation !== null && orientation !== lastOrientation) state.releaseAll();
      lastOrientation = orientation;
    }

    const area = fitArea(viewport, readInsets());
    const fit = chooseFit(placeCasing(area), lastFit); // keep last valid fit (FR2.1)
    if (!fit) return;
    if (fit !== lastFit) lastArea = area;
    lastFit = fit;
    consoleEl.style.width = `${CASING_W}px`;
    consoleEl.style.height = `${CASING_H}px`;
    consoleEl.style.transform = `translate(${fit.offsetX}px, ${fit.offsetY}px) scale(${fit.scale})`;
  };

  // Re-fit now, next frame and after the browser chrome settles (FR1.1, FR1.2).
  let pendingFrame = 0;
  let pendingTimer = 0;
  const scheduleRefit = (): void => {
    refit();
    cancelAnimationFrame(pendingFrame);
    clearTimeout(pendingTimer);
    pendingFrame = requestAnimationFrame(refit);
    pendingTimer = window.setTimeout(refit, SETTLE_DELAY_MS);
  };
  refit();
  window.addEventListener('resize', scheduleRefit);
  window.addEventListener('orientationchange', scheduleRefit);
  window.visualViewport?.addEventListener('resize', scheduleRefit);
  window.visualViewport?.addEventListener('scroll', scheduleRefit);

  // ---- buttons -------------------------------------------------------------
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
      sound.unlock();
      state.pressStart();
    }
  });
  window.addEventListener('keyup', (e) => {
    if (isActionKey(e.code)) e.preventDefault();
    state.inputUp(`key:${e.code}`);
  });
  window.addEventListener('blur', () => {
    // Forget every held key and touch if the window loses focus, so nothing sticks (BR7.4).
    state.releaseAll();
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
      const dir = touchSide(e.clientX, lastArea ?? readViewport()); // casing centre (FR4.1)
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
  const flushEvents = (): void => {
    for (const e of state.drainEvents()) {
      renderer.onEvent(e);
      const name = soundForEvent(e);
      if (name) sound.play(name);
    }
  };

  // ---- screen announcements (FR13.2) ---------------------------------------
  // Write to the hidden live region only when the announcement key changes (BR2.2-BR2.4).
  const announcer = document.getElementById('announcer');
  let lastKey: string | null = null;
  const announce = (): void => {
    try {
      const a = screenAnnouncement(state.view);
      if (announcer && a.key !== lastKey) {
        announcer.textContent = a.text;
        lastKey = a.key;
      }
    } catch {
      // Announcements must never stop the game loop.
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
    renderer.draw(state.view, nowMs / 1000);
    announce();
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

start();
