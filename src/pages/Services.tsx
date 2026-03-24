import React, { useState, useEffect, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';

// Lazy load the Magnetic component as it's a non-critical interactive asset
const Magnetic = React.lazy(() => import('../components/Magnetic').then(module => ({ default: module.Magnetic })));

const services = [
  {
    id: '01',
    slug: 'custom-systems',
    title: 'Custom Systems',
    description: 'We replace boring spreadsheets with custom software that actually slaps. Purpose-built web applications and internal tools that scale with your operations. No cap, just clean code.',
    tags: ['WEB APPS', 'INTERNAL TOOLS', 'AUTOMATION'],
  },
  {
    id: '02',
    slug: 'mobile-apps',
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications with fluid UX and performance-first architecture. We build apps that people actually want to keep on their home screen.',
    tags: ['IOS', 'ANDROID', 'REACT NATIVE'],
  },
  {
    id: '03',
    slug: 'integrations',
    title: 'Integrations',
    description: 'Connecting fragmented systems into a unified ecosystem. Robust middleware and API integrations to sync your tools in real-time so you can focus on the bag.',
    tags: ['APIS', 'MIDDLEWARE', 'WEBHOOKS'],
  }
];

const ServiceRow: React.FC<{ service: any, isOpen: boolean, onClick: () => void }> = ({ service, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/10 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full py-8 md:py-12 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-6 md:gap-16">
          <span className="font-mono text-sm md:text-base text-[#2563EB] group-hover:text-white transition-colors duration-500">{service.id}</span>
          <h2 className="text-[2rem] sm:text-[3rem] md:text-[5rem] font-display uppercase tracking-tight text-white group-hover:text-[#2563EB] transition-colors duration-500 leading-none">
            {service.title}
          </h2>
        </div>
        <div className="relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center shrink-0 ml-4">
           <span className={`absolute w-full h-[2px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-180' : ''}`} />
           <span className={`absolute w-full h-[2px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-180 opacity-0' : 'rotate-90'}`} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pb-12 md:pl-[6.5rem] max-w-3xl">
              <p className="text-lg md:text-2xl font-sans font-light text-slate-400 leading-[1.618] mb-8">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {service.tags.map((tag: string) => (
                  <span key={tag} className="px-4 py-2 rounded-full border border-white/20 text-white font-mono text-xs tracking-widest uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ServicesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number>(0);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const index = services.findIndex(s => s.slug === hash);
      if (index !== -1) {
        setOpenIndex(index);
      }
    }
  }, [location.hash]);

  const handleToggle = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(-1);
      navigate(location.pathname, { replace: true });
    } else {
      setOpenIndex(index);
      navigate(`${location.pathname}#${services[index].slug}`, { replace: true });
    }
  };

  return (
    <>
      
      {/* Hero Section */}
      <section className="min-h-screen w-full snap-start shrink-0 flex flex-col justify-center pt-32 md:pt-48 pb-20 px-6 md:px-[10%] relative">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto w-full"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="font-mono text-[0.75rem] tracking-widest uppercase text-[#2563EB]">Capabilities</span>
          </div>
          
          <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-display uppercase tracking-normal text-[#0F172A] mb-8 leading-[0.9]">
            WE BUILD <br/>
            <span className="text-transparent [-webkit-text-stroke:1.5px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A]">DIGITAL</span> ECOSYSTEMS.
          </h1>
          
          <p className="text-[1.2rem] md:text-[1.5rem] font-sans text-[#64748B] font-light leading-[1.618] max-w-2xl">
            Ditch the generic SaaS. We engineer bespoke platforms that fit your exact workflows and scale infinitely.
          </p>
        </motion.div>
      </section>

      {/* Interactive Accordion Section (Dark Mode for contrast) */}
      <section className="min-h-screen w-full snap-start shrink-0 flex flex-col justify-center bg-[#020617] text-white py-24 md:py-32 px-6 md:px-[10%] relative">
        <div className="max-w-screen-2xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <h2 className="font-mono text-sm tracking-widest uppercase text-[#2563EB] mb-4">// CORE STACK</h2>
          </motion.div>

          <div className="border-t border-white/10">
            {services.map((service, index) => (
              <ServiceRow 
                key={service.id}
                service={service}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Methodology */}
      <section className="min-h-screen w-full snap-start shrink-0 flex flex-col justify-center py-24 md:py-32 px-6 md:px-[10%] relative">
        <div className="max-w-screen-2xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <h2 className="text-[2.618rem] md:text-[4.236rem] font-display uppercase leading-[1.05] text-[#0F172A]">
              How we operate.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white p-10 md:p-16 rounded-[2rem] border border-slate-200 shadow-sm md:col-span-2 flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center overflow-hidden"
            >
              <div className="flex-1">
                <div className="font-display text-[6rem] md:text-[8rem] leading-none text-slate-100 shrink-0 mb-4">01</div>
                <h3 className="text-[2rem] font-display uppercase tracking-wide text-[#0F172A] mb-4">Discovery & Blueprint</h3>
                <p className="text-[1.1rem] font-sans text-[#64748B] font-light leading-[1.618]">
                  We don't just write code; we map your entire operational workflow. We identify bottlenecks, architect the database schema, and design a system that actually solves your problems.
                </p>
              </div>
              <div className="flex-1 w-full">
                <LazyImage 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                  alt="System Architecture" 
                  containerClassName="w-full h-64 md:h-full rounded-2xl shadow-sm"
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="bg-white p-10 md:p-16 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col"
            >
              <div className="font-display text-[4rem] leading-none text-slate-100 mb-8">02</div>
              <h3 className="text-[1.5rem] font-display uppercase tracking-wide text-[#0F172A] mb-4">Agile Engineering</h3>
              <p className="text-[1rem] font-sans text-[#64748B] font-light leading-[1.618]">
                Rapid, iterative development cycles. We build core modules, custom APIs, and integrate webhooks with zero bloat.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="bg-[#2563EB] text-white p-10 md:p-16 rounded-[2rem] shadow-xl flex flex-col"
            >
              <div className="font-display text-[4rem] leading-none text-blue-400/30 mb-8">03</div>
              <h3 className="text-[1.5rem] font-display uppercase tracking-wide mb-4">Deploy & Scale</h3>
              <p className="text-[1rem] font-sans text-blue-100 font-light leading-[1.618]">
                Rigorous security audits, seamless legacy data migration, and a flawless launch. Built to scale infinitely.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen w-full snap-start shrink-0 flex flex-col justify-center bg-white py-32 px-6 text-center border-t border-slate-200 relative">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto w-full"
        >
          <h2 className="text-[3rem] md:text-[5rem] font-display uppercase leading-[0.9] text-[#0F172A] mb-8">
            Ready to build <br /> <span className="text-transparent [-webkit-text-stroke:1.5px_#0F172A]">something real?</span>
          </h2>
          <p className="text-[1.1rem] md:text-[1.2rem] font-sans text-[#64748B] font-light leading-[1.618] mb-12">
            Let's discuss your requirements and architect a solution that scales.
          </p>
          <Suspense fallback={
            <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-[#0F172A] text-white font-mono text-xs uppercase tracking-widest rounded-full hover:bg-[#2563EB] transition-colors duration-500 group shadow-lg">
              <span>Start the Conversation</span>
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </a>
          }>
            <Magnetic>
              <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-[#0F172A] text-white font-mono text-xs uppercase tracking-widest rounded-full hover:bg-[#2563EB] transition-colors duration-500 group shadow-lg">
                <span>Start the Conversation</span>
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </Magnetic>
          </Suspense>
        </motion.div>
      </section>

    </>
  );
}
