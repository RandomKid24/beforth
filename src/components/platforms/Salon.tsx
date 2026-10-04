import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Tile } from './chrome';
import { rupees } from '../demo/format';

type Status = 'booked' | 'inchair' | 'billed';
interface Appt { id: number; s: number; start: number; len: number; service: string; client: string; price: number; status: Status }

const STYLISTS = [
  { name: 'Stylist 1', role: 'Senior stylist' },
  { name: 'Stylist 2', role: 'Beauty therapist' },
  { name: 'Stylist 3', role: 'Barber' },
];

const SEED: Appt[] = [
  { id: 1, s: 0, start: 0, len: 3, service: 'Haircut & styling', client: 'Client 1', price: 900, status: 'billed' },
  { id: 2, s: 0, start: 4, len: 4, service: 'Hair colour', client: 'Client 2', price: 3200, status: 'inchair' },
  { id: 3, s: 0, start: 9, len: 2, service: 'Blow dry', client: 'Client 3', price: 600, status: 'booked' },
  { id: 4, s: 1, start: 1, len: 3, service: 'Facial', client: 'Client 4', price: 1800, status: 'billed' },
  { id: 5, s: 1, start: 5, len: 2, service: 'Manicure', client: 'Client 5', price: 700, status: 'booked' },
  { id: 6, s: 1, start: 8, len: 3, service: 'Bridal trial', client: 'Client 6', price: 4500, status: 'booked' },
  { id: 7, s: 2, start: 0, len: 2, service: 'Beard trim', client: 'Client 7', price: 350, status: 'billed' },
  { id: 8, s: 2, start: 3, len: 3, service: 'Haircut', client: 'Client 8', price: 500, status: 'inchair' },
  { id: 9, s: 2, start: 7, len: 2, service: 'Hair spa', client: 'Client 9', price: 1500, status: 'booked' },
];

const ROWS = 12; // half-hours from 10:00 AM to 4:00 PM
const ROW_H = 26;
const NOW = 4; // 12:00 PM
const NEXT: Record<Status, Status> = { booked: 'inchair', inchair: 'billed', billed: 'billed' };
const LABEL: Record<Status, string> = { booked: 'Booked', inchair: 'In chair', billed: 'Billed' };

const hourLabel = (row: number) => {
  const h = 10 + Math.floor(row / 2);
  return `${h > 12 ? h - 12 : h} ${h >= 12 ? 'PM' : 'AM'}`;
};

export default function SalonPreview() {
  const [appts, setAppts] = useState<Appt[]>(SEED);
  const [picked, setPicked] = useState<number | null>(2);

  const sum = (st: Status[]) => appts.filter((a) => st.includes(a.status)).reduce((x, a) => x + a.price, 0);
  const billed = sum(['billed']);
  const pending = sum(['booked', 'inchair']);
  const inChair = appts.filter((a) => a.status === 'inchair').length;
  const util = Math.round((appts.reduce((x, a) => x + a.len, 0) / (ROWS * STYLISTS.length)) * 100);
  const sel = appts.find((a) => a.id === picked) ?? null;

  const bump = (id: number) => setAppts((list) => list.map((a) => (a.id === id ? { ...a, status: NEXT[a.status] } : a)));
  const billNext = () => {
    const target = appts.filter((a) => a.status === 'inchair').sort((a, b) => a.start - b.start)[0] ?? appts.filter((a) => a.status === 'booked').sort((a, b) => a.start - b.start)[0];
    if (target) { bump(target.id); setPicked(target.id); }
  };

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-5 items-start justify-center">
      <div className="flex-1 min-w-[300px] max-w-[470px] bg-white border border-ink/10">
        <div className="px-3 py-2 border-b border-ink/10 flex items-center justify-between">
          <p className="text-[12px] font-semibold">Today · Branch 1</p>
          <p className="text-[10.5px] text-ash">Tap an appointment to move it along</p>
        </div>
        <div className="grid grid-cols-[2.6rem_repeat(3,1fr)] text-[11px]">
          <div />
          {STYLISTS.map((st) => (
            <div key={st.name} className="px-2 py-1.5 border-l border-ink/10">
              <p className="font-medium leading-tight">{st.name}</p>
              <p className="text-[10px] text-ash leading-tight">{st.role}</p>
            </div>
          ))}
        </div>
        <div className="relative grid grid-cols-[2.6rem_repeat(3,1fr)] border-t border-ink/10" style={{ height: ROWS * ROW_H }}>
          <div className="relative">
            {Array.from({ length: ROWS / 2 }).map((_, i) => (
              <span key={i} className="absolute left-0 right-1 -translate-y-1/2 text-right text-[9.5px] text-ash tabular-nums" style={{ top: i * 2 * ROW_H + 8 }}>{hourLabel(i * 2)}</span>
            ))}
          </div>
          {STYLISTS.map((st, si) => (
            <div
              key={st.name}
              className="relative border-l border-ink/10"
              style={{ backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${ROW_H * 2 - 1}px, rgba(35,31,32,0.07) ${ROW_H * 2 - 1}px, rgba(35,31,32,0.07) ${ROW_H * 2}px)` }}
            >
              {appts.filter((a) => a.s === si).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => { setPicked(a.id); bump(a.id); }}
                  aria-label={`${a.service} for ${a.client}, ${LABEL[a.status]}, ${rupees(a.price)}`}
                  className={`absolute left-1 right-1 px-1.5 py-1 text-left overflow-hidden border transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal ${
                    a.status === 'billed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : a.status === 'inchair' ? 'bg-signal border-signal text-white'
                    : 'bg-white border-signal/40 text-ink hover:bg-signal/[0.06]'
                  } ${picked === a.id ? 'ring-2 ring-ink/70 ring-offset-1 z-10' : ''}`}
                  style={{ top: a.start * ROW_H + 1, height: a.len * ROW_H - 2 }}
                >
                  <span className="block text-[10.5px] font-medium leading-tight truncate">{a.service}</span>
                  <span className={`block text-[9.5px] leading-tight truncate ${a.status === 'inchair' ? 'text-white/80' : 'text-ash'}`}>{a.client}{a.len >= 3 ? ` · ${rupees(a.price)}` : ''}</span>
                  {a.status === 'billed' && <Check className="absolute right-1 top-1 w-3 h-3 text-emerald-700" strokeWidth={3} />}
                </button>
              ))}
            </div>
          ))}
          <div className="pointer-events-none absolute left-[2.6rem] right-0 h-px bg-red-500" style={{ top: NOW * ROW_H }}>
            <span className="absolute -left-1 -top-[3px] w-[7px] h-[7px] rounded-full bg-red-500" />
          </div>
        </div>
      </div>

      <div className="w-full sm:w-[210px] flex flex-col gap-2">
        <Tile label="Billed today" value={rupees(billed)} sub={`${appts.filter((a) => a.status === 'billed').length} of ${appts.length} done`} tone="good" />
        <Tile label="Still to bill" value={rupees(pending)} sub={`${inChair} in the chair now`} />
        <Tile label="Chair utilisation" value={`${util}%`} sub="across 3 stylists" />
        <div className="border border-ink/10 bg-white p-3 min-h-[86px]">
          {sel ? (
            <>
              <p className="text-[10.5px] text-ash">Selected</p>
              <p className="text-[12.5px] font-medium leading-tight mt-1">{sel.service}</p>
              <p className="text-[11px] text-ash mt-0.5">{sel.client} · {STYLISTS[sel.s].name} · {LABEL[sel.status]}</p>
            </>
          ) : <p className="text-[11px] text-ash">Select an appointment.</p>}
        </div>
        <button type="button" onClick={billNext} className="min-h-[38px] bg-ink text-paper text-[12.5px] font-medium hover:bg-signal transition-colors">
          Move next appointment on
        </button>
        <p className="text-[10.5px] text-ash leading-snug">Branches, stylists, packages, stock and commissions in one system.</p>
      </div>
    </div>
  );
}
