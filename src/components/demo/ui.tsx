import React, { useEffect, useId, useRef } from 'react';
import * as m from 'motion/react-m';
import { X } from 'lucide-react';
import type { Tone } from './types';

export const TONE: Record<Tone, string> = {
  blue: 'bg-signal/10 text-signal border-signal/25',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  grey: 'bg-ink/[0.04] text-ash border-ink/12',
};

/** Ordinal series colours, dark to light, built from the brand blues. */
export const RAMP = ['#231F20', '#213C54', '#1E5888', '#1C75BC', '#75BAE6', '#D6E7F1'];
export const GOOD = '#1C75BC';
export const WARN = '#B45309';
export const BAD = '#B91C1C';

export function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-block border px-1.5 py-0.5 text-[11px] leading-tight whitespace-nowrap ${TONE[tone]}`}>
      {children}
    </span>
  );
}

type Variant = 'primary' | 'ink' | 'line' | 'danger' | 'ghost';

const VARIANT: Record<Variant, string> = {
  primary: 'bg-signal text-white border border-signal hover:bg-signal-deep hover:border-signal-deep',
  ink: 'bg-ink text-paper border border-ink hover:bg-signal hover:border-signal',
  line: 'bg-white text-ink border border-ink/20 hover:border-ink',
  danger: 'bg-white text-red-700 border border-red-200 hover:bg-red-50 hover:border-red-300',
  ghost: 'bg-transparent text-ash border border-transparent hover:text-ink hover:bg-ink/[0.05]',
};

export const Btn = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'xs' | 'sm' | 'md' }
>(function Btn({ variant = 'line', size = 'md', className = '', type = 'button', ...rest }, ref) {
  const sizing = size === 'xs' ? 'text-[11.5px] px-2.5 min-h-[28px]' : size === 'sm' ? 'text-[12px] px-3 min-h-[32px]' : 'text-[13px] px-4 min-h-[40px]';
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 font-medium whitespace-nowrap transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${sizing} ${VARIANT[variant]} ${className}`}
      {...rest}
    />
  );
});

/** The one card every module is built from, so spacing and type never drift. */
export function Widget({
  title, hint, action, children, className = '', bodyClass = '',
}: { title: React.ReactNode; hint?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string; bodyClass?: string }) {
  return (
    <section className={`bg-white border border-ink/10 flex flex-col min-w-0 ${className}`}>
      <header className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-3 min-h-[46px]">
        <h4 className="text-[13px] font-semibold tracking-[-0.01em] leading-tight">{title}</h4>
        {action ?? (hint ? <span className="text-[11.5px] text-ash text-right leading-tight">{hint}</span> : null)}
      </header>
      <div className={`flex-1 px-4 pb-4 ${bodyClass}`}>{children}</div>
    </section>
  );
}

export function Bar({ pct, color = GOOD, height = 'h-1.5' }: { pct: number; color?: string; height?: string }) {
  return (
    <div className={`w-full ${height} bg-ink/[0.07] overflow-hidden`}>
      <div className={`${height} transition-[width] duration-500`} style={{ width: `${Math.max(0, Math.min(pct, 100))}%`, backgroundColor: color }} />
    </div>
  );
}

/** A full-width clickable chart row that toggles a filter. */
export function Pick({
  active, onClick, label, children, className = '',
}: { active?: boolean; onClick: () => void; label: string; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`block text-left -mx-2 px-2 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal ${
        active ? 'bg-signal/[0.08]' : 'hover:bg-ink/[0.04]'
      } ${className}`}
      style={{ width: 'calc(100% + 1rem)' }}
    >
      {children}
    </button>
  );
}

/** One row in an action list: what it is, and the thing you can do about it. */
export function QRow({
  onOpen, title, sub, subTone, meta, actions, label,
}: {
  onOpen: () => void; title: React.ReactNode; sub?: React.ReactNode; subTone?: 'red' | 'amber'; meta?: React.ReactNode; actions?: React.ReactNode; label: string;
}) {
  return (
    <li className="flex items-center gap-3 py-2.5 border-t border-ink/[0.07] first:border-t-0 first:pt-0 last:pb-0">
      <button type="button" onClick={onOpen} aria-label={label} className="min-w-0 flex-1 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal">
        <span className="block text-[13px] leading-tight truncate group-hover:text-signal transition-colors">{title}</span>
        {sub && (
          <span className={`block text-[11.5px] mt-1 leading-tight truncate ${subTone === 'red' ? 'text-red-600' : subTone === 'amber' ? 'text-amber-700' : 'text-ash'}`}>{sub}</span>
        )}
      </button>
      {meta && <span className="shrink-0 text-[12px] tabular-nums text-right">{meta}</span>}
      {actions && <span className="shrink-0 flex items-center gap-1.5">{actions}</span>}
    </li>
  );
}

export interface Segment { key: string; label: string; value: number; color: string; onPick?: () => void; active?: boolean }

/** Donut with a legend of real buttons beside it (the ring itself is decorative). */
export function Donut({ segments, size = 104, thickness = 15, center, sub }: { segments: Segment[]; size?: number; thickness?: number; center: React.ReactNode; sub?: string }) {
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((a, x) => a + x.value, 0) || 1;
  let acc = 0;
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#231F20" strokeOpacity="0.07" strokeWidth={thickness} />
          {segments.map((sg) => {
            const len = (sg.value / total) * C;
            const dash = Math.max(len - 1.5, 0);
            const el = (
              <circle
                key={sg.key}
                cx={size / 2} cy={size / 2} r={r} fill="none" stroke={sg.color} strokeWidth={thickness}
                strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc}
                opacity={segments.some((x) => x.active) && !sg.active ? 0.35 : 1}
                className="transition-opacity"
              />
            );
            acc += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[20px] font-semibold tracking-[-0.02em] leading-none tabular-nums">{center}</span>
          {sub && <span className="text-[10.5px] text-ash mt-1 leading-none">{sub}</span>}
        </div>
      </div>
      <ul className="flex-1 min-w-0 flex flex-col gap-0.5">
        {segments.map((sg) => (
          <li key={sg.key}>
            <button
              type="button"
              onClick={sg.onPick}
              disabled={!sg.onPick}
              aria-pressed={sg.active}
              className={`w-full flex items-center gap-2 text-[12px] px-1.5 py-1 -mx-1.5 transition-colors ${sg.active ? 'bg-signal/[0.08]' : 'hover:bg-ink/[0.04]'} disabled:hover:bg-transparent`}
              style={{ width: 'calc(100% + 0.75rem)' }}
            >
              <span className="w-2 h-2 shrink-0" style={{ backgroundColor: sg.color }} />
              <span className="text-ash truncate">{sg.label}</span>
              <span className="ml-auto tabular-nums font-medium">{sg.value}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A single-value ring, e.g. share of tickets within SLA. */
export function Gauge({ pct, color = GOOD, size = 104, thickness = 13, label }: { pct: number; color?: string; size?: number; thickness?: number; label: string }) {
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(pct, 100));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${Math.round(v)}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#231F20" strokeOpacity="0.07" strokeWidth={thickness} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={thickness}
          strokeDasharray={`${(v / 100) * C} ${C}`} className="transition-[stroke-dasharray] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-semibold tracking-[-0.02em] leading-none tabular-nums">{Math.round(v)}%</span>
        <span className="text-[10.5px] text-ash mt-1 leading-none">{label}</span>
      </div>
    </div>
  );
}

export function Field({
  label, hint, children,
}: { label: string; hint?: React.ReactNode; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11.5px] font-medium text-ink/80">{label}</label>
      {children(id)}
      {hint && <p className="text-[11.5px] text-ash leading-snug">{hint}</p>}
    </div>
  );
}

export const inputCls =
  'w-full bg-white border border-ink/20 px-3 min-h-[40px] text-[13px] text-ink placeholder:text-ash/60 outline-none transition-[border-color,box-shadow] hover:border-ink/40 focus:border-signal focus:ring-2 focus:ring-signal/15';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

type Chat = { hideWidget?: () => void; showWidget?: () => void };
const chatApi = () => (window as unknown as { Tawk_API?: Chat }).Tawk_API;

/** Panels can overlap while one animates out and the next animates in, so count them. */
let openPanels = 0;
function panelOpened() {
  if (openPanels++ === 0) { try { chatApi()?.hideWidget?.(); } catch { /* chat not ready */ } }
}
function panelClosed() {
  if (openPanels > 0 && --openPanels === 0) { try { chatApi()?.showWidget?.(); } catch { /* chat not ready */ } }
}

/**
 * A side drawer or centred dialog that lives inside the dashboard window — it
 * covers the app, not the whole page. The parent must be `relative`.
 */
export function Overlay({
  kind, title, subtitle, onClose, children, footer,
}: {
  kind: 'drawer' | 'modal';
  title: string;
  subtitle?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const first = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });

    // The site's chat bubble floats over the bottom-right corner, exactly where
    // the primary action sits, so it steps aside while a panel is open.
    panelOpened();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      panelClosed();
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  const drawer = kind === 'drawer';

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
      className={`absolute inset-0 z-[60] flex ${drawer ? 'justify-end' : 'items-end sm:items-center justify-center sm:p-6'}`}
    >
      <button type="button" tabIndex={-1} aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/45 cursor-default" />
      <m.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={drawer ? { x: '100%' } : { y: 24, opacity: 0 }}
        animate={drawer ? { x: 0 } : { y: 0, opacity: 1 }}
        exit={drawer ? { x: '100%', transition: { duration: 0.2, ease: 'easeIn' } } : { y: 24, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }}
        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
        className={`relative bg-white flex flex-col text-ink shadow-2xl ${
          drawer
            ? 'w-full max-w-[460px] h-full border-l border-ink/15'
            : 'w-full sm:max-w-[540px] max-h-full border border-ink/15'
        }`}
      >
        <div className="shrink-0 bg-white border-b border-ink/12 px-5 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 id={titleId} className="text-[17px] font-semibold tracking-[-0.015em] leading-tight truncate">{title}</h3>
            {subtitle && <div className="text-[12.5px] text-ash mt-1">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-9 h-9 border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="shrink-0 border-t border-ink/12 bg-paper px-5 py-3.5 flex flex-wrap items-center justify-end gap-2.5">{footer}</div>}
      </m.div>
    </m.div>
  );
}
