import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import * as m from 'motion/react-m';
import { ArrowUpRight, ArrowRight, ArrowDown, Mail, Phone, MapPin, Check, Compass, Handshake, MousePointerClick, Puzzle } from 'lucide-react';

import { Magnetic } from '@/components/Magnetic';
import Reveal from '@/components/Reveal';
import { SECTORS } from '@/lib/sectors';
import ProductShowcase from '@/components/ProductShowcase';
import PlatformShowcase from '@/components/PlatformShowcase';
import SectionHead from '@/components/SectionHead';
import { useMotionPreset, springSmooth, springSnappy } from '@/lib/motion';

import ServicesPage from './pages/Services';
import AboutPage from './pages/About';
import TeamPage from './pages/Team';
import ContactPage from './pages/Contact';
import NotFound from './pages/NotFound';
import ProductPage from './pages/ProductPage';
import { PLATFORMS, getPlatform } from '@/components/platforms/catalog';

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/about', label: 'About' },
  { path: '/team', label: 'Team' },
  { path: '/contact', label: 'Contact' },
];

const SERVICES = [
  { n: '01', title: 'Business Software & ERP', desc: 'Sales, HR, service, inventory and reporting on one platform.' },
  { n: '02', title: 'Workflow Automation', desc: 'Approvals and follow-ups tracked, not chased.' },
  { n: '03', title: 'Custom Software', desc: 'Built for the cases off-the-shelf cannot cover.' },
  { n: '04', title: 'Web & Mobile Apps', desc: 'Websites, portals and apps your team will actually use.' },
  { n: '05', title: 'Integrations', desc: 'ERP, accounts, CRM and APIs talking to each other.' },
];

const METHOD = [
  { n: '01', title: 'Discovery', desc: 'We study your workflows, departments, users, data and bottlenecks.' },
  { n: '02', title: 'Architecture', desc: 'Database, application structure, roles, permissions, integrations.' },
  { n: '03', title: 'Development', desc: 'Built in stages, so progress is reviewed throughout.' },
  { n: '04', title: 'Testing & onboarding', desc: 'We validate behaviour, migrate data and train users.' },
  { n: '05', title: 'Deployment', desc: 'Released for real use with the required infrastructure.' },
  { n: '06', title: 'Optimization', desc: 'Monitored, improved and extended as requirements change.' },
];

const FITS = [
  'You have outgrown spreadsheets',
  'The same data gets typed in twice',
  'Nobody trusts the numbers',
  'Work gets lost over chat and phone',
  'Off-the-shelf software almost fits',
];

const NOT_FITS = [
  'You just need a simple website',
  'You want zero customisation',
  'You want a subscription, not a system you own',
];

const REASONS = [
  { icon: Compass, title: 'Business first', desc: 'We start with the problem, not the technology.', how: 'Discovery maps your workflows, users and bottlenecks before any code is written.' },
  { icon: Puzzle, title: 'Built around you', desc: 'Your process stays. The software adapts.', how: 'Roles, approvals and reports mirror how your team already works.' },
  { icon: MousePointerClick, title: 'Simple to use', desc: 'Your team needs no training manual.', how: 'Designed around the people who use it daily, then onboarded with them.' },
  { icon: Handshake, title: 'One partner', desc: 'Everything under one roof, one point of contact.', how: 'We design, build, run and maintain it. One team, no hand-offs.' },
];

const OUTCOMES = [
  { from: 'Spreadsheets', to: 'One source of truth' },
  { from: 'Chat follow-ups', to: 'Tracked workflows' },
  { from: 'Hand-made reports', to: 'Live MIS' },
  { from: 'Forced-fit software', to: 'Systems that fit' },
];

const PILLARS = [
  { k: 'ERP', v: 'Operations in one system' },
  { k: 'CRM', v: 'Leads and pipelines' },
  { k: 'HRMS', v: 'People, shifts, payroll' },
  { k: 'Inventory', v: 'Stock and materials' },
  { k: 'Automation', v: 'Workflows that run themselves' },
  { k: 'Web & Mobile', v: 'Anywhere work happens' },
];

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { shouldReduce } = useMotionPreset();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ${
          scrolled || open
            ? 'bg-paper/90 backdrop-blur-xl border-b border-ink/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="wrap">
          <div className="flex items-center justify-between h-[68px] md:h-[76px]">
            <m.div
              initial={shouldReduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springSmooth}
            >
              <Link to="/" className="flex items-center gap-2.5 min-h-[40px] shrink-0" aria-label="BeForth home">
                <m.img
                  src="/befu.png"
                  alt=""
                  className="w-7 h-7 object-contain"
                  initial={shouldReduce ? false : { opacity: 0, scale: 0.7, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={springSmooth}
                />
                <span className="font-display font-extrabold uppercase tracking-[0.14em] text-[14px] md:text-[15px]">
                  Beforth
                </span>
              </Link>
            </m.div>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV.map((item, i) => {
                const active = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
                return (
                  <m.span
                    key={item.path}
                    initial={shouldReduce ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springSmooth, delay: 0.16 + i * 0.06 }}
                  >
                    <Link
                      to={item.path}
                      className={`label transition-colors duration-300 ${active ? 'text-signal' : 'hover:text-ink'}`}
                    >
                      {item.label}
                    </Link>
                  </m.span>
                );
              })}
            </nav>

            <m.div
              className="hidden lg:block"
              initial={shouldReduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springSmooth}
            >
              <Magnetic>
                <Link to="/contact" className="btn-signal !px-5 !py-2.5 !text-[10px]">
                  Start a project <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </Magnetic>
            </m.div>

            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden flex flex-col items-center justify-center gap-[5px] w-11 h-11 -mr-2"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span className={`block w-6 h-px bg-ink transition-transform duration-300 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
              <span className={`block w-6 h-px bg-ink transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-px bg-ink transition-transform duration-300 ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <m.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        transition={{ duration: 0.28 }}
        className="lg:hidden fixed inset-0 z-40 bg-paper grain flex flex-col justify-center px-6"
      >
        <div className="relative z-10 flex flex-col">
          {NAV.map((item, i) => (
            <m.div
              key={item.path}
              initial={{ opacity: 0, y: 16 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ delay: open ? 0.05 * i : 0, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-ink/12"
            >
              <Link
                to={item.path}
                className="display-lg block text-[13vw] leading-[1.1] py-3 hover:text-signal transition-colors"
              >
                {item.label}
              </Link>
            </m.div>
          ))}
        </div>
        <m.div
          initial={{ opacity: 0 }}
          animate={open ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.26 }}
          className="relative z-10 mt-10 flex flex-col label normal-case"
        >
          <a href="mailto:support@beforth.in" className="flex items-center min-h-[28px] hover:text-signal transition-colors">support@beforth.in</a>
          <a href="tel:+919766183834" className="flex items-center min-h-[28px] hover:text-signal transition-colors">+91 97661 83834</a>
        </m.div>
      </m.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function Hero() {
  const { shouldReduce } = useMotionPreset();

  return (
    <section
      className="relative min-h-[100svh] flex flex-col justify-between pt-28 md:pt-36 pb-8 grain overflow-hidden"
    >
      {/* Parallax layers run on the compositor via CSS scroll timelines
          where supported, and stay static where they are not. */}

      <div
        data-parallax
        className="absolute inset-0 blueprint-grid blueprint-fade pointer-events-none"
        style={{ '--parallax-shift': '18%' } as React.CSSProperties}
      />
      <div
        data-parallax
        className="absolute top-[-10rem] right-[-8rem] w-[42rem] h-[42rem] pointer-events-none"
        style={{ '--parallax-shift': '30%' } as React.CSSProperties}
      >
        <div
          className="w-full h-full"
          style={{ background: 'radial-gradient(circle, rgba(28,117,188,0.09) 0%, transparent 68%)' }}
        />
      </div>

      <div
        data-parallax
        className="wrap relative z-10 w-full flex-1 flex flex-col justify-center"
        style={
          {
            '--parallax-shift': '-40px',
            '--parallax-opacity-to': '0.4',
          } as React.CSSProperties
        }
      >
        <m.div
          initial={shouldReduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSmooth, delay: 0.15 }}
          className="pb-7 flex items-center gap-4"
        >
          <m.span
            initial={shouldReduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="block w-10 h-px bg-signal origin-left"
          />
          <span className="label">Nashik, Maharashtra, India</span>
        </m.div>

        <h1 className="display-xl text-[clamp(1.75rem,7.4vw,6.2rem)] max-w-[16ch]">
          {['Software that fits', 'the way your', 'business runs.'].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <m.span
                initial={shouldReduce ? false : { y: '106%' }}
                animate={{ y: 0 }}
                transition={{ ...springSmooth, delay: 0.3 + i * 0.11 }}
                className="block"
              >
                {i === 2 ? (
                  <>
                    <m.span
                      initial={shouldReduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.62 }}
                      className="accent"
                    >
                      business
                    </m.span>
                    {' runs.'}
                  </>
                ) : (
                  line
                )}
              </m.span>
            </span>
          ))}
        </h1>

        <m.div
          initial={shouldReduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSmooth, delay: 0.75 }}
          className="mt-9 md:mt-12 flex flex-wrap items-center gap-x-8 gap-y-5"
        >
          <p className="lead max-w-lg">
            Custom business software, automation and integrations for companies that have outgrown
            spreadsheets.
          </p>
          <div className="flex flex-wrap items-center gap-5 lg:ml-auto">
            <m.span
              initial={shouldReduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...springSnappy, delay: 0.95 }}
            >
              <Magnetic>
                <Link to="/contact" className="btn-signal">
                  Start a project <ArrowRight className="w-4 h-4" />
                </Link>
              </Magnetic>
            </m.span>
            <m.span
              initial={shouldReduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springSmooth, delay: 1.05 }}
            >
              <a href="#services" className="ulink">
                What we build <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </m.span>
          </div>
        </m.div>
      </div>

      <m.div
        initial={shouldReduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springSmooth, delay: 1.15 }}
        className="wrap relative z-10 w-full mt-10"
      >
        <m.div
          initial={shouldReduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="rule mb-5 origin-left"
        />
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          {PILLARS.map((p, i) => (
            <m.div
              key={p.k}
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springSmooth, delay: 1.3 + i * 0.07 }}
              className="flex flex-col gap-0.5"
            >
              <span className="font-display font-bold text-[15px] md:text-base tracking-tight">{p.k}</span>
              <span className="label !text-[10px]">{p.v}</span>
            </m.div>
          ))}
        </div>
      </m.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Positioning                                                         */
/* ------------------------------------------------------------------ */
function Positioning() {
  return (
    <section className="py-14 md:py-16">
      <div className="wrap">
        <div className="grid lg:grid-cols-[0.28fr_1fr] gap-8 lg:gap-14 items-start">
          <Reveal>
            <div className="rule mb-5" />
            <span className="label">What we do</span>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="display-lg text-xl md:text-[28px] leading-[1.3] max-w-[30ch]">
              We build the systems a business runs on — sales, inventory, service, finance and
              reporting — <span className="accent">connected in one place.</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Fit                                                                 */
/* ------------------------------------------------------------------ */
function Fit() {
  return (
    <section className="section bg-bone grain">
      <div className="wrap relative z-10">
        <SectionHead
          label="Who it's for"
          title={<>Built for companies that have <span className="accent">outgrown spreadsheets.</span></>}
        />

        <div className="grid lg:grid-cols-2 gap-5">
          <Reveal>
            <div className="surface p-6 md:p-8 h-full">
              <h3 className="display-md text-base mb-6 text-signal">You will get on well if…</h3>
              <ul className="flex flex-col gap-3">
                {FITS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal mt-2.5 shrink-0" />
                    <span className="body text-ink/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.07}>
            <div className="surface p-6 md:p-8 h-full">
              <h3 className="display-md text-base mb-6">Probably not you, if…</h3>
              <ul className="flex flex-col gap-3">
                {NOT_FITS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink/20 mt-2.5 shrink-0" />
                    <span className="body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-5 border border-ink/12 bg-paper px-6 py-5">
            <span className="label">Typical client</span>
            <p className="display-md text-base mt-1.5">
              Manufacturing, pharma, distribution and service — 20 to 500 people.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                             */
/* ------------------------------------------------------------------ */
function ServicesSection() {
  return (
    <section id="services" className="section scroll-mt-20">
      <div className="wrap">
        <SectionHead
          label="What we build"
          title={<>Five things. One accountable partner.</>}
        />

        <div className="border-t border-ink/12">
          {SERVICES.map((service, i) => (
            <Reveal key={service.n} delay={i * 0.04}>
              <Link
                to="/services"
                className="group grid md:grid-cols-[3.5rem_1fr_auto] gap-x-8 gap-y-2 py-6 md:py-7 px-3 -mx-3 transition-colors duration-500 hover:bg-bone/50"
              >
                <span className="label transition-colors duration-500 group-hover:text-signal">
                  {service.n}
                </span>
                <h3 className="display-lg text-[clamp(1.3rem,2.4vw,1.9rem)] transition-colors duration-500 group-hover:text-signal">
                  {service.title}
                </h3>
                <div className="flex items-center gap-6 md:justify-end">
                  <p className="body text-right max-w-sm">{service.desc}</p>
                  <span className="w-8 h-8 border border-ink/15 flex items-center justify-center shrink-0 transition-[background-color,border-color,color] duration-500 group-hover:bg-signal group-hover:border-signal group-hover:text-white">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Product proof                                                        */
/* ------------------------------------------------------------------ */
function ProductProof() {
  return (
    <section className="section bg-bone grain">
      <div className="wrap relative z-10">
        <SectionHead
          label="The work"
          title={<>This is what we <span className="accent">actually build.</span></>}
          note="A representative screen from a business management system."
        />

        <Reveal>
          <div className="surface overflow-hidden">
            <ProductShowcase />
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 md:px-7 py-4 border-t border-ink/12 bg-paper">
              <span className="figure-cap">Sales · Inventory · Service · People · Finance · Reports</span>
              <Link to="/contact" className="ulink">
                Request a walkthrough <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Method                                                               */
/* ------------------------------------------------------------------ */
function Method() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rule mb-6" />
            <span className="label block mb-4">How we work</span>
            <h2 className="display-lg text-[clamp(1.8rem,4.2vw,3rem)] mb-5 max-w-[16ch]">
              A method, not a guess.
            </h2>
            <p className="body max-w-xs">
              Five stages, every time. The order is why the result fits.
            </p>
          </div>

          <div className="border-t border-ink/12">
            {METHOD.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.05}>
                <div className="group grid sm:grid-cols-[3.5rem_1fr] gap-x-6 gap-y-1 py-5 md:py-6 border-b border-ink/12">
                  <span className="label text-signal">{step.n}</span>
                  <div>
                    <h3 className="display-md text-lg mb-1 transition-colors duration-500 group-hover:text-signal">
                      {step.title}
                    </h3>
                    <p className="body">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why + outcomes                                                       */
/* ------------------------------------------------------------------ */
function Why() {
  return (
    <section className="section bg-bone grain">
      <div className="wrap relative z-10">
        <SectionHead
          label="Why BeForth"
          title={<>Software built around <span className="accent">your business.</span></>}
          note="Four commitments we hold every project to — and what they change for you."
        />

        <div className="grid lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3 lg:gap-4">
            {REASONS.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <Reveal key={reason.title} delay={i * 0.06} className="h-full">
                  <div className="group h-full bg-white border border-ink/12 p-6 flex flex-col transition-[border-color,box-shadow,transform] duration-500 hover:border-signal/50 hover:shadow-[0_16px_34px_-22px_rgba(28,117,188,0.55)] hover:-translate-y-0.5">
                    <div className="flex items-start justify-between mb-8">
                      <span className="w-11 h-11 bg-signal/10 text-signal flex items-center justify-center transition-colors duration-500 group-hover:bg-signal group-hover:text-white">
                        <Icon className="w-5 h-5" strokeWidth={1.6} />
                      </span>
                      <span className="label !text-[10px]">0{i + 1}</span>
                    </div>
                    <h3 className="display-md text-[19px]">{reason.title}</h3>
                    <p className="body-tight mt-1.5 !text-[14px]">{reason.desc}</p>
                    <p className="mt-auto pt-5 text-[13px] leading-snug text-ink/75">
                      <span className="block h-px w-8 bg-signal mb-3" />
                      {reason.how}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1} className="lg:col-span-5 h-full">
            <div className="relative h-full overflow-hidden bg-ink text-paper p-6 md:p-8 flex flex-col">
              <span aria-hidden className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-signal/30 blur-3xl" />
              <span aria-hidden className="pointer-events-none absolute -bottom-28 -left-16 w-64 h-64 rounded-full bg-wave/15 blur-3xl" />
              <div className="relative">
                <span className="label !text-wave">What changes</span>
                <h3 className="display-lg text-[clamp(1.4rem,2.4vw,1.85rem)] mt-3 mb-7 max-w-[18ch]">From workarounds to a system that fits.</h3>
              </div>

              <ul className="relative flex-1 flex flex-col">
                {OUTCOMES.map((row) => (
                  <li key={row.to} className="group grid grid-cols-[1fr] gap-1 py-4 border-t border-paper/15">
                    <span className="text-[13px] text-paper/45 line-through decoration-paper/30 decoration-1">{row.from}</span>
                    <span className="flex items-center gap-3 text-[17px] md:text-[18px] font-semibold tracking-[-0.015em] transition-transform duration-500 group-hover:translate-x-1">
                      <span className="w-5 h-5 shrink-0 rounded-full bg-wave/20 text-wave flex items-center justify-center">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      {row.to}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="relative mt-6 pt-5 border-t border-paper/15 text-[13px] text-paper/65 leading-relaxed">
                A system you own and that fits your process — not a subscription you adapt to.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Platforms — shown in place, never linked away                        */
/* ------------------------------------------------------------------ */
function Products() {
  return (
    <section id="platforms" className="section scroll-mt-20">
      <div className="wrap">
        <Reveal>
          <PlatformShowcase />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Selected work                                                        */
/* ------------------------------------------------------------------ */
const WORK = [
  {
    title: 'Global Logistics ERP',
    kind: 'Supply chain · Web application',
    desc: 'A logistics management concept bringing shipments, vendors, routes, reports and an operations centre into one centralised interface.',
    points: ['Shipment management', 'Vendor management', 'Routes', 'Operations dashboard', 'Reporting'],
  },
  {
    title: 'SalesPulse CRM',
    kind: 'CRM · Mobile application',
    desc: 'A sales-management platform concept built around leads, customer activity, pipeline stages and sales reporting.',
    points: ['Lead management', 'Sales pipeline', 'Lead trends', 'Customer activity', 'Sales metrics'],
  },
];

function SelectedWork() {
  return (
    <section className="section bg-bone grain">
      <div className="wrap relative z-10">
        <SectionHead
          label="Selected work"
          title={<>Two systems we designed end to <span className="accent">end.</span></>}
        />

        <div className="grid md:grid-cols-2 gap-5">
          {WORK.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="h-full p-6 md:p-8 bg-paper border border-ink/12">
                <span className="label block mb-4">{item.kind}</span>
                <h3 className="display-lg text-xl md:text-2xl mb-3">{item.title}</h3>
                <p className="body-tight mb-6">{item.desc}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {item.points.map((point) => (
                    <li key={point} className="label !text-[10px] border border-ink/12 px-2.5 py-1">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                  */
/* ------------------------------------------------------------------ */
const FAQ = [
  {
    q: 'What does BeForth do?',
    a: 'We develop custom ERP systems, CRM platforms, HRMS solutions, inventory systems, business applications, web and mobile applications, and workflow automation.',
  },
  {
    q: 'Is the software custom or off-the-shelf?',
    a: 'Custom. We design around your approval structures, roles, pricing rules, inventory processes and reporting requirements rather than fitting you into a predefined structure.',
  },
  {
    q: 'Can you work with an existing process?',
    a: 'Yes. Development starts by understanding your processes, roles, workflows, integrations and reporting requirements, then builds around them.',
  },
  {
    q: 'Do you build mobile applications?',
    a: 'Yes — native and cross-platform, using Swift, Kotlin, Flutter and React Native.',
  },
  {
    q: 'Can it integrate with our existing systems?',
    a: 'Yes. Systems are designed with integrations and APIs according to the project requirements.',
  },
  {
    q: 'Do you build HR and payroll systems?',
    a: 'Yes. HRMS and payroll solutions cover employee management, attendance, shifts, leave, payroll, salary calculation, approvals, reports and biometric integration.',
  },
  {
    q: 'Where are you based?',
    a: 'Nashik, Maharashtra, India.',
  },
];

function Faq() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="wrap">
        <SectionHead label="FAQ" title={<>Questions worth <span className="accent">answering.</span></>} />
        <div className="border-t border-ink/12">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 4) * 0.04}>
              <details className="group py-4 md:py-5 border-b border-ink/12">
                <summary className="flex items-start gap-4 cursor-pointer list-none min-h-[32px]">
                  <span className="label text-signal shrink-0 pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 display-md text-base md:text-lg transition-colors duration-300 group-open:text-signal">
                    {item.q}
                  </span>
                  <span className="shrink-0 text-ash group-open:text-signal transition-colors text-lg leading-none pt-0.5">
                    +
                  </span>
                </summary>
                <p className="body max-w-2xl mt-2.5 pl-9 md:pl-12">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sectors                                                              */
/* ------------------------------------------------------------------ */
function Sectors() {
  return (
    <section className="pb-20 md:py-20">
      <div className="wrap">
        <SectionHead label="Industries" title={<>Industries we work in.</>} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTORS.map((sector, i) => (
            <Reveal key={sector.n} delay={(i % 3) * 0.06}>
              <div className="group h-full bg-white border border-ink/12 overflow-hidden transition-[border-color,transform] duration-500 hover:border-signal/50 hover:-translate-y-0.5">
                <div className="aspect-[16/9] overflow-hidden bg-bone">
                  <img
                    src={sector.img}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="display-md text-base mb-2">{sector.n}</h3>
                  <p className="body-tight">{sector.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA                                                                  */
/* ------------------------------------------------------------------ */
function CTA() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="wrap">
        <Reveal>
          <div className="surface-ink p-8 md:p-14 relative overflow-hidden grain">
            <div
              className="absolute -right-24 -bottom-28 w-[32rem] h-[32rem] pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(28,117,188,0.30) 0%, transparent 66%)' }}
            />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-xl">
                <span className="label !text-paper/50 block mb-5">Next step</span>
                <h2 className="display-lg text-[clamp(1.7rem,4vw,2.9rem)] text-paper mb-5">
                  Tell us how your business runs today.
                </h2>
                <p className="text-paper/60 text-base leading-relaxed">
                  We will show you the technology it should run on — even when the answer is less
                  software than you expected.
                </p>
              </div>
              <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                <Magnetic>
                  <Link to="/contact" className="btn-invert !px-8 !py-4">
                    Book a conversation <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Magnetic>
                <a
                  href="mailto:support@beforth.in"
                  className="flex items-center min-h-[28px] label !text-paper/70 hover:!text-paper transition-colors"
                >
                  support@beforth.in
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-ink/12 bg-bone/40 grain">
      <div className="wrap relative z-10 pt-12 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-[1.25fr_0.6fr_0.95fr_1.05fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/befu.png" alt="" className="w-7 h-7 object-contain" />
              <span className="font-display font-extrabold uppercase tracking-[0.14em] text-[15px]">Beforth</span>
            </div>
            <p className="display-md text-lg">Think better. Build smarter.</p>
          </div>

          <div>
            <span className="label block mb-3">Navigate</span>
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center min-h-[28px] body-tight hover:text-signal transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="label block mb-3">Services</span>
            <ul className="flex flex-col">
              {SERVICES.map((s) => (
                <li key={s.n}>
                  <Link
                    to="/services"
                    className="flex items-center min-h-[28px] body-tight hover:text-signal transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="label block mb-3">Platforms</span>
            <ul className="flex flex-col">
              {PLATFORMS.map((x) => (
                <li key={x.slug}>
                  <Link
                    to={`/product/${x.slug}`}
                    className="flex items-center min-h-[28px] body-tight hover:text-signal transition-colors"
                  >
                    {x.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="label block mb-3">Contact</span>
            <ul className="flex flex-col">
              <li>
                <a
                  href="mailto:support@beforth.in"
                  className="flex items-center gap-2 min-h-[28px] body-tight hover:text-signal transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" /> support@beforth.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+919766183834"
                  className="flex items-center gap-2 min-h-[28px] body-tight hover:text-signal transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0" /> +91 97661 83834
                </a>
              </li>
              <li className="flex items-start gap-2 py-1.5 body-tight">
                <MapPin className="w-3.5 h-3.5 mt-1 shrink-0" /> Nashik, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-ink/12 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <p className="label !normal-case !tracking-[0.06em]">© {new Date().getFullYear()} Beforth</p>
          <div className="flex items-center gap-2">
            <a
              href="https://in.linkedin.com/company/beforth"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center min-h-[28px] px-2 label hover:text-signal transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/beforth.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center min-h-[28px] px-2 label hover:text-signal transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* SEO                                                                  */
/* ------------------------------------------------------------------ */
const META: Record<string, { title: string; description: string; keywords: string }> = {
  '/': {
    title: 'Beforth | Custom Business Software & ERP Company — Nashik, India',
    description:
      'Beforth builds custom ERP systems, CRM, HRMS, inventory management, business automation, web and mobile applications — designed around how your organisation actually operates.',
    keywords: 'custom ERP software Nashik, CRM development India, HRMS and payroll software, inventory management system, business automation, custom software company Maharashtra',
  },
  '/services': {
    title: 'Services | Custom ERP, CRM, HRMS & Automation — Beforth',
    description:
      'Custom ERP, CRM, HRMS and payroll, inventory management, business automation, web applications and mobile applications by Beforth, Nashik, India.',
    keywords: 'custom ERP developer Nashik, CRM software India, HRMS payroll developer, inventory management system, business process automation',
  },
  '/about': {
    title: 'About Beforth | Custom Business Software Company, Nashik',
    description:
      'Beforth is an IT services and software development company in Nashik, Maharashtra, focused on custom business systems, workflow automation and operational visibility.',
    keywords: 'about Beforth, custom software company Nashik, ERP development company Maharashtra, IT services Nashik',
  },
  '/team': {
    title: 'Team | The People Behind the Builds — Beforth, Nashik',
    description:
      'Meet the Beforth team — engineers, designers and strategists delivering custom software, automation and digital platforms from Nashik, India.',
    keywords: 'Beforth team, software developers Nashik, technology team Maharashtra',
  },
  '/contact': {
    title: 'Contact Beforth | Discuss Your ERP or Software Project — Nashik',
    description:
      'Talk to Beforth about custom ERP, CRM, HRMS, inventory or automation projects. Based in Nashik, Maharashtra, India.',
    keywords: 'contact Beforth, hire ERP developer India, custom software quote Nashik, business automation consultation',
  },
};

function setMeta(selector: string, attrs: Record<string, string>, content: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const product = pathname.startsWith('/product/') ? getPlatform(pathname.split('/')[2]) : undefined;
    const meta = product
      ? { title: product.seoTitle, description: product.seoDescription, keywords: product.keywords }
      : META[pathname] ?? {
      title: 'Beforth | Custom Software & Automation Company',
      description: 'Beforth builds custom software, business systems and automation from Nashik, India.',
      keywords: 'Beforth, custom software, business systems, automation',
    };
    const canonical = `https://beforth.in${pathname === '/' ? '/' : pathname}`;

    document.title = meta.title;
    setMeta('meta[name="description"]', { name: 'description' }, meta.description);
    setMeta('meta[name="keywords"]', { name: 'keywords' }, meta.keywords);
    setMeta('meta[property="og:title"]', { property: 'og:title' }, meta.title);
    setMeta('meta[property="og:description"]', { property: 'og:description' }, meta.description);
    setMeta('meta[property="og:url"]', { property: 'og:url' }, canonical);
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, meta.title);
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, meta.description);

    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [pathname]);

  return null;
}

function StructuredData() {
  useEffect(() => {
    const origin = 'https://beforth.in';
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${origin}/#organization`,
          name: 'Beforth',
          url: origin,
          description:
            'Beforth is a technology and software solutions company in Nashik, India, building custom business software, ERP systems, workflow automation, web and mobile applications, and integrations.',
          email: 'support@beforth.in',
          telephone: '+91-97661-83834',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Nashik',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN',
          },
          areaServed: 'Worldwide',
          sameAs: [
            'https://in.linkedin.com/company/beforth',
            'https://www.instagram.com/beforth.in',
          ],
        },
        {
          '@type': 'ProfessionalService',
          name: 'Beforth',
          url: origin,
          serviceType: [
            'Custom ERP Development',
            'CRM Development',
            'HRMS and Payroll Systems',
            'Inventory Management Systems',
            'Business Process Automation',
            'Web Application Development',
            'Mobile Application Development',
          ],
          provider: { '@id': `${origin}/#organization` },
        },
        {
          '@type': 'SoftwareApplication',
          name: 'Neomed Delivery',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Android',
          description:
            'Enterprise delivery platform for pharmacy and healthcare distribution operations, supporting delivery assignments, proof of delivery, route handling, live location sharing, notifications and delivery history.',
          url: 'https://play.google.com/store/apps/details?id=com.neomad.neomad_app',
        },
        {
          '@type': 'SoftwareApplication',
          name: '4Form',
          applicationCategory: 'BusinessApplication',
          description:
            'Form-management and workflow platform for creating, managing and tracking digital forms, with analytics, email automation, CRM integration, validation, submission tracking and API integrations.',
          url: 'https://4form.beforth.in/',
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQ.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        },
      ],
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */
/* App                                                                  */
/* ------------------------------------------------------------------ */
export default function App() {
  const { pathname, hash } = useLocation();
  const { shouldReduce } = useMotionPreset();

  const location = useLocation();
  const prevPath = useRef(pathname);

  // A link like /#platforms lands on that section. A new page starts at the top,
  // once the old page has faded out and the new one is mounted.
  useEffect(() => {
    const changed = prevPath.current !== pathname;
    prevPath.current = pathname;
    if (!hash) return;
    const t = window.setTimeout(() => {
      try { document.querySelector(hash)?.scrollIntoView({ block: 'start' }); } catch { /* not a valid selector */ }
    }, changed ? 320 : 90);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  const toTop = () => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <SeoManager />
        <StructuredData />
        <Navbar />

        <AnimatePresence mode="wait" initial={false} onExitComplete={toTop}>
          <m.div
            key={pathname}
            initial={shouldReduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? undefined : { opacity: 0, y: -8, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }}
            transition={shouldReduce ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<><Hero /><Positioning /><Fit /><ServicesSection /><ProductProof /><Method /><Why /><Products /><SelectedWork /><Sectors /><Faq /><CTA /></>} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </m.div>
        </AnimatePresence>

        <Footer />
      </MotionConfig>
    </LazyMotion>
  );
}
