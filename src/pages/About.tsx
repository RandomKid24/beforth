import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import Intro from '../components/Intro';
import { Magnetic } from '../components/Magnetic';

const POINTS = [
  { n: '01', t: 'Business first', d: "We start with the problem, not the technology." },
  { n: '02', t: 'Built around your workflow', d: 'The system fits you, not the other way round.' },
  { n: '03', t: 'Simple and practical', d: 'Your team understands it on day one.' },
  { n: '04', t: 'Scalable by design', d: 'New modules slot in without a rebuild.' },
  { n: '05', t: 'One accountable partner', d: 'One team, one point of responsibility.' },
  { n: '06', t: 'Honest recommendations', d: 'If a spreadsheet solves it, we say so.' },
];

const VALUES = [
  { k: 'Clarity', v: 'Plain language and a written scope.' },
  { k: 'Craft', v: 'Tested, tidy work we put our name on.' },
  { k: 'Ownership', v: 'We treat your deadlines and data as ours.' },
  { k: 'Continuity', v: 'We stay reachable long after go-live.' },
];

const PRINCIPLES = [
  { t: 'Understand the problem', d: 'We solve the business problem, not just the requested feature.' },
  { t: 'Build for the workflow', d: 'Software follows how the business operates.' },
  { t: 'Keep information connected', d: 'The right people see the right data in context.' },
  { t: 'Automate where it matters', d: 'Automation removes work. It never complicates a simple task.' },
  { t: 'Build for change', d: 'The system changes as the business does.' },
];

const INDUSTRIES = [
  'Manufacturing', 'Logistics & Distribution', 'Pharma', 'Sales & Marketing',
  'Human Resources', 'Growing Businesses',
];

function PageHead({ label, title, children }: { label: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16 grain relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid blueprint-fade pointer-events-none" />
      <div className="wrap relative z-10">
        <Intro>
          <div className="rule mb-6" />
          <span className="label block mb-6">{label}</span>
          <h1 className="display-xl text-[clamp(2.2rem,6.4vw,4.8rem)] max-w-[17ch]">{title}</h1>
          {children && <div className="mt-8">{children}</div>}
        </Intro>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHead
        label="About"
        title={<>Technology that <span className="accent">fits</span> the business.</>}
      >
        <div className="grid md:grid-cols-2 gap-8 md:gap-14 max-w-5xl">
          <p className="lead">
            BeForth is a software company in Nashik, India. We build custom business software,
            automation and digital platforms.
          </p>
          <p className="body">
            We learn how your business runs, then build around it. ERP, CRM, HRMS, inventory,
            web and mobile.
          </p>
        </div>
      </PageHead>

      <section className="pb-20 md:pb-24">
        <div className="wrap">
          <div className="grid md:grid-cols-2 gap-5">
            <Reveal>
              <div className="surface p-7 md:p-9 h-full">
                <span className="label block mb-5">Vision</span>
                <p className="display-md text-lg md:text-[24px] leading-[1.28]">
                  Business software that is simple, smart and within reach of any company.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.07}>
              <div className="surface-ink p-7 md:p-9 h-full">
                <span className="label !text-paper/50 block mb-5">Mission</span>
                <p className="display-md text-lg md:text-[24px] leading-[1.28] text-paper">
                  Replace manual work and disconnected tools with software that is practical and
                  scales. We start by understanding the problem behind the request.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-24">
        <div className="wrap">
          <div className="rule mb-6" />
          <span className="label block mb-4">Why BeForth</span>
          <h2 className="display-lg text-[clamp(1.7rem,3.8vw,2.8rem)] mb-10 max-w-[18ch]">
            Six things that make us different.
          </h2>

          <div className="border-t border-ink/12">
            {POINTS.map((item, i) => (
              <Reveal key={item.n} delay={(i % 3) * 0.05}>
                <div className="group grid md:grid-cols-[3.5rem_1fr_1.2fr] gap-x-8 gap-y-2 py-5 md:py-7 border-b border-ink/12">
                  <span className="label text-signal transition-transform duration-500 group-hover:translate-x-1">{item.n}</span>
                  <h3 className="display-md text-base md:text-lg transition-[color,transform] duration-500 group-hover:text-signal group-hover:translate-x-2">
                    {item.t}
                  </h3>
                  <p className="body">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-24">
        <div className="wrap">
          <div className="rule mb-6" />
          <span className="label block mb-4">Our principles</span>
          <h2 className="display-lg text-[clamp(1.7rem,3.8vw,2.8rem)] mb-10 max-w-[18ch]">
            Five things we hold to.
          </h2>

          <div className="border-t border-ink/12">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={Math.min(i, 4) * 0.05}>
                <div className="group grid md:grid-cols-[3.5rem_1fr_1.2fr] gap-x-8 gap-y-2 py-5 md:py-6 border-b border-ink/12">
                  <span className="label text-signal transition-transform duration-500 group-hover:translate-x-1">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="display-md text-base md:text-lg transition-[color,transform] duration-500 group-hover:text-signal group-hover:translate-x-2">
                    {p.t}
                  </h3>
                  <p className="body">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-bone grain">
        <div className="wrap relative z-10">
          <div className="rule mb-6" />
          <span className="label block mb-4">How we operate</span>
          <h2 className="display-lg text-[clamp(1.7rem,3.8vw,2.8rem)] mb-10 max-w-[18ch]">
            Values we ship by.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-9">
            {VALUES.map((value, i) => (
              <Reveal key={value.k} delay={i * 0.06}>
                <div className="group">
                  <span className="block w-7 h-px bg-signal mb-4 transition-[width] duration-500 group-hover:w-16" />
                  <h3 className="display-md text-base mb-2">{value.k}</h3>
                  <p className="body-tight">{value.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
            <Reveal>
              <div className="rule mb-6" />
              <span className="label block mb-4">Who we work with</span>
              <h2 className="display-lg text-[clamp(1.7rem,3.8vw,2.8rem)]">Sectors we know well.</h2>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex flex-wrap gap-2.5">
                {INDUSTRIES.map((industry) => (
                  <span
                    key={industry}
                    className="label border border-ink/15 bg-white px-4 py-2.5 transition-colors duration-300 hover:border-signal hover:text-signal"
                  >
                    {industry}
                  </span>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-ink/12">
                <p className="body max-w-lg mb-6">
                  Your sector not listed? The method is the same.
                </p>
                <Magnetic>
                  <Link to="/contact" className="btn-signal">
                    Start a conversation <ArrowRight className="w-4 h-4" />
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
