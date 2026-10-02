import React from 'react';
import * as m from 'motion/react-m';
import { useMotionPreset } from '../lib/motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

/**
 * Feature detection for CSS scroll-driven timelines.
 *
 * Tests the `view()` function rather than `animation-timeline: auto` —
 * Firefox accepts the property grammar while the behaviour sits behind a
 * flag, so the looser query reports support that isn't actually there.
 */
const supportsScrollTimeline = (): boolean =>
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports('animation-timeline: view()');

export default function Reveal({ children, delay = 0, y = 26, className, once = true }: RevealProps) {
  const { enter } = useMotionPreset();

  // Where CSS scroll timelines are available, the reveal is driven entirely
  // by the compositor and the JS animation is skipped, so the element is
  // never animated twice.
  if (supportsScrollTimeline()) {
    return (
      <div className={className} data-reveal style={{ '--reveal-y': `${y}px` } as React.CSSProperties}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-70px' }}
      transition={{ ...enter, delay }}
    >
      {children}
    </m.div>
  );
}
