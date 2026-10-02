import React, { useState } from 'react';
import { ArrowRight, Check, Info, TriangleAlert } from 'lucide-react';
import type { DemoState, Employee, Integration, LeaveType, Order, Ref, Report, Schedule, Sku, Ticket, Tone, Voucher } from './types';
import type { Action } from './store';
import {
  ENGINEERS, STAGES, VISIT_SLOTS, approvalReason, canCancel, customerOf, customerName, demand, nextLabel, nextStage,
  orderTotal, outstanding, shortages, skuStatus, slaInfo, suggestedPo, voucherState, SLA_HOURS, isSalesInvoice,
} from './rules';
import { ago, clock, downloadCsv, duration, fmtAt, fmtDay, inr, lakh, rupees, toCsv } from './format';
import { runReportData } from './selectors';
import { Bar, Btn, Overlay, Pill, RAMP, inputCls, TONE } from './ui';

export interface DrawerCtx {
  s: DemoState;
  dispatch: (a: Action) => void;
  open: (r: Ref) => void;
  close: () => void;
}

interface Parts {
  title: string;
  subtitle: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
}

const LEAVE_TOTAL: Record<LeaveType, number> = { Casual: 8, Earned: 12, Medical: 6 };
const toInt = (v: string) => (/^\d+$/.test(v.trim()) ? parseInt(v.trim(), 10) : NaN);

/* ------------------------------ building blocks ------------------------------ */

function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section className={`px-5 py-4 ${last ? '' : 'border-b border-ink/[0.08]'}`}>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ash mb-2.5">{title}</h4>
      {children}
    </section>
  );
}

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: Tone }) {
  return (
    <div className="border border-ink/12 p-3 min-w-0">
      <p className="text-[11px] text-ash">{label}</p>
      <div className="text-[14.5px] font-semibold mt-1 tabular-nums truncate">
        {tone ? <Pill tone={tone}>{value}</Pill> : value}
      </div>
    </div>
  );
}

function Trail({ entries, now }: { entries: { at: number; who: string; what: string }[]; now: number }) {
  return (
    <ol className="border-l border-ink/15 pl-4 flex flex-col gap-3">
      {entries.slice(0, 8).map((t, i) => (
        <li key={i} className="relative">
          <span className={`absolute -left-[21px] top-1.5 w-2 h-2 rounded-full ${i === 0 ? 'bg-signal' : 'bg-ink/25'}`} />
          <p className="text-[13px] text-ink leading-snug">{t.what}</p>
          <p className="text-[11px] text-ash mt-0.5">{t.who} · {fmtAt(t.at, now)}</p>
        </li>
      ))}
    </ol>
  );
}

function Notice({ tone = 'amber', children }: { tone?: 'amber' | 'red' | 'blue'; children: React.ReactNode }) {
  const Icon = tone === 'blue' ? Info : TriangleAlert;
  return (
    <div className={`flex gap-2.5 border p-3 text-[12.5px] leading-snug ${TONE[tone]}`}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

const newestFirst = <T,>(a: T[]) => [...a].reverse();

/* ------------------------------ Order ------------------------------ */

function orderParts(c: DrawerCtx, o: Order): Parts {
  const { s, dispatch, open } = c;
  const cust = customerOf(s, o.customerId);
  const total = orderTotal(o);
  const next = nextStage(s, o);
  const short = shortages(s, o);
  const blocked = next === 'Dispatched' && short.length > 0;
  const owed = cust ? outstanding(s, cust.name) : 0;
  // Once invoiced the order is already inside "outstanding"; cancelled orders count for nothing.
  const stillOpen = o.stage !== 'Invoiced' && o.stage !== 'Cancelled';
  const projected = owed + (stillOpen ? total : 0);
  const stageIdx = STAGES.indexOf(o.stage);
  const path = STAGES.filter((st) => st !== 'Approval' || o.stage === 'Approval' || o.trail.some((t) => /approval|Approved/i.test(t.what)));

  const body = (
    <>
      <Section title="Progress">
        {o.stage === 'Cancelled' ? (
          <Pill tone="grey">Cancelled</Pill>
        ) : (
          <ol className="flex items-center gap-1" aria-label="Order progress">
            {path.map((st) => {
              const idx = STAGES.indexOf(st);
              const done = idx < stageIdx;
              const cur = st === o.stage;
              return (
                <li key={st} className="flex-1 min-w-0" aria-current={cur ? 'step' : undefined}>
                  <div className={`h-1.5 ${done || cur ? 'bg-signal' : 'bg-ink/12'} ${cur ? 'ring-2 ring-signal/25' : ''}`} />
                  <p className={`mt-1.5 text-[10.5px] truncate ${cur ? 'text-ink font-semibold' : 'text-ash'}`}>{st}</p>
                </li>
              );
            })}
          </ol>
        )}
        {blocked && (
          <div className="mt-3.5">
            <Notice tone="red">
              <p className="font-medium">Cannot dispatch yet — not enough stock.</p>
              <ul className="mt-1.5 flex flex-col gap-1">
                {short.map((x) => {
                  const k = s.skus.find((z) => z.sku === x.sku)!;
                  return (
                    <li key={x.sku} className="flex flex-wrap items-center justify-between gap-2">
                      <span>{x.sku}: {inr(x.have)} on hand, need {inr(x.need)}{k.onOrder ? ` · PO of ${inr(k.poQty)} raised` : ''}</span>
                      <button type="button" onClick={() => open({ module: 'inventory', id: x.sku })} className="underline underline-offset-2 hover:text-ink">
                        {k.onOrder ? 'Receive stock' : 'Raise PO'}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Notice>
          </div>
        )}
        {o.stage === 'Approval' && (
          <p className="mt-3 text-[12.5px] text-ash">Needs approval: {approvalReason(s, o) || 'manager sign-off'}.</p>
        )}
      </Section>

      <Section title="Line items">
        <div className="border border-ink/12">
          {o.lines.map((l) => {
            const k = s.skus.find((x) => x.sku === l.sku);
            const have = k?.onHand ?? 0;
            const pending = ['Quoted', 'Approval', 'Confirmed', 'Packing'].includes(o.stage);
            return (
              <div key={l.sku} className="flex items-start justify-between gap-3 p-3 border-b border-ink/[0.08] last:border-0">
                <div className="min-w-0">
                  <button type="button" onClick={() => open({ module: 'inventory', id: l.sku })} className="text-[13px] text-left leading-snug hover:text-signal transition-colors">{l.name}</button>
                  <p className="text-[11px] text-ash mt-0.5">
                    {l.sku} · {inr(l.qty)} × {rupees(l.rate)}
                    {pending && (have >= l.qty ? <span className="text-emerald-700"> · {inr(have)} in stock</span> : <span className="text-red-600"> · short by {inr(l.qty - have)}</span>)}
                  </p>
                </div>
                <span className="text-[13px] tabular-nums shrink-0">{rupees(l.qty * l.rate)}</span>
              </div>
            );
          })}
          <div className="flex items-center justify-between p-3 bg-bone/50">
            <span className="text-[11.5px] font-medium">Total</span>
            <span className="text-[14px] font-semibold tabular-nums">{rupees(total)}</span>
          </div>
        </div>
      </Section>

      {cust && (
        <Section title="Customer credit">
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <span className="text-[13px]">{cust.name} <span className="text-ash">· {cust.city}</span></span>
            <span className="text-[11.5px] text-ash tabular-nums">limit {lakh(cust.creditLimit)}</span>
          </div>
          <Bar pct={(projected / cust.creditLimit) * 100} color={projected > cust.creditLimit ? '#B91C1C' : RAMP[3]} height="h-2" />
          <p className="text-[11.5px] text-ash mt-1.5">
            {rupees(owed)} already outstanding{stillOpen ? ` · ${rupees(projected)} with this order` : ''}
            {projected > cust.creditLimit ? ' — over the limit' : ''}
          </p>
        </Section>
      )}

      {o.invoiceId && (
        <Section title="Linked records">
          <button type="button" onClick={() => open({ module: 'finance', id: o.invoiceId! })} className="inline-flex items-center gap-2 text-[13px] hover:text-signal transition-colors">
            Invoice {o.invoiceId} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Section>
      )}

      <Section title="Audit trail" last>
        <Trail entries={newestFirst(o.trail)} now={s.now} />
      </Section>
    </>
  );

  const footer = (
    <>
      {canCancel(o) && (
        <Btn variant="danger" onClick={() => dispatch({ type: 'cancelOrder', id: o.id, reject: o.stage === 'Approval' })}>
          {o.stage === 'Approval' ? 'Reject' : 'Cancel order'}
        </Btn>
      )}
      {next && (
        <Btn variant="primary" disabled={blocked} onClick={() => dispatch({ type: 'advanceOrder', id: o.id })}>
          {nextLabel(s, o)} <ArrowRight className="w-3.5 h-3.5" />
        </Btn>
      )}
    </>
  );

  return {
    title: o.id,
    subtitle: <span className="flex items-center gap-2">{customerName(s, o.customerId)} · {rupees(total)}</span>,
    body, footer,
  };
}

/* ------------------------------ Stock item ------------------------------ */

function StockActions({ k, c }: { k: Sku; c: DrawerCtx }) {
  const [recv, setRecv] = useState(String(k.onOrder ? k.poQty : suggestedPo(k)));
  const [po, setPo] = useState(String(suggestedPo(k)));
  const [count, setCount] = useState(String(k.onHand));
  const r = toInt(recv), p = toInt(po), n = toInt(count);
  const status = skuStatus(k);

  return (
    <div className="flex flex-col gap-4">
      {status !== 'In stock' && !k.onOrder && (
        <div>
          <label className="text-[11.5px] font-medium block mb-1.5" htmlFor="po-qty">Raise purchase order</label>
          <div className="flex gap-2">
            <input id="po-qty" inputMode="numeric" className={inputCls} value={po} onChange={(e) => setPo(e.target.value)} />
            <Btn variant="primary" disabled={!(p >= 1)} onClick={() => c.dispatch({ type: 'raisePO', sku: k.sku, qty: p })}>Raise PO</Btn>
          </div>
          <p className="text-[11.5px] text-ash mt-1.5">Suggested {inr(suggestedPo(k))} units — covers three reorder cycles. Supplier lead time is {k.leadDays} days.</p>
        </div>
      )}
      {k.onOrder && (
        <Notice tone="blue">
          <p>Purchase order raised for <strong>{inr(k.poQty)}</strong> units. Expected in about {k.leadDays} days — receive it below when it arrives.</p>
        </Notice>
      )}
      <div>
        <label className="text-[11.5px] font-medium block mb-1.5" htmlFor="recv-qty">Receive stock</label>
        <div className="flex gap-2">
          <input id="recv-qty" inputMode="numeric" className={inputCls} value={recv} onChange={(e) => setRecv(e.target.value)} />
          <Btn variant={k.onOrder ? 'primary' : 'line'} disabled={!(r >= 1)} onClick={() => c.dispatch({ type: 'receiveStock', sku: k.sku, qty: r })}>Receive</Btn>
        </div>
        {r >= 1 && <p className="text-[11.5px] text-ash mt-1.5">On hand becomes {inr(k.onHand + r)}.</p>}
      </div>
      <div>
        <label className="text-[11.5px] font-medium block mb-1.5" htmlFor="count-qty">Adjust after stock count</label>
        <div className="flex gap-2">
          <input id="count-qty" inputMode="numeric" className={inputCls} value={count} onChange={(e) => setCount(e.target.value)} />
          <Btn disabled={!(n >= 0) || n === k.onHand} onClick={() => c.dispatch({ type: 'adjustStock', sku: k.sku, qty: n })}>Update</Btn>
        </div>
      </div>
    </div>
  );
}

function skuParts(c: DrawerCtx, k: Sku): Parts {
  const { s, open } = c;
  const st = skuStatus(k);
  const need = demand(s, k.sku);
  const tone: Tone = st === 'In stock' ? 'green' : st === 'Low stock' ? 'amber' : 'red';
  const waiting = s.orders.filter((o) => ['Quoted', 'Approval', 'Confirmed', 'Packing'].includes(o.stage) && o.lines.some((l) => l.sku === k.sku));

  const body = (
    <>
      <Section title="Stock level">
        <div className="flex items-end justify-between gap-3 mb-2">
          <p className="text-[28px] font-semibold tracking-[-0.02em] leading-none tabular-nums">{inr(k.onHand)}</p>
          <Pill tone={tone}>{st}</Pill>
        </div>
        <div className="relative">
          <Bar pct={(k.onHand / Math.max(k.reorderAt * 3, k.onHand, 1)) * 100} color={st === 'In stock' ? RAMP[3] : st === 'Low stock' ? '#B45309' : '#B91C1C'} height="h-2.5" />
          <span className="absolute top-[-3px] bottom-[-3px] w-0.5 bg-ink" style={{ left: `${(k.reorderAt / Math.max(k.reorderAt * 3, k.onHand, 1)) * 100}%` }} title={`Reorder at ${k.reorderAt}`} />
        </div>
        <p className="text-[11.5px] text-ash mt-1.5">Reorder point {inr(k.reorderAt)} · {inr(need)} promised to open orders · {inr(Math.max(k.onHand - need, 0))} free</p>
      </Section>

      <Section title="Details">
        <div className="grid grid-cols-2 gap-2.5">
          <Stat label="Stock value" value={rupees(k.onHand * k.rate)} />
          <Stat label="Rate" value={rupees(k.rate)} />
          <Stat label="Location" value={k.store} />
          <Stat label="Last moved" value={`${k.ageDays} days ago`} />
        </div>
      </Section>

      <Section title="Actions">
        <StockActions key={`${k.sku}-${k.onHand}-${k.onOrder}`} k={k} c={c} />
      </Section>

      {waiting.length > 0 && (
        <Section title="Open orders using this item">
          <ul className="border border-ink/12">
            {waiting.map((o) => (
              <li key={o.id} className="border-b border-ink/[0.08] last:border-0">
                <button type="button" onClick={() => open({ module: 'sales', id: o.id })} className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-bone/40 transition-colors">
                  <span className="text-[13px]">{o.id} <span className="text-ash">· {customerName(s, o.customerId)}</span></span>
                  <span className="text-[12px] text-ash tabular-nums">{inr(o.lines.find((l) => l.sku === k.sku)!.qty)} units · {o.stage}</span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Movement history" last>
        <Trail entries={k.trail} now={s.now} />
      </Section>
    </>
  );

  return { title: k.sku, subtitle: `${k.name} · ${k.category}`, body };
}

/* ------------------------------ Ticket ------------------------------ */

function TicketBody({ t, c }: { t: Ticket; c: DrawerCtx }) {
  const { s, dispatch } = c;
  const [slot, setSlot] = useState(t.visit ?? VISIT_SLOTS[0]);
  const sla = slaInfo(t, s.now);
  const total = SLA_HOURS[t.priority] * 60;
  const elapsed = (t.status === 'Resolved' ? (t.resolvedAt ?? s.now) : s.now) - t.openedAt;
  const toneOf: Record<string, Tone> = { ok: 'green', risk: 'amber', breached: 'red', met: 'green', missed: 'red' };
  const text =
    sla.state === 'met' ? `Resolved in ${duration(elapsed)} — SLA met`
    : sla.state === 'missed' ? `Resolved in ${duration(elapsed)} — SLA missed`
    : sla.state === 'breached' ? `Breached ${duration(sla.left)} ago`
    : `${duration(sla.left)} left`;

  return (
    <>
      <Section title={`SLA · ${t.priority} · ${SLA_HOURS[t.priority]}h`}>
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-[18px] font-semibold tracking-[-0.015em] tabular-nums">{text}</p>
          <Pill tone={toneOf[sla.state]}>{sla.state === 'ok' ? 'On track' : sla.state === 'risk' ? 'At risk' : sla.state === 'breached' ? 'Breached' : sla.state === 'met' ? 'Met' : 'Missed'}</Pill>
        </div>
        <Bar pct={(elapsed / total) * 100} color={sla.state === 'breached' || sla.state === 'missed' ? '#B91C1C' : sla.state === 'risk' ? '#B45309' : RAMP[3]} height="h-2" />
        <p className="text-[11.5px] text-ash mt-1.5">Logged {fmtAt(t.openedAt, s.now)} · {duration(elapsed)} elapsed of {SLA_HOURS[t.priority]}h</p>
      </Section>

      <Section title="Ticket">
        <p className="text-[13.5px] leading-snug mb-3">{t.subject}</p>
        <div className="grid grid-cols-2 gap-2.5">
          <Stat label="Customer" value={customerName(s, t.customerId)} />
          <Stat label="Status" value={t.status} tone={t.status === 'Resolved' ? 'green' : t.status === 'Escalated' ? 'amber' : t.status === 'Scheduled' ? 'blue' : 'grey'} />
        </div>
      </Section>

      {t.status !== 'Resolved' && (
        <Section title="Assignment & visit">
          <div className="flex flex-col gap-3.5">
            <div>
              <label htmlFor="eng" className="text-[11.5px] font-medium block mb-1.5">Engineer</label>
              <select id="eng" className={inputCls} value={t.engineer ?? ''} onChange={(e) => e.target.value && dispatch({ type: 'assignTicket', id: t.id, engineer: e.target.value })}>
                <option value="" disabled>Choose an engineer…</option>
                {ENGINEERS.map((e) => {
                  const load = s.tickets.filter((x) => x.engineer === e && x.status !== 'Resolved').length;
                  return <option key={e} value={e}>{e} — {load} open</option>;
                })}
              </select>
            </div>
            <div>
              <label htmlFor="slot" className="text-[11.5px] font-medium block mb-1.5">Site visit</label>
              <div className="flex gap-2">
                <select id="slot" className={inputCls} value={slot} onChange={(e) => setSlot(e.target.value)}>
                  {VISIT_SLOTS.map((v) => <option key={v}>{v}</option>)}
                </select>
                <Btn disabled={!t.engineer} onClick={() => dispatch({ type: 'scheduleTicket', id: t.id, slot })}>{t.status === 'Scheduled' ? 'Reschedule' : 'Schedule'}</Btn>
              </div>
              {!t.engineer && <p className="text-[11.5px] text-ash mt-1.5">Assign an engineer first.</p>}
              {t.visit && <p className="text-[11.5px] text-ash mt-1.5">Booked for {t.visit}.</p>}
            </div>
          </div>
        </Section>
      )}

      <Section title="Audit trail" last>
        <Trail entries={newestFirst(t.trail)} now={s.now} />
      </Section>
    </>
  );
}

function ticketParts(c: DrawerCtx, t: Ticket): Parts {
  const { dispatch, s } = c;
  return {
    title: t.id,
    subtitle: `${customerName(s, t.customerId)} · ${t.engineer ?? 'Unassigned'}`,
    body: <TicketBody t={t} c={c} />,
    footer: t.status === 'Resolved' ? undefined : (
      <>
        {t.status !== 'Escalated' && <Btn onClick={() => dispatch({ type: 'escalateTicket', id: t.id })}>Escalate</Btn>}
        <Btn variant="primary" onClick={() => dispatch({ type: 'resolveTicket', id: t.id })}><Check className="w-3.5 h-3.5" /> Mark resolved</Btn>
      </>
    ),
  };
}

/* ------------------------------ Employee ------------------------------ */

function EmployeeBody({ e, c }: { e: Employee; c: DrawerCtx }) {
  const { s, dispatch } = c;
  const [type, setType] = useState<LeaveType>('Casual');
  const [days, setDays] = useState('1');
  const d = toInt(days);
  const bal = e.balance[type];

  return (
    <>
      <Section title="Today">
        <div className="grid grid-cols-2 gap-2.5">
          <Stat label="Department" value={e.dept} />
          <Stat label="Attendance" value={e.status} tone={e.status === 'Present' ? 'green' : e.status === 'On leave' ? 'amber' : 'red'} />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {e.status === 'On leave' ? (
            <Btn onClick={() => dispatch({ type: 'returnFromLeave', id: e.id })}>Mark as returned</Btn>
          ) : (
            <>
              <Btn variant={e.status === 'Present' ? 'ink' : 'line'} disabled={e.status === 'Present'} onClick={() => dispatch({ type: 'setAttendance', id: e.id, status: 'Present' })}>Present</Btn>
              <Btn variant={e.status === 'Absent' ? 'ink' : 'line'} disabled={e.status === 'Absent'} onClick={() => dispatch({ type: 'setAttendance', id: e.id, status: 'Absent' })}>Absent</Btn>
            </>
          )}
        </div>
        {e.onLeave && <p className="text-[12px] text-ash mt-2.5">{e.onLeave.days} day{e.onLeave.days > 1 ? 's' : ''} of {e.onLeave.type.toLowerCase()} leave, approved.</p>}
      </Section>

      {e.pending && (
        <Section title="Leave request">
          <Notice tone="amber">
            <p className="font-medium">{e.name.split(' ')[0]} asks for {e.pending.days} day{e.pending.days > 1 ? 's' : ''} of {e.pending.type.toLowerCase()} leave.</p>
            <p className="mt-0.5 text-[12px]">{e.balance[e.pending.type]} days available in that balance.</p>
          </Notice>
          <div className="flex gap-2 mt-3">
            <Btn variant="primary" onClick={() => dispatch({ type: 'decideLeave', id: e.id, approve: true })}><Check className="w-3.5 h-3.5" /> Approve</Btn>
            <Btn variant="danger" onClick={() => dispatch({ type: 'decideLeave', id: e.id, approve: false })}>Decline</Btn>
          </div>
        </Section>
      )}

      <Section title="Leave balance">
        <div className="flex flex-col gap-2.5">
          {(Object.keys(LEAVE_TOTAL) as LeaveType[]).map((k, i) => (
            <div key={k} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-2.5">
              <span className="text-[12px] text-ash">{k}</span>
              <Bar pct={(e.balance[k] / LEAVE_TOTAL[k]) * 100} color={RAMP[i + 2]} height="h-2.5" />
              <span className="text-[12px] tabular-nums">{e.balance[k]} / {LEAVE_TOTAL[k]}</span>
            </div>
          ))}
        </div>
      </Section>

      {!e.pending && !e.onLeave && (
        <Section title="Apply for leave">
          <div className="grid grid-cols-[1fr_6rem_auto] gap-2 items-end">
            <div>
              <label htmlFor="lt" className="text-[11.5px] font-medium block mb-1.5">Type</label>
              <select id="lt" className={inputCls} value={type} onChange={(ev) => setType(ev.target.value as LeaveType)}>
                {(Object.keys(LEAVE_TOTAL) as LeaveType[]).map((k) => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ld" className="text-[11.5px] font-medium block mb-1.5">Days</label>
              <input id="ld" inputMode="numeric" className={inputCls} value={days} onChange={(ev) => setDays(ev.target.value)} />
            </div>
            <Btn disabled={!(d >= 1 && d <= bal)} onClick={() => dispatch({ type: 'applyLeave', id: e.id, leave: { type, days: d } })}>Request</Btn>
          </div>
          {d > bal && <p className="text-[11.5px] text-red-600 mt-1.5">Only {bal} {type.toLowerCase()} days left.</p>}
        </Section>
      )}

      <Section title="History" last>
        <Trail entries={newestFirst(e.trail)} now={s.now} />
      </Section>
    </>
  );
}

function employeeParts(c: DrawerCtx, e: Employee): Parts {
  return { title: e.name, subtitle: `${e.id} · ${e.role}`, body: <EmployeeBody e={e} c={c} /> };
}

/* ------------------------------ Voucher ------------------------------ */

function voucherParts(c: DrawerCtx, v: Voucher): Parts {
  const { s, dispatch, open } = c;
  const st = voucherState(v);
  const sales = isSalesInvoice(v);
  const tone: Tone = st === 'Paid' ? 'green' : st === 'Overdue' ? 'red' : st === 'Due' ? 'amber' : 'grey';
  const owed = sales ? outstanding(s, v.party) : 0;

  const body = (
    <>
      <Section title="Amount">
        <div className="flex items-end justify-between gap-3">
          <p className="text-[28px] font-semibold tracking-[-0.02em] leading-none tabular-nums">{rupees(v.amount)}</p>
          <Pill tone={tone}>{st}</Pill>
        </div>
        <p className="text-[12.5px] text-ash mt-2">
          {st === 'Paid' ? `Settled ${ago(v.paidAt ?? s.now, s.now)}` : st === 'Overdue' ? `${-v.dueIn} days late · was due ${fmtDay(v.dueIn)}` : st === 'Due' ? `Due ${fmtDay(v.dueIn)} · in ${v.dueIn} days` : 'Internal journal entry'}
        </p>
      </Section>
      <Section title="Details">
        <div className="grid grid-cols-2 gap-2.5">
          <Stat label="Type" value={v.kind} />
          <Stat label={sales ? 'Customer' : 'Party'} value={v.party} />
          {sales && <Stat label="Customer outstanding" value={rupees(owed)} />}
          {v.reminded && !v.paid && <Stat label="Reminder" value="Sent" />}
        </div>
        {v.orderId && (
          <button type="button" onClick={() => open({ module: 'sales', id: v.orderId! })} className="mt-3 inline-flex items-center gap-2 text-[13px] hover:text-signal transition-colors">
            From order {v.orderId} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </Section>
      <Section title="Audit trail" last>
        <Trail entries={newestFirst(v.trail)} now={s.now} />
      </Section>
    </>
  );

  const open2 = !v.paid && v.kind !== 'Journal';
  const footer = open2 ? (
    <>
      {sales && <Btn onClick={() => dispatch({ type: 'remind', id: v.id })}>{v.reminded ? 'Remind again' : 'Send reminder'}</Btn>}
      <Btn variant="primary" onClick={() => dispatch({ type: 'recordPayment', id: v.id })}>{sales ? 'Record payment' : 'Pay bill'}</Btn>
    </>
  ) : undefined;

  return { title: v.id, subtitle: v.party, body, footer };
}

/* ------------------------------ Report ------------------------------ */

function ReportBody({ r, c }: { r: Report; c: DrawerCtx }) {
  const { s, dispatch } = c;
  const result = runReportData(s, r);

  const download = () => {
    downloadCsv(`beforth-${r.id.toLowerCase()}.csv`, toCsv(result.columns, result.rows));
    dispatch({ type: 'logExport', what: `exported ${r.name} · CSV`, module: 'reports' });
  };

  return (
    <>
      <Section title="Schedule">
        <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
          <div>
            <label htmlFor="sch" className="text-[11.5px] font-medium block mb-1.5">Runs</label>
            <select id="sch" className={inputCls} value={r.schedule} onChange={(e) => dispatch({ type: 'scheduleReport', id: r.id, schedule: e.target.value as Schedule })}>
              {(['Hourly', 'Every 2 hrs', 'Daily 8am', 'On demand'] as Schedule[]).map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <Btn onClick={() => dispatch({ type: 'runReport', id: r.id })}>Run now</Btn>
        </div>
        <p className="text-[11.5px] text-ash mt-2">Last run {ago(r.lastRun, s.now)} · {r.runs} runs · sent to {r.recipients} recipient{r.recipients === 1 ? '' : 's'}</p>
      </Section>
      <Section title="Live result" last>
        <div className="border border-ink/12 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-ash bg-bone/40">
                {result.columns.map((h, i) => <th key={h} className={`font-medium px-3 py-2 whitespace-nowrap ${i > 0 && i === result.columns.length - 1 ? 'text-right' : ''}`}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-ink/[0.07]">
                  {row.map((cell, ci) => <td key={ci} className={`px-3 py-2 tabular-nums ${ci === 0 ? 'text-ash' : ''} ${ci > 0 && ci === row.length - 1 ? 'text-right' : ''}`}>{cell}</td>)}
                </tr>
              ))}
              {result.rows.length === 0 && <tr><td className="px-3 py-4 text-center text-ash" colSpan={result.columns.length}>No data yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="text-[11.5px] text-ash mt-2">{result.note}. Built from the records on this screen, so it changes as you work.</p>
      </Section>
      <div className="px-5 pb-5">
        <Btn onClick={download}>Download CSV</Btn>
      </div>
    </>
  );
}

function reportParts(c: DrawerCtx, r: Report): Parts {
  return { title: r.name, subtitle: `${r.id} · ${r.schedule}`, body: <ReportBody r={r} c={c} /> };
}

/* ------------------------------ Integration ------------------------------ */

function integrationParts(c: DrawerCtx, i: Integration): Parts {
  const { s, dispatch } = c;
  const tone: Tone = i.status === 'Healthy' ? 'green' : i.status === 'Limited' ? 'amber' : 'grey';
  return {
    title: i.name,
    subtitle: `${i.dir} · ${i.every}`,
    body: (
      <>
        <Section title="Status">
          <div className="flex items-center justify-between gap-3">
            <Pill tone={tone}>{i.status}</Pill>
            <span className="text-[12px] text-ash">Last sync {ago(i.lastSync, s.now)} · {clock(i.lastSync)}</span>
          </div>
          <p className="text-[13px] leading-snug mt-3">{i.note}</p>
        </Section>
        <Section title="Throughput">
          <div className="grid grid-cols-2 gap-2.5">
            <Stat label="Records synced" value={inr(i.records)} />
            <Stat label="Latency" value={i.latencyMs !== null ? `${(i.latencyMs / 1000).toFixed(1)}s` : '—'} />
          </div>
        </Section>
        <Section title="Recent activity" last>
          <Trail entries={i.trail} now={s.now} />
        </Section>
      </>
    ),
    footer: (
      <>
        <Btn disabled={i.status === 'Paused'} onClick={() => dispatch({ type: 'syncIntegration', id: i.id })}>Sync now</Btn>
        <Btn variant={i.status === 'Paused' ? 'primary' : 'danger'} onClick={() => dispatch({ type: 'toggleIntegration', id: i.id })}>
          {i.status === 'Paused' ? 'Resume' : 'Pause'}
        </Btn>
      </>
    ),
  };
}

/* ------------------------------ Entry point ------------------------------ */

export default function RecordDrawer({ r, ...c }: DrawerCtx & { r: Ref }) {
  const { s } = c;
  let parts: Parts | null = null;

  switch (r.module) {
    case 'sales': { const o = s.orders.find((x) => x.id === r.id); if (o) parts = orderParts(c, o); break; }
    case 'inventory': { const k = s.skus.find((x) => x.sku === r.id); if (k) parts = skuParts(c, k); break; }
    case 'service': { const t = s.tickets.find((x) => x.id === r.id); if (t) parts = ticketParts(c, t); break; }
    case 'people': { const e = s.employees.find((x) => x.id === r.id); if (e) parts = employeeParts(c, e); break; }
    case 'finance': { const v = s.vouchers.find((x) => x.id === r.id); if (v) parts = voucherParts(c, v); break; }
    case 'reports': { const rp = s.reports.find((x) => x.id === r.id); if (rp) parts = reportParts(c, rp); break; }
    case 'integrations': { const i = s.integrations.find((x) => x.id === r.id); if (i) parts = integrationParts(c, i); break; }
    default: break;
  }

  if (!parts) return null;
  return (
    <Overlay kind="drawer" title={parts.title} subtitle={parts.subtitle} onClose={c.close} footer={parts.footer}>
      {parts.body}
    </Overlay>
  );
}
