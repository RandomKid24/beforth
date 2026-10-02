import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import {
  LayoutDashboard, ShoppingCart, Boxes, Wrench, Users, Wallet, BarChart3, Plug,
  Search, Plus, Download, Undo2, RotateCcw, X, ChevronUp, ChevronDown, ArrowRight, MousePointerClick,
  RefreshCw, type LucideIcon,
} from 'lucide-react';
import type { ModuleId, Ref } from './demo/types';
import { init, reducer } from './demo/store';
import {
  HEADERS, TABLE_TITLE, alerts, chipsFor, kpis, moduleRows, pipeline, search, serviceViz, stockViz,
  type KpiTarget, type Row, type Scope,
} from './demo/selectors';
import { clock, downloadCsv, fmtAt, fmtLongDay, lakh, toCsv } from './demo/format';
import { isOpenOrder, isSalesInvoice, skuStatus } from './demo/rules';
import { Btn, Pill } from './demo/ui';
import Board from './demo/viz';
import RecordDrawer from './demo/drawers';
import FormDialog, { type FormKind } from './demo/forms';
import { useActiveInView } from '../lib/useActiveInView';

const MODULES: { id: ModuleId; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'sales', label: 'Sales', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'service', label: 'Service', icon: Wrench },
  { id: 'people', label: 'People', icon: Users },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'integrations', label: 'Integrations', icon: Plug },
];

const PRIMARY: Record<ModuleId, { label: string; form: FormKind | 'sync' }> = {
  overview: { label: 'New order', form: 'order' },
  sales: { label: 'New order', form: 'order' },
  inventory: { label: 'Receive stock', form: 'receive' },
  service: { label: 'New ticket', form: 'ticket' },
  people: { label: 'Apply leave', form: 'leave' },
  finance: { label: 'New invoice', form: 'invoice' },
  reports: { label: 'New report', form: 'report' },
  integrations: { label: 'Sync all', form: 'sync' },
};

const QUICK: { label: string; form: FormKind }[] = [
  { label: 'Order', form: 'order' },
  { label: 'Service ticket', form: 'ticket' },
  { label: 'Stock in', form: 'receive' },
  { label: 'Invoice', form: 'invoice' },
  { label: 'Leave', form: 'leave' },
];

const SEV_DOT = { high: 'bg-red-500', med: 'bg-amber-500', low: 'bg-ink/30' } as const;

function sparkPath(values: number[]) {
  const w = 62, h = 24, max = Math.max(...values), min = Math.min(...values);
  return values
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${((i / (values.length - 1)) * w).toFixed(1)} ${(h - ((v - min) / (max - min || 1)) * h).toFixed(1)}`)
    .join(' ');
}

const cmp = (a: string | number, b: string | number) =>
  typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b), undefined, { numeric: true });

export default function ProductShowcase() {
  const [store, dispatch] = useReducer(reducer, undefined, init);
  const s = store.present;

  const [module, setModule] = useState<ModuleId>('overview');
  const [chip, setChip] = useState('all');
  const [scope, setScope] = useState<Scope | null>(null);
  const [sort, setSort] = useState<{ col: number; dir: 1 | -1 } | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [openRef, setOpenRef] = useState<Ref | null>(null);
  const [form, setForm] = useState<{ kind: FormKind; preset?: string } | null>(null);
  const [tab, setTab] = useState<'attention' | 'activity'>('attention');
  const [query, setQuery] = useState('');
  const [hit, setHit] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toastGone, setToastGone] = useState(0);

  const { ref: viewRef, active: onScreen } = useActiveInView<HTMLDivElement>();
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ------------------------------ navigation ------------------------------ */

  // The dashboard scrolls inside its own window, so we scroll that, never the page.
  const scrollTo = useCallback((top: number) => {
    scrollRef.current?.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }, [reduce]);

  const reveal = useCallback(() => {
    requestAnimationFrame(() => {
      const sc = scrollRef.current, el = tableRef.current;
      if (!sc || !el) return;
      const delta = el.getBoundingClientRect().top - sc.getBoundingClientRect().top;
      if (delta > sc.clientHeight * 0.55 || delta < 0) scrollTo(sc.scrollTop + delta - 8);
    });
  }, [scrollTo]);

  const go = useCallback((mod: ModuleId, opts: { chip?: string; scope?: Scope | null; reveal?: boolean } = {}) => {
    setModule(mod);
    setChip(opts.chip ?? 'all');
    setScope(opts.scope ?? null);
    setSort(null);
    setShowAll(false);
    if (opts.reveal) reveal();
    else scrollRef.current?.scrollTo({ top: 0 });
  }, [reveal]);

  const pickChip = useCallback((id: string) => { setChip(id); setScope(null); setShowAll(false); reveal(); }, [reveal]);

  const toggleScope = useCallback((sc: Scope) => {
    setScope((cur) => (cur && cur.key === sc.key && cur.value === sc.value ? null : sc));
    setChip('all');
    setShowAll(false);
    reveal();
  }, [reveal]);

  const openRecord = useCallback((r: Ref) => setOpenRef(r), []);
  const closeDrawer = useCallback(() => setOpenRef(null), []);
  const closeForm = useCallback(() => setForm(null), []);
  const jump = useCallback((r: Ref) => { go(r.module); setOpenRef(r); }, [go]);
  const onCreated = useCallback((r: Ref) => { setForm(null); go(r.module); setOpenRef(r); }, [go]);

  const onKpi = (to?: KpiTarget) => { if (to) go(to.module, { chip: to.chip, scope: to.scope, reveal: true }); };

  const doPrimary = () => {
    const p = PRIMARY[module];
    if (p.form === 'sync') dispatch({ type: 'syncAll' });
    else setForm({ kind: p.form });
  };

  /* ------------------------------ clock + toast ------------------------------ */

  useEffect(() => {
    if (!onScreen) return;
    const t = setInterval(() => dispatch({ type: 'tick', mins: 1 }), 6000);
    return () => clearInterval(t);
  }, [onScreen]);

  const lastN = store.last?.n;
  useEffect(() => {
    if (lastN === undefined) return;
    const t = setTimeout(() => setToastGone(lastN), 7000);
    return () => clearTimeout(t);
  }, [lastN]);
  const toast = store.last && store.last.n !== toastGone ? store.last : null;

  /* ------------------------------ derived data ------------------------------ */

  const rows = useMemo(() => moduleRows(s, module), [s, module]);
  const chips = useMemo(() => chipsFor(module), [module]);
  const scoped = useMemo(() => (scope ? rows.filter((r) => r.tags[scope.key] === scope.value) : rows), [rows, scope]);
  const activeChip = chips.find((c) => c.id === chip) ?? chips[0];
  const filtered = useMemo(() => scoped.filter(activeChip.test), [scoped, activeChip]);
  const sorted = useMemo(
    () => (sort ? [...filtered].sort((a, b) => cmp(a.sort[sort.col], b.sort[sort.col]) * sort.dir) : filtered),
    [filtered, sort],
  );
  const visible = showAll ? sorted : sorted.slice(0, 8);

  const kpiList = useMemo(() => kpis(s, module), [s, module]);
  const allAlerts = useMemo(() => alerts(s), [s]);
  const modAlerts = module === 'overview' ? allAlerts : allAlerts.filter((a) => a.module === module);
  const feed = (module === 'overview' ? s.feed : s.feed.filter((f) => f.module === module)).slice(0, 12);
  const hits = useMemo(() => search(s, query), [s, query]);

  // Land on whichever rail tab has something to show when you switch module.
  const alertCountRef = useRef(0);
  alertCountRef.current = modAlerts.length;
  useEffect(() => { setTab(alertCountRef.current > 0 ? 'attention' : 'activity'); }, [module]);

  const counts: Partial<Record<ModuleId, number>> = {
    sales: s.orders.filter(isOpenOrder).length,
    inventory: s.skus.filter((k) => skuStatus(k) !== 'In stock').length,
    service: s.tickets.filter((t) => t.status !== 'Resolved').length,
    people: s.employees.filter((e) => e.pending).length,
    finance: s.vouchers.filter((v) => isSalesInvoice(v) && !v.paid && v.dueIn < 0).length,
    integrations: s.integrations.filter((i) => i.status !== 'Healthy').length,
  };

  const heading = useMemo(() => {
    const open = s.orders.filter(isOpenOrder).length;
    const tickets = s.tickets.filter((t) => t.status !== 'Resolved').length;
    switch (module) {
      case 'overview': {
        const h = Math.floor((s.now % 1440) / 60);
        return { title: `Good ${h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'} — here is the business today.`, sub: `${open} open orders · ${tickets} open tickets · ${allAlerts.length} items need attention` };
      }
      case 'sales': return { title: 'Sales pipeline.', sub: `${open} open orders worth ${lakh(pipeline(s).stages.reduce((a, x) => (x.name === 'Invoiced' ? a : a + x.value), 0))}` };
      case 'inventory': { const v = stockViz(s); return { title: 'Inventory across 3 stores.', sub: `${v.skus} SKUs · ${lakh(v.total)} on hand · ${counts.inventory} need reordering` }; }
      case 'service': return { title: 'Service & AMC.', sub: `${tickets} open tickets · ${serviceViz(s).atRisk} at SLA risk` };
      case 'people': return { title: 'People & attendance.', sub: `${s.employees.length} employees · ${s.employees.filter((e) => e.status === 'Present').length} present today` };
      case 'finance': return { title: 'Finance & receivables.', sub: `${lakh(s.vouchers.filter((v) => isSalesInvoice(v) && !v.paid).reduce((a, v) => a + v.amount, 0))} to collect · ${lakh(s.cash)} in the bank` };
      case 'reports': return { title: 'Reports & MIS.', sub: `${s.reports.length} reports · ${s.reports.filter((r) => r.schedule !== 'On demand').length} scheduled · run on live data` };
      case 'integrations': return { title: 'Connected systems.', sub: `${s.integrations.filter((i) => i.status !== 'Paused').length} of ${s.integrations.length} integrations live` };
    }
  }, [s, module, allAlerts.length]);

  /* ------------------------------ actions ------------------------------ */

  const exportCsv = () => {
    const head = [...HEADERS[module], 'Detail'];
    downloadCsv(`beforth-${module}-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(head, sorted.map((r) => [...r.cols, r.sub ?? ''])));
    dispatch({ type: 'logExport', what: `exported ${sorted.length} ${TABLE_TITLE[module].toLowerCase()} · CSV`, module });
  };

  const cycleSort = (col: number) =>
    setSort((cur) => (!cur || cur.col !== col ? { col, dir: 1 } : cur.dir === 1 ? { col, dir: -1 } : null));

  const pickHit = (i: number) => {
    const h = hits[i];
    if (!h) return;
    setQuery('');
    setSearchOpen(false);
    jump(h.ref);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
      if (e.key === '/' && !typing && onScreen && !openRef && !form) {
        e.preventDefault();
        searchRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onScreen, openRef, form]);

  const prim = PRIMARY[module];
  const ctx = { s, chip, scope, setChip: pickChip, toggleScope, open: openRecord, dispatch, go };

  /* ------------------------------ pieces ------------------------------ */

  const renderNav = (variant: 'sidebar' | 'strip') =>
    variant === 'strip' ? (
      <div className="md:hidden shrink-0 border-b border-ink/10 bg-white">
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-2.5">
          {MODULES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              aria-pressed={id === module}
              className={`shrink-0 inline-flex items-center gap-2 border px-3.5 min-h-[40px] text-[13px] font-medium transition-colors ${id === module ? 'bg-signal text-white border-signal' : 'bg-paper text-ink/75 border-ink/15'}`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
              {label}
              {!!counts[id] && <span className={`text-[11px] tabular-nums ${id === module ? 'text-white/80' : 'text-ash'}`}>{counts[id]}</span>}
            </button>
          ))}
        </div>
      </div>
    ) : (
      <nav className="flex-1 px-3 py-3" aria-label="Modules">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/40">Modules</p>
        <div className="flex flex-col gap-0.5">
          {MODULES.map(({ id, label, icon: Icon }) => {
            const on = id === module;
            return (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                aria-current={on ? 'page' : undefined}
                className={`group relative w-full flex items-center gap-3 pl-3 pr-2.5 min-h-[42px] text-[13.5px] font-medium text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-wave ${on ? 'bg-signal text-white' : 'text-paper/80 hover:text-paper hover:bg-paper/10'}`}
              >
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 origin-center transition-[transform,background-color] duration-200 ${on ? 'scale-y-100 bg-white' : 'scale-y-0 bg-signal group-hover:scale-y-75'}`} />
                <Icon className={`w-[17px] h-[17px] shrink-0 ${on ? 'text-white' : 'text-paper/55 group-hover:text-wave'}`} strokeWidth={1.8} />
                <span className="flex-1 truncate">{label}</span>
                {!!counts[id] && (
                  <span className={`shrink-0 min-w-[22px] text-center text-[11px] tabular-nums px-1.5 py-0.5 ${on ? 'bg-white/20 text-white' : 'bg-paper/10 text-paper/70'}`}>{counts[id]}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    );

  const rail = (
    <section className="bg-white border border-ink/10 flex flex-col h-[380px] @3xl:absolute @3xl:inset-0 @3xl:h-auto min-w-0">
      <div className="shrink-0 flex border-b border-ink/10" role="tablist" aria-label="Things that need attention, and recent activity">
        {([['attention', 'Alerts', modAlerts.length], ['activity', 'Activity', 0]] as const).map(([id, label, n]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex-1 min-h-[46px] px-3 text-[13px] font-semibold transition-colors border-b-2 -mb-px ${tab === id ? 'border-signal text-ink' : 'border-transparent text-ash hover:text-ink'}`}
          >
            {label}{id === 'attention' && n > 0 && <span className="ml-1.5 text-[11px] font-medium tabular-nums bg-ink/[0.07] px-1.5 py-0.5">{n}</span>}
          </button>
        ))}
      </div>

      {tab === 'attention' ? (
        <ul className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {modAlerts.length === 0 && <li className="px-4 py-10 text-center text-[12.5px] text-ash">Nothing needs attention here. Nice.</li>}
          {modAlerts.map((a) => (
            <li key={a.id} className="border-b border-ink/[0.07] last:border-0">
              <button type="button" onClick={() => jump(a.ref)} className="w-full text-left px-4 py-2.5 flex gap-3 hover:bg-bone/40 transition-colors group">
                <span className={`w-2 h-2 rounded-full shrink-0 mt-[6px] ${SEV_DOT[a.sev]}`} aria-label={`${a.sev} priority`} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] leading-snug">{a.title}</span>
                  <span className="block text-[11.5px] text-ash leading-snug mt-0.5">{a.detail}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-ash shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-3 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {feed.map((f) => (
              <m.li key={f.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex gap-2.5">
                <span className="text-[11px] text-ash tabular-nums w-[4.25rem] shrink-0 pt-0.5">{fmtAt(f.at, s.now)}</span>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-[7px] ${f.who === 'You' ? 'bg-signal' : 'bg-ink/30'}`} />
                {f.ref ? (
                  <button type="button" onClick={() => jump(f.ref!)} className="text-left text-[12.5px] text-ink/85 leading-snug hover:text-signal transition-colors">
                    <span className="text-ash">{f.who}</span> {f.what}
                  </button>
                ) : (
                  <p className="text-[12.5px] text-ink/85 leading-snug"><span className="text-ash">{f.who}</span> {f.what}</p>
                )}
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      <p className="shrink-0 text-[11.5px] text-ash px-4 py-2.5 border-t border-ink/10">Every action is logged, attributed and reversible.</p>
    </section>
  );

  /* ------------------------------ render ------------------------------ */

  return (
    <div
      ref={viewRef}
      className="relative bg-paper flex text-ink @container overflow-hidden"
      style={{ height: 'min(880px, calc(100svh - 5rem))', minHeight: 560 }}
    >
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-[220px] lg:w-[240px] shrink-0 bg-ink text-paper flex-col overflow-y-auto">
        <div className="px-4 py-4 border-b border-paper/10 flex items-center gap-2.5">
          <span className="w-7 h-7 bg-signal flex items-center justify-center text-[12px] font-extrabold shrink-0">B</span>
          <div className="min-w-0">
            <p className="text-[13px] tracking-[0.12em] uppercase font-bold leading-none">Beforth</p>
            <p className="text-[10.5px] text-paper/50 mt-1 leading-none">Business Suite</p>
          </div>
        </div>
        <div className="px-4 py-3.5 border-b border-paper/10 flex items-center gap-2.5">
          <span className="w-8 h-8 shrink-0 rounded-full bg-paper/10 border border-paper/15 flex items-center justify-center text-[11px] font-semibold text-paper/85">PN</span>
          <div className="min-w-0">
            <p className="text-[13px] leading-none truncate">Priya Nair</p>
            <p className="text-[10.5px] text-paper/50 mt-1.5 leading-none truncate">Sahyadri Industrial Supply</p>
          </div>
        </div>

        {renderNav('sidebar')}

        <div className="px-4 py-3.5 border-t border-paper/10 flex items-start gap-2.5">
          <MousePointerClick className="w-4 h-4 text-wave shrink-0 mt-0.5" strokeWidth={1.8} />
          <p className="text-[11.5px] text-paper/60 leading-relaxed">
            <span className="text-paper/90 font-medium">Everything here works.</span> Approve, dispatch, invoice — changes stay in your browser. Reset restores the sample data.
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {renderNav('strip')}

        <header className="relative z-20 shrink-0 min-h-12 border-b border-ink/10 bg-white flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ash pointer-events-none" />
            <input
              ref={searchRef}
              type="search"
              role="combobox"
              aria-expanded={searchOpen && hits.length > 0}
              aria-controls="demo-search-results"
              aria-label="Search orders, items, tickets, people and vouchers"
              placeholder="Search anything…  ( / )"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHit(0); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 120)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setHit((h) => Math.min(hits.length - 1, h + 1)); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); setHit((h) => Math.max(0, h - 1)); }
                else if (e.key === 'Enter') { e.preventDefault(); pickHit(hit); }
                else if (e.key === 'Escape') { setQuery(''); setSearchOpen(false); (e.target as HTMLInputElement).blur(); }
              }}
              className="w-full bg-paper border border-ink/12 pl-8 pr-8 min-h-[36px] text-[13px] outline-none placeholder:text-ash/70 focus:border-signal focus:bg-white focus:ring-2 focus:ring-signal/15 transition-[border-color,box-shadow]"
            />
            {query && (
              <button type="button" aria-label="Clear search" onMouseDown={(e) => e.preventDefault()} onClick={() => { setQuery(''); searchRef.current?.focus({ preventScroll: true }); }} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-ash hover:text-ink">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {searchOpen && query.trim() && (
              <ul id="demo-search-results" role="listbox" className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-ink/15 shadow-xl max-h-72 overflow-y-auto">
                {hits.length === 0 && <li className="px-3 py-3 text-[12.5px] text-ash">Nothing matches “{query}”.</li>}
                {hits.map((h, i) => (
                  <li key={`${h.ref.module}-${h.ref.id}`} role="option" aria-selected={i === hit}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickHit(i)}
                      onMouseEnter={() => setHit(i)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between gap-3 ${i === hit ? 'bg-bone/60' : ''}`}
                    >
                      <span className="min-w-0">
                        <span className="block text-[13px] truncate">{h.title}</span>
                        <span className="block text-[11.5px] text-ash truncate">{h.sub}</span>
                      </span>
                      <span className="shrink-0 text-[10.5px] uppercase tracking-[0.12em] text-ash">{h.ref.module}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex-1" />

          <span className="hidden sm:flex items-center gap-2 text-[11.5px] text-ink/80 tabular-nums whitespace-nowrap" aria-label={`Demo time ${clock(s.now)} IST`}>
            <span className="hidden lg:inline text-ash">{fmtLongDay()}</span>
            <span className="flex items-center gap-1.5 text-signal border border-signal/30 px-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-signal pulse-dot" /> {clock(s.now)} IST
            </span>
          </span>
          {store.past.length > 0 && (
            <Btn size="sm" variant="ghost" onClick={() => dispatch({ type: 'undo' })} aria-label="Undo last change">
              <Undo2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Undo</span>
            </Btn>
          )}
          <Btn size="sm" variant="ghost" onClick={() => { dispatch({ type: 'reset' }); go('overview'); setOpenRef(null); }} aria-label="Reset demo data">
            <RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Reset</span>
          </Btn>
        </header>

        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-auto">
          <div className="@container p-3.5 sm:p-5 flex flex-col gap-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[17px] sm:text-[20px] font-semibold tracking-[-0.015em] leading-tight">{heading.title}</h3>
                <p className="text-[12px] text-ash mt-1">{heading.sub}</p>
              </div>
              <div className="flex gap-2">
                <Btn size="sm" onClick={exportCsv}><Download className="w-3.5 h-3.5" /> Export CSV</Btn>
                <Btn size="sm" variant="ink" onClick={doPrimary}>
                  {prim.form === 'sync' ? <RefreshCw className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} {prim.label}
                </Btn>
              </div>
            </div>

            {module === 'overview' && (
              <div className="flex items-center gap-2 -mt-0.5 overflow-x-auto no-scrollbar">
                <span className="shrink-0 text-[11.5px] text-ash mr-1">Quick add</span>
                {QUICK.map((q) => (
                  <button
                    key={q.form}
                    type="button"
                    onClick={() => setForm({ kind: q.form })}
                    className="shrink-0 inline-flex items-center gap-1 border border-ink/15 bg-white px-2.5 min-h-[30px] text-[12px] hover:border-signal hover:text-signal transition-colors"
                  >
                    <Plus className="w-3 h-3" /> {q.label}
                  </button>
                ))}
              </div>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-3">
              {kpiList.map((k) => {
                const inner = (
                  <>
                    <p className="text-[11.5px] text-ash mb-2 flex items-center justify-between gap-1">
                      <span className="leading-snug sm:truncate">{k.label}</span>
                      {k.to && <ArrowRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </p>
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[19px] sm:text-[22px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{k.value}</p>
                        <p className={`text-[11.5px] mt-1.5 tabular-nums ${k.tone === 'good' ? 'text-signal' : k.tone === 'bad' ? 'text-red-600' : 'text-ash'}`}>{k.delta}</p>
                      </div>
                      <svg width="62" height="24" viewBox="0 0 62 24" fill="none" className="shrink-0 hidden sm:block" aria-hidden>
                        <path d={sparkPath(k.spark)} stroke={k.tone === 'bad' ? '#B91C1C' : '#1C75BC'} strokeWidth="1.4" />
                      </svg>
                    </div>
                  </>
                );
                return k.to ? (
                  <button
                    key={k.label}
                    type="button"
                    onClick={() => onKpi(k.to)}
                    className="group text-left bg-white border border-ink/10 p-3.5 hover:border-signal/60 hover:shadow-sm transition-[border-color,box-shadow] focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal"
                    aria-label={`${k.label}: ${k.value}, ${k.delta}. Show the records.`}
                  >
                    {inner}
                  </button>
                ) : (
                  <div key={k.label} className="bg-white border border-ink/10 p-3.5">{inner}</div>
                );
              })}
            </div>

            {/* Main chart + alerts rail, then this module's widgets */}
            <Board module={module} rail={rail} {...ctx} />

            {/* Table */}
            <section ref={tableRef} className="bg-white border border-ink/10 scroll-mt-2">
              <div className="px-4 py-3 border-b border-ink/10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <h4 className="text-[13px] font-semibold tracking-[-0.01em]">{TABLE_TITLE[module]}</h4>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full" role="group" aria-label="Filter">
                  {chips.map((c) => {
                    const on = c.id === activeChip.id;
                    const n = scoped.filter(c.test).length;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => pickChip(c.id)}
                        aria-pressed={on}
                        className={`shrink-0 border px-2.5 min-h-[30px] text-[11.5px] transition-colors ${on ? 'bg-ink text-paper border-ink' : 'bg-white text-ash border-ink/15 hover:border-ink/40'}`}
                      >
                        {c.label} <span className={`tabular-nums ${on ? 'text-paper/65' : 'text-ash/70'}`}>{n}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {scope && (
                <div className="px-4 py-2 border-b border-ink/10 bg-bone/40 flex items-center gap-2 text-[12px]">
                  <span className="text-ash">Filtered by</span>
                  <span className="inline-flex items-center gap-1.5 bg-white border border-ink/15 pl-2 pr-1 py-0.5">
                    {scope.label}
                    <button type="button" aria-label="Remove filter" onClick={() => setScope(null)} className="w-5 h-5 flex items-center justify-center text-ash hover:text-ink"><X className="w-3 h-3" /></button>
                  </span>
                </div>
              )}

              <div className="relative">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full min-w-[480px]">
                    <thead>
                      <tr className="text-[11.5px] text-ash text-left">
                        {HEADERS[module].map((h, i) => {
                          const on = sort?.col === i;
                          return (
                            <th key={h} scope="col" aria-sort={on ? (sort!.dir === 1 ? 'ascending' : 'descending') : 'none'} className={`font-normal px-4 py-2 ${i >= 2 ? 'text-right' : ''}`}>
                              <button type="button" onClick={() => cycleSort(i)} className={`inline-flex items-center gap-1 hover:text-ink transition-colors ${on ? 'text-ink' : ''}`}>
                                {h}
                                {on ? (sort!.dir === 1 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-0" />}
                              </button>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((r: Row) => (
                        <tr
                          key={r.ref.id}
                          onClick={() => setOpenRef(r.ref)}
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenRef(r.ref); } }}
                          className="border-t border-ink/[0.07] hover:bg-bone/40 cursor-pointer focus:outline-none focus-visible:bg-bone/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal"
                        >
                          <td className="px-4 py-2.5 text-ash tabular-nums align-top text-[12px] whitespace-nowrap">{r.cols[0]}</td>
                          <td className="px-4 py-2.5 align-top">
                            <div className="text-[13px] leading-tight">{r.cols[1]}</div>
                            {r.sub && <div className={`text-[11.5px] mt-0.5 leading-snug ${r.subTone === 'red' ? 'text-red-600' : r.subTone === 'amber' ? 'text-amber-700' : 'text-ash'}`}>{r.sub}</div>}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums align-top text-[12.5px] whitespace-nowrap">{r.cols[2]}</td>
                          <td className="px-4 py-2.5 text-right align-top whitespace-nowrap">
                            {module === 'reports' ? <span className="text-[12px] text-ash">{r.cols[3]}</span> : <Pill tone={r.tone}>{r.cols[3]}</Pill>}
                          </td>
                        </tr>
                      ))}
                      {sorted.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-[12.5px] text-ash">
                            No records match.{' '}
                            <button type="button" className="underline underline-offset-2 hover:text-ink" onClick={() => { setChip('all'); setScope(null); }}>Clear filters</button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="sm:hidden pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
              </div>

              <div className="px-4 py-2.5 border-t border-ink/10 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11.5px] text-ash">Click a row to open it and act on it</span>
                <span className="flex items-center gap-3 text-[11.5px]">
                  <span className="text-signal tabular-nums">{visible.length} of {sorted.length}{sorted.length !== rows.length ? ` (${rows.length} total)` : ''}</span>
                  {sorted.length > 8 && (
                    <button type="button" onClick={() => setShowAll((v) => !v)} className="underline underline-offset-2 text-ash hover:text-ink">
                      {showAll ? 'Show fewer' : 'Show all'}
                    </button>
                  )}
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Everything below opens inside this window, never over the page. */}
      <AnimatePresence>
        {openRef && <RecordDrawer key="drawer" r={openRef} s={s} dispatch={dispatch} open={openRecord} close={closeDrawer} />}
      </AnimatePresence>
      <AnimatePresence>
        {form && <FormDialog key="form" kind={form.kind} preset={form.preset} s={s} dispatch={dispatch} close={closeForm} created={onCreated} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {toast && (
          <m.div
            key={toast.n}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
            className="absolute z-[70] bottom-4 left-1/2 -translate-x-1/2 max-w-[calc(100%-2rem)] bg-ink text-paper shadow-2xl flex items-center gap-3 pl-4 pr-1.5 py-1.5"
          >
            <span className="text-[13px] py-1.5">{toast.label}</span>
            {toast.ref && !(openRef && openRef.id === toast.ref.id) && (
              <button type="button" onClick={() => jump(toast.ref!)} className="text-[12.5px] font-medium text-wave hover:text-white px-2 min-h-[36px]">View</button>
            )}
            <button type="button" onClick={() => dispatch({ type: 'undo' })} className="text-[12.5px] font-medium px-3 min-h-[36px] bg-paper/10 hover:bg-paper/20 transition-colors inline-flex items-center gap-1.5">
              <Undo2 className="w-3.5 h-3.5" /> Undo
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
