import React from 'react';
import { Signal, Battery, Wifi } from 'lucide-react';

/** Device frames used by the platform previews. Pure presentation. */

export function Phone({
  children, platform = 'android', label, className = '',
}: { children: React.ReactNode; platform?: 'android' | 'ios'; label?: string; className?: string }) {
  const ios = platform === 'ios';
  return (
    <figure className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`relative w-[216px] h-[420px] bg-ink p-[7px] shadow-[0_18px_40px_-18px_rgba(35,31,32,0.55)] ${ios ? 'rounded-[34px]' : 'rounded-[26px]'}`}
      >
        <div className={`relative h-full w-full bg-white overflow-hidden flex flex-col ${ios ? 'rounded-[28px]' : 'rounded-[20px]'}`}>
          <div className="shrink-0 h-7 px-4 flex items-center justify-between text-[10px] font-semibold tabular-nums relative z-10">
            <span>9:42</span>
            <span className="flex items-center gap-1">
              <Signal className="w-2.5 h-2.5" strokeWidth={2.5} />
              <Wifi className="w-2.5 h-2.5" strokeWidth={2.5} />
              <Battery className="w-3 h-3" strokeWidth={2} />
            </span>
          </div>
          {/* camera cut-out */}
          {ios
            ? <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[68px] h-[18px] rounded-full bg-ink z-20" />
            : <span className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-ink z-20" />}
          <div className="relative flex-1 min-h-0 flex flex-col">{children}</div>
          <span className={`shrink-0 mx-auto my-1.5 h-1 rounded-full bg-ink/80 ${ios ? 'w-20' : 'w-12 opacity-60'}`} />
        </div>
      </div>
      {label && <figcaption className="text-[11.5px] text-ash">{label}</figcaption>}
    </figure>
  );
}

export function Browser({
  url, children, className = '', style,
}: { url: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-white border border-ink/15 shadow-[0_18px_40px_-22px_rgba(35,31,32,0.45)] overflow-hidden ${className}`} style={style}>
      <div className="h-9 px-3 flex items-center gap-3 border-b border-ink/10 bg-paper">
        <span className="flex gap-1.5" aria-hidden>
          <i className="w-2.5 h-2.5 rounded-full bg-ink/15" />
          <i className="w-2.5 h-2.5 rounded-full bg-ink/15" />
          <i className="w-2.5 h-2.5 rounded-full bg-ink/15" />
        </span>
        <span className="flex-1 min-w-0 h-6 px-3 bg-white border border-ink/10 text-[11px] text-ash flex items-center truncate">{url}</span>
      </div>
      {children}
    </div>
  );
}

export function Win({
  title, children, className = '', dark = false,
}: { title: string; children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={`border shadow-[0_18px_40px_-22px_rgba(35,31,32,0.45)] overflow-hidden ${dark ? 'bg-ink border-ink text-paper' : 'bg-white border-ink/15'} ${className}`}>
      <div className={`h-8 px-3 flex items-center gap-3 border-b ${dark ? 'border-paper/10 bg-paper/5' : 'border-ink/10 bg-paper'}`}>
        <span className="flex gap-1.5" aria-hidden>
          <i className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <i className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <i className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </span>
        <span className={`text-[11px] ${dark ? 'text-paper/60' : 'text-ash'}`}>{title}</span>
      </div>
      {children}
    </div>
  );
}

/** Small stat tile used across previews. */
export function Tile({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: 'good' | 'warn' | 'bad' }) {
  const t = tone === 'good' ? 'text-emerald-700' : tone === 'warn' ? 'text-amber-700' : tone === 'bad' ? 'text-red-600' : 'text-ash';
  return (
    <div className="border border-ink/10 bg-white px-3 py-2.5 min-w-0">
      <p className="text-[10.5px] text-ash leading-none">{label}</p>
      <p className="text-[17px] font-semibold tracking-[-0.02em] leading-none mt-1.5 tabular-nums truncate">{value}</p>
      {sub && <p className={`text-[10.5px] mt-1.5 leading-none truncate ${t}`}>{sub}</p>}
    </div>
  );
}
