import React, { useState } from 'react';
import { Check, Navigation, PenLine, RotateCcw } from 'lucide-react';
import { Phone, Tile } from './chrome';

interface Stop { id: number; name: string; area: string; items: string; eta: string; x: number; y: number }

const START = { x: 12, y: 168 };
const STOPS: Stop[] = [
  { id: 1, name: 'Drop point 1', area: 'College Road', items: '4 cartons', eta: '9:55 AM', x: 58, y: 138 },
  { id: 2, name: 'Drop point 2', area: 'Gangapur Road', items: '2 cartons · cold chain', eta: '10:25 AM', x: 112, y: 80 },
  { id: 3, name: 'Drop point 3', area: 'Panchavati', items: '6 cartons', eta: '10:50 AM', x: 176, y: 108 },
  { id: 4, name: 'Drop point 4', area: 'Satpur', items: '3 cartons', eta: '11:30 AM', x: 236, y: 50 },
  { id: 5, name: 'Drop point 5', area: 'Indira Nagar', items: '1 carton · cold chain', eta: '12:05 PM', x: 304, y: 96 },
];

export default function DeliveryPreview() {
  const [done, setDone] = useState(2);
  const [proof, setProof] = useState(false);
  const total = STOPS.length;
  const current = STOPS[done];
  const courier = done === 0 ? START : STOPS[done - 1];

  const advance = () => {
    if (!proof) { setProof(true); return; }
    setProof(false);
    setDone((d) => Math.min(d + 1, total));
  };

  const pts = [START, ...STOPS];
  const path = pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
  const doneUpTo = [START, ...STOPS.slice(0, done)];
  const donePath = doneUpTo.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
      <Phone label="Delivery partner app">
        <div className="px-3.5 pt-1 pb-2">
          <div className="flex items-baseline justify-between">
            <p className="text-[13px] font-semibold tracking-[-0.01em]">Today’s route</p>
            <p className="text-[10.5px] text-ash tabular-nums">{done} of {total} done</p>
          </div>
          <div className="mt-2 h-1.5 bg-ink/[0.08]"><div className="h-full bg-signal transition-[width] duration-500" style={{ width: `${(done / total) * 100}%` }} /></div>
        </div>

        <div className="px-3 flex-1 min-h-0 overflow-hidden flex flex-col gap-2">
          {current ? (
            <div className="border border-signal/40 bg-signal/[0.06] p-2.5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-signal">Next stop · ETA {current.eta}</p>
              <p className="text-[13px] font-semibold leading-tight mt-1">{current.name}</p>
              <p className="text-[11px] text-ash mt-0.5">{current.area} · {current.items}</p>
              {proof ? (
                <div className="mt-2 border border-dashed border-ink/25 bg-white h-12 flex items-center justify-center" aria-label="Customer signature captured">
                  <svg width="110" height="30" viewBox="0 0 110 30" fill="none" aria-hidden><path d="M4 22 C14 4, 20 4, 24 18 S34 26, 42 12 S58 2, 64 20 S84 24, 106 8" stroke="#231F20" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </div>
              ) : null}
              <div className="mt-2 flex gap-1.5">
                <button type="button" className="flex-1 min-h-[30px] border border-ink/20 bg-white text-[11px] flex items-center justify-center gap-1" tabIndex={-1} aria-hidden>
                  <Navigation className="w-3 h-3" /> Navigate
                </button>
                <button type="button" onClick={advance} className="flex-[1.6] min-h-[30px] bg-signal text-white text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-signal-deep transition-colors">
                  {proof ? <><Check className="w-3 h-3" /> Confirm delivery</> : <><PenLine className="w-3 h-3" /> Get proof</>}
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-emerald-200 bg-emerald-50 p-3 text-center">
              <p className="text-[13px] font-semibold text-emerald-800">Route complete</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">5 of 5 delivered · all proofs saved</p>
            </div>
          )}

          <ol className="flex-1 min-h-0 overflow-hidden flex flex-col gap-1.5">
            {STOPS.map((s, i) => (
              <li key={s.id} className="flex items-center gap-2">
                <span className={`w-4 h-4 shrink-0 rounded-full flex items-center justify-center text-[9px] font-semibold ${i < done ? 'bg-signal text-white' : i === done ? 'border border-signal text-signal' : 'border border-ink/20 text-ash'}`}>
                  {i < done ? <Check className="w-2.5 h-2.5" strokeWidth={3} /> : s.id}
                </span>
                <span className={`flex-1 min-w-0 truncate text-[11px] ${i < done ? 'text-ash line-through decoration-ink/20' : ''}`}>{s.name}</span>
                <span className="text-[10px] text-ash tabular-nums">{i < done ? '✓' : s.eta.replace(' AM', '').replace(' PM', '')}</span>
              </li>
            ))}
          </ol>
        </div>
      </Phone>

      <div className="flex-1 min-w-[280px] max-w-[420px] flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          <Tile label="Delivered" value={`${done}/${total}`} sub={done === total ? 'Complete' : `${total - done} to go`} tone={done === total ? 'good' : undefined} />
          <Tile label="Next ETA" value={current ? current.eta.replace(' ', ' ') : '—'} sub={current ? 'on schedule' : 'finished'} tone="good" />
          <Tile label="On time" value="100%" sub="no late stops" tone="good" />
        </div>

        <div className="border border-ink/10 bg-white">
          <div className="px-3 py-2 border-b border-ink/10 flex items-center justify-between">
            <p className="text-[12px] font-semibold">Dispatcher view · live</p>
            <span className="flex items-center gap-1.5 text-[10.5px] text-signal"><span className="w-1.5 h-1.5 rounded-full bg-signal pulse-dot" /> Driver 1</span>
          </div>
          <svg viewBox="0 0 330 190" className="w-full block" role="img" aria-label={`Route map: ${done} of ${total} stops delivered`}>
            <defs>
              <pattern id="dgrid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="#231F20" strokeOpacity="0.06" /></pattern>
            </defs>
            <rect width="330" height="190" fill="url(#dgrid)" />
            <path d={path} fill="none" stroke="#231F20" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="4 5" />
            <path d={donePath} fill="none" stroke="#1C75BC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <g>
              <circle cx={START.x} cy={START.y} r="5" fill="#231F20" />
              <text x={START.x + 8} y={START.y + 14} fontSize="9" fill="#6D737F">Depot</text>
            </g>
            {STOPS.map((s, i) => (
              <g key={s.id}>
                <circle cx={s.x} cy={s.y} r={i === done ? 9 : 7} fill={i < done ? '#1C75BC' : '#fff'} stroke={i <= done ? '#1C75BC' : '#231F20'} strokeOpacity={i <= done ? 1 : 0.3} strokeWidth="2" />
                {i < done && <path d={`M${s.x - 3} ${s.y} l2 2.4 l4 -4.4`} fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
                {i >= done && <text x={s.x} y={s.y + 3} fontSize="8.5" textAnchor="middle" fontWeight="600" fill={i === done ? '#1C75BC' : '#6D737F'}>{s.id}</text>}
              </g>
            ))}
            <g style={{ transform: `translate(${courier.x}px, ${courier.y}px)`, transition: 'transform 0.9s cubic-bezier(.3,.7,.2,1)' }}>
              <circle r="14" fill="#1C75BC" opacity="0.15" />
              <circle r="5.5" fill="#231F20" stroke="#fff" strokeWidth="2" />
            </g>
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] text-ash">
          <span>Proof of delivery, live location and history on every stop.</span>
          <button type="button" onClick={() => { setDone(0); setProof(false); }} className="inline-flex items-center gap-1 hover:text-ink transition-colors shrink-0 ml-3">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
