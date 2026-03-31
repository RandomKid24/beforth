import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, Smartphone, Monitor, Shield, Zap, BarChart3, Database } from 'lucide-react';

const services = [
  {
    id: "01",
    category: "ERP Solutions",
    title: "CUSTOM ERP",
    desc: "End-to-end enterprise resource planning built from scratch for your workflows — not off-the-shelf compromises.",
    tags: ["INVENTORY", "FINANCE", "HR", "CRM"],
    icon: LayoutGrid
  },
  {
    id: "02",
    category: "Mobile Apps",
    title: "IOS & ANDROID",
    desc: "Native and cross-platform mobile apps with fluid UX, performance-first architecture, and zero compromise on feel.",
    tags: ["SWIFT", "KOTLIN", "FLUTTER", "REACT NATIVE"],
    icon: Smartphone
  },
  {
    id: "03",
    category: "Web Platforms",
    title: "WEB PLATFORMS",
    desc: "Blazing fast, beautifully crafted web applications. From landing pages to complex SaaS dashboards.",
    tags: ["NEXT.JS", "REACT", "NODE", "POSTGRESQL"],
    icon: Monitor
  }
];

export default function ServicesPage() {
  return (
    <div className="page-container">
      <section className="min-h-screen snap-start flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto w-full"
        >
          <div className="flex items-center gap-3 mb-[1.618rem]">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[0.85rem] tracking-widest uppercase text-slate-500">Expertise</span>
          </div>

          <h1 className="hero-heading mb-12">
            <span className="block">OUR</span>
            <span className="block text-transparent [-webkit-text-stroke:1.5px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A]">SERVICES.</span>
          </h1>

          <p className="text-[1.2rem] md:text-[1.618rem] font-sans text-slate-500 font-light leading-[1.618] max-w-2xl">
            We build robust, scalable, and beautifully designed software that helps your business move faster and more efficiently.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="min-h-screen snap-start flex flex-col justify-center py-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-900/10 mb-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`group p-8 md:p-12 hover:bg-slate-950 hover:text-white transition-all duration-700 cursor-default border-slate-900/10 ${
                  index !== 0 ? 'border-t md:border-t-0 md:border-l' : ''
                }`}
              >
                <div className="font-mono text-[0.75rem] tracking-widest text-primary mb-12 uppercase">{service.id}</div>
                <service.icon className="w-12 h-12 mb-8 text-slate-400 group-hover:text-primary transition-colors duration-500" />
                <h3 className="text-2xl font-display uppercase mb-6 group-hover:translate-x-2 transition-transform duration-500">{service.title}</h3>
                <p className="font-sans font-light text-slate-500 group-hover:text-slate-300 leading-relaxed mb-8">
                  {service.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 border border-slate-200 group-hover:border-slate-800 text-[10px] font-mono tracking-widest uppercase text-slate-500 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live System Metrics Section */}
      <section className="min-h-screen snap-start flex flex-col justify-center py-24">
        <div className="max-w-7xl mx-auto w-full">
          <motion.h2 
            initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-display uppercase mb-16"
          >
            LIVE SYSTEM METRICS
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'UPTIME', val: '99.98%', icon: Zap },
              { label: 'API LATENCY', val: '< 120ms', icon: BarChart3 },
              { label: 'DATA SECURITY', val: 'AES-256', icon: Shield },
              { label: 'SCALE', val: 'AUTO', icon: Database },
            ].map((metric, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4 border-l-2 border-primary pl-6 py-2"
              >
                <metric.icon className="w-5 h-5 text-primary" />
                <div className="text-2xl font-display uppercase">{metric.val}</div>
                <div className="font-mono text-xs tracking-widest text-slate-500 uppercase">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Contrast Section */}
      <section className="min-h-screen snap-start flex flex-col justify-center">
        <div className="dark-section group w-full">
          <div className="card-hover-border" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-4xl md:text-5xl font-display uppercase mb-6 leading-tight">
                Enterprise-Grade <br />
                <span className="text-transparent [-webkit-text-stroke:1px_white]">Security First.</span>
              </h2>
              <p className="font-sans font-light text-slate-400 leading-relaxed">
                We believe software is only as good as its security. Every line of code we write is hardened against vulnerabilities and designed to protect your most valuable assets.
              </p>
            </motion.div>
            <div className="flex flex-col gap-4">
              {[
                { label: "End-to-End Encryption", icon: Shield },
                { label: "Regular Pen-Testing", icon: Zap },
                { label: "Compliance Ready", icon: BarChart3 }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="p-6 bg-slate-900/50 border border-white/5 flex items-center justify-between group/item hover:bg-slate-900 transition-colors"
                >
                  <span className="font-mono text-sm uppercase tracking-widest">{item.label}</span>
                  <item.icon className="w-5 h-5 text-primary group-hover/item:scale-125 transition-transform" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
