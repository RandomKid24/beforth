import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Users, Target, Lightbulb, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-[15vh] pb-32 px-6 md:px-[10%]">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-[4.236rem]"
        >
          <div className="flex items-center gap-3 mb-[1.618rem]">
            <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="font-mono text-[0.85rem] tracking-widest uppercase text-[#64748B]">Who We Are</span>
          </div>
          
          <h1 className="text-[clamp(3.5rem,14vw,6rem)] md:text-[clamp(4rem,8.5vw,8rem)] leading-[0.95] font-display uppercase tracking-normal flex flex-col mb-8">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="block"
            >
              WE ARE
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="block text-transparent [-webkit-text-stroke:1.5px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A]"
            >
              BEFORTH.
            </motion.span>
          </h1>
          
          <div className="flex flex-wrap gap-[1rem] mb-[2.618rem]">
            {['Innovation', 'Quality', 'Collaboration', 'Transparency'].map((tag, i) => (
              <motion.span 
                key={i} 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-[1rem] py-[0.618rem] rounded-full border border-[#2563EB]/40 text-[#0F172A] font-mono text-[0.75rem] tracking-widest uppercase bg-[#2563EB]/10 cursor-default hover:bg-[#2563EB]/20 transition-colors duration-300"
              >
                {tag}
              </motion.span>
            ))}
          </div>
          
          <p className="text-[1rem] md:text-[1.2rem] font-sans text-[#64748B] font-light leading-[1.618] max-w-2xl">
            To empower businesses through innovative technology and user-centric design. We build software that doesn't just look great, but solves real-world problems efficiently.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2.618rem] mb-[4.236rem]">
          {[
            {
              title: "Innovation",
              desc: "We constantly explore new technologies and methodologies to deliver cutting-edge solutions.",
              icon: <Lightbulb className="w-6 h-6" />
            },
            {
              title: "Quality",
              desc: "Excellence is not an act, but a habit. We ensure the highest standards in every line of code.",
              icon: <Target className="w-6 h-6" />
            },
            {
              title: "Collaboration",
              desc: "We work closely with our clients, treating their goals as our own to achieve mutual success.",
              icon: <Users className="w-6 h-6" />
            },
            {
              title: "Transparency",
              desc: "Open communication and clear processes build trust and ensure project alignment.",
              icon: <Shield className="w-6 h-6" />
            }
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white p-8 md:p-12 rounded-none border border-[#0F172A]/10 relative group flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="w-12 h-12 bg-[#2563EB]/10 text-[#2563EB] rounded-none flex items-center justify-center mb-6 border border-[#2563EB]/20">
                {value.icon}
              </div>
              <h3 className="text-[2rem] font-display uppercase leading-[1.1] mb-[1.618rem]">{value.title}</h3>
              <p className="font-sans font-light text-[1rem] text-[#64748B] leading-[1.618] flex-grow">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dark Contrast Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-[8.5vh] bg-[#020617] text-white p-8 md:p-16 rounded-none relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-[clamp(2.5rem,5vw,3.5rem)] font-display uppercase leading-[1.1] mb-6">
                Join Our <br />
                <span className="text-transparent [-webkit-text-stroke:1px_white] md:[-webkit-text-stroke:2px_white]">Journey.</span>
              </h3>
              <p className="font-sans font-light text-[1rem] text-slate-400 leading-[1.618] mb-8">
                We're always looking for passionate individuals to join our team and help us build the future of digital experiences.
              </p>
              <a href="/team" className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#0F172A] font-mono text-[0.75rem] tracking-widest uppercase rounded-none hover:bg-[#2563EB] hover:text-white transition-colors duration-300">
                Meet the Team
              </a>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden border border-white/10">
              <img src="https://picsum.photos/seed/agency/800/600" alt="Office" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-white font-display text-4xl md:text-5xl uppercase tracking-tighter mix-blend-overlay">NO CAP. JUST CODE.</h2>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
