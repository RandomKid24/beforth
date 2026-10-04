import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import Reveal from '../components/Reveal';
import Intro from '../components/Intro';
import { Magnetic } from '../components/Magnetic';
import WorkflowDiagram from '../components/WorkflowDiagram';

const SERVICES = [
  {
    n: '01',
    title: 'Custom ERP',
    summary: 'A business management system designed around your operations.',
    detail:
      'Manage departments, workflows and business data through one connected platform — starting with the processes you need today and expanding as the business grows.',
    points: [
      'Inventory management', 'Purchase management', 'Sales management',
      'Production workflows', 'Finance & operations', 'Employee management',
      'Approvals', 'CRM', 'Reporting', 'Dashboards', 'Business analytics', 'Workflow automation',
    ],
  },
  {
    n: '02',
    title: 'CRM',
    summary: 'Make every lead and follow-up count.',
    detail:
      'A CRM built around your actual sales process, instead of changing your process to fit generic software.',
    points: [
      'Lead management', 'Custom sales pipelines', 'Follow-up management',
      'Customer records', 'Campaign tracking', 'Sales activity',
      'Notifications & reminders', 'Reports & analytics', 'Workflow automation',
    ],
  },
  {
    n: '03',
    title: 'HRMS & Payroll',
    summary: 'One system for your workforce operations.',
    detail:
      'Employee information, attendance, shifts, leave and payroll through workflows designed around your policies and salary structure — whether the team is ten people or several hundred.',
    points: [
      'Employee management', 'Attendance tracking', 'Shift management',
      'Leave management', 'Payroll processing', 'Salary calculations',
      'Approval workflows', 'Biometric integration', 'Reports', 'Dashboards', 'Workforce analytics',
    ],
  },
  {
    n: '04',
    title: 'Inventory Management',
    summary: 'Know what you have, where it is and what needs attention.',
    detail:
      'Inventory gets harder to manage as operations grow. We build systems that give real visibility across stock, materials, warehouses and operational workflows.',
    points: [
      'Real-time stock visibility', 'Raw material management', 'Warehouse management',
      'Stock movement', 'Reorder alerts', 'Purchase & issue workflows',
      'Production-related inventory', 'Reporting & analytics',
    ],
  },
  {
    n: '05',
    title: 'Business Automation',
    summary: 'Reduce repetitive work.',
    detail:
      'Not every task needs handling by hand. We connect workflows, data and notifications so routine processes move automatically.',
    points: [
      'Approval workflows', 'Automated notifications', 'Follow-up reminders',
      'Status updates', 'Data synchronisation', 'Report generation',
      'Lead workflows', 'HR processes', 'Inventory alerts', 'Operational triggers',
    ],
  },
  {
    n: '06',
    title: 'Web Applications',
    summary: 'Business software that runs in the browser.',
    detail:
      'Modern web platforms from internal applications to complex dashboards and customer-facing systems, with a focus on usability, performance, maintainability and scalable architecture.',
    stack: 'Next.js · React · Node.js · PostgreSQL',
  },
  {
    n: '07',
    title: 'Mobile Applications',
    summary: 'Take your business wherever work happens.',
    detail:
      'Applications for employees, field teams, customers and business operations — from field apps to enterprise mobile workflows, designed around the people actually using them.',
    stack: 'Flutter · React Native · Swift · Kotlin',
  },
];

const SECTORS = [
  {
    n: 'Manufacturing',
    desc: 'Connect inventory, materials, production, sales and operations through a unified system.',
    uses: ['Manufacturing ERP', 'Inventory visibility', 'Raw-material tracking', 'Production workflows', 'Warehouse management', 'Operational dashboards'],
  },
  {
    n: 'Logistics & Distribution',
    desc: 'Bring shipments, routes, deliveries, vendors and operational information into one system.',
    uses: ['Shipment management', 'Delivery workflows', 'Route tracking', 'Vendor management', 'Proof of delivery', 'Real-time visibility'],
  },
  {
    n: 'Sales & Marketing',
    desc: 'Give sales teams a single place to manage leads, customers and follow-ups.',
    uses: ['CRM', 'Lead generation', 'Follow-up management', 'Sales pipelines', 'Campaign management', 'Sales dashboards'],
  },
  {
    n: 'Human Resources',
    desc: 'Simplify employee administration and workforce operations.',
    uses: ['HRMS', 'Attendance', 'Leave', 'Shifts', 'Payroll', 'Biometric integration'],
  },
  {
    n: 'Growing Businesses',
    desc: 'Replace fragmented workflows with systems that bring departments, information and processes together.',
    uses: ['Spreadsheet replacement', 'Department systems', 'Connected workflows', 'Shared data', 'Dashboards'],
  },
];

const ENGAGEMENT = [
  { k: 'Discovery', v: 'We map your process and agree what success looks like.' },
  { k: 'Proposal', v: 'Scope, sequence and cost — in plain language.' },
  { k: 'Build', v: 'Modular delivery, with working software early.' },
  { k: 'Handover', v: 'Training, documentation and support.' },
];

function PageHead({ label, title, lead }: { label: string; title: React.ReactNode; lead?: string }) {
  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16 grain relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid blueprint-fade pointer-events-none" />
      <div className="wrap relative z-10">
        <Intro>
          <div className="rule mb-6" />
          <span className="label block mb-6">{label}</span>
          <h1 className="display-xl text-[clamp(2.2rem,6.4vw,4.8rem)] max-w-[16ch]">{title}</h1>
          {lead && <p className="lead max-w-2xl mt-7">{lead}</p>}
        </Intro>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHead
        label="Services"
        title={<>Everything you need to <span className="accent">run on.</span></>}
        lead="Seven service lines, one accountable partner."
      />

      <section className="pb-20 md:pb-24">
        <div className="wrap">
          <div className="flex flex-col gap-16 md:gap-20">
            {SERVICES.map((service, i) => (
              <Reveal key={service.n}>
                <article className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16">
                  <div className="lg:sticky lg:top-28 lg:self-start">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="label text-signal">{service.n}</span>
                      <span className="h-px flex-1 bg-ink/15" />
                    </div>
                    <h2 className="display-lg text-[clamp(1.5rem,3.4vw,2.4rem)] mb-2">
                      {service.title}
                    </h2>
                    <p className="accent text-lg md:text-xl mb-4">{service.summary}</p>
                    <p className="body max-w-md">{service.detail}</p>
                    {service.stack && (
                      <p className="label !text-[10px] !tracking-[0.14em] mt-5 pt-5 border-t border-ink/12">
                        {service.stack}
                      </p>
                    )}
                  </div>

                  <div className="surface p-6 md:p-9 h-fit">
                    {service.points && (
                      <>
                        <span className="label block mb-5">Capabilities can include</span>
                        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                          {service.points.map((point) => (
                            <li key={point} className="flex items-start gap-2.5">
                              <Check className="w-3.5 h-3.5 text-signal mt-1 shrink-0" />
                              <span className="text-[13.5px] text-ink/85 leading-snug">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {i === 0 && (
                      <div className="mt-6 pt-5 border-t border-ink/12">
                        <p className="body mb-4 max-w-md">
                          Any module can stand alone, or be wired into one connected system.
                        </p>
                        <Link to="/contact" className="ulink">
                          Discuss your requirements <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions by business need */}
      <section className="section bg-bone grain">
        <div className="wrap relative z-10">
          <div className="rule mb-6" />
          <span className="label block mb-4">Solutions by business need</span>
          <h2 className="display-lg text-[clamp(1.7rem,3.8vw,2.8rem)] mb-12 max-w-[20ch]">
            Common use cases, by sector.
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {SECTORS.map((sector, i) => (
              <Reveal key={sector.n} delay={(i % 2) * 0.06}>
                <div className="h-full p-6 md:p-7 bg-paper border border-ink/12">
                  <h3 className="display-md text-base mb-2">{sector.n}</h3>
                  <p className="body-tight mb-5">{sector.desc}</p>
                  <span className="label block mb-2.5 !text-[10px]">Common use cases</span>
                  <ul className="flex flex-wrap gap-1.5">
                    {sector.uses.map((u) => (
                      <li key={u} className="label !text-[10px] border border-ink/12 px-2.5 py-1">
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Topology */}
      <section className="pb-20 md:pb-24">
        <div className="wrap">
          <Reveal>
            <div className="rule mb-6" />
            <span className="label block mb-4">How it fits together</span>
            <h2 className="display-lg text-[clamp(1.7rem,3.8vw,2.8rem)] mb-9 max-w-[18ch]">
              Separate modules, one source of truth.
            </h2>

            <div className="surface p-6 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 mb-7 border-b border-ink/12">
                <div>
                  <span className="figure-cap block mb-1.5">Figure 01</span>
                  <h3 className="display-md text-base">Integration topology</h3>
                </div>
                <span className="figure-cap hidden md:block max-w-[26ch] leading-relaxed">
                  Operational modules resolved into one connected system
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-0 blueprint-grid blueprint-fade pointer-events-none opacity-60" />
                <div className="relative mx-auto max-w-[500px]">
                  <WorkflowDiagram />
                </div>
              </div>

              <div className="mt-7 pt-4 border-t border-ink/12 flex flex-wrap items-center justify-between gap-2">
                <span className="figure-cap">Sales · Inventory · Finance · People · Service</span>
                <span className="figure-cap">Hover a node to trace</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section surface-ink grain">
        <div className="wrap relative z-10">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20">
            <Reveal>
              <span className="label !text-paper/45 block mb-5">How an engagement runs</span>
              <h2 className="display-lg text-[clamp(1.7rem,4vw,2.8rem)] text-paper mb-4">
                No surprises.<br />No black box.
              </h2>
              <p className="text-paper/60 leading-relaxed max-w-xs">
                You always know what is being built, what it costs, and what happens next.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-px bg-paper/15 border border-paper/15">
              {ENGAGEMENT.map((step, i) => (
                <Reveal key={step.k} delay={i * 0.06}>
                  <div className="bg-ink p-6 h-full">
                    <span className="label !text-wave block mb-3">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="display-md text-base mb-1.5">{step.k}</h3>
                    <p className="text-paper/55 text-[13.5px] leading-relaxed">{step.v}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="wrap">
          <Reveal>
            <div className="rule mb-9" />
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
              <h2 className="display-lg text-[clamp(1.5rem,3.4vw,2.5rem)] max-w-[22ch]">
                Not sure which one you need? That is normal.
              </h2>
              <Magnetic>
                <Link to="/contact" className="btn-signal shrink-0">
                  Tell us the problem <ArrowRight className="w-4 h-4" />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
