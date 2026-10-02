export type ModuleId =
  | 'overview'
  | 'sales'
  | 'inventory'
  | 'service'
  | 'people'
  | 'finance'
  | 'reports'
  | 'integrations';

export type Tone = 'blue' | 'amber' | 'green' | 'red' | 'grey';

export interface Ref {
  module: ModuleId;
  id: string;
}

export interface TrailEntry {
  at: number;
  who: string;
  what: string;
}

export interface FeedEntry {
  id: number;
  at: number;
  who: string;
  what: string;
  module: ModuleId;
  ref?: Ref;
}

export interface Customer {
  id: string;
  name: string;
  city: string;
  creditLimit: number;
}

export interface Sku {
  sku: string;
  name: string;
  category: string;
  store: string;
  rate: number;
  onHand: number;
  reorderAt: number;
  ageDays: number;
  leadDays: number;
  onOrder: boolean;
  poQty: number;
  trail: TrailEntry[];
}

export type OrderStage =
  | 'Quoted'
  | 'Approval'
  | 'Confirmed'
  | 'Packing'
  | 'Dispatched'
  | 'Invoiced'
  | 'Cancelled';

export interface OrderLine {
  sku: string;
  name: string;
  qty: number;
  rate: number;
}

export interface Order {
  id: string;
  customerId: string;
  lines: OrderLine[];
  stage: OrderStage;
  owner: string;
  createdAt: number;
  invoiceId?: string;
  trail: TrailEntry[];
}

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 'Open' | 'Scheduled' | 'Escalated' | 'Resolved';

export interface Ticket {
  id: string;
  customerId: string;
  subject: string;
  priority: Priority;
  status: TicketStatus;
  engineer: string | null;
  openedAt: number;
  resolvedAt?: number;
  visit?: string;
  trail: TrailEntry[];
}

export type EmpStatus = 'Present' | 'On leave' | 'Absent';
export type LeaveType = 'Casual' | 'Earned' | 'Medical';

export interface LeaveRequest {
  type: LeaveType;
  days: number;
}

export interface Employee {
  id: string;
  name: string;
  dept: string;
  role: string;
  status: EmpStatus;
  balance: Record<LeaveType, number>;
  pending: LeaveRequest | null;
  onLeave: LeaveRequest | null;
  trail: TrailEntry[];
}

export type VoucherKind = 'Sales invoice' | 'Purchase bill' | 'Journal';

export interface Voucher {
  id: string;
  kind: VoucherKind;
  party: string;
  amount: number;
  /** Days until due; negative means overdue. */
  dueIn: number;
  paid: boolean;
  createdAt: number;
  paidAt?: number;
  orderId?: string;
  reminded: boolean;
  trail: TrailEntry[];
}

export type Schedule = 'Hourly' | 'Every 2 hrs' | 'Daily 8am' | 'On demand';
export type ReportKind = 'sales' | 'stock' | 'sla' | 'receivables' | 'attendance' | 'gst';

export interface Report {
  id: string;
  name: string;
  kind: ReportKind;
  schedule: Schedule;
  lastRun: number;
  runs: number;
  users: number;
  recipients: number;
  trail: TrailEntry[];
}

export type IntStatus = 'Healthy' | 'Limited' | 'Paused';

export interface Integration {
  id: string;
  name: string;
  dir: string;
  status: IntStatus;
  records: number;
  every: string;
  latencyMs: number | null;
  lastSync: number;
  note: string;
  trail: TrailEntry[];
}

export interface DemoState {
  /** Demo clock, in minutes. 0 is midnight today. */
  now: number;
  cash: number;
  exports: number;
  customers: Customer[];
  skus: Sku[];
  orders: Order[];
  tickets: Ticket[];
  employees: Employee[];
  vouchers: Voucher[];
  reports: Report[];
  integrations: Integration[];
  feed: FeedEntry[];
  movement: { received: number; issued: number; transferred: number; adjusted: number };
  seq: { order: number; ticket: number; invoice: number; report: number; feed: number };
}
