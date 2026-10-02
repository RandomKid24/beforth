import { useEffect, useRef, useState } from 'react';

/**
 * Reports whether the element is currently visible, and pauses continuous
 * animation when it is not — or when the tab is in the background.
 *
 * The diagram runs five travelling particles and a rotating ring. Left
 * alone those animate for the whole session, including while scrolled far
 * past them or with the tab hidden, which is wasted CPU and battery.
 */
export function useActiveInView<T extends HTMLElement>(rootMargin = '120px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);

    const onVisibility = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [rootMargin]);

  const active = inView && tabVisible;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.toggle('is-offscreen', !inView);
  }, [inView]);

  useEffect(() => {
    document.documentElement.classList.toggle('is-hidden-tab', !tabVisible);
    return () => document.documentElement.classList.remove('is-hidden-tab');
  }, [tabVisible]);

  return { ref, active };
}
