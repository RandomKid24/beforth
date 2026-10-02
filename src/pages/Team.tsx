import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import { Magnetic } from '../components/Magnetic';

const TEAM = [
  {
    name: 'Vivek Zope',
    initials: 'VZ',
    role: 'Chief Executive Officer',
    focus: 'Strategy & Growth',
    desc: 'Leads client partnerships and product direction, keeping every engagement tied to a business outcome.',
  },
  {
    name: 'Ritesh Mahale',
    initials: 'RM',
    role: 'Chief Technology Officer',
    focus: 'Architecture & Backend',
    desc: 'Owns architecture, data modelling and backend engineering — the decisions that outlast the project.',
  },
  {
    name: 'Aditya Badgujar',
    initials: 'AB',
    role: 'Chief Operating Officer',
    focus: 'Product & Frontend',
    desc: 'Runs research, interface design and frontend engineering, making complex systems feel simple.',
  },
];

const DISCIPLINES = [
  'Engineering', 'Product design', 'Requirements', 'QA & testing', 'DevOps', 'Client partnership',
];

function PageHead({ label, title, lead }: { label: string; title: React.ReactNode; lead?: string }) {
  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16 grain relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid blueprint-fade pointer-events-none" />
      <div className="wrap relative z-10">
        <Reveal>
          <div className="rule mb-6" />
          <span className="label block mb-6">{label}</span>
          <h1 className="display-xl text-[clamp(2.2rem,6.4vw,4.8rem)] max-w-[15ch]">{title}</h1>
          {lead && <p className="lead max-w-2xl mt-7">{lead}</p>}
        </Reveal>
      </div>
    </section>
  );
}

export default function TeamPage() {
  return (
    <>
      <PageHead
        label="Team"
        title={<>A small team that <span className="accent">owns</span> the outcome.</>}
        lead="The people who scope your project are the people who build and support it. No handoffs."
      />

      <section className="pb-20 md:pb-24">
        <div className="wrap">
          <div className="border-t border-ink/12">
            {TEAM.map((person, i) => (
              <Reveal key={person.name} delay={i * 0.06}>
                <div className="group grid md:grid-cols-[auto_1fr_1.1fr] gap-6 md:gap-10 items-start py-7 md:py-9 border-b border-ink/12">
                  <span className="font-display font-extrabold text-2xl md:text-3xl text-signal w-14 md:w-16 shrink-0 leading-none">
                    {person.initials}
                  </span>
                  <div>
                    <h2 className="display-lg text-[clamp(1.25rem,2.6vw,1.9rem)] leading-tight mb-1.5 transition-colors duration-500 group-hover:text-signal">
                      {person.name}
                    </h2>
                    <p className="label mb-1.5">{person.role}</p>
                    <p className="accent text-base">{person.focus}</p>
                  </div>
                  <p className="body max-w-md">{person.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-bone grain">
        <div className="wrap relative z-10">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-center">
            <Reveal>
              <div className="rule mb-6" />
              <span className="label block mb-4">Capabilities in-house</span>
              <h2 className="display-lg text-[clamp(1.6rem,3.6vw,2.6rem)] mb-5">
                Everything under one roof.
              </h2>
              <p className="body max-w-sm mb-7">
                Requirements, design, engineering, testing and deployment — same team throughout.
              </p>
              <Magnetic>
                <Link to="/contact" className="btn-solid">
                  Work with us <ArrowRight className="w-4 h-4" />
                </Link>
              </Magnetic>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex flex-wrap gap-2.5">
                {DISCIPLINES.map((d) => (
                  <span key={d} className="label bg-white border border-ink/15 px-4 py-2.5">
                    {d}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="wrap">
          <Reveal>
            <div className="rule mb-9" />
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
              <h2 className="display-lg text-[clamp(1.5rem,3.4vw,2.5rem)] max-w-[22ch]">
                Hiring? We are open to good engineers.
              </h2>
              <div className="flex flex-wrap gap-3">
                <Magnetic>
                  <a href="mailto:support@beforth.in" className="btn-line">
                    Send an introduction <ArrowUpRight className="w-4 h-4" />
                  </a>
                </Magnetic>
                <Link to="/contact" className="btn-line">
                  Contact us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
