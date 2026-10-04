import type {
  DemoState, Employee, Integration, ModuleId, Order, OrderStage, Priority, Ref, Report, Sku, Ticket, Tone, Voucher,
} from './types';
import {
  AGE_BUCKETS, DUE_BUCKETS, ENGINEERS, PRIORITIES, STAGES, ageBucket, customerName, dueBucket,
  isBill, isOpenOrder, isSalesInvoice, orderTotal, shortages, skuStatus, slaInfo, voucherState,
  approvalReason, demand, nextLabel, nextStage, suggestedPo,
} from './rules';
import { ago, clock, duration, fmtDay, inr, lakh, rupees } from './format';
import { MONTH_START, WEEKLY_PAST, WEEKLY_TARGET, WEEK_START, createSeed } from './seed';

/* ------------------------------------------------------------------ */
/* Table rows                                                           */
/* ------------------------------------------------------------------ */

export interface Row {
  ref: Ref;
  cols: [string, string, string, string];
  sub?: string;
  subTone?: 'red' | 'amber';
  status: string;
  tone: Tone;
  sort: [string | number, string | number, string | number, string | number];
  flags: string[];
  tags: Record<string, string>;
  text: string;
}

export interface Chip {
  id: string;
  label: string;
  test: (r: Row) => boolean;
}

export interface Scope {
  key: string;
  value: string;
  label: string;
}

export const HEADERS: Record<ModuleId, [string, string, string, string]> = {
  overview: ['Order', 'Party', 'Value', 'Stage'],
  sales: ['Order', 'Party', 'Value', 'Stage'],
  inventory: ['SKU', 'Item', 'On hand', 'Status'],
  service: ['Ticket', 'Customer', 'Priority', 'Status'],
  people: ['Code', 'Name', 'Leave', 'Status'],
  finance: ['Voucher', 'Party', 'Amount', 'Status'],
  reports: ['Report', 'Name', 'Schedule', 'Last run'],
  integrations: ['System', 'Direction', 'Records', 'Status'],
};

export const TABLE_TITLE: Record<ModuleId, string> = {
  overview: 'Latest orders',
  sales: 'Orders',
  inventory: 'Stock',
  service: 'Tickets',
  people: 'Team',
  finance: 'Vouchers',
  reports: 'Reports',
  integrations: 'Integrations',
};

const seqOf = (id: string) => Number(id.replace(/\D/g, '')) || 0;
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

const ORDER_TONE: Record<OrderStage, Tone> = {
  Quoted: 'grey', Approval: 'amber', Confirmed: 'blue', Packing: 'blue', Dispatched: 'blue', Invoiced: 'green', Cancelled: 'grey',
};

function orderRow(s: DemoState, o: Order): Row {
  const total = orderTotal(o);
  const cust = customerName(s, o.customerId);
  const blocked = o.stage === 'Packing' && shortages(s, o).length > 0;
  return {
    ref: { module: 'sales', id: o.id },
    cols: [o.id, cust, rupees(total), o.stage],
    sub: `${plural(o.lines.length, 'item')} · ${o.owner}${blocked ? ' · short on stock' : ''}`,
    subTone: blocked ? 'red' : undefined,
    status: o.stage,
    tone: ORDER_TONE[o.stage],
    sort: [seqOf(o.id), cust, total, STAGES.indexOf(o.stage)],
    flags: [...(isOpenOrder(o) ? ['open'] : []), ...(blocked ? ['blocked'] : [])],
    tags: { stage: o.stage, customer: cust },
    text: `${o.id} ${cust} ${o.stage} ${o.owner} ${o.lines.map((l) => `${l.sku} ${l.name}`).join(' ')}`,
  };
}

const SKU_TONE: Record<string, Tone> = { 'In stock': 'green', 'Low stock': 'amber', 'Out of stock': 'red' };
const SKU_RANK: Record<string, number> = { 'Out of stock': 0, 'Low stock': 1, 'In stock': 2 };

function skuRow(k: Sku): Row {
  const st = skuStatus(k);
  return {
    ref: { module: 'inventory', id: k.sku },
    cols: [k.sku, k.name, inr(k.onHand), st],
    sub: `${k.category} · ${k.store}${k.onOrder ? ' · PO raised' : ''}`,
    status: st,
    tone: SKU_TONE[st],
    sort: [k.sku, k.name, k.onHand, SKU_RANK[st]],
    flags: [...(st !== 'In stock' ? ['attention'] : []), ...(k.onOrder ? ['onorder'] : [])],
    tags: { category: k.category, store: k.store, age: ageBucket(k.ageDays) },
    text: `${k.sku} ${k.name} ${k.category} ${k.store} ${st}`,
  };
}

const TKT_TONE: Record<string, Tone> = { Open: 'grey', Scheduled: 'blue', Escalated: 'amber', Resolved: 'green' };
const PRIO_RANK: Record<Priority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

function ticketRow(s: DemoState, t: Ticket): Row {
  const sla = slaInfo(t, s.now);
  const cust = customerName(s, t.customerId);
  const hot = sla.state === 'risk' || sla.state === 'breached';
  const slaText = sla.state === 'breached' ? ` · SLA breached ${duration(sla.left)} ago` : sla.state === 'risk' ? ` · SLA ${duration(sla.left)} left` : '';
  return {
    ref: { module: 'service', id: t.id },
    cols: [t.id, cust, t.priority, t.status],
    sub: `${t.subject}${slaText}`,
    subTone: sla.state === 'breached' ? 'red' : sla.state === 'risk' ? 'amber' : undefined,
    status: t.status,
    tone: sla.state === 'breached' ? 'red' : TKT_TONE[t.status],
    sort: [seqOf(t.id), cust, PRIO_RANK[t.priority], t.status],
    flags: [...(t.status !== 'Resolved' ? ['open'] : []), ...(hot ? ['risk'] : []), ...(!t.engineer && t.status !== 'Resolved' ? ['unassigned'] : [])],
    tags: { priority: t.priority, engineer: t.engineer ?? 'Unassigned' },
    text: `${t.id} ${cust} ${t.subject} ${t.priority} ${t.status} ${t.engineer ?? ''}`,
  };
}

const EMP_TONE: Record<string, Tone> = { Present: 'green', 'On leave': 'amber', Absent: 'red' };

function employeeRow(e: Employee): Row {
  const leave = e.onLeave ? `${e.onLeave.days}d ${e.onLeave.type.toLowerCase()}` : e.pending ? `${e.pending.days}d pending` : '—';
  return {
    ref: { module: 'people', id: e.id },
    cols: [e.id, e.name, leave, e.status],
    sub: `${e.dept} · ${e.role}${e.pending ? ' · leave request pending' : ''}`,
    subTone: e.pending ? 'amber' : undefined,
    status: e.status,
    tone: EMP_TONE[e.status],
    sort: [e.id, e.name, e.onLeave?.days ?? e.pending?.days ?? 0, e.status],
    flags: e.pending ? ['pending'] : [],
    tags: { dept: e.dept, leave: e.onLeave?.type ?? '' },
    text: `${e.id} ${e.name} ${e.dept} ${e.role} ${e.status}`,
  };
}

const VCH_TONE: Record<string, Tone> = { Paid: 'green', Due: 'amber', Overdue: 'red', Posted: 'grey' };
const VCH_RANK: Record<string, number> = { Overdue: 0, Due: 1, Paid: 2, Posted: 3 };

function voucherRow(s: DemoState, v: Voucher): Row {
  const st = voucherState(v);
  const when = st === 'Paid' ? `paid ${ago(v.paidAt ?? s.now, s.now)}` : st === 'Overdue' ? `${-v.dueIn} days late · was due ${fmtDay(v.dueIn)}` : st === 'Due' ? `due ${fmtDay(v.dueIn)}` : 'internal';
  const unpaid = !v.paid && v.kind !== 'Journal';
  return {
    ref: { module: 'finance', id: v.id },
    cols: [v.id, v.party, rupees(v.amount), st],
    sub: `${v.kind} · ${when}${v.reminded && unpaid ? ' · reminded' : ''}`,
    subTone: st === 'Overdue' ? 'red' : undefined,
    status: st,
    tone: VCH_TONE[st],
    sort: [v.id, v.party, v.amount, VCH_RANK[st]],
    flags: [...(unpaid ? ['unpaid'] : [])],
    tags: { kind: v.kind, bucket: unpaid ? `${isBill(v) ? 'pay' : 'recv'}:${dueBucket(v)}` : '' },
    text: `${v.id} ${v.party} ${v.kind} ${st}`,
  };
}

function reportRow(s: DemoState, r: Report): Row {
  return {
    ref: { module: 'reports', id: r.id },
    cols: [r.id, r.name, r.schedule, ago(r.lastRun, s.now)],
    sub: `${plural(r.recipients, 'recipient')} · ${plural(r.runs, 'run')}`,
    status: r.schedule,
    tone: r.schedule === 'On demand' ? 'grey' : 'green',
    sort: [r.id, r.name, r.schedule, -r.lastRun],
    flags: [],
    tags: { schedule: r.schedule },
    text: `${r.id} ${r.name} ${r.schedule}`,
  };
}

const INT_TONE: Record<string, Tone> = { Healthy: 'green', Limited: 'amber', Paused: 'grey' };

function integrationRow(s: DemoState, i: Integration): Row {
  return {
    ref: { module: 'integrations', id: i.id },
    cols: [i.name, i.dir, inr(i.records), i.status],
    sub: `${i.every} · synced ${ago(i.lastSync, s.now)}`,
    status: i.status,
    tone: INT_TONE[i.status],
    sort: [i.name, i.dir, i.records, i.status],
    flags: i.status !== 'Healthy' ? ['attention'] : [],
    tags: { status: i.status },
    text: `${i.name} ${i.dir} ${i.status} ${i.note}`,
  };
}

export function moduleRows(s: DemoState, m: ModuleId): Row[] {
  switch (m) {
    case 'overview':
      return [...s.orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8).map((o) => orderRow(s, o));
    case 'sales':
      return [...s.orders].sort((a, b) => b.createdAt - a.createdAt || seqOf(b.id) - seqOf(a.id)).map((o) => orderRow(s, o));
    case 'inventory':
      return [...s.skus].sort((a, b) => SKU_RANK[skuStatus(a)] - SKU_RANK[skuStatus(b)] || a.sku.localeCompare(b.sku)).map(skuRow);
    case 'service': {
      const order = (t: Ticket) => (t.status === 'Resolved' ? 1e9 - (t.resolvedAt ?? 0) : slaInfo(t, s.now).left);
      return [...s.tickets].sort((a, b) => order(a) - order(b)).map((t) => ticketRow(s, t));
    }
    case 'people': {
      const rank = (e: Employee) => (e.pending ? 0 : e.status === 'Absent' ? 1 : e.status === 'On leave' ? 2 : 3);
      return [...s.employees].sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id)).map(employeeRow);
    }
    case 'finance': {
      const rank = (v: Voucher) => VCH_RANK[voucherState(v)];
      return [...s.vouchers].sort((a, b) => rank(a) - rank(b) || a.dueIn - b.dueIn || b.createdAt - a.createdAt).map((v) => voucherRow(s, v));
    }
    case 'reports':
      return [...s.reports].sort((a, b) => b.lastRun - a.lastRun).map((r) => reportRow(s, r));
    case 'integrations': {
      const rank = (i: Integration) => (i.status === 'Limited' ? 0 : i.status === 'Paused' ? 1 : 2);
      return [...s.integrations].sort((a, b) => rank(a) - rank(b)).map((i) => integrationRow(s, i));
    }
  }
}

const byStatus = (id: string, label = id): Chip => ({ id, label, test: (r) => r.status === id });
const byFlag = (id: string, label: string): Chip => ({ id, label, test: (r) => r.flags.includes(id) });
const ALL: Chip = { id: 'all', label: 'All', test: () => true };

export function chipsFor(m: ModuleId): Chip[] {
  switch (m) {
    case 'overview':
    case 'sales':
      return [ALL, byFlag('open', 'Open'), byStatus('Quoted'), byStatus('Approval'), byStatus('Confirmed'), byStatus('Packing'), byStatus('Dispatched'), byStatus('Invoiced'), byStatus('Cancelled')];
    case 'inventory':
      return [ALL, byFlag('attention', 'Low & out'), byStatus('In stock'), byStatus('Low stock'), byStatus('Out of stock'), byFlag('onorder', 'On order')];
    case 'service':
      return [ALL, byFlag('open', 'Open'), byFlag('risk', 'SLA at risk'), byFlag('unassigned', 'Unassigned'), byStatus('Escalated'), byStatus('Scheduled'), byStatus('Resolved')];
    case 'people':
      return [ALL, byStatus('Present'), byStatus('On leave'), byStatus('Absent'), byFlag('pending', 'Leave pending')];
    case 'finance':
      return [ALL, byFlag('unpaid', 'Unpaid'), byStatus('Overdue'),
        { id: 'over30', label: '30+ days late', test: (r) => r.tags.bucket === 'recv:31–60 days' || r.tags.bucket === 'recv:60+ days' },
        byStatus('Due'), byStatus('Paid'),
        { id: 'invoices', label: 'Invoices', test: (r) => r.tags.kind === 'Sales invoice' },
        { id: 'bills', label: 'Bills', test: (r) => r.tags.kind === 'Purchase bill' }];
    case 'reports':
      return [ALL, byStatus('Hourly'), byStatus('Every 2 hrs'), byStatus('Daily 8am'), byStatus('On demand')];
    case 'integrations':
      return [ALL, byFlag('attention', 'Needs attention'), byStatus('Healthy'), byStatus('Limited'), byStatus('Paused')];
  }
}

/* ------------------------------------------------------------------ */
/* KPIs                                                                 */
/* ------------------------------------------------------------------ */

export interface KpiTarget {
  module: ModuleId;
  chip?: string;
  scope?: Scope;
}

export interface KpiView {
  label: string;
  value: string;
  delta: string;
  tone: 'good' | 'bad' | 'flat';
  spark: number[];
  to?: KpiTarget;
}

type Fmt = 'lakh' | 'int' | 'pct' | 'hours' | 'sec';

interface KpiRaw {
  label: string;
  value: number;
  fmt: Fmt;
  good: 'up' | 'down' | 'none';
  /** How the previous period relates to the seeded value: a factor or an offset. */
  pf?: number;
  po?: number;
  shape: number[];
  to?: KpiTarget;
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const avg = (xs: number[]) => (xs.length ? sum(xs) / xs.length : 0);

function kpiRaw(s: DemoState, m: ModuleId): KpiRaw[] {
  const sales = s.vouchers.filter(isSalesInvoice);
  const bills = s.vouchers.filter(isBill);
  const unpaid = (v: Voucher) => !v.paid;
  const openOrders = s.orders.filter(isOpenOrder);
  const openTickets = s.tickets.filter((t) => t.status !== 'Resolved');

  switch (m) {
    case 'overview':
      return [
        { label: 'Revenue (30 days)', value: sum(sales.filter((v) => v.createdAt >= MONTH_START).map((v) => v.amount)), fmt: 'lakh', good: 'up', pf: 0.89, shape: [8, 12, 10, 16, 14, 20, 18, 24], to: { module: 'finance', chip: 'invoices' } },
        { label: 'Open orders', value: openOrders.length, fmt: 'int', good: 'none', po: -2, shape: [14, 12, 16, 15, 19, 17, 21, 23], to: { module: 'sales', chip: 'open' } },
        { label: 'Open tickets', value: openTickets.length, fmt: 'int', good: 'down', po: 3, shape: [24, 22, 19, 20, 16, 15, 13, 11], to: { module: 'service', chip: 'open' } },
        { label: 'Overdue receivables', value: sum(sales.filter((v) => unpaid(v) && v.dueIn < 0).map((v) => v.amount)), fmt: 'lakh', good: 'down', pf: 1.12, shape: [22, 21, 19, 18, 16, 14, 12, 10], to: { module: 'finance', chip: 'Overdue' } },
      ];
    case 'sales': {
      const live = s.orders.filter((o) => o.stage !== 'Cancelled');
      return [
        { label: 'Pipeline value', value: sum(openOrders.map(orderTotal)), fmt: 'lakh', good: 'up', pf: 0.85, shape: [10, 14, 12, 18, 16, 22, 20, 26], to: { module: 'sales', chip: 'open' } },
        { label: 'Invoiced', value: sum(s.orders.filter((o) => o.stage === 'Invoiced').map(orderTotal)), fmt: 'lakh', good: 'up', pf: 0.94, shape: [12, 11, 15, 14, 18, 17, 21, 23], to: { module: 'sales', chip: 'Invoiced' } },
        { label: 'Avg order value', value: avg(live.map(orderTotal)), fmt: 'lakh', good: 'up', pf: 0.96, shape: [14, 15, 14, 16, 17, 16, 18, 19] },
        { label: 'Awaiting approval', value: s.orders.filter((o) => o.stage === 'Approval').length, fmt: 'int', good: 'down', po: 1, shape: [24, 22, 21, 18, 16, 14, 12, 10], to: { module: 'sales', chip: 'Approval' } },
      ];
    }
    case 'inventory':
      return [
        { label: 'Stock value', value: sum(s.skus.map((k) => k.onHand * k.rate)), fmt: 'lakh', good: 'up', pf: 0.976, shape: [16, 17, 16, 18, 19, 18, 20, 21] },
        { label: 'Low & out of stock', value: s.skus.filter((k) => skuStatus(k) !== 'In stock').length, fmt: 'int', good: 'down', po: 2, shape: [22, 21, 19, 20, 17, 16, 14, 13], to: { module: 'inventory', chip: 'attention' } },
        { label: 'Slow movers (90+ days)', value: s.skus.filter((k) => k.ageDays > 90).length, fmt: 'int', good: 'down', po: 1, shape: [24, 23, 21, 20, 18, 17, 15, 14], to: { module: 'inventory', scope: { key: 'age', value: '90+ days', label: 'Age: 90+ days' } } },
        { label: 'Open purchase orders', value: s.skus.filter((k) => k.onOrder).length, fmt: 'int', good: 'none', po: 0, shape: [13, 14, 13, 15, 16, 15, 17, 18], to: { module: 'inventory', chip: 'onorder' } },
      ];
    case 'service': {
      const all = s.tickets;
      const bad = all.filter((t) => ['breached', 'missed'].includes(slaInfo(t, s.now).state)).length;
      const resolved = s.tickets.filter((t) => t.status === 'Resolved' && t.resolvedAt !== undefined);
      return [
        { label: 'Open tickets', value: openTickets.length, fmt: 'int', good: 'down', po: 3, shape: [24, 22, 20, 19, 17, 15, 13, 11], to: { module: 'service', chip: 'open' } },
        { label: 'Within SLA', value: all.length ? (100 * (all.length - bad)) / all.length : 100, fmt: 'pct', good: 'up', po: -3, shape: [12, 13, 14, 14, 16, 17, 17, 19] },
        { label: 'SLA at risk', value: openTickets.filter((t) => ['risk', 'breached'].includes(slaInfo(t, s.now).state)).length, fmt: 'int', good: 'down', po: 2, shape: [15, 15, 16, 16, 17, 17, 18, 18], to: { module: 'service', chip: 'risk' } },
        { label: 'Avg resolution', value: avg(resolved.map((t) => (t.resolvedAt ?? 0) - t.openedAt)), fmt: 'hours', good: 'down', pf: 1.18, shape: [22, 21, 19, 18, 16, 15, 13, 12] },
      ];
    }
    case 'people': {
      const total = s.employees.length;
      const present = s.employees.filter((e) => e.status === 'Present').length;
      return [
        { label: 'Present today', value: present, fmt: 'int', good: 'up', po: -2, shape: [16, 17, 16, 18, 18, 19, 18, 20], to: { module: 'people', chip: 'Present' } },
        { label: 'On leave', value: s.employees.filter((e) => e.status === 'On leave').length, fmt: 'int', good: 'none', po: 1, shape: [14, 15, 14, 13, 13, 12, 12, 11], to: { module: 'people', chip: 'On leave' } },
        { label: 'Leave requests pending', value: s.employees.filter((e) => e.pending).length, fmt: 'int', good: 'down', po: 3, shape: [22, 21, 20, 18, 17, 15, 13, 12], to: { module: 'people', chip: 'pending' } },
        { label: 'Attendance', value: total ? (100 * present) / total : 0, fmt: 'pct', good: 'up', po: -2, shape: [13, 14, 13, 15, 16, 15, 17, 18] },
      ];
    }
    case 'finance':
      return [
        { label: 'Receivables', value: sum(sales.filter(unpaid).map((v) => v.amount)), fmt: 'lakh', good: 'down', pf: 1.05, shape: [24, 23, 22, 21, 20, 19, 18, 17], to: { module: 'finance', chip: 'invoices' } },
        { label: 'Payables', value: sum(bills.filter(unpaid).map((v) => v.amount)), fmt: 'lakh', good: 'none', pf: 0.92, shape: [14, 15, 16, 17, 17, 18, 19, 20], to: { module: 'finance', chip: 'bills' } },
        { label: 'Overdue 30+ days', value: sum(sales.filter((v) => unpaid(v) && v.dueIn < -30).map((v) => v.amount)), fmt: 'lakh', good: 'down', pf: 1.2, shape: [22, 21, 19, 18, 16, 14, 12, 10], to: { module: 'finance', chip: 'over30' } },
        { label: 'Cash position', value: s.cash, fmt: 'lakh', good: 'up', pf: 0.93, shape: [12, 14, 13, 16, 18, 17, 20, 23] },
      ];
    case 'reports':
      return [
        { label: 'Reports built', value: s.reports.length, fmt: 'int', good: 'up', po: -2, shape: [18, 19, 20, 20, 22, 23, 24, 25] },
        { label: 'Scheduled', value: s.reports.filter((r) => r.schedule !== 'On demand').length, fmt: 'int', good: 'up', po: -1, shape: [16, 16, 17, 17, 18, 18, 19, 19] },
        { label: 'Exports (30 days)', value: s.exports, fmt: 'int', good: 'up', po: -44, shape: [14, 16, 15, 18, 19, 21, 22, 24] },
        { label: 'Report runs', value: sum(s.reports.map((r) => r.runs)), fmt: 'int', good: 'up', pf: 0.93, shape: [20, 19, 18, 17, 15, 14, 13, 12] },
      ];
    case 'integrations': {
      const lat = s.integrations.map((i) => i.latencyMs).filter((x): x is number => x !== null);
      return [
        { label: 'Live connections', value: s.integrations.filter((i) => i.status !== 'Paused').length, fmt: 'int', good: 'up', po: 1, shape: [14, 15, 15, 16, 16, 17, 17, 18] },
        { label: 'Records synced', value: sum(s.integrations.map((i) => i.records)), fmt: 'int', good: 'up', pf: 0.93, shape: [12, 14, 13, 16, 18, 17, 20, 22] },
        { label: 'Need attention', value: s.integrations.filter((i) => i.status !== 'Healthy').length, fmt: 'int', good: 'down', po: -1, shape: [20, 18, 16, 14, 12, 10, 8, 6], to: { module: 'integrations', chip: 'attention' } },
        { label: 'Avg latency', value: avg(lat), fmt: 'sec', good: 'down', pf: 1.2, shape: [19, 18, 17, 16, 15, 14, 13, 12] },
      ];
    }
  }
}

function fmtValue(v: number, f: Fmt): string {
  switch (f) {
    case 'lakh': return lakh(v);
    case 'int': return inr(v);
    case 'pct': return `${v.toFixed(1)}%`;
    case 'hours': return `${(v / 60).toFixed(1)}h`;
    case 'sec': return `${(v / 1000).toFixed(1)}s`;
  }
}

function fmtDelta(d: number, f: Fmt): string {
  const sign = d > 0 ? '+' : '−';
  const a = Math.abs(d);
  switch (f) {
    case 'lakh': return `${sign}${lakh(a)}`;
    case 'int': return `${sign}${inr(a)}`;
    case 'pct': return `${sign}${a.toFixed(1)} pts`;
    case 'hours': return `${sign}${(a / 60).toFixed(1)}h`;
    case 'sec': return `${sign}${(a / 1000).toFixed(1)}s`;
  }
}

let seedBase: Map<string, number> | null = null;
function baseValue(m: ModuleId, label: string): number {
  if (!seedBase) {
    seedBase = new Map();
    const seed = createSeed();
    (['overview', 'sales', 'inventory', 'service', 'people', 'finance', 'reports', 'integrations'] as ModuleId[]).forEach((mod) => {
      kpiRaw(seed, mod).forEach((k) => seedBase!.set(`${mod}:${k.label}`, k.value));
    });
  }
  return seedBase.get(`${m}:${label}`) ?? 0;
}

export function kpis(s: DemoState, m: ModuleId): KpiView[] {
  return kpiRaw(s, m).map((k) => {
    const base = baseValue(m, k.label);
    const prior = k.pf !== undefined ? base * k.pf : base + (k.po ?? 0);
    const diff = k.value - prior;
    const flat = Math.abs(diff) < (k.fmt === 'lakh' ? 500 : k.fmt === 'pct' ? 0.05 : k.fmt === 'hours' ? 1 : k.fmt === 'sec' ? 20 : 0.5);
    const tone = flat || k.good === 'none' ? 'flat' : (diff > 0) === (k.good === 'up') ? 'good' : 'bad';
    const spark = k.shape.map((v, i) => (i === k.shape.length - 1 && base > 0 ? v * (k.value / base) : v));
    return {
      label: k.label,
      value: fmtValue(k.value, k.fmt),
      delta: flat ? 'No change' : fmtDelta(diff, k.fmt),
      tone,
      spark,
      to: k.to,
    };
  });
}

/* ------------------------------------------------------------------ */
/* Alerts                                                               */
/* ------------------------------------------------------------------ */

export interface Alert {
  id: string;
  module: ModuleId;
  ref: Ref;
  sev: 'high' | 'med' | 'low';
  title: string;
  detail: string;
}

export function alerts(s: DemoState): Alert[] {
  const out: Alert[] = [];

  s.orders.forEach((o) => {
    if (o.stage === 'Approval') {
      out.push({ id: `appr-${o.id}`, module: 'sales', ref: { module: 'sales', id: o.id }, sev: 'med', title: `${o.id} awaiting approval`, detail: `${customerName(s, o.customerId)} · ${rupees(orderTotal(o))} · ${approvalReason(s, o) || 'review needed'}` });
    }
    if (o.stage === 'Packing') {
      const short = shortages(s, o);
      if (short.length) {
        out.push({ id: `short-${o.id}`, module: 'sales', ref: { module: 'sales', id: o.id }, sev: 'high', title: `${o.id} cannot ship`, detail: `Short on ${short.map((x) => `${x.sku} (${x.have} of ${x.need})`).join(', ')}` });
      }
    }
  });

  s.skus.forEach((k) => {
    const st = skuStatus(k);
    if (st === 'Out of stock') {
      out.push({ id: `oos-${k.sku}`, module: 'inventory', ref: { module: 'inventory', id: k.sku }, sev: 'high', title: `${k.sku} is out of stock`, detail: `${k.name}${k.onOrder ? ' · PO raised' : ` · lead time ${k.leadDays} days`}` });
    } else if (st === 'Low stock' && !k.onOrder) {
      out.push({ id: `low-${k.sku}`, module: 'inventory', ref: { module: 'inventory', id: k.sku }, sev: 'med', title: `${k.sku} is low`, detail: `${inr(k.onHand)} on hand · reorder at ${inr(k.reorderAt)}` });
    }
  });

  s.tickets.forEach((t) => {
    if (t.status === 'Resolved') return;
    const sla = slaInfo(t, s.now);
    if (sla.state === 'breached') {
      out.push({ id: `sla-${t.id}`, module: 'service', ref: { module: 'service', id: t.id }, sev: 'high', title: `${t.id} breached SLA`, detail: `${customerName(s, t.customerId)} · ${duration(sla.left)} over` });
    } else if (sla.state === 'risk') {
      out.push({ id: `sla-${t.id}`, module: 'service', ref: { module: 'service', id: t.id }, sev: 'med', title: `${t.id} at SLA risk`, detail: `${customerName(s, t.customerId)} · ${duration(sla.left)} left` });
    } else if (!t.engineer) {
      out.push({ id: `un-${t.id}`, module: 'service', ref: { module: 'service', id: t.id }, sev: 'low', title: `${t.id} is unassigned`, detail: `${customerName(s, t.customerId)} · ${t.priority}` });
    }
  });

  s.vouchers.forEach((v) => {
    if (v.paid || v.dueIn >= 0 || v.kind === 'Journal') return;
    out.push({
      id: `ov-${v.id}`, module: 'finance', ref: { module: 'finance', id: v.id },
      sev: isSalesInvoice(v) && v.dueIn < -30 ? 'high' : 'med',
      title: `${v.id} overdue ${-v.dueIn} days`, detail: `${v.party} · ${rupees(v.amount)}${v.reminded ? ' · reminded' : ''}`,
    });
  });

  s.employees.forEach((e) => {
    if (e.pending) {
      out.push({ id: `leave-${e.id}`, module: 'people', ref: { module: 'people', id: e.id }, sev: 'low', title: `${e.name} requests leave`, detail: `${e.pending.days} day${e.pending.days > 1 ? 's' : ''} ${e.pending.type.toLowerCase()}` });
    }
  });

  s.integrations.forEach((i) => {
    if (i.status === 'Limited') {
      out.push({ id: `int-${i.id}`, module: 'integrations', ref: { module: 'integrations', id: i.id }, sev: 'med', title: `${i.name} is rate-limited`, detail: i.note });
    } else if (i.status === 'Paused') {
      out.push({ id: `int-${i.id}`, module: 'integrations', ref: { module: 'integrations', id: i.id }, sev: 'low', title: `${i.name} is paused`, detail: i.note });
    }
  });

  const rank = { high: 0, med: 1, low: 2 };
  return out.sort((a, b) => rank[a.sev] - rank[b.sev]);
}

/* ------------------------------------------------------------------ */
/* Search                                                               */
/* ------------------------------------------------------------------ */

export interface Hit {
  ref: Ref;
  title: string;
  sub: string;
}

export function search(s: DemoState, q: string): Hit[] {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const modules: ModuleId[] = ['sales', 'inventory', 'service', 'people', 'finance', 'reports', 'integrations'];
  const hits: (Hit & { score: number })[] = [];
  modules.forEach((m) => {
    moduleRows(s, m).forEach((r) => {
      const hay = r.text.toLowerCase();
      if (!tokens.every((t) => hay.includes(t))) return;
      const title = `${r.cols[0]} ${r.cols[1]}`.toLowerCase();
      // Best: the id starts with the query. Next: what the row is called matches. Last: only hidden detail matches.
      const score = r.cols[0].toLowerCase().startsWith(tokens[0]) ? 0 : tokens.every((t) => title.includes(t)) ? 1 : 2;
      hits.push({ ref: r.ref, title: `${r.cols[0]} · ${r.cols[1]}`, sub: `${r.cols[3]}${r.sub ? ` · ${r.sub}` : ''}`, score });
    });
  });
  return hits.sort((a, b) => a.score - b.score).slice(0, 8);
}

/* ------------------------------------------------------------------ */
/* Visualisation data                                                   */
/* ------------------------------------------------------------------ */

export function trend(s: DemoState) {
  const thisWeek = sum(s.vouchers.filter((v) => isSalesInvoice(v) && v.createdAt >= WEEK_START).map((v) => v.amount)) / 1000;
  const series = [...WEEKLY_PAST, Math.round(thisWeek)];
  const labels = series.map((_, i) => (i === series.length - 1 ? 'Last 7 days' : `${series.length - 1 - i}w earlier`));
  return { series, target: WEEKLY_TARGET, labels };
}

export function pipeline(s: DemoState) {
  const live = s.orders.filter((o) => o.stage !== 'Cancelled');
  const stages = STAGES.map((st) => {
    const os = live.filter((o) => o.stage === st);
    return { name: st, n: os.length, value: sum(os.map(orderTotal)) };
  });
  const reached = (from: OrderStage) => live.filter((o) => STAGES.indexOf(o.stage) >= STAGES.indexOf(from)).length;
  const pct = (a: OrderStage, b: OrderStage) => (reached(a) ? Math.round((100 * reached(b)) / reached(a)) : 0);
  return {
    stages,
    conversion: [
      { from: 'Quoted', to: 'Confirmed', pct: pct('Quoted', 'Confirmed') },
      { from: 'Confirmed', to: 'Dispatched', pct: pct('Confirmed', 'Dispatched') },
      { from: 'Dispatched', to: 'Invoiced', pct: pct('Dispatched', 'Invoiced') },
    ],
  };
}

function groupSum<T>(items: T[], key: (x: T) => string, val: (x: T) => number) {
  const m = new Map<string, { value: number; n: number }>();
  items.forEach((x) => {
    const k = key(x);
    const cur = m.get(k) ?? { value: 0, n: 0 };
    m.set(k, { value: cur.value + val(x), n: cur.n + 1 });
  });
  return [...m.entries()].map(([name, v]) => ({ name, ...v }));
}

export function stockViz(s: DemoState) {
  const value = (k: Sku) => k.onHand * k.rate;
  const total = sum(s.skus.map(value));
  const categories = groupSum(s.skus, (k) => k.category, value).sort((a, b) => b.value - a.value);
  const stores = groupSum(s.skus, (k) => k.store, value).sort((a, b) => a.name.localeCompare(b.name));
  const ageing = AGE_BUCKETS.map((b) => {
    const v = sum(s.skus.filter((k) => ageBucket(k.ageDays) === b).map(value));
    return { label: b, value: v, pct: total ? (100 * v) / total : 0 };
  });
  return { total, skus: s.skus.length, categories, stores, ageing, movement: s.movement };
}

const CLOSED_BASE: Record<string, number> = { 'Employee 2': 33, 'Employee 4': 28, 'Employee 7': 25, 'Employee 3': 21 };

export function serviceViz(s: DemoState) {
  const open = s.tickets.filter((t) => t.status !== 'Resolved');
  const priority = PRIORITIES.map((p) => ({ name: p, n: open.filter((t) => t.priority === p).length }));
  const engineers = ENGINEERS.map((name) => ({
    name,
    open: open.filter((t) => t.engineer === name).length,
    closed: CLOSED_BASE[name] + s.tickets.filter((t) => t.status === 'Resolved' && t.engineer === name).length,
  }));
  const unassigned = open.filter((t) => !t.engineer).length;
  const atRisk = open.filter((t) => ['risk', 'breached'].includes(slaInfo(t, s.now).state)).length;
  const bad = s.tickets.filter((t) => ['breached', 'missed'].includes(slaInfo(t, s.now).state)).length;
  const slaMet = s.tickets.length ? Math.round((100 * (s.tickets.length - bad)) / s.tickets.length) : 100;
  return { priority, engineers, unassigned, atRisk, slaMet, total: open.length };
}

export function peopleViz(s: DemoState) {
  const depts = ['Store 1', 'Store 2', 'Store 3', 'Admin', 'Leadership'].map((name) => {
    const list = s.employees.filter((e) => e.dept === name);
    return { name, head: list.length, present: list.filter((e) => e.status === 'Present').length };
  });
  const leave = (['Casual', 'Earned', 'Medical'] as const).map((type) => ({
    name: type, n: s.employees.filter((e) => e.onLeave?.type === type).length,
  }));
  return {
    depts, leave,
    present: s.employees.filter((e) => e.status === 'Present').length,
    total: s.employees.length,
    pending: s.employees.filter((e) => e.pending).length,
  };
}

export function financeViz(s: DemoState) {
  const bucketSum = (list: Voucher[]) => DUE_BUCKETS.map((label) => {
    const items = list.filter((v) => !v.paid && dueBucket(v) === label);
    return { label, value: sum(items.map((v) => v.amount)), n: items.length };
  });
  const rec = bucketSum(s.vouchers.filter(isSalesInvoice));
  const pay = bucketSum(s.vouchers.filter(isBill));
  const recTotal = sum(rec.map((b) => b.value));
  const payTotal = sum(pay.map((b) => b.value));
  const toRemind = s.vouchers.filter((v) => isSalesInvoice(v) && !v.paid && v.dueIn < 0 && !v.reminded).length;
  return { rec, pay, recTotal, payTotal, cash: s.cash, toRemind };
}

export function reportsViz(s: DemoState) {
  const top = [...s.reports].sort((a, b) => b.runs - a.runs).slice(0, 5);
  return {
    top,
    total: s.reports.length,
    scheduled: s.reports.filter((r) => r.schedule !== 'On demand').length,
    recipients: sum(s.reports.map((r) => r.recipients)),
  };
}

/* ------------------------------------------------------------------ */
/* Running a report against live data                                   */
/* ------------------------------------------------------------------ */

export interface ReportResult {
  title: string;
  columns: string[];
  rows: string[][];
  note: string;
}

export function runReportData(s: DemoState, r: Report): ReportResult {
  switch (r.kind) {
    case 'sales': {
      const g = groupSum(s.orders.filter((o) => o.stage !== 'Cancelled'), (o) => customerName(s, o.customerId), orderTotal).sort((a, b) => b.value - a.value);
      return { title: r.name, columns: ['Customer', 'Orders', 'Value'], rows: g.map((x) => [x.name, String(x.n), rupees(x.value)]), note: `${g.length} customers · ${rupees(sum(g.map((x) => x.value)))} across live orders` };
    }
    case 'stock': {
      const rows = [...s.skus].sort((a, b) => b.ageDays - a.ageDays).map((k) => [k.sku, k.name, `${k.ageDays}d`, inr(k.onHand), rupees(k.onHand * k.rate)]);
      return { title: r.name, columns: ['SKU', 'Item', 'Age', 'On hand', 'Value'], rows, note: `Sorted by days since last movement · ${s.skus.filter((k) => k.ageDays > 90).length} items older than 90 days` };
    }
    case 'sla': {
      const rows = PRIORITIES.map((p) => {
        const list = s.tickets.filter((t) => t.priority === p);
        const states = list.map((t) => slaInfo(t, s.now).state);
        return [p, String(list.filter((t) => t.status !== 'Resolved').length), String(states.filter((x) => x === 'risk').length), String(states.filter((x) => x === 'breached' || x === 'missed').length), String(list.filter((t) => t.status === 'Resolved').length)];
      });
      return { title: r.name, columns: ['Priority', 'Open', 'At risk', 'Breached', 'Resolved'], rows, note: `Measured at ${clock(s.now)} today` };
    }
    case 'receivables': {
      const g = groupSum(s.vouchers.filter((v) => isSalesInvoice(v) && !v.paid), (v) => v.party, (v) => v.amount);
      const rows = g.sort((a, b) => b.value - a.value).map((x) => {
        const oldest = Math.min(...s.vouchers.filter((v) => isSalesInvoice(v) && !v.paid && v.party === x.name).map((v) => v.dueIn));
        return [x.name, String(x.n), rupees(x.value), oldest < 0 ? `${-oldest} days overdue` : 'Not due'];
      });
      return { title: r.name, columns: ['Customer', 'Invoices', 'Outstanding', 'Oldest'], rows, note: `${rupees(sum(g.map((x) => x.value)))} outstanding` };
    }
    case 'attendance': {
      const rows = peopleViz(s).depts.map((d) => [d.name, String(d.head), String(d.present), `${d.head ? Math.round((100 * d.present) / d.head) : 0}%`]);
      return { title: r.name, columns: ['Department', 'Headcount', 'Present', 'Attendance'], rows, note: `${s.employees.length} employees` };
    }
    case 'gst': {
      const inv = s.vouchers.filter(isSalesInvoice);
      const rows = inv.map((v) => {
        const tax = (v.amount * 18) / 118;
        return [v.id, v.party, rupees(v.amount - tax), rupees(tax), rupees(v.amount)];
      });
      const taxTotal = sum(inv.map((v) => (v.amount * 18) / 118));
      return { title: r.name, columns: ['Invoice', 'Party', 'Taxable', 'GST 18%', 'Total'], rows, note: `${rupees(taxTotal)} GST across ${inv.length} invoices` };
    }
  }
}


/* ------------------------------------------------------------------ */
/* Widget data                                                          */
/* ------------------------------------------------------------------ */

export function stockHealth(s: DemoState) {
  const count = (st: string) => s.skus.filter((k) => skuStatus(k) === st).length;
  return { inStock: count('In stock'), low: count('Low stock'), out: count('Out of stock'), onOrder: s.skus.filter((k) => k.onOrder).length, total: s.skus.length };
}

const QUEUE_RANK: Record<string, number> = { Dispatched: 0, Packing: 1, Confirmed: 2, Approval: 3, Quoted: 4 };

export interface QueueItem {
  order: Order;
  customer: string;
  total: number;
  label: string;
  blocked: boolean;
  shortText: string;
  shortSku: string;
}

/** Every open order with the one thing that moves it forward. */
export function orderQueue(s: DemoState, limit = 6): QueueItem[] {
  return s.orders
    .filter((o) => isOpenOrder(o) && nextStage(s, o))
    .sort((a, b) => QUEUE_RANK[a.stage] - QUEUE_RANK[b.stage] || a.createdAt - b.createdAt)
    .slice(0, limit)
    .map((o) => {
      const short = nextStage(s, o) === 'Dispatched' ? shortages(s, o) : [];
      return {
        order: o,
        customer: customerName(s, o.customerId),
        total: orderTotal(o),
        label: nextLabel(s, o),
        blocked: short.length > 0,
        shortText: short.map((x) => `${x.sku} ${inr(x.have)}/${inr(x.need)}`).join(', '),
        shortSku: short[0]?.sku ?? '',
      };
    });
}

export function topCustomers(s: DemoState, limit = 5) {
  const live = s.orders.filter((o) => o.stage !== 'Cancelled');
  return groupSum(live, (o) => customerName(s, o.customerId), orderTotal).sort((a, b) => b.value - a.value).slice(0, limit);
}

export function reorderList(s: DemoState, limit = 6) {
  return s.skus
    .filter((k) => skuStatus(k) !== 'In stock')
    .sort((a, b) => a.onHand / Math.max(a.reorderAt, 1) - b.onHand / Math.max(b.reorderAt, 1))
    .slice(0, limit)
    .map((k) => ({ k, status: skuStatus(k), need: demand(s, k.sku), qty: k.onOrder ? k.poQty : suggestedPo(k) }));
}

export function slaQueue(s: DemoState, limit = 6) {
  return s.tickets
    .filter((t) => t.status !== 'Resolved')
    .map((t) => ({ t, customer: customerName(s, t.customerId), sla: slaInfo(t, s.now) }))
    .sort((a, b) => a.sla.left - b.sla.left)
    .slice(0, limit);
}

export function roster(s: DemoState) {
  const initials = (n: string) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  return s.employees.map((e) => ({ e, initials: initials(e.name) }));
}

export function leaveRequests(s: DemoState) {
  return s.employees.filter((e) => e.pending);
}

export function collections(s: DemoState, limit = 5) {
  return s.vouchers
    .filter((v) => isSalesInvoice(v) && !v.paid && v.dueIn < 0)
    .sort((a, b) => a.dueIn - b.dueIn)
    .slice(0, limit);
}

export function billsDue(s: DemoState, limit = 5) {
  return s.vouchers.filter((v) => isBill(v) && !v.paid).sort((a, b) => a.dueIn - b.dueIn).slice(0, limit);
}

export function integrationLog(s: DemoState, limit = 7) {
  return s.integrations
    .flatMap((i) => i.trail.map((t) => ({ ...t, name: i.name, id: i.id })))
    .sort((a, b) => b.at - a.at)
    .slice(0, limit);
}
