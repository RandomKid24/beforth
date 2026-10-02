import React from 'react';
import { Link } from 'react-router-dom';
import * as m from 'motion/react-m';
import { ArrowLeft } from 'lucide-react';

const SUGGESTIONS = [
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <section className="relative min-h-[100svh] flex items-center pt-32 pb-20 overflow-hidden grain">
      <div className="absolute inset-0 blueprint-grid blueprint-fade pointer-events-none" />

      <div className="wrap relative z-10 w-full">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div>
            <m.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="label block"
            >
              Error 404
            </m.span>

            <h1 className="display-xl text-[clamp(5rem,20vw,14rem)] leading-[0.8] my-6 text-signal">
              404
            </h1>

            <m.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
            >
              <div className="rule mb-7" />
              <h2 className="display-lg text-[clamp(1.5rem,3.4vw,2.4rem)] mb-4 max-w-[20ch]">
                This page took an early exit.
              </h2>
              <p className="body max-w-md mb-8">
                The link may be out of date, or the address might be slightly off. Here is the way
                back.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/" className="btn-solid">
                  <ArrowLeft className="w-4 h-4" /> Back to home
                </Link>
                <Link to="/contact" className="btn-line">
                  Contact us
                </Link>
              </div>
            </m.div>
          </div>

          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="surface p-7 md:p-9"
          >
            <span className="label block mb-5">Try one of these</span>
            <ul>
              {SUGGESTIONS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group flex items-center justify-between py-3.5 border-b border-ink/12 last:border-0"
                  >
                    <span className="display-md text-lg transition-colors duration-300 group-hover:text-signal">
                      {item.label}
                    </span>
                    <span className="label transition-[color,transform] duration-300 group-hover:text-signal group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </m.div>
        </div>
      </div>
    </section>
  );
}
