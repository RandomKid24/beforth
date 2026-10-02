import React, { useEffect, useRef, useState } from 'react';
import { Check, KeyRound, Loader2, Lock, Monitor, Power, ShieldCheck } from 'lucide-react';
import { Win } from './chrome';

interface Machine { id: string; name: string; os: string; online: boolean; ms: number }

const MACHINES: Machine[] = [
  { id: 'erp', name: 'Office-ERP-Server', os: 'Windows Server 2022', online: true, ms: 41 },
  { id: 'acct', name: 'Accounts-PC', os: 'Windows 11 Pro', online: true, ms: 52 },
  { id: 'wh', name: 'Warehouse-PC', os: 'Windows 10 Pro', online: false, ms: 0 },
];

const STEPS = [
  { icon: KeyRound, text: 'Checking who you are (Cloudflare Access)' },
  { icon: Lock, text: 'Opening an encrypted tunnel — no open ports' },
  { icon: Monitor, text: 'Starting the remote desktop session' },
];

export default function TunnelPreview() {
  const [target, setTarget] = useState<Machine | null>(null);
  const [step, setStep] = useState(0);
  const [live, setLive] = useState(false);
  const timers = useRef<number[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  const connect = (m: Machine) => {
    clear();
    setTarget(m); setLive(false); setStep(1);
    timers.current.push(window.setTimeout(() => setStep(2), 750));
    timers.current.push(window.setTimeout(() => setStep(3), 1550));
    timers.current.push(window.setTimeout(() => { setStep(4); setLive(true); }, 2350));
  };
  const disconnect = () => { clear(); setTarget(null); setStep(0); setLive(false); };

  return (
    <Win title="TunnelGate" className="max-w-[640px] mx-auto">
      <div className="grid sm:grid-cols-[210px_1fr] min-h-[330px]">
        <div className="border-b sm:border-b-0 sm:border-r border-ink/10 bg-paper p-3 flex flex-col gap-2">
          <p className="text-[10.5px] uppercase tracking-[0.14em] text-ash px-1">Your machines</p>
          {MACHINES.map((m) => {
            const active = target?.id === m.id;
            return (
              <div key={m.id} className={`border p-2.5 bg-white ${active ? 'border-signal' : 'border-ink/10'}`}>
                <div className="flex items-center gap-2">
                  <i className={`w-2 h-2 rounded-full ${m.online ? 'bg-emerald-500' : 'bg-ink/25'}`} />
                  <p className="text-[12px] font-medium leading-tight truncate">{m.name}</p>
                </div>
                <p className="text-[10.5px] text-ash mt-0.5 pl-4">{m.os}</p>
                <button
                  type="button"
                  disabled={!m.online}
                  onClick={() => (active ? disconnect() : connect(m))}
                  className={`mt-2 w-full min-h-[28px] text-[11px] font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none ${active ? 'border border-ink/20 hover:border-ink' : 'bg-signal text-white hover:bg-signal-deep'}`}
                >
                  {!m.online ? 'Offline' : active ? (live ? 'Disconnect' : 'Cancel') : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 flex flex-col">
          {!target && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-8">
              <ShieldCheck className="w-9 h-9 text-signal" strokeWidth={1.4} />
              <p className="text-[13.5px] font-semibold">Reach any office machine, safely</p>
              <p className="text-[12px] text-ash max-w-[300px] leading-snug">One click opens a remote desktop through a Zero Trust tunnel. No VPN to set up and no ports exposed to the internet. Pick a machine.</p>
            </div>
          )}

          {target && !live && (
            <div className="flex-1 flex flex-col justify-center gap-3 py-4">
              <p className="text-[12.5px] font-semibold">Connecting to {target.name}…</p>
              <ol className="flex flex-col gap-2.5">
                {STEPS.map((s, i) => {
                  const done = step > i + 1, now = step === i + 1;
                  return (
                    <li key={s.text} className={`flex items-center gap-2.5 text-[12px] transition-opacity ${done || now ? 'opacity-100' : 'opacity-35'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-signal text-white' : 'border border-ink/25'}`}>
                        {done ? <Check className="w-3 h-3" strokeWidth={3} /> : now ? <Loader2 className="w-3 h-3 animate-spin text-signal" /> : <s.icon className="w-3 h-3" />}
                      </span>
                      {s.text}
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {target && live && (
            <div className="flex-1 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-700"><i className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" /> Connected · {target.name}</span>
                <span className="text-ash tabular-nums">{target.ms} ms · encrypted</span>
              </div>
              <div className="relative flex-1 min-h-[190px] bg-gradient-to-br from-[#1E5888] to-[#213C54] overflow-hidden">
                <div className="absolute left-4 top-4 right-10 bottom-10 bg-white shadow-xl">
                  <div className="h-5 bg-[#1C75BC] text-white text-[9px] px-2 flex items-center">Tally Prime — Gateway of Tally</div>
                  <div className="p-2.5 flex flex-col gap-1.5 text-[10px]">
                    {['Vouchers', 'Day Book', 'Balance Sheet', 'Stock Summary'].map((x, i) => (
                      <div key={x} className={`px-2 py-1 ${i === 1 ? 'bg-signal/10 text-signal' : 'text-ink/80'}`}>{x}</div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-6 bg-ink/80 flex items-center gap-2 px-2.5 text-[9px] text-paper/80">
                  <span className="w-3 h-3 bg-wave" /> <span>Tally</span><span className="ml-auto tabular-nums">9:42 AM</span>
                </div>
              </div>
              <button type="button" onClick={disconnect} className="self-start inline-flex items-center gap-1.5 min-h-[30px] px-3 border border-ink/20 text-[11.5px] hover:border-ink transition-colors">
                <Power className="w-3 h-3" /> Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </Win>
  );
}
