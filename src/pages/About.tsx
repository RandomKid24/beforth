import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, Zap, Globe, Heart, Rocket } from 'lucide-react';

const values = [
  {
    num: "01",
    title: "Uncompromising Quality",
    desc: "We don't ship 'good enough'. We ship exceptional, or we don't ship at all.",
    icon: Zap
  },
  {
    num: "02",
    title: "Client Partnership",
    desc: "We aren't just vendors; we're your technical partners invested in your success.",
    icon: Heart
  },
  {
    num: "03",
    title: "Radical Transparency",
    desc: "Open communication and honest feedback are at the core of our technical process.",
    icon: Target
  },
  {
    num: "04",
    title: "Innovation First",
    desc: "We stay ahead of the curve so your business never falls behind.",
    icon: Rocket
  }
];

export default function AboutPage() {
  return (
    <div className="page-container">
      <section className="min-h-screen snap-start flex flex-col pt-48">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto w-full"
        >
          <div className="flex items-center gap-3 mb-[1.618rem]">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[0.85rem] tracking-widest uppercase text-slate-500">Our Story</span>
          </div>

          <h1 className="hero-heading mb-12">
            <span className="block">BEYOND</span>
            <span className="block text-transparent [-webkit-text-stroke:1.5px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A]">EXPECTATIONS.</span>
          </h1>

          <div className="max-w-3xl">
            <p className="text-[1.2rem] md:text-[1.618rem] font-sans text-slate-700 font-light leading-[1.618]">
              BEFORTH was founded on a simple principle: <span className="font-medium text-slate-950">software shouldn't be boring or burdensome.</span> We build high-density digital experiences that solve real problems with premium aesthetics.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="min-h-screen snap-start flex flex-col justify-center py-20 px-0 md:px-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 md:p-16 bg-[#020617] text-white relative overflow-hidden w-full"
        >
           <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 blur-[100px] pointer-events-none" />
           <div className="relative z-10">
              <h2 className="text-3xl font-display uppercase mb-8">THE MISSION</h2>
              <p className="text-xl md:text-3xl font-sans font-light leading-relaxed max-w-4xl">
                To eliminate digital friction and replace outdated systems with custom software that is powerful, secure, and a joy to use.
              </p>
           </div>
        </motion.div>
      </section>

      {/* Core Values Grid */}
      <section className="min-h-screen snap-start flex flex-col justify-center py-24">
        <div className="max-w-7xl mx-auto w-full">
          <motion.h2 
            initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-display uppercase mb-16"
          >
            OUR CORE VALUES
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-primary">{value.num}</span>
                  <div className="h-[1px] flex-1 bg-slate-900/10" />
                </div>
                <value.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-display uppercase">{value.title}</h3>
                <p className="font-sans font-light text-slate-500 leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Contrast Section */}
      <section className="min-h-screen snap-start flex flex-col justify-center">
        <div className="dark-section group w-full">
          <div className="card-hover-border" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto w-full">
            <div className="max-w-xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl font-display uppercase mb-6 leading-tight"
              >
                Ready to <br />
                <span className="text-transparent [-webkit-text-stroke:1px_white]">Innovate?</span>
              </motion.h2>
              <p className="font-sans font-light text-slate-400 leading-relaxed mb-8">
                Let's discuss how we can transform your business processes with custom software. No cap, just results.
              </p>
              <a href="/contact" className="badge bg-white text-slate-950 font-bold hover:bg-primary hover:text-white transition-all transform hover:scale-105 inline-block">
                START CONVERSATION
              </a>
            </div>
            <div className="w-full md:w-auto flex justify-center">
              <div className="w-48 h-48 rounded-full border-2 border-white/10 flex items-center justify-center animate-spin-slow">
                 <div className="font-display text-8xl opacity-10">B</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
