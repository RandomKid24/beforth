import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'motion/react';

export const Magnetic = ({ children }: { children: React.ReactElement }) => {
  const magnetic = useRef<HTMLElement>(null);
  const bounds = useRef<DOMRect | null>(null);
  const frame = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = magnetic.current;
    if (!el || reduce) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const flush = () => {
      frame.current = null;
      if (!bounds.current) return;
      const { x, y } = pointer.current;
      const { height, width, left, top } = bounds.current;
      xTo((x - (left + width / 2)) * 0.28);
      yTo((y - (top + height / 2)) * 0.28);
    };

    const handleMouseEnter = () => {
      bounds.current = magnetic.current!.getBoundingClientRect();
      setActive(true);
    };

    // Coalesce mousemove to one update per animation frame instead of
    // running the maths on every event.
    const handleMouseMove = (e: MouseEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      if (!bounds.current) bounds.current = magnetic.current!.getBoundingClientRect();
      if (frame.current === null) frame.current = requestAnimationFrame(flush);
    };

    const handleMouseLeave = () => {
      setActive(false);
      xTo(0);
      yTo(0);
      bounds.current = null;
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reduce]);

  // Promote only while actually moving the element, so the hint is not
  // permanently holding GPU memory.
  const style = active
    ? ({ willChange: 'transform' } as React.CSSProperties)
    : undefined;

  return React.cloneElement(children, { ref: magnetic, style } as any);
};
