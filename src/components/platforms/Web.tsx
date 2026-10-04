import React, { useState } from 'react';
import { Menu, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Browser } from './chrome';

type Device = 'desktop' | 'tablet' | 'mobile';
const WIDTH: Record<Device, string> = { desktop: '100%', tablet: '68%', mobile: '38%' };

function Ring({ value, label }: { value: number; label: string }) {
  const r = 20, C = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 50 50" className="w-full h-full -rotate-90" aria-hidden>
          <circle cx="25" cy="25" r={r} fill="none" stroke="#231F20" strokeOpacity="0.08" strokeWidth="5" />
          <circle cx="25" cy="25" r={r} fill="none" stroke="#1C75BC" strokeWidth="5" strokeDasharray={`${(value / 100) * C} ${C}`} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold tabular-nums" aria-label={`${label} ${value}`}>{value}</span>
      </div>
      <span className="text-[10.5px] text-ash">{label}</span>
    </div>
  );
}

function Site() {
  return (
    <div className="@container bg-white text-ink">
      <div className="flex items-center justify-between px-4 h-11 border-b border-ink/10">
        <span className="text-[12px] font-bold tracking-[0.08em]">SAHYADRI<span className="text-signal">.</span></span>
        <nav className="hidden @md:flex gap-4 text-[10.5px] text-ash"><span>Products</span><span>Industries</span><span>About</span><span className="text-ink font-medium">Get a quote</span></nav>
        <Menu className="@md:hidden w-4 h-4" />
      </div>
      <div className="px-4 py-5 @md:py-8 @md:grid @md:grid-cols-[1.1fr_1fr] gap-4 items-center bg-gradient-to-br from-bone/70 to-paper">
        <div>
          <p className="text-[9.5px] uppercase tracking-[0.16em] text-signal">Your business name</p>
          <h4 className="text-[18px] @md:text-[24px] font-bold tracking-[-0.03em] leading-[1.05] mt-1.5">Your products and services, presented clearly.</h4>
          <div className="flex gap-2 mt-3">
            <span className="inline-block bg-signal text-white text-[10.5px] px-3 py-1.5">Request a quote</span>
            <span className="inline-block border border-ink/25 text-[10.5px] px-3 py-1.5">Browse catalogue</span>
          </div>
        </div>
        <div className="hidden @md:block h-24 bg-signal/15 border border-signal/20 relative overflow-hidden">
          <i className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-signal/30" />
          <i className="absolute left-6 top-5 w-12 h-12 rounded-full bg-wave/70" />
        </div>
      </div>
      <div className="px-4 py-4 grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-2">
        {['Bearings', 'Valves & fittings', 'Pumps & motors'].map((c) => (
          <div key={c} className="border border-ink/10 p-2.5 flex items-center gap-2.5">
            <span className="w-8 h-8 bg-ink/[0.06]" /><span className="text-[11px] font-medium">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WebPreview() {
  const [device, setDevice] = useState<Device>('desktop');
  const opts: { id: Device; label: string; Icon: typeof Monitor }[] = [
    { id: 'desktop', label: 'Desktop', Icon: Monitor }, { id: 'tablet', label: 'Tablet', Icon: Tablet }, { id: 'mobile', label: 'Phone', Icon: Smartphone },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-[640px] mx-auto">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-semibold">Same site, every screen</p>
        <div className="flex border border-ink/15 bg-white" role="group" aria-label="Preview device">
          {opts.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setDevice(id)}
              aria-pressed={device === id}
              className={`flex items-center gap-1.5 px-3 min-h-[32px] text-[11.5px] transition-colors ${device === id ? 'bg-ink text-paper' : 'text-ash hover:text-ink'}`}
            >
              <Icon className="w-3.5 h-3.5" /><span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center bg-ink/[0.035] border border-ink/10 py-5 px-3 min-h-[300px]">
        <Browser url="sahyadri-supply.in" className="transition-[width] duration-500 ease-out self-start" style={{ width: WIDTH[device], minWidth: 210 }}>
          <Site />
        </Browser>
      </div>

      <div className="grid grid-cols-[1fr_auto] items-center gap-4 bg-white border border-ink/10 px-4 py-3">
        <div>
          <p className="text-[12px] font-semibold">Built to be found and to load fast</p>
          <p className="text-[11px] text-ash mt-0.5 leading-snug">Page loads in about 1.1 s on a mobile connection. Structured data, sitemap and clean metadata come as standard.</p>
        </div>
        <div className="flex gap-3">
          <Ring value={98} label="Speed" /><Ring value={96} label="Access" /><Ring value={100} label="SEO" />
        </div>
      </div>
    </div>
  );
}
