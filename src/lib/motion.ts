import { useReducedMotion } from 'motion/react';
import type { Transition } from 'motion/react';

/**
 * Shared motion tokens.
 *
 * Motion animates physical properties (x, y, scale, rotate) with spring
 * physics by default, and only uses tween easing for visual properties like
 * opacity and colour. Where we previously forced a single cubic-bezier onto
 * everything, transform animations were overriding those springs and reading
 * mechanical. Springs are used for anything that moves; tween easing is kept
 * for fades.
 */

/** Hover / press feedback. Fast, no overshoot — overshoot on a UI element feels sluggish. */
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};

/** Entrances and large movements. Softer, a little more travel. */
export const springSmooth: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

/** Drawer / sheet style slides. */
export const springPanel: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 34,
};

/** Opacity-only fades stay on tween easing. */
export const fade: Transition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
};

export const fadeFast: Transition = {
  duration: 0.18,
  ease: [0.4, 0, 0.2, 1],
};

/**
 * Returns the right transition for a property, honouring the user's
 * reduced-motion preference. The component stays in the tree either way —
 * only the transition changes — so layout and enter/exit animations still
 * resolve correctly, just instantly.
 */
export function useMotionPreset() {
  const shouldReduce = useReducedMotion();

  return {
    shouldReduce,
    enter: (shouldReduce ? { duration: 0 } : springSmooth) as Transition,
    snappy: (shouldReduce ? { duration: 0 } : springSnappy) as Transition,
    panel: (shouldReduce ? { duration: 0 } : springPanel) as Transition,
    fade: (shouldReduce ? { duration: 0 } : fade) as Transition,
    fadeFast: (shouldReduce ? { duration: 0 } : fadeFast) as Transition,
  };
}
