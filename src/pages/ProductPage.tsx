import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ArrowDown, Check } from 'lucide-react';

import Reveal from '@/components/Reveal';
import SectionHead from '@/components/SectionHead';
import { Magnetic } from '@/components/Magnetic';
import { getPlatform } from '@/components/platforms/catalog';
import NotFound from './NotFound';

const ORIGIN = 'https://beforth.in';

export default function ProductPage() {
  const { slug } = useParams();
  const p = getPlatform(slug);

  // Search engines read this: the service, where it sits on the site, and its FAQ.
  useEffect(() => {
    if (!p) return;
    const url = `${ORIGIN}/product/${p.slug}`;
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${url}#service`,
          name: p.name,
          serviceType: p.name,
          description: p.seoDescription,
          url,
          provider: { '@id': `${ORIGIN}/#organization` },
          areaServed: ['IN', 'AE', 'US', 'GB', 'AU'],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
            { '@type': 'ListItem', position: 2, name: 'Platforms', item: `${ORIGIN}/#platforms` },
            { '@type': 'ListItem', position: 3, name: p.name, item: url },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: p.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    };
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'ld-product';
    el.text = JSON.stringify(data);
    document.head.appendChild(el);
    return () => el.remove();
  }, [p]);

  if (!p) return <NotFound />;

  const Icon = p.icon;
  const Preview = p.Preview;
  const related = p.related.map((s) => getPlatform(s)).filter((x): x is NonNullable<typeof x> => !!x);

  const toDemo = () => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <main>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="pt-[104px] md:pt-[136px] pb-12 md:pb-20">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="mb-8 md:mb-10 flex flex-wrap items-center gap-2 label">
            <Link to="/" className="hover:text-signal transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <Link to="/#platforms" className="hover:text-signal transition-colors">Platforms</Link>
            <span aria-hidden>/</span>
            <span className="text-ink" aria-current="page">{p.name}</span>
          </nav>

          <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] gap-10 lg:gap-16 items-start">
            <div className="min-w-0">
              <Reveal>
                <span className="inline-flex items-center gap-2.5 mb-6">
                  <span className="w-9 h-9 bg-signal text-white flex items-center justify-center"><Icon className="w-[18px] h-[18px]" strokeWidth={1.7} /></span>
                  <span className="label">{p.sub}</span>
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="display-xl text-[clamp(2.3rem,5.8vw,4.5rem)] max-w-[18ch]">
                  {p.headline[0]} <span className="accent">{p.headline[1]}</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="body text-[16px] md:text-[18px] max-w-[34rem] mt-6 md:mt-7 !text-ink/70">{p.lead}</p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="flex flex-wrap items-center gap-x-7 gap-y-4 mt-8 md:mt-10">
                  <Magnetic>
                    <Link to="/contact" className="btn-signal !px-7 !py-4">
                      <span className="sm:hidden">Talk to us</span>
                      <span className="hidden sm:inline">Talk to us about {p.name}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Link>
                  </Magnetic>
                  <button type="button" onClick={toDemo} className="ulink">
                    Try the live preview <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Reveal>
              {p.proof && (
                <Reveal delay={0.2}>
                  <p className="mt-8 border-l-2 border-signal pl-4 text-[14px] leading-relaxed text-ink/75 max-w-[34rem]">
                    {p.proof.text}{' '}
                    <a href={p.proof.href} target="_blank" rel="noopener noreferrer" className="text-signal underline underline-offset-4 decoration-signal/40 hover:decoration-signal">
                      {p.proof.cta}
                    </a>
                  </p>
                </Reveal>
              )}
            </div>

            <Reveal delay={0.12}>
              <aside className="surface p-6 md:p-7" aria-label={`${p.name} at a glance`}>
                <span className="label">Built for</span>
                <p className="display-md text-[18px] mt-2 mb-6">{p.built}</p>
                <span className="label">At a glance</span>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {p.caps.map((c) => (
                    <li key={c} className="flex items-center gap-3 text-[14px]">
                      <span className="w-5 h-5 rounded-full bg-signal/10 text-signal flex items-center justify-center shrink-0"><Check className="w-3 h-3" strokeWidth={3} /></span>
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t border-ink/12 grid grid-cols-3 gap-2 text-center">
                  {['Build', 'Run', 'Maintain'].map((t) => (
                    <span key={t} className="label !text-ink !tracking-[0.14em] border border-ink/12 py-2">{t}</span>
                  ))}
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------ Live preview ------------------------------ */}
      <section id="demo" className="section bg-bone grain scroll-mt-20">
        <div className="wrap relative z-10">
          <SectionHead
            label="Live preview"
            title={<>Try it <span className="accent">yourself.</span></>}
            note="A working preview with sample data. Click around: everything here responds."
          />
          <Reveal>
            <div className="bg-white border border-ink/12">
              <div className="px-5 py-3.5 border-b border-ink/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-signal/10 text-signal flex items-center justify-center"><Icon className="w-4 h-4" strokeWidth={1.7} /></span>
                  <h2 className="display-md text-[17px]">{p.name}</h2>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-ash"><i className="w-1.5 h-1.5 rounded-full bg-signal pulse-dot" /> Sample data</span>
              </div>
              <div className="relative bg-bone/55 blueprint-grid p-4 sm:p-8 min-h-[520px] flex items-center justify-center overflow-hidden">
                <div className="w-full max-w-[900px] relative z-10"><Preview /></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ What changes ------------------------------ */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            label="What changes"
            title={<>From the workaround to <span className="accent">the system.</span></>}
          />
          <div className="grid md:grid-cols-3 gap-4">
            {p.changes.map((c, i) => (
              <Reveal key={c.to} delay={i * 0.07} className="h-full">
                <div className="h-full bg-white border border-ink/12 p-6 md:p-7 flex flex-col gap-4">
                  <span className="label !text-[10px]">0{i + 1}</span>
                  <p className="text-[14px] text-ash line-through decoration-ink/25">{c.from}</p>
                  <p className="flex items-start gap-3 display-md text-[18px] md:text-[19px] leading-snug">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-signal/10 text-signal flex items-center justify-center shrink-0"><Check className="w-3 h-3" strokeWidth={3} /></span>
                    {c.to}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Features ------------------------------ */}
      <section className="pb-16 md:pb-24">
        <div className="wrap">
          <SectionHead label="What it does" title={<>Everything it needs to <span className="accent">do the job.</span></>} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/12 border border-ink/12">
            {p.features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.05} className="h-full">
                <div className="group h-full bg-paper p-6 md:p-7">
                  <span className="block w-6 h-px bg-signal mb-5" />
                  <h3 className="display-md text-[17px] mb-2 transition-colors duration-500 group-hover:text-signal">{f.title}</h3>
                  <p className="body-tight">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ How it works ------------------------------ */}
      <section className="section bg-bone grain">
        <div className="wrap relative z-10">
          <SectionHead label="How it works" title={<>A day with it, <span className="accent">step by step.</span></>} />
          <ol className="grid md:grid-cols-4 gap-4 md:gap-0">
            {p.flow.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07} className="h-full">
                <li className="relative h-full md:pr-6 list-none">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center text-[13px] font-semibold tabular-nums shrink-0">{i + 1}</span>
                    {i < p.flow.length - 1 && <span aria-hidden className="hidden md:block flex-1 h-px bg-ink/20" />}
                  </div>
                  <h3 className="display-md text-[17px] mb-1.5">{s.title}</h3>
                  <p className="body-tight">{s.desc}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------ Build / run / maintain ------------------------------ */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <div className="surface-ink relative overflow-hidden p-7 md:p-12">
              <span aria-hidden className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-signal/30 blur-3xl" />
              <div className="relative">
                <span className="label !text-wave">One team, start to finish</span>
                <h2 className="display-lg text-[clamp(1.6rem,3.4vw,2.5rem)] text-paper mt-3 mb-9 max-w-[34ch]">We build it. We run it. We maintain it.</h2>
                <div className="grid md:grid-cols-3 gap-px bg-paper/15 border border-paper/15">
                  {[
                    ['We build it', 'Designed around how your business actually works, with your roles, your data and your rules.'],
                    ['We run it', 'Hosting, monitoring and backups are ours to worry about, not yours.'],
                    ['We maintain it', 'Fixes, updates and new features as your business changes, from the same team that built it.'],
                  ].map(([t, d]) => (
                    <div key={t} className="bg-ink p-6">
                      <h3 className="display-md text-[17px] text-paper mb-2">{t}</h3>
                      <p className="text-[14px] leading-relaxed text-paper/65">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ FAQ ------------------------------ */}
      <section className="pb-16 md:pb-24">
        <div className="wrap">
          <SectionHead label="FAQ" title={<>Questions about <span className="accent">{p.name}.</span></>} />
          <div className="border-t border-ink/12">
            {p.faq.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.04}>
                <details className="group py-4 md:py-5 border-b border-ink/12">
                  <summary className="flex items-start gap-4 cursor-pointer list-none min-h-[32px]">
                    <span className="label text-signal shrink-0 pt-1">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="flex-1 display-md text-base md:text-lg transition-colors duration-300 group-open:text-signal">{item.q}</h3>
                    <span className="shrink-0 text-ash group-open:text-signal transition-colors text-lg leading-none pt-0.5">+</span>
                  </summary>
                  <p className="body max-w-2xl mt-2.5 pl-9 md:pl-12">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Related ------------------------------ */}
      <section className="pb-16 md:pb-24">
        <div className="wrap">
          <div className="rule mb-6" />
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="display-md text-xl md:text-2xl">Other platforms we build</h2>
            <Link to="/#platforms" className="ulink shrink-0">All platforms <ArrowUpRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((r, i) => {
              const RIcon = r.icon;
              return (
                <Reveal key={r.slug} delay={i * 0.06} className="h-full">
                  <Link
                    to={`/product/${r.slug}`}
                    className="group h-full flex flex-col bg-white border border-ink/12 p-6 transition-[border-color,box-shadow] duration-500 hover:border-signal/50 hover:shadow-[0_16px_34px_-22px_rgba(28,117,188,0.55)]"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <span className="w-10 h-10 bg-signal/10 text-signal flex items-center justify-center transition-colors duration-500 group-hover:bg-signal group-hover:text-white"><RIcon className="w-[18px] h-[18px]" strokeWidth={1.7} /></span>
                      <ArrowUpRight className="w-4 h-4 text-ash group-hover:text-signal transition-colors" />
                    </div>
                    <h3 className="display-md text-[18px] mb-1.5 group-hover:text-signal transition-colors">{r.name}</h3>
                    <p className="body-tight">{r.summary}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------ CTA ------------------------------ */}
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
                  <h2 className="display-lg text-[clamp(1.7rem,4vw,2.9rem)] text-paper mb-5">Tell us how your business runs today.</h2>
                  <p className="text-paper/60 text-base leading-relaxed">
                    We will show you what {p.name} should look like for you, and be straight about it if the answer is less software than you expected.
                  </p>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                  <Magnetic>
                    <Link to="/contact" className="btn-invert !px-8 !py-4">
                      Book a conversation <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </Magnetic>
                  <a href="mailto:support@beforth.in" className="flex items-center min-h-[28px] label !text-paper/70 hover:!text-paper transition-colors">support@beforth.in</a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
