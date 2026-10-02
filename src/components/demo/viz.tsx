import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { DemoState, ModuleId, Ref, Schedule } from './types';
import type { Action } from './store';
import {
  billsDue, collections, financeViz, integrationLog, leaveRequests, orderQueue, peopleViz, pipeline,
  reorderList, reportsViz, roster, serviceViz, slaQueue, stockHealth, stockViz, topCustomers, trend, type Scope,
} from './selectors';
import { ENGINEERS } from './rules';
import { ago, duration, fmtAt, fmtDay, inr, lakh, lakhK, rupees } from './format';
import { BAD, Bar, Btn, Donut, GOOD, Gauge, Pick, Pill, QRow, RAMP, WARN, Widget } from './ui';

export interface VizCtx {
  s: DemoState;
  chip: string;
  scope: Scope | null;
  setChip: (id: string) => void;
  toggleScope: (sc: Scope) => void;
  open: (r: Ref) => void;
  dispatch: (a: Action) => void;
  go: (m: ModuleId, opts?: { chip?: string; scope?: Scope | null; reveal?: boolean }) => void;
}

const scopeOn = (c: VizCtx, key: string, value: string) => c.scope?.key === key && c.scope.value === value;
/** Pipeline stages darken as an order matures. */
const PIPE = [RAMP[4], RAMP[4], RAMP[3], RAMP[2], RAMP[1], RAMP[0]];
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

const OpenLink = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-[11.5px] text-ash hover:text-signal transition-colors">
    {label} <ArrowRight className="w-3 h-3" />
  </button>
);

const Empty = ({ children }: { children: React.ReactNode }) => (
  <p className="py-6 text-center text-[12.5px] text-ash">{children}</p>
);

/* ================================================================== */
/* Overview                                                             */
/* ================================================================== */

function TrendChart({ s }: { s: DemoState }) {
  const [range, setRange] = useState(12);
  const [hover, setHover] = useState<number | null>(null);
  const t = trend(s);
  const series = t.series.slice(-range);
  const target = t.target.slice(-range);
  const labels = t.labels.slice(-range);
  const n = series.length;

  const W = 600, H = 168, px = 8, pt = 12, pb = 10;
  const lo = Math.floor((Math.min(...series, ...target) * 0.8) / 50) * 50;
  const hi = Math.ceil((Math.max(...series, ...target) * 1.08) / 50) * 50;
  const X = (i: number) => px + (i / (n - 1)) * (W - 2 * px);
  const Y = (v: number) => H - pb - ((v - lo) / (hi - lo)) * (H - pt - pb);
  const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'} ${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
  const area = `${path(series)} L ${X(n - 1).toFixed(1)} ${H - pb} L ${X(0).toFixed(1)} ${H - pb} Z`;

  const idx = Math.min(hover ?? n - 1, n - 1);
  const cur = series[idx];
  const tgt = target[idx];
  const vs = tgt ? Math.round(((cur - tgt) / tgt) * 100) : 0;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    setHover(Math.max(0, Math.min(n - 1, Math.round(((x - px) / (W - 2 * px)) * (n - 1)))));
  };

  return (
    <Widget
      title="Billing vs target"
      className="h-full"
      action={
        <div className="flex items-center gap-1.5" role="group" aria-label="Chart range">
          {[4, 8, 12].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`border px-2.5 min-h-[28px] text-[11.5px] transition-colors ${range === r ? 'bg-ink text-paper border-ink' : 'bg-white text-ash border-ink/15 hover:border-ink/40'}`}
            >
              {r}w
            </button>
          ))}
        </div>
      }
    >
      <div className="flex items-end justify-between gap-3 mb-2">
        <div>
          <p className="text-[24px] font-semibold tracking-[-0.02em] leading-none tabular-nums">{lakhK(cur)}</p>
          <p className="text-[11.5px] text-ash mt-1.5">{labels[idx]} · sales invoices raised</p>
        </div>
        <p className={`text-[12px] tabular-nums text-right ${vs >= 0 ? 'text-signal' : 'text-red-600'}`}>
          {vs >= 0 ? '+' : '−'}{Math.abs(vs)}% <span className="text-ash">vs target {lakhK(tgt)}</span>
        </p>
      </div>

      <div
        className="relative touch-pan-y cursor-crosshair focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        tabIndex={0}
        role="group"
        aria-label={`Weekly billing chart. ${labels[idx]}: ${lakhK(cur)}, ${vs}% against target. Use the arrow keys to move.`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') { e.preventDefault(); setHover(Math.max(0, idx - 1)); }
          if (e.key === 'ArrowRight') { e.preventDefault(); setHover(Math.min(n - 1, idx + 1)); }
        }}
        onBlur={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[168px]" preserveAspectRatio="none" fill="none" aria-hidden>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1C75BC" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1C75BC" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1="0" x2={W} y1={pt + f * (H - pt - pb) - 0.5} y2={pt + f * (H - pt - pb) - 0.5} stroke="#231F20" strokeOpacity="0.07" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={area} fill="url(#trendFill)" />
          <path d={path(target)} stroke="#231F20" strokeOpacity="0.32" strokeWidth="1.2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          <path d={path(series)} stroke="#1C75BC" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <line x1={X(idx)} x2={X(idx)} y1={pt} y2={H - pb} stroke="#231F20" strokeOpacity="0.25" vectorEffect="non-scaling-stroke" />
        </svg>
        <span
          className="absolute w-2.5 h-2.5 rounded-full bg-signal ring-4 ring-white -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${(X(idx) / W) * 100}%`, top: `${(Y(cur) / H) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[10.5px] text-ash mt-1.5 tabular-nums">
        <span>{labels[0]}</span>
        <span className="hidden sm:inline">{labels[Math.floor(n / 2)]}</span>
        <span>{labels[n - 1]}</span>
      </div>
      <div className="flex items-center gap-4 mt-2.5 text-[11.5px] text-ash">
        <span className="flex items-center gap-1.5"><i className="w-3 h-0.5 bg-signal inline-block" />Billed (₹ lakh)</span>
        <span className="flex items-center gap-1.5"><i className="w-3 border-t border-dashed border-ink/40 inline-block" />Target</span>
      </div>
    </Widget>
  );
}

function SalesGlance(c: VizCtx) {
  const p = pipeline(c.s);
  const max = Math.max(...p.stages.map((x) => x.n), 1);
  return (
    <Widget title="Sales" action={<OpenLink onClick={() => c.go('sales', { reveal: true })} label="Open" />}>
      <div className="flex flex-col gap-0.5">
        {p.stages.map((st, i) => (
          <Pick key={st.name} onClick={() => c.go('sales', { chip: st.name, reveal: true })} label={`Open sales, ${st.name}`}>
            <div className="grid grid-cols-[4.6rem_1fr_1.5rem] items-center gap-2">
              <span className="text-[11.5px] text-ash">{st.name}</span>
              <Bar pct={(st.n / max) * 100} color={PIPE[i]} height="h-2" />
              <span className="text-[11.5px] tabular-nums text-right">{st.n}</span>
            </div>
          </Pick>
        ))}
      </div>
    </Widget>
  );
}

function StockGlance(c: VizCtx) {
  const h = stockHealth(c.s);
  return (
    <Widget title="Stock health" action={<OpenLink onClick={() => c.go('inventory', { reveal: true })} label="Open" />}>
      <Donut
        size={96}
        thickness={13}
        center={h.low + h.out}
        sub="to reorder"
        segments={[
          { key: 'in', label: 'In stock', value: h.inStock, color: RAMP[3], onPick: () => c.go('inventory', { chip: 'In stock', reveal: true }) },
          { key: 'low', label: 'Low', value: h.low, color: '#D97706', onPick: () => c.go('inventory', { chip: 'Low stock', reveal: true }) },
          { key: 'out', label: 'Out', value: h.out, color: BAD, onPick: () => c.go('inventory', { chip: 'Out of stock', reveal: true }) },
        ]}
      />
    </Widget>
  );
}

function SlaGlance(c: VizCtx) {
  const v = serviceViz(c.s);
  return (
    <Widget title="Service SLA" action={<OpenLink onClick={() => c.go('service', { reveal: true })} label="Open" />}>
      <div className="flex items-center gap-4">
        <Gauge pct={v.slaMet} label="in SLA" size={96} thickness={12} color={v.slaMet >= 90 ? GOOD : WARN} />
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <button type="button" onClick={() => c.go('service', { chip: 'risk', reveal: true })} className="flex items-center justify-between text-[12px] px-1.5 py-1 -mx-1.5 hover:bg-ink/[0.04] transition-colors">
            <span className="text-ash">At risk</span><span className={`tabular-nums font-medium ${v.atRisk ? 'text-amber-700' : ''}`}>{v.atRisk}</span>
          </button>
          <button type="button" onClick={() => c.go('service', { chip: 'unassigned', reveal: true })} className="flex items-center justify-between text-[12px] px-1.5 py-1 -mx-1.5 hover:bg-ink/[0.04] transition-colors">
            <span className="text-ash">Unassigned</span><span className="tabular-nums font-medium">{v.unassigned}</span>
          </button>
          <button type="button" onClick={() => c.go('service', { chip: 'open', reveal: true })} className="flex items-center justify-between text-[12px] px-1.5 py-1 -mx-1.5 hover:bg-ink/[0.04] transition-colors">
            <span className="text-ash">Open</span><span className="tabular-nums font-medium">{v.total}</span>
          </button>
        </div>
      </div>
    </Widget>
  );
}

function CashGlance(c: VizCtx) {
  const v = financeViz(c.s);
  const max = Math.max(v.recTotal, v.payTotal, 1);
  const overdue = v.rec.filter((b) => b.label !== 'Not due').reduce((a, b) => a + b.value, 0);
  return (
    <Widget title="Cash & dues" action={<OpenLink onClick={() => c.go('finance', { reveal: true })} label="Open" />}>
      <p className="text-[22px] font-semibold tracking-[-0.02em] leading-none tabular-nums">{lakh(v.cash)}</p>
      <p className="text-[11.5px] text-ash mt-1 mb-3">in the bank</p>
      <div className="flex flex-col gap-0.5">
        <Pick onClick={() => c.go('finance', { chip: 'invoices', reveal: true })} label="Open receivables">
          <div className="flex justify-between text-[11.5px] mb-1"><span className="text-ash">To collect</span><span className="tabular-nums">{lakh(v.recTotal)}</span></div>
          <Bar pct={(v.recTotal / max) * 100} height="h-2" />
        </Pick>
        <Pick onClick={() => c.go('finance', { chip: 'bills', reveal: true })} label="Open payables">
          <div className="flex justify-between text-[11.5px] mb-1"><span className="text-ash">To pay</span><span className="tabular-nums">{lakh(v.payTotal)}</span></div>
          <Bar pct={(v.payTotal / max) * 100} color={RAMP[1]} height="h-2" />
        </Pick>
      </div>
      {overdue > 0 && <p className="text-[11.5px] text-red-600 mt-2">{lakh(overdue)} of that is overdue</p>}
    </Widget>
  );
}

/* ================================================================== */
/* Sales                                                                */
/* ================================================================== */

function PipelineHero(c: VizCtx) {
  const p = pipeline(c.s);
  const max = Math.max(...p.stages.map((x) => x.value), 1);
  const orders = p.stages.reduce((a, x) => a + x.n, 0);
  const value = p.stages.reduce((a, x) => a + x.value, 0);

  return (
    <Widget title="Pipeline by stage" hint={`${plural(orders, 'order')} · ${lakh(value)}`} className="h-full">
      <div className="flex flex-col gap-0.5">
        {p.stages.map((st, i) => (
          <Pick key={st.name} active={c.chip === st.name} onClick={() => c.setChip(c.chip === st.name ? 'all' : st.name)} label={`Filter orders: ${st.name}`}>
            <div className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3">
              <span className="text-[12px] text-ash">{st.name}</span>
              <Bar pct={(st.value / max) * 100} color={PIPE[i]} height="h-3" />
              <span className="text-[12px] tabular-nums min-w-[6.5rem] text-right">{lakh(st.value)} <span className="text-ash">· {st.n}</span></span>
            </div>
          </Pick>
        ))}
      </div>
      <div className="mt-3.5 pt-3.5 border-t border-ink/[0.08] grid grid-cols-3 gap-3">
        {p.conversion.map((x) => (
          <div key={x.from}>
            <p className="text-[20px] font-semibold tracking-[-0.02em] leading-none tabular-nums">{x.pct}%</p>
            <p className="text-[11px] text-ash mt-1.5 leading-tight">{x.from} → {x.to}</p>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function OrderQueue(c: VizCtx) {
  const q = orderQueue(c.s, 6);
  return (
    <Widget title="Order queue" hint="next step for each open order" className="h-full">
      {q.length === 0 ? <Empty>Every order is invoiced. Nothing waiting.</Empty> : (
        <ul>
          {q.map((x) => (
            <QRow
              key={x.order.id}
              label={`Open ${x.order.id}`}
              onOpen={() => c.open({ module: 'sales', id: x.order.id })}
              title={<>{x.order.id} <span className="text-ash">· {x.customer}</span></>}
              sub={x.blocked ? `Short on stock: ${x.shortText}` : `${x.order.stage} · ${plural(x.order.lines.length, 'item')}`}
              subTone={x.blocked ? 'red' : undefined}
              meta={rupees(x.total)}
              actions={
                x.blocked ? (
                  <Btn size="xs" onClick={() => c.open({ module: 'inventory', id: x.shortSku })}>Fix stock</Btn>
                ) : (
                  <Btn size="xs" variant="primary" onClick={() => c.dispatch({ type: 'advanceOrder', id: x.order.id })}>
                    {x.label.replace(' & issue stock', '')}
                  </Btn>
                )
              }
            />
          ))}
        </ul>
      )}
    </Widget>
  );
}

function TopCustomers(c: VizCtx) {
  const list = topCustomers(c.s, 5);
  const max = Math.max(...list.map((x) => x.value), 1);
  return (
    <Widget title="Top customers" hint="by order value · click to filter" className="h-full">
      <div className="flex flex-col gap-0.5">
        {list.map((x, i) => (
          <Pick key={x.name} active={scopeOn(c, 'customer', x.name)} onClick={() => c.toggleScope({ key: 'customer', value: x.name, label: x.name })} label={`Filter orders: ${x.name}`}>
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="text-[12px] truncate">{x.name}</span>
              <span className="text-[12px] tabular-nums shrink-0">{lakh(x.value)} <span className="text-ash">· {x.n}</span></span>
            </div>
            <Bar pct={(x.value / max) * 100} color={RAMP[Math.min(i + 1, 4)]} height="h-2" />
          </Pick>
        ))}
      </div>
    </Widget>
  );
}

/* ================================================================== */
/* Inventory                                                            */
/* ================================================================== */

function StockHero(c: VizCtx) {
  const v = stockViz(c.s);
  const h = stockHealth(c.s);
  const maxCat = Math.max(...v.categories.map((x) => x.value), 1);
  const seg = (n: number, color: string, chip: string, label: string) =>
    n > 0 && (
      <button
        key={chip}
        type="button"
        aria-label={`Show ${label}: ${n}`}
        aria-pressed={c.chip === chip}
        onClick={() => c.setChip(c.chip === chip ? 'all' : chip)}
        className={`h-3 transition-opacity ${c.chip !== 'all' && c.chip !== chip ? 'opacity-35' : ''}`}
        style={{ width: `${(n / h.total) * 100}%`, backgroundColor: color }}
      />
    );

  return (
    <Widget title="Stock value by category" hint={`${lakh(v.total)} · ${plural(v.skus, 'SKU')}`} className="h-full">
      <div className="mb-3.5">
        <div className="flex h-3 w-full overflow-hidden bg-ink/[0.07]">
          {seg(h.inStock, RAMP[3], 'In stock', 'in stock')}
          {seg(h.low, '#D97706', 'Low stock', 'low stock')}
          {seg(h.out, BAD, 'Out of stock', 'out of stock')}
        </div>
        <p className="text-[11.5px] text-ash mt-1.5">{h.inStock} in stock · {h.low} low · {h.out} out{h.onOrder ? ` · ${h.onOrder} on order` : ''}</p>
      </div>
      <div className="flex flex-col gap-0.5 pt-3 border-t border-ink/[0.08]">
        {v.categories.map((x, i) => (
          <Pick key={x.name} active={scopeOn(c, 'category', x.name)} onClick={() => c.toggleScope({ key: 'category', value: x.name, label: x.name })} label={`Filter stock: ${x.name}`}>
            <div className="grid grid-cols-[8.5rem_1fr_auto] items-center gap-3">
              <span className="text-[12px] text-ash truncate">{x.name}</span>
              <Bar pct={(x.value / maxCat) * 100} color={RAMP[Math.min(i, 5)]} height="h-3" />
              <span className="text-[12px] tabular-nums min-w-[6rem] text-right">{lakh(x.value)} <span className="text-ash">· {x.n}</span></span>
            </div>
          </Pick>
        ))}
      </div>
    </Widget>
  );
}

function ReorderList(c: VizCtx) {
  const list = reorderList(c.s, 6);
  return (
    <Widget title="Reorder list" hint="raise a PO, then receive the goods" className="h-full">
      {list.length === 0 ? <Empty>Everything is above its reorder point.</Empty> : (
        <ul>
          {list.map(({ k, status, need, qty }) => (
            <QRow
              key={k.sku}
              label={`Open ${k.sku}`}
              onOpen={() => c.open({ module: 'inventory', id: k.sku })}
              title={<>{k.sku} <span className="text-ash">· {k.name}</span></>}
              sub={`${inr(k.onHand)} on hand · reorder at ${inr(k.reorderAt)}${need ? ` · ${inr(need)} promised` : ''}`}
              subTone={status === 'Out of stock' ? 'red' : 'amber'}
              actions={
                k.onOrder ? (
                  <Btn size="xs" variant="primary" onClick={() => c.dispatch({ type: 'receiveStock', sku: k.sku, qty })}>Receive {inr(qty)}</Btn>
                ) : (
                  <Btn size="xs" onClick={() => c.dispatch({ type: 'raisePO', sku: k.sku, qty })}>Raise PO · {inr(qty)}</Btn>
                )
              }
            />
          ))}
        </ul>
      )}
    </Widget>
  );
}

function StockSplit(c: VizCtx) {
  const v = stockViz(c.s);
  const maxStore = Math.max(...v.stores.map((x) => x.value), 1);
  return (
    <Widget title="Where the stock sits" hint="click to filter" className="h-full">
      <div className="flex flex-col gap-0.5">
        {v.stores.map((x, i) => (
          <Pick key={x.name} active={scopeOn(c, 'store', x.name)} onClick={() => c.toggleScope({ key: 'store', value: x.name, label: x.name })} label={`Filter stock: ${x.name}`}>
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="text-[12px]">{x.name}</span>
              <span className="text-[12px] tabular-nums">{lakh(x.value)} <span className="text-ash">· {plural(x.n, 'SKU')}</span></span>
            </div>
            <Bar pct={(x.value / maxStore) * 100} color={RAMP[i + 2]} height="h-2" />
          </Pick>
        ))}
      </div>
      <div className="mt-3.5 pt-3.5 border-t border-ink/[0.08]">
        <p className="text-[11.5px] text-ash mb-2">Age of stock, by value</p>
        <div className="flex h-3 w-full overflow-hidden bg-ink/[0.07]">
          {v.ageing.map((a, i) => a.pct > 0 && (
            <button
              key={a.label}
              type="button"
              aria-label={`Filter stock: ${a.label}, ${a.pct.toFixed(0)}% of value`}
              aria-pressed={scopeOn(c, 'age', a.label)}
              onClick={() => c.toggleScope({ key: 'age', value: a.label, label: `Age ${a.label}` })}
              className={`h-3 transition-opacity ${c.scope?.key === 'age' && !scopeOn(c, 'age', a.label) ? 'opacity-35' : ''}`}
              style={{ width: `${a.pct}%`, backgroundColor: RAMP[i] }}
            />
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
          {v.ageing.map((a, i) => (
            <Pick key={a.label} active={scopeOn(c, 'age', a.label)} onClick={() => c.toggleScope({ key: 'age', value: a.label, label: `Age ${a.label}` })} label={`Filter stock: ${a.label}`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 shrink-0" style={{ backgroundColor: RAMP[i] }} />
                <span className="text-[11.5px] text-ash">{a.label}</span>
                <span className="text-[11.5px] tabular-nums ml-auto">{a.pct.toFixed(0)}%</span>
              </div>
            </Pick>
          ))}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-ink/[0.08] grid grid-cols-4 gap-2 text-center">
        {([['Received', v.movement.received], ['Issued', v.movement.issued], ['Transferred', v.movement.transferred], ['Adjusted', v.movement.adjusted]] as [string, number][]).map(([k, n]) => (
          <div key={k}>
            <p className="text-[15px] font-semibold tabular-nums">{n}</p>
            <p className="text-[10.5px] text-ash leading-tight">{k}</p>
          </div>
        ))}
      </div>
    </Widget>
  );
}

/* ================================================================== */
/* Service                                                              */
/* ================================================================== */

function SlaQueue(c: VizCtx) {
  const list = slaQueue(c.s, 6);
  const tone = { ok: 'text-ash', risk: 'text-amber-700 font-medium', breached: 'text-red-600 font-medium', met: 'text-ash', missed: 'text-red-600' } as const;
  return (
    <Widget title="SLA queue" hint="most urgent first" className="h-full">
      {list.length === 0 ? <Empty>No open tickets. All caught up.</Empty> : (
        <ul>
          {list.map(({ t, customer, sla }) => (
            <QRow
              key={t.id}
              label={`Open ${t.id}`}
              onOpen={() => c.open({ module: 'service', id: t.id })}
              title={<>{t.id} <span className="text-ash">· {customer}</span></>}
              sub={`${t.priority} · ${t.subject}`}
              meta={<span className={tone[sla.state]}>{sla.state === 'breached' ? `${duration(sla.left)} late` : `${duration(sla.left)} left`}</span>}
              actions={
                t.engineer ? (
                  <Btn size="xs" variant="primary" onClick={() => c.dispatch({ type: 'resolveTicket', id: t.id })}><Check className="w-3 h-3" /> Resolve</Btn>
                ) : (
                  <select
                    aria-label={`Assign ${t.id}`}
                    defaultValue=""
                    onChange={(e) => e.target.value && c.dispatch({ type: 'assignTicket', id: t.id, engineer: e.target.value })}
                    className="text-[11.5px] border border-ink/20 bg-white min-h-[28px] px-1.5 hover:border-ink/50 focus:border-signal outline-none"
                  >
                    <option value="" disabled>Assign…</option>
                    {ENGINEERS.map((e) => <option key={e}>{e}</option>)}
                  </select>
                )
              }
            />
          ))}
        </ul>
      )}
    </Widget>
  );
}

function PriorityMix(c: VizCtx) {
  const v = serviceViz(c.s);
  return (
    <Widget title="Open by priority" hint="click to filter" className="h-full">
      <Donut
        center={v.total}
        sub="open"
        segments={v.priority.map((p, i) => ({
          key: p.name, label: p.name, value: p.n, color: RAMP[i],
          active: scopeOn(c, 'priority', p.name),
          onPick: () => c.toggleScope({ key: 'priority', value: p.name, label: `${p.name} priority` }),
        }))}
      />
    </Widget>
  );
}

function EngineerLoad(c: VizCtx) {
  const v = serviceViz(c.s);
  const maxEng = Math.max(...v.engineers.map((e) => Math.max(e.open, e.closed)), 1);
  return (
    <Widget title="Engineer workload" hint="open now · closed (30 days)" className="h-full">
      <div className="flex flex-col gap-0.5">
        {ENGINEERS.map((name) => {
          const e = v.engineers.find((x) => x.name === name)!;
          return (
            <Pick key={name} active={scopeOn(c, 'engineer', name)} onClick={() => c.toggleScope({ key: 'engineer', value: name, label: name })} label={`Filter tickets: ${name}`}>
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-[12px]">{name}</span>
                <span className="text-[11.5px] tabular-nums text-ash">{e.open} open · {e.closed} closed</span>
              </div>
              <div className="flex flex-col gap-1">
                <Bar pct={(e.open / maxEng) * 100} color={RAMP[4]} height="h-1.5" />
                <Bar pct={(e.closed / maxEng) * 100} color={RAMP[1]} height="h-1.5" />
              </div>
            </Pick>
          );
        })}
      </div>
      <div className="mt-2.5 flex items-center gap-4 text-[11px] text-ash">
        <span className="flex items-center gap-1.5"><i className="w-2.5 h-1.5 inline-block" style={{ background: RAMP[4] }} />Open</span>
        <span className="flex items-center gap-1.5"><i className="w-2.5 h-1.5 inline-block" style={{ background: RAMP[1] }} />Closed</span>
      </div>
    </Widget>
  );
}

/* ================================================================== */
/* People                                                               */
/* ================================================================== */

function RosterHero(c: VizCtx) {
  const list = roster(c.s);
  const v = peopleViz(c.s);
  const out = c.s.employees.filter((e) => e.status === 'On leave').length;
  const absent = c.s.employees.filter((e) => e.status === 'Absent').length;
  const skin = {
    Present: 'border-ink/12 bg-white hover:border-signal/50',
    'On leave': 'border-amber-200 bg-amber-50',
    Absent: 'border-red-200 bg-red-50',
  } as const;
  const dot = { Present: 'bg-signal', 'On leave': 'bg-amber-500', Absent: 'bg-red-500' } as const;

  return (
    <Widget title="Roster today" hint={`${v.present} of ${v.total} present`} className="h-full">
      <div className="grid grid-cols-2 @lg:grid-cols-3 gap-2">
        {list.map(({ e, initials }) => (
          <button
            key={e.id}
            type="button"
            onClick={() => c.open({ module: 'people', id: e.id })}
            aria-label={`${e.name}, ${e.status}${e.pending ? ', leave request pending' : ''}`}
            className={`flex items-center gap-2.5 border px-2.5 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal ${skin[e.status]}`}
          >
            <span className="relative w-8 h-8 shrink-0 rounded-full bg-ink/[0.07] flex items-center justify-center text-[11px] font-semibold">
              {initials}
              <span className={`absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${dot[e.status]}`} />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] leading-tight truncate">{e.name.split(' ')[0]}</span>
              <span className={`block text-[10.5px] leading-tight truncate mt-0.5 ${e.pending ? 'text-amber-700' : 'text-ash'}`}>{e.pending ? 'Leave pending' : e.dept}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-ink/[0.08] flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] text-ash">
        <button type="button" onClick={() => c.setChip('Present')} className="hover:text-ink flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-signal" />{v.present} present</button>
        <button type="button" onClick={() => c.setChip('On leave')} className="hover:text-ink flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-amber-500" />{out} on leave</button>
        <button type="button" onClick={() => c.setChip('Absent')} className="hover:text-ink flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-red-500" />{absent} absent</button>
      </div>
    </Widget>
  );
}

function DeptAttendance(c: VizCtx) {
  const v = peopleViz(c.s);
  const maxLeave = Math.max(...v.leave.map((l) => l.n), 1);
  return (
    <Widget title="Attendance by department" hint={`${v.present} of ${v.total} present`} className="h-full">
      <div className="flex flex-col gap-0.5">
        {v.depts.map((d) => {
          const pct = d.head ? (d.present / d.head) * 100 : 0;
          return (
            <Pick key={d.name} active={scopeOn(c, 'dept', d.name)} onClick={() => c.toggleScope({ key: 'dept', value: d.name, label: d.name })} label={`Filter team: ${d.name}`}>
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-[12px]">{d.name}</span>
                <span className="text-[11.5px] tabular-nums text-ash">{d.present}/{d.head} · {pct.toFixed(0)}%</span>
              </div>
              <Bar pct={pct} height="h-2.5" color={pct < 67 ? RAMP[2] : RAMP[3]} />
            </Pick>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-ink/[0.08]">
        <p className="text-[11.5px] text-ash mb-1.5">On leave today, by type</p>
        <div className="flex flex-col gap-0.5">
          {v.leave.map((l, i) => (
            <Pick key={l.name} active={scopeOn(c, 'leave', l.name)} onClick={() => c.toggleScope({ key: 'leave', value: l.name, label: `${l.name} leave` })} label={`Filter team: ${l.name} leave`}>
              <div className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-2">
                <span className="text-[11.5px] text-ash">{l.name}</span>
                <Bar pct={(l.n / maxLeave) * 100} color={RAMP[i + 2]} height="h-2" />
                <span className="text-[11.5px] tabular-nums">{l.n}</span>
              </div>
            </Pick>
          ))}
        </div>
      </div>
    </Widget>
  );
}

function LeaveRequests(c: VizCtx) {
  const list = leaveRequests(c.s);
  return (
    <Widget title="Leave requests" hint={list.length ? `${list.length} waiting for you` : undefined} className="h-full">
      {list.length === 0 ? <Empty>No leave requests waiting.</Empty> : (
        <ul>
          {list.map((e) => (
            <QRow
              key={e.id}
              label={`Open ${e.name}`}
              onOpen={() => c.open({ module: 'people', id: e.id })}
              title={e.name}
              sub={`${plural(e.pending!.days, 'day')} ${e.pending!.type.toLowerCase()} · ${e.balance[e.pending!.type]} available`}
              actions={
                <>
                  <Btn size="xs" variant="primary" onClick={() => c.dispatch({ type: 'decideLeave', id: e.id, approve: true })}>Approve</Btn>
                  <Btn size="xs" onClick={() => c.dispatch({ type: 'decideLeave', id: e.id, approve: false })}>Decline</Btn>
                </>
              }
            />
          ))}
        </ul>
      )}
    </Widget>
  );
}

/* ================================================================== */
/* Finance                                                              */
/* ================================================================== */

function AgeingHero(c: VizCtx) {
  const v = financeViz(c.s);

  const strip = (title: string, total: number, data: typeof v.rec, prefix: 'recv' | 'pay') => (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <p className="text-[12px] font-medium">{title}</p>
        <span className="text-[12.5px] tabular-nums font-semibold">{lakh(total)}</span>
      </div>
      <div className="flex h-3 w-full overflow-hidden bg-ink/[0.07]">
        {data.map((d, i) => d.value > 0 && (
          <button
            key={d.label}
            type="button"
            aria-label={`Filter vouchers: ${title} ${d.label}, ${lakh(d.value)}`}
            aria-pressed={scopeOn(c, 'bucket', `${prefix}:${d.label}`)}
            onClick={() => c.toggleScope({ key: 'bucket', value: `${prefix}:${d.label}`, label: `${prefix === 'recv' ? 'Receivable' : 'Payable'} · ${d.label}` })}
            className={`h-3 transition-opacity ${c.scope?.key === 'bucket' && !scopeOn(c, 'bucket', `${prefix}:${d.label}`) ? 'opacity-35' : ''}`}
            style={{ width: `${(d.value / (total || 1)) * 100}%`, backgroundColor: RAMP[i] }}
          />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 @lg:grid-cols-4 gap-x-2 gap-y-0.5">
        {data.map((d, i) => (
          <Pick key={d.label} active={scopeOn(c, 'bucket', `${prefix}:${d.label}`)} onClick={() => c.toggleScope({ key: 'bucket', value: `${prefix}:${d.label}`, label: `${prefix === 'recv' ? 'Receivable' : 'Payable'} · ${d.label}` })} label={`Filter vouchers: ${d.label}`}>
            <div className="flex items-center gap-1 mb-0.5">
              <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: RAMP[i] }} />
              <span className="text-[11px] text-ash truncate">{d.label}</span>
            </div>
            <p className="text-[12.5px] tabular-nums font-semibold">{lakh(d.value)}</p>
          </Pick>
        ))}
      </div>
    </div>
  );

  return (
    <Widget title="Receivables & payables ageing" hint="click a band to filter" className="h-full">
      <div className="flex flex-col gap-5">
        {strip('Receivables', v.recTotal, v.rec, 'recv')}
        {strip('Payables', v.payTotal, v.pay, 'pay')}
        <div className="pt-3.5 border-t border-ink/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11.5px] text-ash">Cash position</p>
            <p className="text-[20px] font-semibold tabular-nums tracking-[-0.02em] leading-tight">{lakh(v.cash)}</p>
          </div>
          <Btn size="sm" disabled={v.toRemind === 0} onClick={() => c.dispatch({ type: 'remindAll' })}>
            {v.toRemind ? `Remind ${plural(v.toRemind, 'overdue customer')}` : 'All overdue customers reminded'}
          </Btn>
        </div>
      </div>
    </Widget>
  );
}

function Collections(c: VizCtx) {
  const list = collections(c.s, 5);
  return (
    <Widget title="Collections" hint="overdue invoices, oldest first" className="h-full">
      {list.length === 0 ? <Empty>Nothing overdue. Every customer is paid up.</Empty> : (
        <ul>
          {list.map((v) => (
            <QRow
              key={v.id}
              label={`Open ${v.id}`}
              onOpen={() => c.open({ module: 'finance', id: v.id })}
              title={<>{v.id} <span className="text-ash">· {v.party}</span></>}
              sub={`${-v.dueIn} days late · was due ${fmtDay(v.dueIn)}`}
              subTone="red"
              meta={rupees(v.amount)}
              actions={
                <>
                  <Btn size="xs" disabled={v.reminded} onClick={() => c.dispatch({ type: 'remind', id: v.id })}>{v.reminded ? 'Reminded' : 'Remind'}</Btn>
                  <Btn size="xs" variant="primary" onClick={() => c.dispatch({ type: 'recordPayment', id: v.id })}>Paid</Btn>
                </>
              }
            />
          ))}
        </ul>
      )}
    </Widget>
  );
}

function BillsDue(c: VizCtx) {
  const list = billsDue(c.s, 5);
  return (
    <Widget title="Bills to pay" hint="soonest first" className="h-full">
      {list.length === 0 ? <Empty>No bills waiting.</Empty> : (
        <ul>
          {list.map((v) => (
            <QRow
              key={v.id}
              label={`Open ${v.id}`}
              onOpen={() => c.open({ module: 'finance', id: v.id })}
              title={<>{v.id} <span className="text-ash">· {v.party}</span></>}
              sub={v.dueIn < 0 ? `${-v.dueIn} days late · was due ${fmtDay(v.dueIn)}` : `due ${fmtDay(v.dueIn)}`}
              subTone={v.dueIn < 0 ? 'red' : undefined}
              meta={rupees(v.amount)}
              actions={<Btn size="xs" onClick={() => c.dispatch({ type: 'recordPayment', id: v.id })}>Pay</Btn>}
            />
          ))}
        </ul>
      )}
    </Widget>
  );
}

/* ================================================================== */
/* Reports                                                              */
/* ================================================================== */

function ReportsHero(c: VizCtx) {
  const v = reportsViz(c.s);
  const max = Math.max(...v.top.map((r) => r.runs), 1);
  return (
    <Widget title="Most-used reports" hint="runs · run one live" className="h-full">
      <ul>
        {v.top.map((r, i) => (
          <li key={r.id} className="flex items-center gap-3 py-2.5 border-t border-ink/[0.07] first:border-t-0 first:pt-0 last:pb-0">
            <button type="button" onClick={() => c.open({ module: 'reports', id: r.id })} aria-label={`Open ${r.name}`} className="min-w-0 flex-1 text-left group">
              <span className="flex items-baseline justify-between gap-2 mb-1.5">
                <span className="text-[12.5px] truncate group-hover:text-signal transition-colors">{r.name}</span>
                <span className="text-[11.5px] tabular-nums text-ash shrink-0">{r.runs} runs · {plural(r.users, 'user')}</span>
              </span>
              <Bar pct={(r.runs / max) * 100} color={RAMP[Math.min(i, 4)]} height="h-2.5" />
            </button>
            <Btn size="xs" onClick={() => c.dispatch({ type: 'runReport', id: r.id })}>Run</Btn>
          </li>
        ))}
      </ul>
    </Widget>
  );
}

function ReportLibrary(c: VizCtx) {
  const v = reportsViz(c.s);
  return (
    <Widget title="Library" className="h-full">
      <div className="grid grid-cols-3 gap-2 text-center">
        {([['reports built', v.total], ['scheduled', v.scheduled], ['recipients', v.recipients]] as [string, number][]).map(([k, n]) => (
          <div key={k} className="border border-ink/10 py-3">
            <p className="text-[20px] font-semibold tabular-nums leading-none">{n}</p>
            <p className="text-[11px] text-ash mt-1.5 leading-tight">{k}</p>
          </div>
        ))}
      </div>
      <p className="text-[11.5px] text-ash mt-3 leading-relaxed">
        Every report runs against the live records on this screen, so a MIS view is never a stale export.
      </p>
    </Widget>
  );
}

function Schedules(c: VizCtx) {
  return (
    <Widget title="Schedules" hint="change when each report is sent" className="h-full">
      <ul>
        {c.s.reports.map((r) => (
          <QRow
            key={r.id}
            label={`Open ${r.name}`}
            onOpen={() => c.open({ module: 'reports', id: r.id })}
            title={r.name}
            sub={`Last run ${ago(r.lastRun, c.s.now)} · ${plural(r.recipients, 'recipient')}`}
            actions={
              <select
                aria-label={`Schedule for ${r.name}`}
                value={r.schedule}
                onChange={(e) => c.dispatch({ type: 'scheduleReport', id: r.id, schedule: e.target.value as Schedule })}
                className="text-[11.5px] border border-ink/20 bg-white min-h-[28px] px-1.5 hover:border-ink/50 focus:border-signal outline-none"
              >
                {(['Hourly', 'Every 2 hrs', 'Daily 8am', 'On demand'] as Schedule[]).map((x) => <option key={x}>{x}</option>)}
              </select>
            }
          />
        ))}
      </ul>
    </Widget>
  );
}

/* ================================================================== */
/* Integrations                                                         */
/* ================================================================== */

function ConnectionsHero(c: VizCtx) {
  const { s } = c;
  const tone = { Healthy: 'green', Limited: 'amber', Paused: 'grey' } as const;
  return (
    <Widget title="Connections" hint={`${s.integrations.filter((i) => i.status !== 'Paused').length} of ${s.integrations.length} live`} className="h-full">
      <div className="grid @lg:grid-cols-2 gap-2.5">
        {s.integrations.map((i) => (
          <div key={i.id} className="border border-ink/10 p-3 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <button type="button" onClick={() => c.open({ module: 'integrations', id: i.id })} className="text-[12.5px] font-medium leading-tight text-left hover:text-signal transition-colors">
                {i.name}
              </button>
              <Pill tone={tone[i.status]}>{i.status}</Pill>
            </div>
            <div className="flex items-baseline justify-between gap-2 text-[11.5px] text-ash">
              <span>{i.dir} · {i.every}</span>
              <span className="tabular-nums">{inr(i.records)} records</span>
            </div>
            <div className="flex items-baseline justify-between gap-2 text-[11.5px] text-ash">
              <span>synced {ago(i.lastSync, s.now)}</span>
              <span className="tabular-nums">{i.latencyMs !== null ? `${(i.latencyMs / 1000).toFixed(1)} s` : '—'}</span>
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <Btn size="xs" disabled={i.status === 'Paused'} onClick={() => c.dispatch({ type: 'syncIntegration', id: i.id })}>Sync now</Btn>
              <Btn size="xs" variant="ghost" onClick={() => c.dispatch({ type: 'toggleIntegration', id: i.id })}>
                {i.status === 'Paused' ? 'Resume' : 'Pause'}
              </Btn>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function SyncLog(c: VizCtx) {
  const log = integrationLog(c.s, 7);
  return (
    <Widget title="Sync log" hint="latest events across systems" className="h-full">
      <ul>
        {log.map((l, i) => (
          <QRow
            key={`${l.id}-${l.at}-${i}`}
            label={`Open ${l.name}`}
            onOpen={() => c.open({ module: 'integrations', id: l.id })}
            title={<>{l.name} <span className="text-ash">· {l.what}</span></>}
            sub={`${l.who} · ${fmtAt(l.at, c.s.now)}`}
          />
        ))}
      </ul>
    </Widget>
  );
}

function Health(c: VizCtx) {
  const { s } = c;
  const count = (st: string) => s.integrations.filter((i) => i.status === st).length;
  const live = s.integrations.filter((i) => i.status !== 'Paused').length;
  return (
    <Widget title="Health" className="h-full">
      <Donut
        center={`${live}/${s.integrations.length}`}
        sub="live"
        segments={[
          { key: 'h', label: 'Healthy', value: count('Healthy'), color: RAMP[3], onPick: () => c.setChip('Healthy') },
          { key: 'l', label: 'Limited', value: count('Limited'), color: '#D97706', onPick: () => c.setChip('Limited') },
          { key: 'p', label: 'Paused', value: count('Paused'), color: RAMP[0], onPick: () => c.setChip('Paused') },
        ]}
      />
      <Btn size="sm" className="mt-3.5" onClick={() => c.dispatch({ type: 'syncAll' })}>Sync all live systems</Btn>
    </Widget>
  );
}

/* ================================================================== */
/* The board: hero + rail, then the secondary widgets                   */
/* ================================================================== */

export default function Board({ module, rail, ...c }: VizCtx & { module: ModuleId; rail: React.ReactNode }) {
  const ctx = c as VizCtx;
  let hero: React.ReactNode;
  let second: React.ReactNode = null;

  switch (module) {
    case 'sales':
      hero = <PipelineHero {...ctx} />;
      second = (<><div className="@3xl:col-span-7"><OrderQueue {...ctx} /></div><div className="@3xl:col-span-5"><TopCustomers {...ctx} /></div></>);
      break;
    case 'inventory':
      hero = <StockHero {...ctx} />;
      second = (<><div className="@3xl:col-span-7"><ReorderList {...ctx} /></div><div className="@3xl:col-span-5"><StockSplit {...ctx} /></div></>);
      break;
    case 'service':
      hero = <SlaQueue {...ctx} />;
      second = (<><div className="@3xl:col-span-5"><PriorityMix {...ctx} /></div><div className="@3xl:col-span-7"><EngineerLoad {...ctx} /></div></>);
      break;
    case 'people':
      hero = <RosterHero {...ctx} />;
      second = (<><div className="@3xl:col-span-6"><DeptAttendance {...ctx} /></div><div className="@3xl:col-span-6"><LeaveRequests {...ctx} /></div></>);
      break;
    case 'finance':
      hero = <AgeingHero {...ctx} />;
      second = (<><div className="@3xl:col-span-7"><Collections {...ctx} /></div><div className="@3xl:col-span-5"><BillsDue {...ctx} /></div></>);
      break;
    case 'reports':
      hero = <ReportsHero {...ctx} />;
      second = (<><div className="@3xl:col-span-5"><ReportLibrary {...ctx} /></div><div className="@3xl:col-span-7"><Schedules {...ctx} /></div></>);
      break;
    case 'integrations':
      hero = <ConnectionsHero {...ctx} />;
      second = (<><div className="@3xl:col-span-7"><SyncLog {...ctx} /></div><div className="@3xl:col-span-5"><Health {...ctx} /></div></>);
      break;
    default:
      hero = <TrendChart s={ctx.s} />;
      second = (
        <div className="@3xl:col-span-12 grid grid-cols-1 @lg:grid-cols-2 gap-3">
          <SalesGlance {...ctx} />
          <StockGlance {...ctx} />
          <SlaGlance {...ctx} />
          <CashGlance {...ctx} />
        </div>
      );
  }

  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-12 gap-3">
      <div className="@3xl:col-span-8 min-w-0">{hero}</div>
      <div className="@3xl:col-span-4 min-w-0 relative">{rail}</div>
      {second}
    </div>
  );
}
