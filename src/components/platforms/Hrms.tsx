import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Tile } from './chrome';

type Day = 'P' | 'L' | 'A' | 'V' | 'H';
type Status = 'Present' | 'Late' | 'On leave' | 'Absent';
interface Person {
  id: string; name: string; role: string; status: Status; punch: string; week: Day[];
  balance: { Casual: number; Earned: number }; pending: { type: 'Casual' | 'Earned'; days: number } | null;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SEED: Person[] = [
  { id: 'E-014', name: 'Employee 3', role: 'Service Engineer', status: 'Present', punch: '9:02 AM', week: ['P', 'P', 'P', 'L', 'P', 'H', 'H'], balance: { Casual: 6, Earned: 9 }, pending: null },
  { id: 'E-018', name: 'Employee 4', role: 'Sales Executive', status: 'Present', punch: '9:11 AM', week: ['P', 'P', 'P', 'P', 'P', 'H', 'H'], balance: { Casual: 8, Earned: 12 }, pending: null },
  { id: 'E-021', name: 'Employee 5', role: 'Storekeeper', status: 'Late', punch: '10:20 AM', week: ['P', 'L', 'P', 'P', 'L', 'H', 'H'], balance: { Casual: 5, Earned: 12 }, pending: { type: 'Earned', days: 3 } },
  { id: 'E-027', name: 'Employee 7', role: 'Service Engineer', status: 'Present', punch: '8:55 AM', week: ['P', 'P', 'P', 'P', 'P', 'H', 'H'], balance: { Casual: 7, Earned: 10 }, pending: null },
  { id: 'E-031', name: 'Employee 9', role: 'Accounts', status: 'On leave', punch: '—', week: ['P', 'P', 'P', 'P', 'V', 'H', 'H'], balance: { Casual: 3, Earned: 12 }, pending: null },
  { id: 'E-036', name: 'Employee 11', role: 'Driver', status: 'Absent', punch: '—', week: ['P', 'P', 'A', 'P', 'A', 'H', 'H'], balance: { Casual: 4, Earned: 8 }, pending: { type: 'Casual', days: 2 } },
];

const DAY_SKIN: Record<Day, string> = {
  P: 'bg-signal text-white', L: 'bg-amber-400 text-ink', A: 'bg-red-500 text-white', V: 'bg-wave text-ink', H: 'bg-ink/[0.07] text-ash',
};
const DAY_NAME: Record<Day, string> = { P: 'Present', L: 'Late', A: 'Absent', V: 'Leave', H: 'Off' };
const STATUS_DOT: Record<Status, string> = { Present: 'bg-signal', Late: 'bg-amber-500', 'On leave': 'bg-wave', Absent: 'bg-red-500' };

export default function HrmsPreview() {
  const [people, setPeople] = useState(SEED);
  const [sel, setSel] = useState('E-021');
  const p = people.find((x) => x.id === sel)!;

  const present = people.filter((x) => x.status === 'Present' || x.status === 'Late').length;
  const edit = (id: string, fn: (x: Person) => Person) => setPeople((l) => l.map((x) => (x.id === id ? fn(x) : x)));

  return (
    <div className="flex flex-col gap-3 max-w-[760px] mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Tile label="Present today" value={`${present}/${people.length}`} sub={`${Math.round((present / people.length) * 100)}% attendance`} tone="good" />
        <Tile label="Late arrivals" value={people.filter((x) => x.status === 'Late').length} sub="after 9:30 AM" tone="warn" />
        <Tile label="On leave" value={people.filter((x) => x.status === 'On leave').length} sub="approved" />
        <Tile label="Leave requests" value={people.filter((x) => x.pending).length} sub="waiting for you" tone={people.some((x) => x.pending) ? 'warn' : 'good'} />
      </div>

      <div className="grid md:grid-cols-[1.1fr_1fr] gap-3">
        <div className="bg-white border border-ink/10">
          <div className="px-3.5 py-2.5 border-b border-ink/10"><p className="text-[12px] font-semibold">Team · {people.length} people</p></div>
          <ul>
            {people.map((x) => (
              <li key={x.id} className="border-t border-ink/[0.07] first:border-t-0">
                <button
                  type="button"
                  onClick={() => setSel(x.id)}
                  aria-pressed={x.id === sel}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${x.id === sel ? 'bg-signal/[0.07]' : 'hover:bg-ink/[0.03]'}`}
                >
                  <span className="relative w-8 h-8 shrink-0 rounded-full bg-ink/[0.07] flex items-center justify-center text-[11px] font-semibold">
                    {x.name.split(' ').map((w) => w[0]).join('')}
                    <i className={`absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${STATUS_DOT[x.status]}`} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] leading-tight truncate">{x.name}</span>
                    <span className="block text-[11px] text-ash leading-tight mt-0.5">{x.role}</span>
                  </span>
                  <span className="text-right shrink-0">
                    <span className="block text-[11.5px] leading-tight">{x.status}</span>
                    <span className="block text-[10.5px] text-ash tabular-nums leading-tight mt-0.5">{x.punch}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-ink/10 p-3.5 flex flex-col gap-3.5">
          <div>
            <p className="text-[14px] font-semibold leading-tight">{p.name}</p>
            <p className="text-[11.5px] text-ash mt-0.5">{p.id} · {p.role}</p>
          </div>

          <div>
            <p className="text-[10.5px] text-ash mb-1.5">This week</p>
            <div className="grid grid-cols-7 gap-1">
              {p.week.map((d, i) => (
                <div key={i} className="text-center">
                  <span className={`block h-7 leading-7 text-[11px] font-semibold ${DAY_SKIN[d]}`} title={DAY_NAME[d]}>{d === 'H' ? '' : d}</span>
                  <span className="block text-[9.5px] text-ash mt-1">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="border border-ink/10 py-2"><p className="text-[15px] font-semibold tabular-nums">{p.balance.Casual}</p><p className="text-[10.5px] text-ash">casual days left</p></div>
            <div className="border border-ink/10 py-2"><p className="text-[15px] font-semibold tabular-nums">{p.balance.Earned}</p><p className="text-[10.5px] text-ash">earned days left</p></div>
          </div>

          {p.pending ? (
            <div className="border border-amber-200 bg-amber-50 p-2.5">
              <p className="text-[12px] text-amber-900">{p.name} requests {p.pending.days} days of {p.pending.type.toLowerCase()} leave.</p>
              <div className="flex gap-2 mt-2">
                <button type="button" className="flex-1 min-h-[30px] bg-signal text-white text-[11.5px] font-medium inline-flex items-center justify-center gap-1 hover:bg-signal-deep transition-colors"
                  onClick={() => edit(p.id, (x) => ({ ...x, status: 'On leave', punch: '—', balance: { ...x.balance, [x.pending!.type]: x.balance[x.pending!.type] - x.pending!.days }, pending: null }))}>
                  <Check className="w-3 h-3" /> Approve
                </button>
                <button type="button" className="flex-1 min-h-[30px] border border-ink/20 bg-white text-[11.5px] hover:border-ink transition-colors"
                  onClick={() => edit(p.id, (x) => ({ ...x, pending: null }))}>Decline</button>
              </div>
            </div>
          ) : p.status === 'Absent' ? (
            <button type="button" className="min-h-[34px] border border-ink/20 bg-white text-[12px] hover:border-ink transition-colors"
              onClick={() => edit(p.id, (x) => ({ ...x, status: 'Present', punch: '9:48 AM' }))}>Mark present (manual punch)</button>
          ) : (
            <p className="text-[11.5px] text-ash">Shifts, biometric punches and approvals sync automatically.</p>
          )}
        </div>
      </div>
    </div>
  );
}
