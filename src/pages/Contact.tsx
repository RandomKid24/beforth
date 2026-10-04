import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, Check, AlertCircle } from 'lucide-react';
import Reveal from '../components/Reveal';
import Intro from '../components/Intro';

const SUBJECTS = [
  'General Inquiry',
  'Custom ERP',
  'CRM',
  'HRMS & Payroll',
  'Inventory Management',
  'Business Automation',
  'Web / Mobile Application',
  'Request a Demo',
  'Career Opportunities',
];

const STATUSES = [
  'We reply to every serious enquiry within one working day.',
  'Tell us the problem. We will say if software is the answer.',
];

function Dropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="field flex items-center justify-between text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value}</span>
        <m.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
          <ChevronDown className="w-4 h-4 text-ash" />
        </m.span>
      </button>

      <AnimatePresence>
        {open && (
          <m.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute z-30 top-full left-0 right-0 mt-px bg-white border border-ink/15 py-1.5"
          >
            {SUBJECTS.map((subject) => (
              <li key={subject}>
                <button
                  type="button"
                  role="option"
                  aria-selected={subject === value}
                  onClick={() => { onChange(subject); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    subject === value ? 'text-signal bg-bone' : 'text-ink/80 hover:bg-bone/60'
                  }`}
                >
                  {subject}
                </button>
              </li>
            ))}
          </m.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', subject: SUBJECTS[0], message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStatusIndex((i) => (i + 1) % STATUSES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      const text = await res.text();
      let data: { message?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(res.ok ? 'Unreadable server response.' : 'The contact service is unavailable right now.');
        }
      }

      if (!res.ok) throw new Error(data.message || 'Something went wrong. Please try again.');

      setState('success');
      setFeedback('Message sent. We will get back to you shortly.');
      setForm({ name: '', email: '', company: '', subject: SUBJECTS[0], message: '' });
      setTimeout(() => setState('idle'), 6000);
    } catch (err) {
      setState('error');
      setFeedback(err instanceof Error ? err.message : 'Failed to send. Please email support@beforth.in.');
    }
  };

  return (
    <>
      <section className="pt-32 md:pt-40 pb-14 md:pb-20 grain relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid blueprint-fade pointer-events-none" />
        <div className="wrap relative z-10">
          <Intro>
            <div className="rule mb-6" />
            <span className="label block mb-7">Contact</span>
            <h1 className="display-xl text-[clamp(2.2rem,6.4vw,4.8rem)] max-w-[14ch]">
              Let's talk about <span className="accent">your business.</span>
            </h1>
          </Intro>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="wrap">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="lead mb-9 max-w-md">
                  A process to digitise? An ERP to build? Spreadsheets to replace? Tell us.
                </p>
              </Reveal>

              <Reveal delay={0.07}>
                <div className="surface p-6 mb-9">
                  <div className="flex items-start gap-3.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-signal pulse-dot shrink-0" />
                    <AnimatePresence mode="wait">
                      <m.p
                        key={statusIndex}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                        className="text-[14px] text-ink/80 leading-relaxed"
                      >
                        {STATUSES[statusIndex]}
                      </m.p>
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>

              <div className="flex flex-col gap-6">
                {[
                  {
                    icon: Mail,
                    label: 'Email',
                    lines: [
                      { text: 'support@beforth.in', href: 'mailto:support@beforth.in' },
                    ],
                  },
                  {
                    icon: Phone,
                    label: 'Phone',
                    lines: [{ text: '+91 97661 83834', href: 'tel:+919766183834' }],
                  },
                  {
                    icon: MapPin,
                    label: 'Office',
                    lines: [{ text: 'Nashik, Maharashtra, India' }],
                  },
                  {
                    icon: Clock,
                    label: 'Hours',
                    lines: [{ text: 'Mon – Fri, 9:00 AM – 6:00 PM IST' }],
                  },
                ].map((item, i) => (
                  <Reveal key={item.label} delay={i * 0.05}>
                    <div className="flex items-start gap-4">
                      <span className="w-9 h-9 border border-ink/15 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-ash" />
                      </span>
                      <div>
                        <span className="flabel !mb-1">{item.label}</span>
                        {item.lines.map((line) => (
                          line.href ? (
                            <a
                              key={line.text}
                              href={line.href}
                              className="flex items-center min-h-[28px] text-[15px] text-ink hover:text-signal transition-colors duration-300"
                            >
                              {line.text}
                            </a>
                          ) : (
                            <p key={line.text} className="text-[15px] text-ink/85">
                              {line.text}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={0.08}>
              <form onSubmit={handleSubmit} className="surface p-6 md:p-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-5 border-b border-ink/12">
                  <h2 className="display-md text-lg md:text-xl">Start a project enquiry</h2>
                  <span className="label">Reply within 1 working day</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="flabel" htmlFor="name">Full name *</label>
                    <input id="name" type="text" required value={form.name} onChange={update('name')} className="field" placeholder="Your name" autoComplete="name" />
                  </div>
                  <div>
                    <label className="flabel" htmlFor="email">Email *</label>
                    <input id="email" type="email" required value={form.email} onChange={update('email')} className="field" placeholder="you@company.com" autoComplete="email" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="flabel" htmlFor="company">Company</label>
                    <input id="company" type="text" value={form.company} onChange={update('company')} className="field" placeholder="Optional" autoComplete="organization" />
                  </div>
                  <div>
                    <span className="flabel">What do you need?</span>
                    <Dropdown value={form.subject} onChange={(v) => setForm((f) => ({ ...f, subject: v }))} />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="flabel" htmlFor="message">Project details *</label>
                  <textarea
                    id="message"
                    required
                    rows={7}
                    value={form.message}
                    onChange={update('message')}
                    className="field resize-none"
                    placeholder="What does the business do today, and which process do you want to improve?"
                  />
                </div>

                <AnimatePresence>
                  {feedback && (
                    <m.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex items-start gap-2.5 border px-4 py-3 mb-5 text-sm ${
                        state === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {state === 'success' ? <Check className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                      <span>{feedback}</span>
                    </m.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={state === 'sending'} className="btn-signal w-full disabled:opacity-60 disabled:cursor-wait">
                  {state === 'sending' ? 'Sending…' : 'Send enquiry'}
                  {state !== 'sending' && <Send className="w-4 h-4" />}
                </button>

                <p className="label !normal-case !tracking-[0.06em] mt-5 text-center leading-relaxed">
                  We never share your details. No mailing lists, no spam.
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
