import React, { useState } from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { rupees } from '../demo/format';

interface Item { id: string; name: string; price: number; gst: number }

const ITEMS: Item[] = [
  { id: 'croissant', name: 'Butter croissant', price: 90, gst: 5 },
  { id: 'sourdough', name: 'Sourdough loaf', price: 220, gst: 5 },
  { id: 'truffle', name: 'Chocolate truffle', price: 180, gst: 5 },
  { id: 'coffee', name: 'Filter coffee', price: 80, gst: 5 },
  { id: 'cold', name: 'Cold coffee', price: 140, gst: 5 },
  { id: 'puff', name: 'Veg puff', price: 45, gst: 5 },
  { id: 'brownie', name: 'Walnut brownie', price: 110, gst: 5 },
  { id: 'hamper', name: 'Gift hamper', price: 850, gst: 18 },
];
const STOCK0: Record<string, number> = { croissant: 12, sourdough: 8, truffle: 14, coffee: 40, cold: 22, puff: 9, brownie: 6, hamper: 4 };
const PAY = ['Cash', 'UPI', 'Card'] as const;

export default function PosPreview() {
  const [cart, setCart] = useState<Record<string, number>>({ croissant: 2, coffee: 2 });
  const [stock, setStock] = useState(STOCK0);
  const [pay, setPay] = useState<(typeof PAY)[number]>('UPI');
  const [bill, setBill] = useState(1042);
  const [receipt, setReceipt] = useState<{ no: number; lines: [string, number, number][]; sub: number; gst: number; total: number; pay: string } | null>(null);

  const lines = ITEMS.filter((i) => cart[i.id]).map((i) => ({ ...i, qty: cart[i.id] }));
  const sub = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const gst = lines.reduce((a, l) => a + (l.price * l.qty * l.gst) / 100, 0);
  const total = Math.round(sub + gst);

  const add = (id: string, d: number) => setCart((c) => {
    const qty = Math.max(0, Math.min((c[id] ?? 0) + d, stock[id]));
    const next = { ...c, [id]: qty };
    if (!qty) delete next[id];
    return next;
  });

  const charge = () => {
    if (!lines.length) return;
    setReceipt({ no: bill, lines: lines.map((l) => [l.name, l.qty, l.price * l.qty]), sub, gst, total, pay });
    setStock((s) => { const n = { ...s }; lines.forEach((l) => { n[l.id] -= l.qty; }); return n; });
    setBill(bill + 1);
    setCart({});
  };

  return (
    <div className="grid md:grid-cols-[1.5fr_1fr] gap-3 max-w-[780px] mx-auto">
      <div className="bg-white border border-ink/10">
        <div className="px-3.5 py-2.5 border-b border-ink/10 flex items-center justify-between">
          <p className="text-[12px] font-semibold">Counter 1 · Crumble Bakery, College Road</p>
          <p className="text-[10.5px] text-ash">Tap to add</p>
        </div>
        <div className="p-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ITEMS.map((it) => {
            const left = stock[it.id], inCart = cart[it.id] ?? 0;
            return (
              <button
                key={it.id}
                type="button"
                disabled={left - inCart <= 0}
                onClick={() => add(it.id, 1)}
                className={`relative text-left border p-2.5 min-h-[76px] transition-colors disabled:opacity-40 disabled:pointer-events-none ${inCart ? 'border-signal bg-signal/[0.06]' : 'border-ink/12 hover:border-ink/40'}`}
              >
                {inCart > 0 && <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-signal text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">{inCart}</span>}
                <span className="block text-[11.5px] font-medium leading-tight pr-5">{it.name}</span>
                <span className="block text-[12.5px] tabular-nums mt-1.5">{rupees(it.price)}</span>
                <span className={`block text-[10px] mt-0.5 ${left <= 5 ? 'text-amber-700 font-medium' : 'text-ash'}`}>{left === 0 ? 'Sold out' : left <= 5 ? `Only ${left} left` : `${left} in stock`}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-ink/10 flex flex-col">
        {receipt ? (
          <div className="p-3.5 flex-1 flex flex-col text-[12px]">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold"><Check className="w-4 h-4" strokeWidth={3} /> Paid · {receipt.pay}</div>
            <p className="text-[10.5px] text-ash mt-0.5 mb-2.5">Bill B-{receipt.no} · 9:42 AM</p>
            <div className="border-y border-dashed border-ink/25 py-2 flex flex-col gap-1">
              {receipt.lines.map(([n, q, v]) => <div key={n} className="flex justify-between"><span>{n} × {q}</span><span className="tabular-nums">{rupees(v)}</span></div>)}
            </div>
            <div className="pt-2 flex flex-col gap-0.5">
              <div className="flex justify-between text-ash"><span>Subtotal</span><span className="tabular-nums">{rupees(receipt.sub)}</span></div>
              <div className="flex justify-between text-ash"><span>GST</span><span className="tabular-nums">{rupees(receipt.gst)}</span></div>
              <div className="flex justify-between text-[14px] font-semibold mt-1"><span>Total</span><span className="tabular-nums">{rupees(receipt.total)}</span></div>
            </div>
            <p className="text-[10.5px] text-ash mt-2.5">Stock updated across the outlet. Receipt sent by WhatsApp.</p>
            <button type="button" onClick={() => setReceipt(null)} className="mt-auto min-h-[38px] bg-ink text-paper text-[12.5px] font-medium hover:bg-signal transition-colors">New bill</button>
          </div>
        ) : (
          <div className="p-3.5 flex-1 flex flex-col">
            <p className="text-[12px] font-semibold mb-2">Bill B-{bill}</p>
            <div className="flex-1 min-h-[100px] flex flex-col gap-2">
              {lines.length === 0 && <p className="text-[12px] text-ash py-6 text-center">Cart is empty. Tap an item.</p>}
              {lines.map((l) => (
                <div key={l.id} className="flex items-center gap-2">
                  <span className="flex-1 min-w-0"><span className="block text-[12px] leading-tight truncate">{l.name}</span><span className="block text-[10.5px] text-ash">{rupees(l.price)} · GST {l.gst}%</span></span>
                  <span className="flex items-center border border-ink/15">
                    <button type="button" aria-label={`Remove one ${l.name}`} onClick={() => add(l.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-ink/[0.06]"><Minus className="w-3 h-3" /></button>
                    <span className="w-6 text-center text-[11.5px] tabular-nums">{l.qty}</span>
                    <button type="button" aria-label={`Add one ${l.name}`} onClick={() => add(l.id, 1)} disabled={l.qty >= stock[l.id]} className="w-6 h-6 flex items-center justify-center hover:bg-ink/[0.06] disabled:opacity-30"><Plus className="w-3 h-3" /></button>
                  </span>
                  <span className="w-14 text-right text-[12px] tabular-nums">{rupees(l.price * l.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-ink/10 pt-2.5 mt-2 flex flex-col gap-0.5 text-[12px]">
              <div className="flex justify-between text-ash"><span>Subtotal</span><span className="tabular-nums">{rupees(sub)}</span></div>
              <div className="flex justify-between text-ash"><span>GST</span><span className="tabular-nums">{rupees(gst)}</span></div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mt-2.5" role="radiogroup" aria-label="Payment method">
              {PAY.map((p) => (
                <button key={p} type="button" role="radio" aria-checked={pay === p} onClick={() => setPay(p)} className={`min-h-[30px] text-[11.5px] border transition-colors ${pay === p ? 'bg-ink text-paper border-ink' : 'bg-white border-ink/20 hover:border-ink/50'}`}>{p}</button>
              ))}
            </div>
            <button type="button" onClick={charge} disabled={!lines.length} className="mt-2.5 min-h-[40px] bg-signal text-white text-[13px] font-medium hover:bg-signal-deep transition-colors disabled:opacity-40 disabled:pointer-events-none">
              Charge {rupees(total)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
