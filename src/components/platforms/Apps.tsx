import React, { useEffect, useRef, useState } from 'react';
import { BellRing, Check, Fingerprint, ScanFace, WifiOff } from 'lucide-react';
import { Phone } from './chrome';

interface Visit { id: number; name: string; time: string; done: boolean }

const SEED: Visit[] = [
  { id: 1, name: 'Kothari Distributors', time: '10:30 AM', done: true },
  { id: 2, name: 'Meridian Pharma', time: '12:00 PM', done: false },
  { id: 3, name: 'Vertex Retail', time: '3:30 PM', done: false },
];
const PUSHED: Visit = { id: 4, name: 'Deccan Packaging', time: '4:45 PM', done: false };

interface Shared {
  visits: Visit[]; offline: boolean; queued: number; synced: number; push: boolean; locked: boolean;
  checkIn: (id: number) => void; unlock: () => void;
}

function FieldApp({ platform, st }: { platform: 'android' | 'ios'; st: Shared }) {
  const ios = platform === 'ios';
  const next = st.visits.find((v) => !v.done);
  const done = st.visits.filter((v) => v.done).length;

  return (
    <>
      {st.locked && (
        <div className="absolute inset-0 z-30 bg-ink/95 text-paper flex flex-col items-center justify-center gap-3 px-6 text-center">
          {ios ? <ScanFace className="w-10 h-10 text-wave" strokeWidth={1.4} /> : <Fingerprint className="w-10 h-10 text-wave" strokeWidth={1.4} />}
          <p className="text-[13px] font-semibold">Field Sales is locked</p>
          <p className="text-[11px] text-paper/60 leading-snug">{ios ? 'Look at your phone to unlock.' : 'Touch the sensor to unlock.'}</p>
          <button type="button" onClick={st.unlock} className="mt-1 min-h-[32px] px-4 bg-signal text-white text-[11.5px] font-medium hover:bg-signal-deep transition-colors">
            {ios ? 'Use Face ID' : 'Use fingerprint'}
          </button>
        </div>
      )}

      {st.push && (
        <div className="absolute top-8 left-2 right-2 z-20 bg-ink text-paper px-2.5 py-2 shadow-xl flex gap-2 items-start animate-[fadeDown_.3s_ease-out]">
          <BellRing className="w-3.5 h-3.5 text-wave shrink-0 mt-0.5" />
          <span className="text-[10.5px] leading-snug"><b className="font-semibold">New visit assigned</b><br />{PUSHED.name}, {PUSHED.time}</span>
        </div>
      )}

      <div className={`px-3.5 ${ios ? 'pt-1' : 'pt-0 bg-signal text-white pb-2.5'}`}>
        {ios ? (
          <>
            <p className="text-[10px] text-signal font-medium">Field Sales</p>
            <p className="text-[22px] font-bold tracking-[-0.03em] leading-tight">Today</p>
          </>
        ) : (
          <div className="flex items-center justify-between h-8">
            <p className="text-[14px] font-medium">Field Sales</p>
            <span className="w-6 h-6 rounded-full bg-white/20 text-[9px] font-semibold flex items-center justify-center">PN</span>
          </div>
        )}
      </div>

      {st.offline ? (
        <div className="px-3.5 py-1.5 bg-amber-100 text-amber-900 text-[10px] flex items-center gap-1.5"><WifiOff className="w-3 h-3" /> Offline · {st.queued} change{st.queued === 1 ? '' : 's'} saved on device</div>
      ) : st.synced > 0 ? (
        <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-[10px] flex items-center gap-1.5"><Check className="w-3 h-3" /> Back online · {st.synced} change{st.synced === 1 ? '' : 's'} synced</div>
      ) : null}

      <div className="px-3.5 py-2.5 flex-1 min-h-0 overflow-hidden flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] text-ash">Visits</p>
          <p className="text-[11px] tabular-nums">{done} of {st.visits.length} done</p>
        </div>
        {st.visits.map((v) => (
          <div key={v.id} className={`border p-2 ${v.done ? 'border-ink/10 bg-ink/[0.03]' : v.id === next?.id ? 'border-signal/50 bg-signal/[0.05]' : 'border-ink/10'}`}>
            <div className="flex items-start justify-between gap-2">
              <p className={`text-[11.5px] font-medium leading-tight ${v.done ? 'text-ash' : ''}`}>{v.name}</p>
              {v.done && <Check className="w-3.5 h-3.5 text-signal shrink-0" strokeWidth={3} />}
            </div>
            <p className="text-[10px] text-ash mt-0.5">{v.time}</p>
            {v.id === next?.id && (
              <button type="button" onClick={() => st.checkIn(v.id)} className={`mt-1.5 w-full min-h-[26px] bg-signal text-white text-[10.5px] font-medium hover:bg-signal-deep transition-colors ${ios ? 'rounded-md' : ''}`}>
                Check in here
              </button>
            )}
          </div>
        ))}
        {!next && <p className="text-[11px] text-ash text-center py-2">All visits done for today.</p>}
      </div>

      <div className={`shrink-0 grid grid-cols-3 text-center text-[9.5px] border-t border-ink/10 ${ios ? 'py-1.5' : 'py-2 bg-paper'}`}>
        <span className="text-signal font-medium">Visits</span><span className="text-ash">Orders</span><span className="text-ash">Profile</span>
      </div>
    </>
  );
}

function Switch({ on, onChange, label, sub }: { on: boolean; onChange: () => void; label: string; sub: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onChange} className="w-full flex items-center justify-between gap-3 border border-ink/10 bg-white px-3 py-2.5 text-left hover:border-ink/30 transition-colors">
      <span>
        <span className="block text-[12.5px] font-medium leading-tight">{label}</span>
        <span className="block text-[11px] text-ash leading-tight mt-0.5">{sub}</span>
      </span>
      <span className={`relative w-9 h-5 shrink-0 rounded-full transition-colors ${on ? 'bg-signal' : 'bg-ink/20'}`}>
        <i className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : ''}`} />
      </span>
    </button>
  );
}

export default function AppsPreview() {
  const [visits, setVisits] = useState(SEED);
  const [offline, setOffline] = useState(false);
  const [queued, setQueued] = useState(0);
  const [synced, setSynced] = useState(0);
  const [push, setPush] = useState(false);
  const [bio, setBio] = useState(false);
  const [locked, setLocked] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const checkIn = (id: number) => {
    setVisits((l) => l.map((v) => (v.id === id ? { ...v, done: true } : v)));
    if (offline) setQueued((n) => n + 1);
  };
  const toggleOffline = () => {
    if (offline) {
      if (queued > 0) { setSynced(queued); later(() => setSynced(0), 3000); }
      setQueued(0);
    }
    setOffline(!offline);
  };
  const sendPush = () => {
    setVisits((l) => (l.some((v) => v.id === PUSHED.id) ? l : [...l, PUSHED]));
    setPush(true);
    later(() => setPush(false), 3200);
  };
  const toggleBio = () => { setBio(!bio); setLocked(!bio); };

  const st: Shared = { visits, offline, queued, synced, push, locked, checkIn, unlock: () => setLocked(false) };

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-6">
      <div className="flex gap-4 sm:gap-6">
        <Phone platform="android" label="Android"><FieldApp platform="android" st={st} /></Phone>
        <Phone platform="ios" label="iPhone" className="hidden min-[560px]:flex"><FieldApp platform="ios" st={st} /></Phone>
      </div>

      <div className="w-full sm:w-[250px] flex flex-col gap-2">
        <p className="text-[12px] font-semibold mb-0.5">Try what the phone can do</p>
        <Switch on={offline} onChange={toggleOffline} label="Works offline" sub="Check in with no signal; sync later" />
        <Switch on={bio} onChange={toggleBio} label="Biometric lock" sub="Fingerprint on Android, Face ID on iPhone" />
        <button type="button" onClick={sendPush} className="w-full flex items-center justify-between gap-3 border border-ink/10 bg-white px-3 py-2.5 text-left hover:border-signal transition-colors">
          <span>
            <span className="block text-[12.5px] font-medium leading-tight">Push notification</span>
            <span className="block text-[11px] text-ash leading-tight mt-0.5">Assign a visit to this phone now</span>
          </span>
          <BellRing className="w-4 h-4 text-signal shrink-0" />
        </button>
        <p className="text-[10.5px] text-ash leading-snug mt-1">One team, one codebase, both stores. Both phones above run the same app and stay in step.</p>
      </div>
    </div>
  );
}
