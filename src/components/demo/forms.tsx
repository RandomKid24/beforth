import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { DemoState, LeaveType, Order, Priority, Ref, ReportKind, Schedule } from './types';
import type { Action } from './store';
import {
  PRIORITIES, SLA_HOURS, approvalReason, customerOf, needsApproval, orderTotal, outstanding, skuStatus, suggestedPo,
} from './rules';
import { inr, lakh, rupees } from './format';
import { Btn, Field, Overlay, inputCls } from './ui';

export type FormKind = 'order' | 'receive' | 'ticket' | 'leave' | 'invoice' | 'report';

export interface FormCtx {
  s: DemoState;
  dispatch: (a: Action) => void;
  close: () => void;
  /** Called with the new record so the dashboard can jump to it. */
  created: (r: Ref) => void;
  preset?: string;
}

const toInt = (v: string) => (/^\d+$/.test(v.trim()) ? parseInt(v.trim(), 10) : NaN);

function FormShell({
  title, subtitle, submit, canSubmit, onSubmit, close, children,
}: {
  title: string; subtitle?: string; submit: string; canSubmit: boolean; onSubmit: () => void; close: () => void; children: React.ReactNode;
}) {
  return (
    <Overlay
      kind="modal"
      title={title}
      subtitle={subtitle}
      onClose={close}
      footer={
        <>
          <Btn onClick={close}>Cancel</Btn>
          <Btn variant="primary" type="submit" form="demo-form" disabled={!canSubmit}>{submit}</Btn>
        </>
      }
    >
      <form
        id="demo-form"
        className="p-5 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) onSubmit();
        }}
      >
        {children}
      </form>
    </Overlay>
  );
}

/* ------------------------------ New order ------------------------------ */

function OrderForm({ s, dispatch, close, created }: FormCtx) {
  const [customerId, setCustomerId] = useState(s.customers[0].id);
  const [lines, setLines] = useState<{ sku: string; qty: string }[]>([{ sku: s.skus[0].sku, qty: '10' }]);

  const parsed = lines.map((l) => ({ sku: l.sku, qty: toInt(l.qty) }));
  const valid = parsed.length > 0 && parsed.every((l) => l.qty >= 1) && new Set(parsed.map((l) => l.sku)).size === parsed.length;

  const preview: Order | null = !valid ? null : {
    id: 'preview', customerId, stage: 'Quoted', owner: 'You', createdAt: s.now, trail: [],
    lines: parsed.map((l) => {
      const k = s.skus.find((x) => x.sku === l.sku)!;
      return { sku: k.sku, name: k.name, qty: l.qty, rate: k.rate };
    }),
  };

  const cust = customerOf(s, customerId)!;
  const total = preview ? orderTotal(preview) : 0;
  const owed = outstanding(s, cust.name);
  const approval = preview ? needsApproval(s, preview) : false;

  const setLine = (i: number, patch: Partial<{ sku: string; qty: string }>) =>
    setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  return (
    <FormShell
      title="New order"
      subtitle="Creates a quotation you can confirm, pack, dispatch and invoice."
      submit="Create order"
      canSubmit={valid}
      close={close}
      onSubmit={() => {
        const id = `SO-${s.seq.order + 1}`;
        dispatch({ type: 'createOrder', customerId, lines: parsed });
        created({ module: 'sales', id });
      }}
    >
      <Field label="Customer" hint={`${cust.city} · credit limit ${lakh(cust.creditLimit)} · ${rupees(owed)} outstanding`}>
        {(id) => (
          <select id={id} data-autofocus className={inputCls} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            {s.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </Field>

      <div className="flex flex-col gap-2.5">
        <p className="text-[11.5px] font-medium text-ink/80">Items</p>
        {lines.map((l, i) => {
          const k = s.skus.find((x) => x.sku === l.sku)!;
          const q = toInt(l.qty);
          const short = q >= 1 && q > k.onHand;
          return (
            <div key={i} className="grid grid-cols-[1fr_5.5rem_auto] gap-2 items-start">
              <div>
                <select aria-label={`Item ${i + 1}`} className={inputCls} value={l.sku} onChange={(e) => setLine(i, { sku: e.target.value })}>
                  {s.skus.map((x) => <option key={x.sku} value={x.sku}>{x.sku} — {x.name}</option>)}
                </select>
                <p className={`text-[11.5px] mt-1 ${short ? 'text-amber-700' : 'text-ash'}`}>
                  {rupees(k.rate)} each · {inr(k.onHand)} in stock{short ? ` — ${inr(q - k.onHand)} short, you can still quote it` : ''}
                </p>
              </div>
              <input aria-label={`Quantity ${i + 1}`} inputMode="numeric" className={inputCls} value={l.qty} onChange={(e) => setLine(i, { qty: e.target.value })} />
              <button
                type="button"
                aria-label={`Remove item ${i + 1}`}
                disabled={lines.length === 1}
                onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))}
                className="w-10 min-h-[40px] flex items-center justify-center border border-ink/15 text-ash hover:text-red-600 hover:border-red-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
        {lines.length < 5 && (
          <Btn size="sm" className="self-start" onClick={() => setLines((ls) => [...ls, { sku: s.skus.find((k) => !ls.some((l) => l.sku === k.sku))?.sku ?? s.skus[0].sku, qty: '1' }])}>
            <Plus className="w-3.5 h-3.5" /> Add item
          </Btn>
        )}
        {!valid && parsed.some((l) => !(l.qty >= 1)) && <p className="text-[11.5px] text-red-600">Enter a whole-number quantity for every item.</p>}
        {new Set(parsed.map((l) => l.sku)).size !== parsed.length && <p className="text-[11.5px] text-red-600">Each item can appear once — combine the quantities.</p>}
      </div>

      <div className="border border-ink/12 bg-bone/40 p-3.5 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[12px] text-ash">Order total</span>
          <span className="text-[17px] font-semibold tabular-nums">{rupees(total)}</span>
        </div>
        {preview && (
          <p className="text-[11.5px] text-ash">
            {approval ? `Will need approval: ${approvalReason(s, preview)}.` : 'No approval needed — you can confirm it straight away.'}
          </p>
        )}
      </div>
    </FormShell>
  );
}

/* ------------------------------ Receive stock ------------------------------ */

function ReceiveForm({ s, dispatch, close, created, preset }: FormCtx) {
  const firstNeed = s.skus.find((k) => skuStatus(k) !== 'In stock')?.sku ?? s.skus[0].sku;
  const [sku, setSku] = useState(preset ?? firstNeed);
  const k = s.skus.find((x) => x.sku === sku)!;
  const [qty, setQty] = useState(String(k.onOrder ? k.poQty : suggestedPo(k)));
  const q = toInt(qty);

  return (
    <FormShell
      title="Receive stock"
      subtitle="Book goods in against an item — a raised purchase order pre-fills the quantity."
      submit="Receive stock"
      canSubmit={q >= 1}
      close={close}
      onSubmit={() => {
        dispatch({ type: 'receiveStock', sku, qty: q });
        created({ module: 'inventory', id: sku });
      }}
    >
      <Field label="Item" hint={`${inr(k.onHand)} on hand · reorder at ${inr(k.reorderAt)} · ${skuStatus(k)}${k.onOrder ? ` · PO of ${inr(k.poQty)} raised` : ''}`}>
        {(id) => (
          <select
            id={id}
            data-autofocus
            className={inputCls}
            value={sku}
            onChange={(e) => {
              const next = s.skus.find((x) => x.sku === e.target.value)!;
              setSku(next.sku);
              setQty(String(next.onOrder ? next.poQty : suggestedPo(next)));
            }}
          >
            {s.skus.map((x) => <option key={x.sku} value={x.sku}>{x.sku} — {x.name} ({skuStatus(x)})</option>)}
          </select>
        )}
      </Field>
      <Field label="Quantity received" hint={q >= 1 ? `On hand will become ${inr(k.onHand + q)}.` : 'Enter a whole number.'}>
        {(id) => <input id={id} inputMode="numeric" className={inputCls} value={qty} onChange={(e) => setQty(e.target.value)} />}
      </Field>
    </FormShell>
  );
}

/* ------------------------------ New ticket ------------------------------ */

function TicketForm({ s, dispatch, close, created }: FormCtx) {
  const [customerId, setCustomerId] = useState(s.customers[0].id);
  const [priority, setPriority] = useState<Priority>('Medium');
  const [subject, setSubject] = useState('');

  return (
    <FormShell
      title="Log a service ticket"
      subtitle="The SLA clock starts as soon as the ticket is logged."
      submit="Log ticket"
      canSubmit={subject.trim().length >= 3}
      close={close}
      onSubmit={() => {
        const id = `TKT-${s.seq.ticket + 1}`;
        dispatch({ type: 'createTicket', customerId, subject, priority });
        created({ module: 'service', id });
      }}
    >
      <Field label="Customer">
        {(id) => (
          <select id={id} data-autofocus className={inputCls} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            {s.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </Field>
      <Field label="What is the problem?">
        {(id) => <input id={id} className={inputCls} value={subject} placeholder="e.g. Pump seal leaking at plant 2" onChange={(e) => setSubject(e.target.value)} />}
      </Field>
      <div>
        <p className="text-[11.5px] font-medium text-ink/80 mb-1.5">Priority</p>
        <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Priority">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={priority === p}
              onClick={() => setPriority(p)}
              className={`border min-h-[44px] px-2 text-center transition-colors ${priority === p ? 'bg-ink text-paper border-ink' : 'bg-white border-ink/20 hover:border-ink/50'}`}
            >
              <span className="block text-[12.5px] font-medium">{p}</span>
              <span className={`block text-[10.5px] ${priority === p ? 'text-paper/70' : 'text-ash'}`}>{SLA_HOURS[p]}h SLA</span>
            </button>
          ))}
        </div>
      </div>
    </FormShell>
  );
}

/* ------------------------------ Apply leave ------------------------------ */

function LeaveForm({ s, dispatch, close, created, preset }: FormCtx) {
  const eligible = s.employees.filter((e) => !e.pending && !e.onLeave);
  const [empId, setEmpId] = useState(preset && eligible.some((e) => e.id === preset) ? preset : eligible[0]?.id ?? '');
  const [type, setType] = useState<LeaveType>('Casual');
  const [days, setDays] = useState('1');
  const e = s.employees.find((x) => x.id === empId);
  const d = toInt(days);
  const bal = e ? e.balance[type] : 0;

  return (
    <FormShell
      title="Apply for leave"
      subtitle="The request waits for approval before it counts."
      submit="Request leave"
      canSubmit={!!e && d >= 1 && d <= bal}
      close={close}
      onSubmit={() => {
        dispatch({ type: 'applyLeave', id: empId, leave: { type, days: d } });
        created({ module: 'people', id: empId });
      }}
    >
      <Field label="Employee" hint={eligible.length === s.employees.length ? undefined : 'People who are on leave or already have a request pending are not listed.'}>
        {(id) => (
          <select id={id} data-autofocus className={inputCls} value={empId} onChange={(ev) => setEmpId(ev.target.value)}>
            {eligible.map((x) => <option key={x.id} value={x.id}>{x.name} — {x.dept}</option>)}
          </select>
        )}
      </Field>
      <div className="grid grid-cols-[1fr_6.5rem] gap-3">
        <Field label="Leave type" hint={e ? `${bal} days available` : undefined}>
          {(id) => (
            <select id={id} className={inputCls} value={type} onChange={(ev) => setType(ev.target.value as LeaveType)}>
              {(['Casual', 'Earned', 'Medical'] as LeaveType[]).map((t) => <option key={t}>{t}</option>)}
            </select>
          )}
        </Field>
        <Field label="Days">
          {(id) => <input id={id} inputMode="numeric" className={inputCls} value={days} onChange={(ev) => setDays(ev.target.value)} />}
        </Field>
      </div>
      {d > bal && <p className="text-[11.5px] text-red-600 -mt-2">That is more than the {bal} {type.toLowerCase()} days available.</p>}
    </FormShell>
  );
}

/* ------------------------------ New invoice ------------------------------ */

function InvoiceForm({ s, dispatch, close, created }: FormCtx) {
  const [customerId, setCustomerId] = useState(s.customers[0].id);
  const [amount, setAmount] = useState('');
  const [dueIn, setDueIn] = useState(30);
  const a = toInt(amount.replace(/,/g, ''));
  const cust = customerOf(s, customerId)!;
  const owed = outstanding(s, cust.name);

  return (
    <FormShell
      title="New invoice"
      subtitle="Posts a sales invoice straight to receivables."
      submit="Post invoice"
      canSubmit={a >= 1}
      close={close}
      onSubmit={() => {
        const id = `INV-${s.seq.invoice + 1}`;
        dispatch({ type: 'createInvoice', customerId, amount: a, dueIn });
        created({ module: 'finance', id });
      }}
    >
      <Field label="Customer" hint={`${rupees(owed)} outstanding today`}>
        {(id) => (
          <select id={id} data-autofocus className={inputCls} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            {s.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </Field>
      <div className="grid grid-cols-[1fr_9rem] gap-3">
        <Field label="Amount (₹)" hint={a >= 1 ? rupees(a) : undefined}>
          {(id) => <input id={id} inputMode="numeric" className={inputCls} value={amount} placeholder="e.g. 85000" onChange={(e) => setAmount(e.target.value)} />}
        </Field>
        <Field label="Payment terms">
          {(id) => (
            <select id={id} className={inputCls} value={dueIn} onChange={(e) => setDueIn(Number(e.target.value))}>
              {[15, 30, 45].map((d) => <option key={d} value={d}>{d} days</option>)}
            </select>
          )}
        </Field>
      </div>
    </FormShell>
  );
}

/* ------------------------------ New report ------------------------------ */

const TEMPLATES: { kind: ReportKind; label: string }[] = [
  { kind: 'sales', label: 'Sales by customer' },
  { kind: 'stock', label: 'Stock ageing' },
  { kind: 'sla', label: 'Service SLA by priority' },
  { kind: 'receivables', label: 'Receivables by customer' },
  { kind: 'attendance', label: 'Attendance by department' },
  { kind: 'gst', label: 'GST summary' },
];

function ReportForm({ s, dispatch, close, created }: FormCtx) {
  const [kind, setKind] = useState<ReportKind>('sales');
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState<Schedule>('On demand');
  const label = TEMPLATES.find((t) => t.kind === kind)!.label;
  const finalName = name.trim() || label;

  return (
    <FormShell
      title="Build a report"
      subtitle="Pick what to measure — it runs on live data every time."
      submit="Build report"
      canSubmit
      close={close}
      onSubmit={() => {
        const id = `CUS-${s.seq.report + 1}`;
        dispatch({ type: 'createReport', name: finalName, kind, schedule });
        created({ module: 'reports', id });
      }}
    >
      <Field label="Based on">
        {(id) => (
          <select id={id} data-autofocus className={inputCls} value={kind} onChange={(e) => setKind(e.target.value as ReportKind)}>
            {TEMPLATES.map((t) => <option key={t.kind} value={t.kind}>{t.label}</option>)}
          </select>
        )}
      </Field>
      <Field label="Report name" hint={`Leave blank to use “${label}”.`}>
        {(id) => <input id={id} className={inputCls} value={name} placeholder={label} onChange={(e) => setName(e.target.value)} />}
      </Field>
      <Field label="Send automatically">
        {(id) => (
          <select id={id} className={inputCls} value={schedule} onChange={(e) => setSchedule(e.target.value as Schedule)}>
            {(['On demand', 'Hourly', 'Every 2 hrs', 'Daily 8am'] as Schedule[]).map((x) => <option key={x}>{x}</option>)}
          </select>
        )}
      </Field>
    </FormShell>
  );
}

export default function FormDialog({ kind, ...ctx }: FormCtx & { kind: FormKind }) {
  switch (kind) {
    case 'order': return <OrderForm {...ctx} />;
    case 'receive': return <ReceiveForm {...ctx} />;
    case 'ticket': return <TicketForm {...ctx} />;
    case 'leave': return <LeaveForm {...ctx} />;
    case 'invoice': return <InvoiceForm {...ctx} />;
    case 'report': return <ReportForm {...ctx} />;
  }
}
