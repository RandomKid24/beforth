import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { ArrowUpRight } from 'lucide-react';
import { PLATFORMS } from './platforms/catalog';

export default function PlatformShowcase() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = PLATFORMS[active];

  const select = (i: number, focus = false) => {
    const n = (i + PLATFORMS.length) % PLATFORMS.length;
    setActive(n);
    if (focus) tabs.current[n]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select(active + 1, true); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select(active - 1, true); }
    else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
    else if (e.key === 'End') { e.preventDefault(); select(PLATFORMS.length - 1, true); }
  };

  return (
    <div className="grid lg:grid-cols-[272px_minmax(0,1fr)] gap-4 lg:gap-6 items-start">
      {/* Rail */}
      <div
        role="tablist"
        aria-label="Platforms we build"
        aria-orientation="vertical"
        onKeyDown={onKey}
        className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar snap-x -mx-6 px-6 md:-mx-10 md:px-10 lg:mx-0 lg:px-0 pb-1 lg:pb-0"
      >
        {PLATFORMS.map((x, i) => {
          const on = i === active;
          const Icon = x.icon;
          return (
            <button
              key={x.slug}
              ref={(el) => { tabs.current[i] = el; }}
              id={`platform-tab-${x.slug}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls="platform-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group snap-start shrink-0 lg:shrink lg:w-full min-w-[184px] lg:min-w-0 flex items-center gap-3 text-left px-3 py-2.5 border transition-[background-color,border-color,box-shadow] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal ${
                on ? 'bg-white border-signal shadow-[inset_3px_0_0_0_#1C75BC]' : 'bg-white/60 border-ink/12 hover:border-ink/35 hover:bg-white'
              }`}
            >
              <span className={`w-9 h-9 shrink-0 flex items-center justify-center transition-colors duration-300 ${on ? 'bg-signal text-white' : 'bg-ink/[0.05] text-ash group-hover:text-ink'}`}>
                <Icon className="w-[17px] h-[17px]" strokeWidth={1.7} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold leading-tight tracking-[-0.01em] truncate">{x.name}</span>
                <span className="block text-[11.5px] text-ash leading-tight mt-0.5 truncate">{x.sub}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage */}
      <div id="platform-panel" role="tabpanel" aria-labelledby={`platform-tab-${p.slug}`} className="min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={p.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="bg-white border border-ink/12 p-6 md:p-9"
          >
            <span className="w-11 h-11 bg-signal/10 text-signal flex items-center justify-center mb-5">
              <p.icon className="w-5 h-5" strokeWidth={1.7} />
            </span>
            <h3 className="display-lg text-[clamp(1.5rem,3vw,2.2rem)]">{p.name}</h3>
            <p className="body max-w-xl mt-3">{p.summary}</p>

            <span className="label block mt-8 mb-3">Built for · {p.built}</span>
            <ul className="flex flex-wrap gap-2">
              {p.caps.map((c) => (
                <li key={c} className="text-[13px] border border-ink/15 px-3 py-1.5">{c}</li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-ink/12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-[13px] text-ash">We build it, run it and maintain it.</p>
              <Link to={`/product/${p.slug}`} className="ulink">
                See how it works <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
