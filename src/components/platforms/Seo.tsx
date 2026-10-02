import React, { useState } from 'react';
import { Tile } from './chrome';
import { inr } from '../demo/format';

interface Kw { kw: string; now: number; prev: number; vol: number; trend: number[] }

/** Sample data. Position 1 is best, so a falling number is good news. */
const KEYWORDS: Kw[] = [
  { kw: 'custom erp software nashik', now: 3, prev: 5, vol: 480, trend: [14, 13, 12, 11, 9, 9, 8, 7, 6, 5, 5, 3] },
  { kw: 'salon software maharashtra', now: 2, prev: 2, vol: 390, trend: [9, 8, 7, 6, 5, 4, 4, 3, 3, 2, 2, 2] },
  { kw: 'delivery tracking app for pharmacy', now: 4, prev: 7, vol: 210, trend: [20, 18, 16, 14, 12, 10, 9, 8, 7, 7, 7, 4] },
  { kw: 'crm for manufacturing company', now: 6, prev: 9, vol: 880, trend: [16, 15, 14, 13, 12, 11, 10, 10, 9, 9, 9, 6] },
  { kw: 'pos software for bakery', now: 8, prev: 6, vol: 1300, trend: [12, 11, 10, 9, 8, 7, 7, 6, 6, 6, 6, 8] },
  { kw: 'hrms software india', now: 12, prev: 11, vol: 6600, trend: [18, 17, 16, 15, 14, 13, 12, 12, 11, 11, 11, 12] },
  { kw: 'payroll software for small business', now: 15, prev: 15, vol: 2900, trend: [19, 19, 18, 17, 17, 16, 16, 15, 15, 15, 15, 15] },
];

type Filter = 'all' | 'up' | 'down';

function Spark({ data, w = 64, h = 22 }: { data: number[]; w?: number; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${i ? 'L' : 'M'} ${((i / (data.length - 1)) * w).toFixed(1)} ${(((v - min) / (max - min || 1)) * (h - 4) + 2).toFixed(1)}`).join(' ');
  const better = data[data.length - 1] <= data[0];
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden><path d={pts} fill="none" stroke={better ? '#1C75BC' : '#B91C1C'} strokeWidth="1.5" /></svg>;
}

export default function SeoPreview() {
  const [sel, setSel] = useState(0);
  const [filter, setFilter] = useState<Filter>('all');
  const rows = KEYWORDS.map((k, i) => ({ ...k, i })).filter((k) => filter === 'all' || (filter === 'up' ? k.now < k.prev : k.now > k.prev));
  const k = KEYWORDS[sel];

  const avg = KEYWORDS.reduce((a, x) => a + x.now, 0) / KEYWORDS.length;
  const avgPrev = KEYWORDS.reduce((a, x) => a + x.prev, 0) / KEYWORDS.length;
  const top3 = KEYWORDS.filter((x) => x.now <= 3).length;
  const improved = KEYWORDS.filter((x) => x.now < x.prev).length;

  // chart: position 1 at the top
  const W = 300, H = 120, pad = 10;
  const maxPos = Math.max(20, ...k.trend);
  const X = (i: number) => pad + (i / (k.trend.length - 1)) * (W - pad * 2);
  const Y = (p: number) => pad + ((p - 1) / (maxPos - 1)) * (H - pad * 2);
  const line = k.trend.map((p, i) => `${i ? 'L' : 'M'} ${X(i).toFixed(1)} ${Y(p).toFixed(1)}`).join(' ');

  return (
    <div className="flex flex-col gap-3 max-w-[780px] mx-auto">
      <div className="grid grid-cols-3 gap-2">
        <Tile label="Average position" value={avg.toFixed(1)} sub={`${avgPrev - avg >= 0 ? '▲' : '▼'} ${Math.abs(avgPrev - avg).toFixed(1)} since last week`} tone={avgPrev - avg >= 0 ? 'good' : 'bad'} />
        <Tile label="In the top 3" value={`${top3} of ${KEYWORDS.length}`} sub="keywords" />
        <Tile label="Improved" value={improved} sub="this week" tone="good" />
      </div>

      <div className="grid md:grid-cols-[1.35fr_1fr] gap-3">
        <div className="bg-white border border-ink/10">
          <div className="px-3.5 py-2.5 border-b border-ink/10 flex items-center justify-between gap-2">
            <p className="text-[12px] font-semibold">Keywords we track</p>
            <div className="flex gap-1" role="group" aria-label="Filter keywords">
              {([['all', 'All'], ['up', 'Improved'], ['down', 'Dropped']] as [Filter, string][]).map(([id, label]) => (
                <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}
                  className={`px-2 min-h-[26px] text-[11px] border transition-colors ${filter === id ? 'bg-ink text-paper border-ink' : 'bg-white text-ash border-ink/15 hover:border-ink/40'}`}>{label}</button>
              ))}
            </div>
          </div>
          <ul>
            {rows.map((r) => {
              const d = r.prev - r.now;
              return (
                <li key={r.kw} className="border-t border-ink/[0.07] first:border-t-0">
                  <button type="button" onClick={() => setSel(r.i)} aria-pressed={sel === r.i}
                    className={`w-full grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${sel === r.i ? 'bg-signal/[0.07]' : 'hover:bg-ink/[0.03]'}`}>
                    <span className="min-w-0">
                      <span className="block text-[12px] leading-tight truncate">{r.kw}</span>
                      <span className="block text-[10.5px] text-ash mt-0.5">{inr(r.vol)} searches a month</span>
                    </span>
                    <span className="hidden sm:block"><Spark data={r.trend} /></span>
                    <span className="text-right w-12">
                      <span className="block text-[15px] font-semibold tabular-nums leading-none">{r.now}</span>
                      <span className={`block text-[10.5px] tabular-nums mt-1 leading-none ${d > 0 ? 'text-emerald-700' : d < 0 ? 'text-red-600' : 'text-ash'}`}>{d > 0 ? `▲ ${d}` : d < 0 ? `▼ ${-d}` : '—'}</span>
                    </span>
                  </button>
                </li>
              );
            })}
            {rows.length === 0 && <li className="px-3.5 py-6 text-center text-[12px] text-ash">Nothing here this week.</li>}
          </ul>
        </div>

        <div className="bg-white border border-ink/10 p-3.5 flex flex-col">
          <p className="text-[12px] font-semibold leading-tight">{k.kw}</p>
          <p className="text-[11px] text-ash mt-0.5">Google position, last 12 weeks</p>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-2" role="img" aria-label={`Position moved from ${k.trend[0]} to ${k.now} over 12 weeks`}>
            <rect x="0" y={Y(1)} width={W} height={Y(10) - Y(1)} fill="#1C75BC" opacity="0.07" />
            <line x1="0" x2={W} y1={Y(10)} y2={Y(10)} stroke="#231F20" strokeOpacity="0.2" strokeDasharray="3 4" />
            <text x={W - 4} y={Y(10) - 4} textAnchor="end" fontSize="8.5" fill="#6D737F">Page 1 ends here</text>
            <path d={line} fill="none" stroke="#1C75BC" strokeWidth="2" strokeLinejoin="round" />
            <circle cx={X(k.trend.length - 1)} cy={Y(k.now)} r="4" fill="#1C75BC" stroke="#fff" strokeWidth="2" />
          </svg>
          <div className="mt-auto pt-3 grid grid-cols-2 gap-2 text-center">
            <div className="border border-ink/10 py-2"><p className="text-[16px] font-semibold tabular-nums">{k.now}</p><p className="text-[10.5px] text-ash">position now</p></div>
            <div className="border border-ink/10 py-2"><p className="text-[16px] font-semibold tabular-nums">{k.trend[0]}</p><p className="text-[10.5px] text-ash">12 weeks ago</p></div>
          </div>
        </div>
      </div>
      <p className="text-[10.5px] text-ash">Sample keywords and positions. A real dashboard tracks your own terms, competitors and pages.</p>
    </div>
  );
}
