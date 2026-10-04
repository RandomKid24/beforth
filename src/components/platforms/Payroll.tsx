import React, { useState } from 'react';
import { Check, Download } from 'lucide-react';
import { Tile } from './chrome';
import { lakh, rupees } from '../demo/format';

const EMPLOYEES = [
  { name: 'Employee 3', role: 'Service Engineer', gross: 46000 },
  { name: 'Employee 4', role: 'Sales Executive', gross: 52000 },
  { name: 'Employee 5', role: 'Storekeeper', gross: 28000 },
  { name: 'Employee 7', role: 'Service Engineer', gross: 58000 },
  { name: 'Employee 12', role: 'Finance Head', gross: 112000 },
];

/** A simplified Indian payslip: PF on basic (capped), professional tax, and TDS above a threshold. */
function slip(gross: number) {
  const basic = Math.round(gross * 0.5);
  const hra = Math.round(basic * 0.4);
  const special = gross - basic - hra;
  const pf = Math.round(Math.min(basic, 15000) * 0.12);
  const pt = gross >= 25000 ? 200 : 0;
  const tds = gross > 60000 ? Math.round((gross - 60000) * 0.1) : 0;
  const deductions = pf + pt + tds;
  return { basic, hra, special, pf, pt, tds, deductions, net: gross - deductions };
}

const STEPS = ['Draft', 'Reviewed', 'Approved', 'Paid'];
const ACTION = ['Review payroll', 'Approve payroll', 'Release salaries'];

export default function PayrollPreview() {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState(1);
  const month = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const rows = EMPLOYEES.map((e) => ({ ...e, ...slip(e.gross) }));
  const tot = rows.reduce((a, r) => ({ gross: a.gross + r.gross, ded: a.ded + r.deductions, net: a.net + r.net }), { gross: 0, ded: 0, net: 0 });
  const p = rows[sel];

  return (
    <div className="flex flex-col gap-3 max-w-[780px] mx-auto">
      <div className="bg-white border border-ink/10 px-3.5 py-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-[12.5px] font-semibold">Payroll run · {month}</p>
          <button
            type="button"
            onClick={() => (step === 3 ? setStep(0) : setStep(step + 1))}
            className={`min-h-[32px] px-3.5 text-[12px] font-medium transition-colors ${step === 3 ? 'border border-ink/20 bg-white hover:border-ink' : 'bg-signal text-white hover:bg-signal-deep'}`}
          >
            {step === 3 ? 'Start next month' : ACTION[step]}
          </button>
        </div>
        <ol className="grid grid-cols-4 gap-1.5" aria-label="Payroll progress">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? 'step' : undefined}>
              <div className={`h-1.5 transition-colors duration-500 ${i <= step ? 'bg-signal' : 'bg-ink/[0.1]'}`} />
              <p className={`text-[10.5px] mt-1.5 flex items-center gap-1 ${i === step ? 'font-semibold' : i < step ? '' : 'text-ash'}`}>{i < step && <Check className="w-3 h-3 text-signal" strokeWidth={3} />}{s}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Tile label="Gross pay" value={lakh(tot.gross)} sub={`${EMPLOYEES.length} employees`} />
        <Tile label="Deductions" value={rupees(tot.ded)} sub="PF · PT · TDS" />
        <Tile label="Net payable" value={rupees(tot.net)} sub={step === 3 ? 'Paid' : 'to be paid'} tone={step === 3 ? 'good' : undefined} />
      </div>

      <div className="grid md:grid-cols-[1.25fr_1fr] gap-3">
        <div className="bg-white border border-ink/10 overflow-x-auto">
          <table className="w-full min-w-[340px] text-[12px]">
            <thead>
              <tr className="text-left text-ash text-[11px]"><th className="font-normal px-3.5 py-2">Employee</th><th className="font-normal px-2 py-2 text-right">Gross</th><th className="font-normal px-3.5 py-2 text-right">Net pay</th></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.name} onClick={() => setSel(i)} className={`border-t border-ink/[0.07] cursor-pointer transition-colors ${sel === i ? 'bg-signal/[0.07]' : 'hover:bg-ink/[0.03]'}`}>
                  <td className="px-3.5 py-2.5"><button type="button" onClick={() => setSel(i)} aria-pressed={sel === i} className="text-left"><span className="block leading-tight">{r.name}</span><span className="block text-[10.5px] text-ash mt-0.5">{r.role}</span></button></td>
                  <td className="px-2 py-2.5 text-right tabular-nums text-ash">{rupees(r.gross)}</td>
                  <td className="px-3.5 py-2.5 text-right tabular-nums font-medium">{rupees(r.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-ink/10 p-3.5 text-[12px]">
          <p className="text-[13px] font-semibold leading-tight">{p.name}</p>
          <p className="text-[11px] text-ash mt-0.5 mb-3">Salary slip · {month}</p>
          {[['Earnings', [['Basic', p.basic], ['House rent allowance', p.hra], ['Special allowance', p.special]]], ['Deductions', [['Provident fund (12%)', -p.pf], ['Professional tax', -p.pt], ['Income tax (TDS)', -p.tds]]]].map(([title, items]) => (
            <div key={title as string} className="mb-2.5">
              <p className="text-[10.5px] uppercase tracking-[0.12em] text-ash mb-1">{title as string}</p>
              {(items as [string, number][]).map(([label, v]) => (
                <div key={label} className="flex justify-between py-0.5"><span className="text-ink/80">{label}</span><span className="tabular-nums">{v === 0 ? '—' : v < 0 ? `−${rupees(-v)}` : rupees(v)}</span></div>
              ))}
            </div>
          ))}
          <div className="flex justify-between border-t border-ink/15 pt-2 mt-1 text-[13px] font-semibold"><span>Net pay</span><span className="tabular-nums">{rupees(p.net)}</span></div>
        </div>
      </div>

      {step === 3 && (
        <div className="border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[12px] text-emerald-900">
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /> Salary slips emailed to {EMPLOYEES.length} employees. Bank transfer file is ready.</span>
          <span className="inline-flex items-center gap-1 text-emerald-800"><Download className="w-3.5 h-3.5" /> bank-file.csv</span>
        </div>
      )}
    </div>
  );
}
