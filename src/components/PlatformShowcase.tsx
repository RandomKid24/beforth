import React, { useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import {
  Truck, Scissors, Users, Kanban, Smartphone, Globe, ShieldCheck, TrendingUp, IndianRupee, ReceiptText,
  type LucideIcon,
} from 'lucide-react';

import DeliveryPreview from './platforms/Delivery';
import SalonPreview from './platforms/Salon';
import HrmsPreview from './platforms/Hrms';
import CrmPreview from './platforms/Crm';
import AppsPreview from './platforms/Apps';
import WebPreview from './platforms/Web';
import TunnelPreview from './platforms/Tunnel';
import SeoPreview from './platforms/Seo';
import PayrollPreview from './platforms/Payroll';
import PosPreview from './platforms/Pos';

interface Platform {
  id: string;
  name: string;
  sub: string;
  icon: LucideIcon;
  summary: string;
  built: string;
  caps: string[];
  Preview: React.ComponentType;
}

const PLATFORMS: Platform[] = [
  {
    id: 'delivery', name: 'Delivery tracking', sub: 'Routes · proof of delivery', icon: Truck, Preview: DeliveryPreview,
    summary: 'Delivery partners follow a route and capture proof at every drop, while the office sees where each order is, live.',
    built: 'Pharmacy and healthcare distribution',
    caps: ['Assigned routes', 'Proof of delivery', 'Live location', 'Delivery history'],
  },
  {
    id: 'salon', name: 'Salon ERP', sub: 'Appointments · billing · branches', icon: Scissors, Preview: SalonPreview,
    summary: 'Bookings, stylists, billing, packages and stock for salons, across every branch from one place.',
    built: 'Multi-branch salons and spas',
    caps: ['Appointments', 'Billing & packages', 'Stylist commissions', 'Branch reports'],
  },
  {
    id: 'hrms', name: 'HRMS', sub: 'Attendance · leave · shifts', icon: Users, Preview: HrmsPreview,
    summary: 'Attendance, shifts, leave and approvals for the whole team, with biometric punches syncing in automatically.',
    built: 'Teams from ten to a few hundred people',
    caps: ['Attendance', 'Leave & approvals', 'Shift rosters', 'Biometric integration'],
  },
  {
    id: 'crm', name: 'CRM', sub: 'Leads · pipeline · follow-ups', icon: Kanban, Preview: CrmPreview,
    summary: 'Every lead, quote and follow-up in one pipeline, so nothing depends on someone remembering to chase it.',
    built: 'Sales teams in manufacturing and distribution',
    caps: ['Lead capture', 'Pipeline stages', 'Follow-up reminders', 'Sales reports'],
  },
  {
    id: 'apps', name: 'Android & iOS apps', sub: 'One team, both stores', icon: Smartphone, Preview: AppsPreview,
    summary: 'Apps that field staff and customers use every day, including when the signal drops.',
    built: 'Field teams, delivery partners and customers',
    caps: ['Android & iOS', 'Offline work', 'Push notifications', 'Biometric login'],
  },
  {
    id: 'web', name: 'Websites', sub: 'Fast · findable · responsive', icon: Globe, Preview: WebPreview,
    summary: 'Business websites and customer portals that load quickly, work on every screen and are easy to find on Google.',
    built: 'Companies and customer portals',
    caps: ['Responsive design', 'SEO foundations', 'Fast loading', 'Easy content updates'],
  },
  {
    id: 'tunnel', name: 'TunnelGate', sub: 'Secure remote desktop', icon: ShieldCheck, Preview: TunnelPreview,
    summary: 'One-click remote desktop to office machines through a Zero Trust tunnel. No VPN to manage and no open ports.',
    built: 'IT teams and remote staff',
    caps: ['One-click RDP', 'Zero Trust tunnel', 'Windows, macOS, Linux', 'Native full-screen'],
  },
  {
    id: 'seo', name: 'SEO & SERP tracking', sub: 'Rankings you can read', icon: TrendingUp, Preview: SeoPreview,
    summary: 'See where your pages rank on Google, week by week, and which keywords moved.',
    built: 'Marketing and growth teams',
    caps: ['Keyword positions', 'Weekly movement', 'Page-one tracking', 'Trend history'],
  },
  {
    id: 'payroll', name: 'Payroll', sub: 'Salary · PF · TDS', icon: IndianRupee, Preview: PayrollPreview,
    summary: 'Monthly payroll with Indian statutory deductions, an approval flow, and payslips sent automatically.',
    built: 'Finance and HR teams',
    caps: ['PF, PT and TDS', 'Approval workflow', 'Payslips by email', 'Bank transfer file'],
  },
  {
    id: 'pos', name: 'POS', sub: 'Billing · stock · GST', icon: ReceiptText, Preview: PosPreview,
    summary: 'A fast billing counter with GST, UPI, card and cash, and stock that updates with every sale.',
    built: 'Bakeries, cafés and retail outlets',
    caps: ['GST billing', 'UPI, card and cash', 'Live stock', 'Multi-outlet'],
  },
];

export default function PlatformShowcase() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = PLATFORMS[active];

  const select = (i: number, focus = false) => {
    const n = (i + PLATFORMS.length) % PLATFORMS.length;
    setActive(n);
    if (focus) tabs.current[n]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select(active + 1, true); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select(active - 1, true); }
    else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
    else if (e.key === 'End') { e.preventDefault(); select(PLATFORMS.length - 1, true); }
  };

  return (
    <div className="grid lg:grid-cols-[272px_minmax(0,1fr)] gap-4 lg:gap-6 items-start">
      {/* Rail */}
      <div
        role="tablist"
        aria-label="Platforms we build"
        aria-orientation="vertical"
        onKeyDown={onKey}
        className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar snap-x -mx-6 px-6 md:-mx-10 md:px-10 lg:mx-0 lg:px-0 pb-1 lg:pb-0"
      >
        {PLATFORMS.map((x, i) => {
          const on = i === active;
          const Icon = x.icon;
          return (
            <button
              key={x.id}
              ref={(el) => { tabs.current[i] = el; }}
              id={`platform-tab-${x.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls="platform-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group snap-start shrink-0 lg:shrink lg:w-full min-w-[184px] lg:min-w-0 flex items-center gap-3 text-left px-3 py-2.5 border transition-[background-color,border-color,box-shadow] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal ${
                on ? 'bg-white border-signal shadow-[inset_3px_0_0_0_#1C75BC]' : 'bg-white/60 border-ink/12 hover:border-ink/35 hover:bg-white'
              }`}
            >
              <span className={`w-9 h-9 shrink-0 flex items-center justify-center transition-colors duration-300 ${on ? 'bg-signal text-white' : 'bg-ink/[0.05] text-ash group-hover:text-ink'}`}>
                <Icon className="w-[17px] h-[17px]" strokeWidth={1.7} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold leading-tight tracking-[-0.01em] truncate">{x.name}</span>
                <span className="block text-[11.5px] text-ash leading-tight mt-0.5 truncate">{x.sub}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage */}
      <div id="platform-panel" role="tabpanel" aria-labelledby={`platform-tab-${p.id}`} className="min-w-0 bg-white border border-ink/12">
        <div className="px-5 py-3.5 border-b border-ink/10 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 bg-signal/10 text-signal flex items-center justify-center shrink-0"><p.icon className="w-4 h-4" strokeWidth={1.7} /></span>
            <h3 className="display-md text-[17px] truncate">{p.name}</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-ash"><i className="w-1.5 h-1.5 rounded-full bg-signal pulse-dot" /> Live preview · sample data · try it</span>
        </div>

        <div className="relative bg-bone/55 blueprint-grid p-4 sm:p-6 min-h-[520px] flex items-center justify-center overflow-hidden">
          <div className="w-full relative z-10">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <p.Preview />
              </m.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="px-5 py-4 grid md:grid-cols-[1.4fr_1fr] gap-x-8 gap-y-3 border-t border-ink/10">
          <p className="body-tight">{p.summary}</p>
          <div>
            <p className="label !text-[10px] mb-2">Built for · {p.built}</p>
            <ul className="flex flex-wrap gap-1.5">
              {p.caps.map((c) => <li key={c} className="text-[11.5px] border border-ink/15 px-2.5 py-1">{c}</li>)}
            </ul>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-ink/10 bg-paper flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] text-ash">
          <span><b className="font-semibold text-ink">We build it.</b> Designed around your process.</span>
          <span><b className="font-semibold text-ink">We run it.</b> Hosting, monitoring, backups.</span>
          <span><b className="font-semibold text-ink">We maintain it.</b> Updates and support.</span>
        </div>
      </div>
    </div>
  );
}
