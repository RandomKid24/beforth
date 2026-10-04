import type {
  Customer, DemoState, Employee, Integration, Order, OrderStage, Priority, Report, Sku, Ticket,
  TicketStatus, TrailEntry, Voucher,
} from './types';
import { APPROVAL_LIMIT, orderTotal } from './rules';

const H = 60;
const D = 1440;
/** Day 0 is today; -1 is yesterday. */
const at = (day: number, h: number, m = 0) => day * D + h * H + m;
const tr = (a: number, who: string, what: string): TrailEntry => ({ at: a, who, what });

export const NOW0 = at(0, 9, 42);
/** Rolling windows, so the figures don't depend on today's place in the calendar. */
export const MONTH_START = at(-30, 0);
export const WEEK_START = at(-7, 0);

/** Weekly billing in ₹ thousands for the 11 weeks before this one, and the monthly target line. */
export const WEEKLY_PAST = [380, 420, 405, 470, 455, 520, 498, 560, 541, 604, 588];
export const WEEKLY_TARGET = [400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620];

const customers: Customer[] = [
  { id: 'c1', name: 'Customer 1', city: 'Nashik', creditLimit: 800000 },
  { id: 'c2', name: 'Customer 2', city: 'Pune', creditLimit: 400000 },
  { id: 'c3', name: 'Customer 3', city: 'Nashik', creditLimit: 300000 },
  { id: 'c4', name: 'Customer 4', city: 'Mumbai', creditLimit: 1000000 },
  { id: 'c5', name: 'Customer 5', city: 'Sinnar', creditLimit: 200000 },
  { id: 'c6', name: 'Customer 6', city: 'Nashik', creditLimit: 500000 },
  { id: 'c7', name: 'Customer 7', city: 'Sinnar', creditLimit: 250000 },
  { id: 'c8', name: 'Customer 8', city: 'Pune', creditLimit: 150000 },
  { id: 'c9', name: 'Customer 9', city: 'Aurangabad', creditLimit: 200000 },
  { id: 'c10', name: 'Customer 10', city: 'Malegaon', creditLimit: 300000 },
];

function sku(
  code: string, name: string, category: string, store: string, rate: number,
  onHand: number, reorderAt: number, ageDays: number, leadDays: number,
): Sku {
  return {
    sku: code, name, category, store, rate, onHand, reorderAt, ageDays, leadDays,
    onOrder: false, poQty: 0,
    trail: [tr(at(-ageDays, 10), 'System', `Last stock movement ${ageDays} days ago`)],
  };
}

const skus = (): Sku[] => [
  sku('BRG-2201', 'Bearing 6205-2RS', 'Bearings & bushings', 'Store 1', 640, 1240, 400, 12, 5),
  sku('BRG-6306', 'Bearing 6306-ZZ', 'Bearings & bushings', 'Store 1', 910, 520, 200, 34, 5),
  sku('BSH-4410', 'Bronze bush 44×50', 'Bearings & bushings', 'Store 1', 285, 310, 150, 71, 7),
  sku('VLV-1104', 'SS316 ball valve 1½"', 'Valves', 'Store 1', 3562, 36, 40, 9, 10),
  sku('VLV-2208', 'Gate valve CI 2"', 'Valves', 'Store 2', 2140, 74, 30, 22, 8),
  sku('VLV-0905', 'NRV brass ¾"', 'Valves', 'Store 2', 690, 210, 80, 48, 6),
  sku('PMP-C75', 'Centrifugal pump 1.5HP', 'Pumps & motors', 'Store 2', 36250, 8, 10, 15, 12),
  sku('MTR-3PH5', '3-phase motor 5HP', 'Pumps & motors', 'Store 2', 28400, 14, 6, 41, 14),
  sku('BLT-M12', 'Hex bolt M12×60', 'Fasteners', 'Store 3', 42, 6800, 2000, 18, 4),
  sku('BLT-M8', 'Hex bolt M8×40', 'Fasteners', 'Store 3', 18, 9400, 3000, 27, 4),
  sku('NUT-M12', 'Hex nut M12', 'Fasteners', 'Store 3', 9, 12100, 4000, 94, 4),
  sku('GSK-08', 'Gasket sheet 1.5mm', 'Gaskets & seals', 'Store 1', 380, 0, 25, 6, 3),
  sku('GSK-12', 'Head gasket 1.2mm', 'Gaskets & seals', 'Store 1', 520, 84, 40, 38, 3),
  sku('SEL-OR30', 'O-ring kit 30pc', 'Gaskets & seals', 'Store 3', 460, 160, 60, 63, 4),
  sku('FLT-0090', 'Oil filter spin-on', 'Consumables', 'Store 3', 310, 460, 150, 11, 3),
  sku('CVR-44', 'Conveyor belt 800mm', 'Consumables', 'Store 2', 2356, 42, 20, 120, 9),
];

function order(
  all: Sku[], id: string, customerId: string, lines: [string, number][], stage: OrderStage,
  owner: string, createdAt: number, invoiceId?: string,
): Order {
  const o: Order = {
    id, customerId, stage, owner, createdAt, invoiceId, trail: [],
    lines: lines.map(([code, qty]) => {
      const k = all.find((x) => x.sku === code)!;
      return { sku: code, name: k.name, qty, rate: k.rate };
    }),
  };
  const path: OrderStage[] = ['Quoted'];
  if (orderTotal(o) >= APPROVAL_LIMIT) path.push('Approval');
  path.push('Confirmed', 'Packing', 'Dispatched', 'Invoiced');
  const upTo = path.indexOf(stage);
  const verbs: Record<string, string> = {
    Quoted: 'Order created', Approval: 'Sent for approval', Confirmed: 'Confirmed',
    Packing: 'Packing started', Dispatched: 'Dispatched · stock issued', Invoiced: 'Invoice generated',
  };
  const who = [owner, owner, 'Employee 1', 'Employee 2', 'Employee 6', 'System'];
  o.trail = path.slice(0, upTo + 1).map((st, i) => tr(Math.min(createdAt + i * 85, NOW0 - 5), who[i] ?? owner, verbs[st]));
  return o;
}

function voucher(
  id: string, kind: Voucher['kind'], party: string, amount: number, dueIn: number,
  createdAt: number, paid = false, paidAt?: number, orderId?: string,
): Voucher {
  const trail = [tr(createdAt, 'System', kind === 'Purchase bill' ? 'Bill booked' : kind === 'Journal' ? 'Journal posted' : 'Invoice posted')];
  if (paid && paidAt !== undefined) trail.push(tr(paidAt, 'System', kind === 'Purchase bill' ? 'Payment made' : 'Payment received'));
  return { id, kind, party, amount, dueIn, paid, createdAt, paidAt, orderId, reminded: false, trail };
}

function ticket(
  id: string, customerId: string, subject: string, priority: Priority, status: TicketStatus,
  engineer: string | null, openedAt: number, extra: { resolvedAt?: number; visit?: string } = {},
): Ticket {
  const trail: TrailEntry[] = [tr(openedAt, 'System', 'Ticket logged')];
  if (engineer) trail.push(tr(openedAt + 12, 'System', `Assigned to ${engineer}`));
  if (status === 'Escalated') trail.push(tr(Math.min(openedAt + 40, NOW0 - 5), 'System', 'Escalated · SLA at risk'));
  if (extra.visit) trail.push(tr(openedAt + 30, engineer ?? 'System', `Visit scheduled · ${extra.visit}`));
  if (extra.resolvedAt !== undefined) trail.push(tr(extra.resolvedAt, engineer ?? 'System', 'Resolved'));
  return { id, customerId, subject, priority, status, engineer, openedAt, ...extra, trail };
}

function emp(
  id: string, name: string, dept: string, role: string, status: Employee['status'],
  opts: { pending?: Employee['pending']; onLeave?: Employee['onLeave']; bal?: Partial<Employee['balance']> } = {},
): Employee {
  const trail = [tr(at(-300, 9), 'System', 'Joined')];
  if (opts.onLeave) trail.push(tr(at(0, 7, 30), 'System', `${opts.onLeave.type} leave approved · ${opts.onLeave.days}d`));
  if (opts.pending) trail.push(tr(at(-1, 17), name, `Requested ${opts.pending.type.toLowerCase()} leave · ${opts.pending.days}d`));
  return {
    id, name, dept, role, status, pending: opts.pending ?? null, onLeave: opts.onLeave ?? null,
    balance: { Casual: 8, Earned: 12, Medical: 6, ...opts.bal }, trail,
  };
}

function report(id: string, name: string, kind: Report['kind'], schedule: Report['schedule'], lastRun: number, runs: number, users: number, recipients: number): Report {
  return { id, name, kind, schedule, lastRun, runs, users, recipients, trail: [tr(at(-40, 11), 'Employee 4', 'Report built')] };
}

function integration(
  id: string, name: string, dir: string, status: Integration['status'], records: number,
  every: string, latencyMs: number | null, lastSync: number, note: string,
): Integration {
  return { id, name, dir, status, records, every, latencyMs, lastSync, note, trail: [tr(lastSync, 'System', status === 'Paused' ? 'Integration paused' : 'Sync completed')] };
}

export function createSeed(): DemoState {
  const k = skus();
  const orders: Order[] = [
    order(k, 'SO-4821', 'c1', [['BRG-2201', 120], ['BLT-M12', 400], ['GSK-08', 60]], 'Dispatched', 'Employee 1', at(-2, 11)),
    order(k, 'SO-4820', 'c2', [['VLV-1104', 40]], 'Approval', 'Employee 2', at(0, 8, 20)),
    order(k, 'SO-4819', 'c3', [['FLT-0090', 200], ['GSK-12', 30]], 'Packing', 'Employee 1', at(-1, 15)),
    order(k, 'SO-4818', 'c4', [['PMP-C75', 8]], 'Invoiced', 'System', at(-4, 10), 'INV-9018'),
    order(k, 'SO-4817', 'c1', [['BRG-6306', 60], ['SEL-OR30', 20]], 'Confirmed', 'Employee 4', at(-1, 9, 30)),
    order(k, 'SO-4816', 'c4', [['PMP-C75', 12]], 'Invoiced', 'System', at(-10, 10), 'INV-9016'),
    order(k, 'SO-4815', 'c5', [['CVR-44', 25]], 'Quoted', 'Employee 4', at(0, 8, 44)),
    order(k, 'SO-4814', 'c6', [['MTR-3PH5', 3], ['BRG-2201', 40]], 'Confirmed', 'Employee 2', at(-1, 12)),
    order(k, 'SO-4813', 'c7', [['BLT-M12', 1000], ['BLT-M8', 2000], ['NUT-M12', 1000]], 'Quoted', 'Employee 1', at(0, 9, 5)),
    order(k, 'SO-4812', 'c8', [['VLV-2208', 12], ['VLV-0905', 20]], 'Dispatched', 'Employee 4', at(-3, 14)),
    order(k, 'SO-4811', 'c9', [['CVR-44', 6], ['FLT-0090', 50]], 'Packing', 'Employee 2', at(-1, 10)),
    order(k, 'SO-4810', 'c10', [['MTR-3PH5', 2]], 'Invoiced', 'System', at(-13, 10), 'INV-9010'),
    order(k, 'SO-4809', 'c3', [['BRG-6306', 40], ['GSK-12', 20]], 'Invoiced', 'System', at(-16, 10), 'INV-9009'),
  ];

  const vouchers: Voucher[] = [
    voucher('INV-9024', 'Sales invoice', 'Customer 2', 142500, 9, at(-1, 11)),
    voucher('INV-9021', 'Sales invoice', 'Customer 1', 284000, 0, at(-3, 14), true, at(0, 9, 12)),
    voucher('INV-9018', 'Sales invoice', 'Customer 4', 290000, 9, at(-2, 16), false, undefined, 'SO-4818'),
    voucher('INV-9016', 'Sales invoice', 'Customer 4', 435000, -4, at(-9, 12), false, undefined, 'SO-4816'),
    voucher('INV-9015', 'Sales invoice', 'Customer 6', 98200, -21, at(-33, 12)),
    voucher('INV-9012', 'Sales invoice', 'Customer 7', 61300, -38, at(-45, 12)),
    voucher('INV-9010', 'Sales invoice', 'Customer 10', 56800, -2, at(-12, 12), true, at(-6, 15), 'SO-4810'),
    voucher('INV-9009', 'Sales invoice', 'Customer 3', 46800, -3, at(-15, 12), true, at(-8, 11), 'SO-4809'),
    voucher('INV-9004', 'Sales invoice', 'Customer 8', 27400, -67, at(-80, 12)),
    voucher('BILL-455', 'Purchase bill', 'Supplier 1', 64500, 22, at(-4, 10)),
    voucher('BILL-452', 'Purchase bill', 'Supplier 2', 142000, 14, at(-6, 10)),
    voucher('BILL-447', 'Purchase bill', 'Supplier 3', 86400, -12, at(-27, 10)),
    voucher('BILL-441', 'Purchase bill', 'Supplier 4', 38900, -34, at(-49, 10)),
    voucher('BILL-438', 'Purchase bill', 'Supplier 3', 52000, -5, at(-40, 10), true, at(-8, 16)),
    voucher('JV-1188', 'Journal', 'Store 2 transfer', 24600, 0, at(-3, 17), true, at(-3, 17)),
  ];

  const tickets: Ticket[] = [
    ticket('TKT-7752', 'c1', 'AMC renewal quotation', 'Low', 'Open', null, at(0, 9, 10)),
    ticket('TKT-7750', 'c5', 'Gasket replacement request', 'Low', 'Open', null, at(0, 8, 40)),
    ticket('TKT-7749', 'c10', 'Bearing noise on line 3 motor', 'Medium', 'Open', 'Employee 7', at(-1, 11)),
    ticket('TKT-7748', 'c4', 'Quarterly AMC visit', 'Medium', 'Scheduled', 'Employee 4', at(0, 8, 25), { visit: '11:30 AM today' }),
    ticket('TKT-7747', 'c9', 'Calibration due on filling unit', 'Low', 'Open', 'Employee 4', at(-1, 9, 30)),
    ticket('TKT-7746', 'c7', 'Conveyor belt misaligned', 'Medium', 'Scheduled', 'Employee 3', at(-1, 16), { visit: '2:00 PM today' }),
    ticket('TKT-7745', 'c2', 'Valve actuator not responding', 'Critical', 'Escalated', 'Employee 7', at(0, 8, 5)),
    ticket('TKT-7743', 'c8', 'Pressure drop on line B', 'High', 'Open', 'Employee 2', at(0, 2, 50)),
    ticket('TKT-7742', 'c6', 'Motor overheating after restart', 'High', 'Open', 'Employee 3', at(0, 4, 10)),
    ticket('TKT-7741', 'c1', 'Pump seal leak at plant 2', 'High', 'Resolved', 'Employee 2', at(0, 5, 10), { resolvedAt: at(0, 9, 31) }),
    ticket('TKT-7751', 'c3', 'Oil filter supply query', 'Low', 'Resolved', 'Employee 4', at(-1, 15), { resolvedAt: at(0, 8, 30) }),
    ticket('TKT-7739', 'c2', 'Seal kit replacement', 'High', 'Resolved', 'Employee 3', at(-2, 11), { resolvedAt: at(-2, 16) }),
    ticket('TKT-7738', 'c4', 'Pump not priming', 'Critical', 'Resolved', 'Employee 7', at(-1, 10), { resolvedAt: at(-1, 13, 10) }),
  ];

  const employees: Employee[] = [
    emp('EMP-009', 'Employee 1', 'Admin', 'Sales Manager', 'Present'),
    emp('EMP-012', 'Employee 2', 'Store 1', 'Service Lead', 'Present'),
    emp('EMP-014', 'Employee 3', 'Store 1', 'Service Engineer', 'Present'),
    emp('EMP-018', 'Employee 4', 'Store 2', 'Sales Executive', 'Present'),
    emp('EMP-021', 'Employee 5', 'Store 1', 'Storekeeper', 'Present', { pending: { type: 'Earned', days: 3 } }),
    emp('EMP-023', 'Employee 6', 'Store 2', 'Dispatch Coordinator', 'Present'),
    emp('EMP-027', 'Employee 7', 'Store 2', 'Service Engineer', 'Present'),
    emp('EMP-029', 'Employee 8', 'Store 3', 'Storekeeper', 'Present', { pending: { type: 'Medical', days: 2 } }),
    emp('EMP-031', 'Employee 9', 'Store 1', 'Accounts Executive', 'On leave', { onLeave: { type: 'Casual', days: 1 } }),
    emp('EMP-033', 'Employee 10', 'Admin', 'HR & Payroll', 'Present', { pending: { type: 'Casual', days: 2 } }),
    emp('EMP-036', 'Employee 11', 'Store 2', 'Driver', 'Absent'),
    emp('EMP-040', 'Employee 12', 'Leadership', 'Finance Head', 'Present'),
    emp('EMP-044', 'Employee 13', 'Store 3', 'Storekeeper', 'On leave', { onLeave: { type: 'Medical', days: 3 } }),
    emp('EMP-002', 'Employee 14', 'Leadership', 'Director', 'Present'),
  ];

  const reports: Report[] = [
    report('MIS-01', 'Sales by party', 'sales', 'Hourly', at(0, 9, 38), 48, 12, 12),
    report('MIS-07', 'Stock ageing', 'stock', 'Daily 8am', at(0, 8), 31, 4, 4),
    report('MIS-15', 'Service SLA', 'sla', 'Every 2 hrs', at(0, 9, 41), 26, 6, 6),
    report('MIS-12', 'Receivables ageing', 'receivables', 'Daily 8am', at(0, 8), 18, 5, 5),
    report('MIS-20', 'Attendance by department', 'attendance', 'Daily 8am', at(0, 8, 2), 12, 3, 3),
    report('CUS-22', 'Custom — GST summary', 'gst', 'On demand', at(-2, 10), 6, 2, 2),
  ];

  const integrations: Integration[] = [
    integration('tally', 'Tally Prime', 'Export', 'Healthy', 1102, 'Every 15 min', 400, at(0, 9, 30), 'Vouchers post to Tally automatically.'),
    integration('bank', 'HDFC bank feed', 'Import', 'Healthy', 86, 'Daily', 1100, at(0, 8, 45), 'Bank entries reconcile against open invoices.'),
    integration('whatsapp', 'WhatsApp Business', 'Outbound', 'Limited', 412, 'On trigger', 900, at(0, 9, 0), 'Rate limit: 1,000 messages a day. Reminders fall back to email when paused.'),
    integration('einvoice', 'GST e-invoice', 'Outbound', 'Paused', 16, 'On trigger', null, at(0, 8, 10), 'Certificate expiring. Resume once the new certificate is installed.'),
    integration('portal', 'Customer portal', 'Inbound', 'Healthy', 54, 'Realtime', 200, at(0, 9, 41), 'Customers see orders and invoices live.'),
    integration('supplier', 'Supplier API', 'Import', 'Healthy', 28, 'Hourly', 600, at(0, 9, 5), 'Purchase orders reach suppliers by API.'),
  ];

  const feed = [
    { at: at(0, 9, 40), who: 'Employee 4', what: 'sent quotation SO-4815 · Customer 5', module: 'sales' as const, ref: { module: 'sales' as const, id: 'SO-4815' } },
    { at: at(0, 9, 38), who: 'System', what: 'stock sync completed · 16 SKUs', module: 'inventory' as const },
    { at: at(0, 9, 31), who: 'Employee 2', what: 'closed ticket TKT-7741', module: 'service' as const, ref: { module: 'service' as const, id: 'TKT-7741' } },
    { at: at(0, 9, 12), who: 'System', what: 'payment received · INV-9021', module: 'finance' as const, ref: { module: 'finance' as const, id: 'INV-9021' } },
    { at: at(0, 9, 0), who: 'System', what: 'WhatsApp rate limit reached · 412 sent', module: 'integrations' as const, ref: { module: 'integrations' as const, id: 'whatsapp' } },
    { at: at(0, 8, 47), who: 'Employee 2', what: 'marked GSK-08 out of stock', module: 'inventory' as const, ref: { module: 'inventory' as const, id: 'GSK-08' } },
    { at: at(0, 8, 20), who: 'Employee 2', what: 'raised SO-4820 · Customer 2', module: 'sales' as const, ref: { module: 'sales' as const, id: 'SO-4820' } },
    { at: at(0, 8, 2), who: 'System', what: 'attendance marked · 3 locations', module: 'people' as const },
  ].map((f, i) => ({ ...f, id: i + 1 }));

  return {
    now: NOW0,
    cash: 1240000,
    exports: 284,
    customers,
    skus: k,
    orders,
    tickets,
    employees,
    vouchers,
    reports,
    integrations,
    feed,
    movement: { received: 18, issued: 15, transferred: 4, adjusted: 1 },
    seq: { order: 4821, ticket: 7752, invoice: 9024, report: 22, feed: 100 },
  };
}
