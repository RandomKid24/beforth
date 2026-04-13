import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Magnetic = ({ children }: { children: React.ReactElement }) => {
  const magnetic = useRef<HTMLElement>(null);
  const bounds = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (!magnetic.current) return;

    const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseEnter = () => {
      if (magnetic.current) {
        bounds.current = magnetic.current.getBoundingClientRect();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!bounds.current) {
        bounds.current = magnetic.current!.getBoundingClientRect();
      }
      const { clientX, clientY } = e;
      const { height, width, left, top } = bounds.current;
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      bounds.current = null;
    };

    const element = magnetic.current;
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return React.cloneElement(children, { ref: magnetic });
};
