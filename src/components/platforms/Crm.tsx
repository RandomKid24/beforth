import React, { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { Tile } from './chrome';
import { lakh } from '../demo/format';

interface Deal { id: number; co: string; value: number; owner: string; stage: number }

const STAGES = ['New lead', 'Contacted', 'Proposal', 'Won'];

const SEED: Deal[] = [
  { id: 1, co: 'Customer 1', value: 640000, owner: 'E1', stage: 0 },
  { id: 2, co: 'Customer 5', value: 185000, owner: 'E4', stage: 0 },
  { id: 3, co: 'Customer 2', value: 1250000, owner: 'E2', stage: 1 },
  { id: 4, co: 'Customer 6', value: 420000, owner: 'E1', stage: 1 },
  { id: 5, co: 'Customer 4', value: 2200000, owner: 'E4', stage: 2 },
  { id: 6, co: 'Customer 9', value: 310000, owner: 'E2', stage: 2 },
  { id: 7, co: 'Customer 10', value: 560000, owner: 'E1', stage: 3 },
  { id: 8, co: 'Customer 8', value: 150000, owner: 'E4', stage: 3 },
];

const NEW_LEADS = [
  { co: 'Customer 7', value: 275000 }, { co: 'Customer 3', value: 480000 },
  { co: 'Customer 11', value: 920000 }, { co: 'Customer 12', value: 360000 },
];

export default function CrmPreview() {
  const [deals, setDeals] = useState(SEED);
  const [added, setAdded] = useState(0);

  const sum = (f: (d: Deal) => boolean) => deals.filter(f).reduce((a, d) => a + d.value, 0);
  const open = sum((d) => d.stage < 3);
  const won = sum((d) => d.stage === 3);
  const rate = Math.round((deals.filter((d) => d.stage === 3).length / deals.length) * 100);

  const move = (id: number) => setDeals((l) => l.map((d) => (d.id === id && d.stage < 3 ? { ...d, stage: d.stage + 1 } : d)));
  const addLead = () => {
    const lead = NEW_LEADS[added % NEW_LEADS.length];
    setDeals((l) => [{ id: Date.now(), co: lead.co, value: lead.value, owner: 'You', stage: 0 }, ...l]);
    setAdded((n) => n + 1);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        <Tile label="Open pipeline" value={lakh(open)} sub={`${deals.filter((d) => d.stage < 3).length} live deals`} />
        <Tile label="Won" value={lakh(won)} sub={`${deals.filter((d) => d.stage === 3).length} deals closed`} tone="good" />
        <Tile label="Win rate" value={`${rate}%`} sub="of all leads" />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold">Sales pipeline</p>
        <button type="button" onClick={addLead} className="inline-flex items-center gap-1 min-h-[30px] px-2.5 border border-ink/20 bg-white text-[11.5px] hover:border-signal hover:text-signal transition-colors">
          <Plus className="w-3 h-3" /> Add lead
        </button>
      </div>

      <div className="overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        <div className="grid grid-cols-4 gap-2 min-w-[640px]">
          {STAGES.map((stage, si) => {
            const col = deals.filter((d) => d.stage === si);
            return (
              <div key={stage} className="bg-ink/[0.035] p-2 flex flex-col gap-2 min-h-[240px]">
                <div className="flex items-baseline justify-between px-1">
                  <p className="text-[11.5px] font-semibold">{stage} <span className="text-ash font-normal">{col.length}</span></p>
                  <p className="text-[10.5px] text-ash tabular-nums">{lakh(col.reduce((a, d) => a + d.value, 0))}</p>
                </div>
                {col.map((d) => (
                  <div key={d.id} className={`bg-white border p-2.5 ${si === 3 ? 'border-emerald-200' : 'border-ink/10'}`}>
                    <p className="text-[12px] leading-tight font-medium">{d.co}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[12px] tabular-nums">{lakh(d.value)}</p>
                      <span className="w-5 h-5 rounded-full bg-ink/[0.07] text-[9px] font-semibold flex items-center justify-center" title={`Owner ${d.owner}`}>{d.owner === 'You' ? 'Y' : d.owner}</span>
                    </div>
                    {si < 3 && (
                      <button type="button" onClick={() => move(d.id)} className="mt-2 w-full min-h-[26px] border border-ink/15 text-[11px] text-ash hover:border-signal hover:text-signal transition-colors inline-flex items-center justify-center gap-1">
                        Move to {STAGES[si + 1]} <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                {col.length === 0 && <p className="text-[11px] text-ash text-center py-6">Nothing here yet</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
