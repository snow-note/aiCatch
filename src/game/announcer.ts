/**
 * Screen-reader announcements (FR13.2, BR1.1-BR2.1).
 * Pure: reads only a GameView. No DOM, storage, network, or timer.
 * Text is built only from numbers, stage.name, and fixed strings.
 */
import type { GameView } from './types';

export interface Announcement {
  /** Changes only when the screen reader should speak again. */
  readonly key: string;
  readonly text: string;
}

/** Fixed item names, indexed by stage number - 1 (BR1.3). */
const ITEMS = ['mainframes', 'magnetic tapes', 'floppy disks', 'LLM, GPU, and robot parts'];

function text(view: GameView): string {
  const { stage, score, best, lives, caught } = view;
  const { stageNumber: n, name, requiredCount: req } = stage;
  const ai = `AI ${view.aiRestoration}%`;
  const hs = `High score ${best}.`;
  const high = view.newHighScore ? ' New high score.' : '';
  switch (view.phase) {
    case 'title':
      return `AI CATCH. Press Start. Arrow keys to move. ${hs}`;
    case 'stage-intro':
      return `Stage ${n}, ${name}. Collect ${req} ${ITEMS[n - 1]}. Avoid virus. ${ai}.`;
    case 'playing':
      return `Stage ${n} ${name}, ${ai}, score ${score}, ${caught} of ${req}, ${lives} ${lives == 1 ? 'life' : 'lives'}`;
    case 'stage-clear':
      return `${name} recovered. ${ai}.`;
    case 'game-over':
      return `${view.gameOverReason === 'time' ? 'Time up. ' : ''}Game over. ${ai}. Score ${score}. ${hs}${high}`;
    default:
      return `AI restored, 100%. Humans saved AI. Save the AI, save the future. Score ${score}.${high}`;
  }
}

export function screenAnnouncement(view: GameView): Announcement {
  const { phase, stage, lives } = view;
  // Lives are part of the key only while playing, so a lost life is spoken but catches are not (BR1.6).
  return { key: phase + ':' + stage.stageNumber + (phase == 'playing' ? ':' + lives : ''), text: text(view) };
}
