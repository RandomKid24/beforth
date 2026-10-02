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
      <div id="platform-panel" role="tabpanel" aria-labelledby={`platform-tab-${p.slug}`} className="min-w-0 bg-white border border-ink/12">
        <div className="px-5 py-3.5 border-b border-ink/10 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 bg-signal/10 text-signal flex items-center justify-center shrink-0"><p.icon className="w-4 h-4" strokeWidth={1.7} /></span>
            <h3 className="display-md text-[17px] truncate">{p.name}</h3>
          </div>
          <div className="flex items-center gap-x-5 gap-y-1 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-ash"><i className="w-1.5 h-1.5 rounded-full bg-signal pulse-dot" /> Live preview · sample data · try it</span>
            <Link to={`/product/${p.slug}`} className="ulink !min-h-[24px] !py-0">
              Full page <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="relative bg-bone/55 blueprint-grid p-4 sm:p-6 min-h-[520px] flex items-center justify-center overflow-hidden">
          <div className="w-full relative z-10">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={p.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <p.Preview />
              </m.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="px-5 py-4 grid md:grid-cols-[1.4fr_1fr] gap-x-8 gap-y-3 border-t border-ink/10">
          <p className="body-tight">{p.summary}</p>
          <div>
            <p className="label !text-[10px] mb-2">Built for · {p.built}</p>
            <ul className="flex flex-wrap gap-1.5">
              {p.caps.map((c) => <li key={c} className="text-[11.5px] border border-ink/15 px-2.5 py-1">{c}</li>)}
            </ul>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-ink/10 bg-paper flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] text-ash">
          <span><b className="font-semibold text-ink">We build it.</b> Designed around your process.</span>
          <span><b className="font-semibold text-ink">We run it.</b> Hosting, monitoring, backups.</span>
          <span><b className="font-semibold text-ink">We maintain it.</b> Updates and support.</span>
        </div>
      </div>
    </div>
  );
}
