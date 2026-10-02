import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';
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
  { k: 'Clarity', v: 'Plain language, documented scope, no jargon between you and the build.' },
  { k: 'Craft', v: 'Work we are happy to put our name on — tested, tidy and built to last.' },
  { k: 'Ownership', v: 'Your deadlines and data treated as our own.' },
  { k: 'Continuity', v: 'Reachable for the years after go-live.' },
];

const PRINCIPLES = [
  { t: 'Understand the problem', d: 'We focus on the actual business challenge, not just the requested feature.' },
  { t: 'Build for the workflow', d: 'Software should support how the business operates.' },
  { t: 'Keep information connected', d: 'Data is more useful when the right teams can access it in the right context.' },
  { t: 'Automate where it matters', d: 'Automation should remove unnecessary work, not make simple work complicated.' },
  { t: 'Build for change', d: 'A business system should be able to evolve as the business does.' },
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
        <Reveal>
          <div className="rule mb-6" />
          <span className="label block mb-6">{label}</span>
          <h1 className="display-xl text-[clamp(2.2rem,6.4vw,4.8rem)] max-w-[17ch]">{title}</h1>
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
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
            Our work is simple to state: understand how a business really runs, then build
            technology around it. Our span covers ERP, CRM, HRMS, inventory systems, business
            applications, web platforms and mobile applications.
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
                  Business technology that is simpler, smarter and accessible to any company, at
                  any size.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.07}>
              <div className="surface-ink p-7 md:p-9 h-full">
                <span className="label !text-paper/50 block mb-5">Mission</span>
                <p className="display-md text-lg md:text-[24px] leading-[1.28] text-paper">
                  Replace manual processes and disconnected tools with practical, scalable
                  technology that makes businesses run better. Our job is not simply to deliver
                  software — it is to understand the problem behind the request.
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
                  <span className="label text-signal">{item.n}</span>
                  <h3 className="display-md text-base md:text-lg transition-colors duration-500 group-hover:text-signal">
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
                  <span className="label text-signal">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="display-md text-base md:text-lg transition-colors duration-500 group-hover:text-signal">
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
                <div>
                  <span className="block w-7 h-px bg-signal mb-4" />
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
                  If your sector is not listed, that is not a blocker. The method is the same.
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
