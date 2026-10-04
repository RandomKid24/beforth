import React from 'react';
import * as m from 'motion/react-m';
import { useMotionPreset } from '../lib/motion';

interface IntroProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Entrance for content that is already on screen when a page opens.
 * Reveal waits for scroll, so a page header never animated. This one
 * plays on mount, after the route fade has started.
 */
export default function Intro({ children, delay = 0, y = 22, className }: IntroProps) {
  const { enter } = useMotionPreset();
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...enter, delay: 0.12 + delay }}
    >
      {children}
    </m.div>
  );
}
