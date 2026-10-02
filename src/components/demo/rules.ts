import type { DemoState, Order, OrderStage, Priority, Sku, Ticket, Voucher } from './types';

/* Business rules shared by the reducer, the selectors and the UI, so what a
   button says it will do is exactly what the reducer does. */

export const STAGES: OrderStage[] = ['Quoted', 'Approval', 'Confirmed', 'Packing', 'Dispatched', 'Invoiced'];
export const APPROVAL_LIMIT = 100000;
export const ENGINEERS = ['Ravi K.', 'Meera S.', 'Sandeep P.', 'Anjali D.'];
export const SLA_HOURS: Record<Priority, number> = { Critical: 2, High: 8, Medium: 24, Low: 72 };
export const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
export const VISIT_SLOTS = ['11:30 AM today', '2:00 PM today', '4:30 PM today', '10:00 AM tomorrow', '3:00 PM tomorrow'];

export const orderTotal = (o: Order) => o.lines.reduce((s, l) => s + l.qty * l.rate, 0);

export const customerOf = (s: DemoState, id: string) => s.customers.find((c) => c.id === id);
export const customerName = (s: DemoState, id: string) => customerOf(s, id)?.name ?? id;

export const isSalesInvoice = (v: Voucher) => v.kind === 'Sales invoice';
export const isBill = (v: Voucher) => v.kind === 'Purchase bill';

/** Unpaid sales invoices for one customer. */
export function outstanding(s: DemoState, party: string): number {
  return s.vouchers
    .filter((v) => isSalesInvoice(v) && !v.paid && v.party === party)
    .reduce((sum, v) => sum + v.amount, 0);
}

export function overCredit(s: DemoState, o: Order): boolean {
  const c = customerOf(s, o.customerId);
  if (!c) return false;
  return outstanding(s, c.name) + orderTotal(o) > c.creditLimit;
}

export function needsApproval(s: DemoState, o: Order): boolean {
  return orderTotal(o) >= APPROVAL_LIMIT || overCredit(s, o);
}

export function approvalReason(s: DemoState, o: Order): string {
  if (overCredit(s, o)) return 'over credit limit';
  if (orderTotal(o) >= APPROVAL_LIMIT) return 'value above ₹1,00,000';
  return '';
}

export function nextStage(s: DemoState, o: Order): OrderStage | null {
  switch (o.stage) {
    case 'Quoted': return needsApproval(s, o) ? 'Approval' : 'Confirmed';
    case 'Approval': return 'Confirmed';
    case 'Confirmed': return 'Packing';
    case 'Packing': return 'Dispatched';
    case 'Dispatched': return 'Invoiced';
    default: return null;
  }
}

export function nextLabel(s: DemoState, o: Order): string {
  switch (o.stage) {
    case 'Quoted': return needsApproval(s, o) ? 'Send for approval' : 'Confirm order';
    case 'Approval': return 'Approve order';
    case 'Confirmed': return 'Start packing';
    case 'Packing': return 'Dispatch & issue stock';
    case 'Dispatched': return 'Generate invoice';
    default: return '';
  }
}

export const canCancel = (o: Order) => ['Quoted', 'Approval', 'Confirmed', 'Packing'].includes(o.stage);
export const isOpenOrder = (o: Order) => o.stage !== 'Invoiced' && o.stage !== 'Cancelled';

export interface Shortage { sku: string; name: string; need: number; have: number }

export function shortages(s: DemoState, o: Order): Shortage[] {
  return o.lines
    .map((l) => ({ sku: l.sku, name: l.name, need: l.qty, have: s.skus.find((k) => k.sku === l.sku)?.onHand ?? 0 }))
    .filter((x) => x.have < x.need);
}

/** Units of a SKU promised to open orders that have not shipped yet. */
export function demand(s: DemoState, sku: string): number {
  return s.orders
    .filter((o) => ['Quoted', 'Approval', 'Confirmed', 'Packing'].includes(o.stage))
    .reduce((sum, o) => sum + o.lines.filter((l) => l.sku === sku).reduce((a, l) => a + l.qty, 0), 0);
}

export function skuStatus(k: Sku): 'In stock' | 'Low stock' | 'Out of stock' {
  if (k.onHand <= 0) return 'Out of stock';
  if (k.onHand <= k.reorderAt) return 'Low stock';
  return 'In stock';
}

export const suggestedPo = (k: Sku) => Math.max(k.reorderAt * 3 - k.onHand, k.reorderAt);

export function ageBucket(d: number): string {
  if (d <= 30) return '0–30 days';
  if (d <= 60) return '31–60 days';
  if (d <= 90) return '61–90 days';
  return '90+ days';
}
export const AGE_BUCKETS = ['0–30 days', '31–60 days', '61–90 days', '90+ days'];

export type SlaState = 'ok' | 'risk' | 'breached' | 'met' | 'missed';

export function slaInfo(t: Ticket, now: number): { state: SlaState; left: number } {
  const total = SLA_HOURS[t.priority] * 60;
  const due = t.openedAt + total;
  if (t.status === 'Resolved') {
    const done = t.resolvedAt ?? now;
    return { state: done <= due ? 'met' : 'missed', left: due - done };
  }
  const left = due - now;
  if (left < 0) return { state: 'breached', left };
  if (left < total * 0.25) return { state: 'risk', left };
  return { state: 'ok', left };
}

export type VoucherState = 'Paid' | 'Due' | 'Overdue' | 'Posted';

export function voucherState(v: Voucher): VoucherState {
  if (v.kind === 'Journal') return 'Posted';
  if (v.paid) return 'Paid';
  return v.dueIn < 0 ? 'Overdue' : 'Due';
}

export function dueBucket(v: Voucher): string {
  if (v.dueIn >= 0) return 'Not due';
  const d = -v.dueIn;
  if (d <= 30) return '1–30 days';
  if (d <= 60) return '31–60 days';
  return '60+ days';
}
export const DUE_BUCKETS = ['Not due', '1–30 days', '31–60 days', '60+ days'];
