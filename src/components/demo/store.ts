import type {
  DemoState, FeedEntry, Integration, LeaveRequest, ModuleId, Order, OrderStage, Priority, Ref,
  Report, ReportKind, Schedule, Sku, Ticket, TrailEntry, Voucher,
} from './types';
import { createSeed } from './seed';
import {
  customerName, isSalesInvoice, approvalReason, nextStage, orderTotal, canCancel, shortages,
} from './rules';
import { rupees, inr } from './format';

export type Action =
  | { type: 'tick'; mins: number }
  | { type: 'undo' }
  | { type: 'reset' }
  | { type: 'createOrder'; customerId: string; lines: { sku: string; qty: number }[] }
  | { type: 'advanceOrder'; id: string }
  | { type: 'cancelOrder'; id: string; reject?: boolean }
  | { type: 'receiveStock'; sku: string; qty: number }
  | { type: 'adjustStock'; sku: string; qty: number }
  | { type: 'raisePO'; sku: string; qty: number }
  | { type: 'createTicket'; customerId: string; subject: string; priority: Priority }
  | { type: 'assignTicket'; id: string; engineer: string }
  | { type: 'scheduleTicket'; id: string; slot: string }
  | { type: 'escalateTicket'; id: string }
  | { type: 'resolveTicket'; id: string }
  | { type: 'setAttendance'; id: string; status: 'Present' | 'Absent' }
  | { type: 'applyLeave'; id: string; leave: LeaveRequest }
  | { type: 'decideLeave'; id: string; approve: boolean }
  | { type: 'returnFromLeave'; id: string }
  | { type: 'createInvoice'; customerId: string; amount: number; dueIn: number }
  | { type: 'recordPayment'; id: string }
  | { type: 'remind'; id: string }
  | { type: 'remindAll' }
  | { type: 'runReport'; id: string }
  | { type: 'scheduleReport'; id: string; schedule: Schedule }
  | { type: 'createReport'; name: string; kind: ReportKind; schedule: Schedule }
  | { type: 'logExport'; what: string; module: ModuleId }
  | { type: 'toggleIntegration'; id: string }
  | { type: 'syncIntegration'; id: string }
  | { type: 'syncAll' };

interface Result {
  state: DemoState;
  /** Present when the action changed something; becomes the toast text. */
  label?: string;
  ref?: Ref;
}

export interface Store {
  present: DemoState;
  past: DemoState[];
  last: { n: number; label: string; ref?: Ref } | null;
}

const YOU = 'You';
const tr = (at: number, who: string, what: string): TrailEntry => ({ at, who, what });
const noop = (state: DemoState): Result => ({ state });

function withFeed(state: DemoState, who: string, what: string, module: ModuleId, ref?: Ref): DemoState {
  const entry: FeedEntry = { id: state.seq.feed + 1, at: state.now, who, what, module, ref };
  return { ...state, feed: [entry, ...state.feed].slice(0, 40), seq: { ...state.seq, feed: state.seq.feed + 1 } };
}

function done(state: DemoState, who: string, what: string, module: ModuleId, label: string, ref?: Ref): Result {
  return { state: withFeed(state, who, what, module, ref), label, ref };
}

function mapBy<T extends { id: string }>(arr: T[], id: string, fn: (x: T) => T): T[] {
  return arr.map((x) => (x.id === id ? fn(x) : x));
}

const orderRef = (id: string): Ref => ({ module: 'sales', id });
const voucherRef = (id: string): Ref => ({ module: 'finance', id });

function apply(state: DemoState, a: Action): Result {
  const now = state.now;

  switch (a.type) {
    /* ---------------------------- Sales ---------------------------- */
    case 'createOrder': {
      const cust = state.customers.find((c) => c.id === a.customerId);
      const lines = a.lines
        .filter((l) => l.qty > 0)
        .map((l) => {
          const k = state.skus.find((x) => x.sku === l.sku);
          return k ? { sku: k.sku, name: k.name, qty: Math.floor(l.qty), rate: k.rate } : null;
        })
        .filter((l): l is NonNullable<typeof l> => !!l);
      if (!cust || lines.length === 0) return noop(state);
      const n = state.seq.order + 1;
      const id = `SO-${n}`;
      const o: Order = {
        id, customerId: cust.id, lines, stage: 'Quoted', owner: YOU, createdAt: now,
        trail: [tr(now, YOU, 'Order created')],
      };
      const next = { ...state, orders: [o, ...state.orders], seq: { ...state.seq, order: n } };
      return done(next, YOU, `created ${id} · ${cust.name} · ${rupees(orderTotal(o))}`, 'sales', `Created ${id}`, orderRef(id));
    }

    case 'advanceOrder': {
      const o = state.orders.find((x) => x.id === a.id);
      if (!o) return noop(state);
      const to = nextStage(state, o);
      if (!to) return noop(state);
      if (to === 'Dispatched' && shortages(state, o).length) return noop(state);

      let s = state;
      let what = '';
      let feed = '';
      switch (to) {
        case 'Approval':
          what = `Sent for approval · ${approvalReason(state, o)}`;
          feed = `sent ${o.id} for approval · ${approvalReason(state, o)}`;
          break;
        case 'Confirmed':
          what = o.stage === 'Approval' ? 'Approved' : 'Confirmed';
          feed = o.stage === 'Approval' ? `approved ${o.id}` : `confirmed ${o.id}`;
          break;
        case 'Packing':
          what = 'Packing started';
          feed = `started packing ${o.id}`;
          break;
        case 'Dispatched': {
          what = 'Dispatched · stock issued';
          feed = `dispatched ${o.id} · stock issued`;
          s = {
            ...s,
            skus: s.skus.map((k) => {
              const line = o.lines.find((l) => l.sku === k.sku);
              return line ? { ...k, onHand: k.onHand - line.qty, trail: [tr(now, YOU, `Issued ${inr(line.qty)} to ${o.id}`), ...k.trail] } : k;
            }),
            movement: { ...s.movement, issued: s.movement.issued + 1 },
          };
          break;
        }
        case 'Invoiced': {
          const inv = s.seq.invoice + 1;
          const invId = `INV-${inv}`;
          const v: Voucher = {
            id: invId, kind: 'Sales invoice', party: customerName(s, o.customerId), amount: orderTotal(o),
            dueIn: 15, paid: false, createdAt: now, orderId: o.id, reminded: false,
            trail: [tr(now, 'System', `Invoice posted from ${o.id}`)],
          };
          s = { ...s, vouchers: [v, ...s.vouchers], seq: { ...s.seq, invoice: inv } };
          what = `Invoice ${invId} generated`;
          feed = `generated ${invId} for ${o.id} · ${rupees(v.amount)}`;
          s = { ...s, orders: mapBy(s.orders, o.id, (x) => ({ ...x, invoiceId: invId })) };
          break;
        }
        default:
          break;
      }
      s = {
        ...s,
        orders: mapBy(s.orders, o.id, (x) => ({ ...x, stage: to as OrderStage, trail: [...x.trail, tr(now, YOU, what)] })),
      };
      return done(s, YOU, feed, 'sales', `${o.id} → ${to}`, orderRef(o.id));
    }

    case 'cancelOrder': {
      const o = state.orders.find((x) => x.id === a.id);
      if (!o || !canCancel(o)) return noop(state);
      const verb = a.reject ? 'Rejected' : 'Cancelled';
      const s = { ...state, orders: mapBy(state.orders, o.id, (x) => ({ ...x, stage: 'Cancelled' as const, trail: [...x.trail, tr(now, YOU, verb)] })) };
      return done(s, YOU, `${verb.toLowerCase()} ${o.id}`, 'sales', `${verb} ${o.id}`, orderRef(o.id));
    }

    /* -------------------------- Inventory -------------------------- */
    case 'receiveStock': {
      const k = state.skus.find((x) => x.sku === a.sku);
      const qty = Math.floor(a.qty);
      if (!k || qty <= 0) return noop(state);
      const total = k.onHand + qty;
      const s: DemoState = {
        ...state,
        skus: state.skus.map((x): Sku =>
          x.sku === k.sku
            ? { ...x, onHand: total, onOrder: false, poQty: 0, ageDays: Math.round((x.ageDays * x.onHand) / total), trail: [tr(now, YOU, `Received ${inr(qty)} units`), ...x.trail] }
            : x),
        movement: { ...state.movement, received: state.movement.received + 1 },
      };
      return done(s, YOU, `received ${inr(qty)} × ${k.sku}`, 'inventory', `Received ${inr(qty)} × ${k.sku}`, { module: 'inventory', id: k.sku });
    }

    case 'adjustStock': {
      const k = state.skus.find((x) => x.sku === a.sku);
      const qty = Math.max(0, Math.floor(a.qty));
      if (!k || qty === k.onHand) return noop(state);
      const s: DemoState = {
        ...state,
        skus: state.skus.map((x): Sku => (x.sku === k.sku ? { ...x, onHand: qty, trail: [tr(now, YOU, `Count adjusted ${inr(k.onHand)} → ${inr(qty)}`), ...x.trail] } : x)),
        movement: { ...state.movement, adjusted: state.movement.adjusted + 1 },
      };
      return done(s, YOU, `adjusted ${k.sku} count ${inr(k.onHand)} → ${inr(qty)}`, 'inventory', `Adjusted ${k.sku}`, { module: 'inventory', id: k.sku });
    }

    case 'raisePO': {
      const k = state.skus.find((x) => x.sku === a.sku);
      const qty = Math.floor(a.qty);
      if (!k || qty <= 0 || k.onOrder) return noop(state);
      const s: DemoState = {
        ...state,
        skus: state.skus.map((x): Sku => (x.sku === k.sku ? { ...x, onOrder: true, poQty: qty, trail: [tr(now, YOU, `Purchase order raised · ${inr(qty)} units`), ...x.trail] } : x)),
      };
      return done(s, YOU, `raised purchase order · ${inr(qty)} × ${k.sku}`, 'inventory', `PO raised for ${k.sku}`, { module: 'inventory', id: k.sku });
    }

    /* ---------------------------- Service --------------------------- */
    case 'createTicket': {
      const subject = a.subject.trim();
      if (!subject || !state.customers.some((c) => c.id === a.customerId)) return noop(state);
      const n = state.seq.ticket + 1;
      const id = `TKT-${n}`;
      const t: Ticket = {
        id, customerId: a.customerId, subject, priority: a.priority, status: 'Open', engineer: null, openedAt: now,
        trail: [tr(now, YOU, 'Ticket logged')],
      };
      const s = { ...state, tickets: [t, ...state.tickets], seq: { ...state.seq, ticket: n } };
      return done(s, YOU, `logged ${id} · ${customerName(state, a.customerId)} · ${a.priority}`, 'service', `Logged ${id}`, { module: 'service', id });
    }

    case 'assignTicket': {
      const t = state.tickets.find((x) => x.id === a.id);
      if (!t || t.status === 'Resolved' || t.engineer === a.engineer) return noop(state);
      const s = { ...state, tickets: mapBy(state.tickets, t.id, (x) => ({ ...x, engineer: a.engineer, trail: [...x.trail, tr(now, YOU, `Assigned to ${a.engineer}`)] })) };
      return done(s, YOU, `assigned ${t.id} to ${a.engineer}`, 'service', `${t.id} → ${a.engineer}`, { module: 'service', id: t.id });
    }

    case 'scheduleTicket': {
      const t = state.tickets.find((x) => x.id === a.id);
      if (!t || t.status === 'Resolved' || !t.engineer) return noop(state);
      const s = { ...state, tickets: mapBy(state.tickets, t.id, (x) => ({ ...x, status: 'Scheduled' as const, visit: a.slot, trail: [...x.trail, tr(now, YOU, `Visit scheduled · ${a.slot}`)] })) };
      return done(s, YOU, `scheduled visit for ${t.id} · ${a.slot}`, 'service', `Visit booked for ${t.id}`, { module: 'service', id: t.id });
    }

    case 'escalateTicket': {
      const t = state.tickets.find((x) => x.id === a.id);
      if (!t || t.status === 'Resolved' || t.status === 'Escalated') return noop(state);
      const s = { ...state, tickets: mapBy(state.tickets, t.id, (x) => ({ ...x, status: 'Escalated' as const, trail: [...x.trail, tr(now, YOU, 'Escalated to service lead')] })) };
      return done(s, YOU, `escalated ${t.id}`, 'service', `Escalated ${t.id}`, { module: 'service', id: t.id });
    }

    case 'resolveTicket': {
      const t = state.tickets.find((x) => x.id === a.id);
      if (!t || t.status === 'Resolved') return noop(state);
      const s = { ...state, tickets: mapBy(state.tickets, t.id, (x) => ({ ...x, status: 'Resolved' as const, resolvedAt: now, trail: [...x.trail, tr(now, YOU, 'Resolved')] })) };
      return done(s, YOU, `closed ticket ${t.id}`, 'service', `Resolved ${t.id}`, { module: 'service', id: t.id });
    }

    /* ----------------------------- People ---------------------------- */
    case 'setAttendance': {
      const e = state.employees.find((x) => x.id === a.id);
      if (!e || e.status === 'On leave' || e.status === a.status) return noop(state);
      const s = { ...state, employees: mapBy(state.employees, e.id, (x) => ({ ...x, status: a.status, trail: [...x.trail, tr(now, YOU, `Marked ${a.status.toLowerCase()}`)] })) };
      return done(s, YOU, `marked ${e.name} ${a.status.toLowerCase()}`, 'people', `${e.name} · ${a.status}`, { module: 'people', id: e.id });
    }

    case 'applyLeave': {
      const e = state.employees.find((x) => x.id === a.id);
      const { type, days } = a.leave;
      if (!e || e.pending || e.onLeave || days < 1 || days > e.balance[type]) return noop(state);
      const s = { ...state, employees: mapBy(state.employees, e.id, (x) => ({ ...x, pending: a.leave, trail: [...x.trail, tr(now, YOU, `Requested ${type.toLowerCase()} leave · ${days}d`)] })) };
      return done(s, YOU, `leave requested · ${e.name} · ${days}d ${type.toLowerCase()}`, 'people', `Leave requested for ${e.name}`, { module: 'people', id: e.id });
    }

    case 'decideLeave': {
      const e = state.employees.find((x) => x.id === a.id);
      if (!e || !e.pending) return noop(state);
      const req = e.pending;
      const s = {
        ...state,
        employees: mapBy(state.employees, e.id, (x): typeof x =>
          a.approve
            ? { ...x, pending: null, onLeave: req, status: 'On leave', balance: { ...x.balance, [req.type]: x.balance[req.type] - req.days }, trail: [...x.trail, tr(now, YOU, `${req.type} leave approved · ${req.days}d`)] }
            : { ...x, pending: null, trail: [...x.trail, tr(now, YOU, `${req.type} leave declined`)] }),
      };
      const verb = a.approve ? 'approved' : 'declined';
      return done(s, YOU, `${verb} leave · ${e.name}`, 'people', `Leave ${verb} · ${e.name}`, { module: 'people', id: e.id });
    }

    case 'returnFromLeave': {
      const e = state.employees.find((x) => x.id === a.id);
      if (!e || e.status !== 'On leave') return noop(state);
      const s = { ...state, employees: mapBy(state.employees, e.id, (x) => ({ ...x, status: 'Present' as const, onLeave: null, trail: [...x.trail, tr(now, YOU, 'Back from leave')] })) };
      return done(s, YOU, `${e.name} back from leave`, 'people', `${e.name} is back`, { module: 'people', id: e.id });
    }

    /* ----------------------------- Finance --------------------------- */
    case 'createInvoice': {
      const cust = state.customers.find((c) => c.id === a.customerId);
      const amount = Math.round(a.amount);
      if (!cust || amount <= 0) return noop(state);
      const n = state.seq.invoice + 1;
      const id = `INV-${n}`;
      const v: Voucher = {
        id, kind: 'Sales invoice', party: cust.name, amount, dueIn: a.dueIn, paid: false, createdAt: now, reminded: false,
        trail: [tr(now, YOU, 'Invoice posted')],
      };
      const s = { ...state, vouchers: [v, ...state.vouchers], seq: { ...state.seq, invoice: n } };
      return done(s, YOU, `posted ${id} · ${cust.name} · ${rupees(amount)}`, 'finance', `Posted ${id}`, voucherRef(id));
    }

    case 'recordPayment': {
      const v = state.vouchers.find((x) => x.id === a.id);
      if (!v || v.paid || v.kind === 'Journal') return noop(state);
      const sales = isSalesInvoice(v);
      const s = {
        ...state,
        cash: state.cash + (sales ? v.amount : -v.amount),
        vouchers: mapBy(state.vouchers, v.id, (x) => ({ ...x, paid: true, paidAt: now, trail: [...x.trail, tr(now, YOU, sales ? 'Payment received' : 'Payment made')] })),
      };
      return done(s, YOU, `${sales ? 'payment received' : 'payment made'} · ${v.id} · ${rupees(v.amount)}`, 'finance', `${sales ? 'Received' : 'Paid'} ${rupees(v.amount)} · ${v.id}`, voucherRef(v.id));
    }

    case 'remind': {
      const v = state.vouchers.find((x) => x.id === a.id);
      if (!v || v.paid || !isSalesInvoice(v)) return noop(state);
      const wa = state.integrations.find((i) => i.id === 'whatsapp');
      const viaWa = !!wa && wa.status !== 'Paused';
      const s = {
        ...state,
        integrations: viaWa ? state.integrations.map((i) => (i.id === 'whatsapp' ? { ...i, records: i.records + 1, lastSync: now } : i)) : state.integrations,
        vouchers: mapBy(state.vouchers, v.id, (x) => ({ ...x, reminded: true, trail: [...x.trail, tr(now, YOU, `Reminder sent via ${viaWa ? 'WhatsApp' : 'email'}`)] })),
      };
      return done(s, YOU, `reminder sent to ${v.party} via ${viaWa ? 'WhatsApp' : 'email'}`, 'finance', `Reminder sent · ${v.party}`, voucherRef(v.id));
    }

    case 'remindAll': {
      const targets = state.vouchers.filter((v) => isSalesInvoice(v) && !v.paid && v.dueIn < 0 && !v.reminded);
      if (targets.length === 0) return noop(state);
      const ids = new Set(targets.map((v) => v.id));
      const wa = state.integrations.find((i) => i.id === 'whatsapp');
      const viaWa = !!wa && wa.status !== 'Paused';
      const s = {
        ...state,
        integrations: viaWa ? state.integrations.map((i) => (i.id === 'whatsapp' ? { ...i, records: i.records + targets.length, lastSync: now } : i)) : state.integrations,
        vouchers: state.vouchers.map((v) => (ids.has(v.id) ? { ...v, reminded: true, trail: [...v.trail, tr(now, YOU, `Reminder sent via ${viaWa ? 'WhatsApp' : 'email'}`)] } : v)),
      };
      return done(s, YOU, `sent ${targets.length} payment reminder${targets.length > 1 ? 's' : ''} via ${viaWa ? 'WhatsApp' : 'email'}`, 'finance', `${targets.length} reminders sent`);
    }

    /* ----------------------------- Reports --------------------------- */
    case 'runReport': {
      const r = state.reports.find((x) => x.id === a.id);
      if (!r) return noop(state);
      const s = { ...state, reports: mapBy(state.reports, r.id, (x) => ({ ...x, runs: x.runs + 1, lastRun: now, trail: [tr(now, YOU, 'Report run'), ...x.trail] })) };
      return done(s, YOU, `ran report ${r.id} · ${r.name}`, 'reports', `Ran ${r.name}`, { module: 'reports', id: r.id });
    }

    case 'scheduleReport': {
      const r = state.reports.find((x) => x.id === a.id);
      if (!r || r.schedule === a.schedule) return noop(state);
      const s = { ...state, reports: mapBy(state.reports, r.id, (x) => ({ ...x, schedule: a.schedule, trail: [tr(now, YOU, `Schedule set to ${a.schedule}`), ...x.trail] })) };
      return done(s, YOU, `scheduled ${r.id} · ${a.schedule}`, 'reports', `${r.name} → ${a.schedule}`, { module: 'reports', id: r.id });
    }

    case 'createReport': {
      const name = a.name.trim();
      if (!name) return noop(state);
      const n = state.seq.report + 1;
      const id = `CUS-${n}`;
      const r: Report = { id, name, kind: a.kind, schedule: a.schedule, lastRun: now, runs: 1, users: 1, recipients: 1, trail: [tr(now, YOU, 'Report built')] };
      const s = { ...state, reports: [r, ...state.reports], seq: { ...state.seq, report: n } };
      return done(s, YOU, `built report ${id} · ${name}`, 'reports', `Built ${name}`, { module: 'reports', id });
    }

    case 'logExport': {
      return done({ ...state, exports: state.exports + 1 }, YOU, a.what, a.module, 'Exported CSV');
    }

    /* --------------------------- Integrations ------------------------ */
    case 'toggleIntegration': {
      const i = state.integrations.find((x) => x.id === a.id);
      if (!i) return noop(state);
      const next: Integration['status'] = i.status === 'Paused' ? 'Healthy' : 'Paused';
      const s = {
        ...state,
        integrations: mapBy(state.integrations, i.id, (x) => ({
          ...x, status: next, latencyMs: next === 'Paused' ? null : 600,
          trail: [tr(now, YOU, next === 'Paused' ? 'Integration paused' : 'Integration resumed'), ...x.trail],
        })),
      };
      return done(s, YOU, `${next === 'Paused' ? 'paused' : 'resumed'} ${i.name}`, 'integrations', `${i.name} ${next === 'Paused' ? 'paused' : 'resumed'}`, { module: 'integrations', id: i.id });
    }

    case 'syncIntegration': {
      const i = state.integrations.find((x) => x.id === a.id);
      if (!i || i.status === 'Paused') return noop(state);
      const added = 8 + ((now + i.records) % 23);
      const s = {
        ...state,
        integrations: mapBy(state.integrations, i.id, (x) => ({
          ...x, records: x.records + added, lastSync: now, latencyMs: 300 + ((now * 37) % 640),
          trail: [tr(now, YOU, `Manual sync · ${added} records`), ...x.trail],
        })),
      };
      return done(s, YOU, `synced ${i.name} · ${added} records`, 'integrations', `Synced ${i.name}`, { module: 'integrations', id: i.id });
    }

    case 'syncAll': {
      const live = state.integrations.filter((i) => i.status !== 'Paused');
      if (live.length === 0) return noop(state);
      const s = {
        ...state,
        integrations: state.integrations.map((x) =>
          x.status === 'Paused' ? x : { ...x, records: x.records + 8 + ((now + x.records) % 23), lastSync: now, latencyMs: 300 + ((now * 37 + x.records) % 640), trail: [tr(now, YOU, 'Manual sync'), ...x.trail] }),
      };
      return done(s, YOU, `synced ${live.length} integrations`, 'integrations', `Synced ${live.length} integrations`);
    }

    default:
      return noop(state);
  }
}

export function init(): Store {
  return { present: createSeed(), past: [], last: null };
}

export function reducer(store: Store, a: Action): Store {
  switch (a.type) {
    case 'tick':
      return { ...store, present: { ...store.present, now: store.present.now + a.mins } };
    case 'reset':
      return init();
    case 'undo': {
      const prev = store.past[store.past.length - 1];
      if (!prev) return store;
      // Undo rewinds the data, never the clock.
      return { present: { ...prev, now: store.present.now }, past: store.past.slice(0, -1), last: null };
    }
    default: {
      const res = apply(store.present, a);
      if (!res.label) return store;
      return {
        present: res.state,
        past: [...store.past.slice(-29), store.present],
        last: { n: (store.last?.n ?? 0) + 1, label: res.label, ref: res.ref },
      };
    }
  }
}
