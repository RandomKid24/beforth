import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Monitor, Shield, Zap, Smartphone, Database } from 'lucide-react';
import { Magnetic } from '../components/Magnetic';

export default function ServicesPage() {
  const services = [
    {
      title: "Digital Transformation",
      desc: "We help traditional businesses evolve into digital-first organizations, optimizing workflows and creating new revenue streams.",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Custom Software",
      desc: "Tailored applications built from the ground up to solve your unique business challenges with scalable architecture.",
      icon: <Monitor className="w-6 h-6" />
    },
    {
      title: "Cloud Infrastructure",
      desc: "Secure, highly available, and cost-effective cloud solutions designed for modern enterprise needs.",
      icon: <Database className="w-6 h-6" />
    },
    {
      title: "UI/UX Design",
      desc: "Award-winning interfaces that captivate users and drive conversions through intuitive, accessible design.",
      icon: <Smartphone className="w-6 h-6" />
    }
  ];

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
            <span className="font-mono text-[0.85rem] tracking-widest uppercase text-[#64748B]">What We Do</span>
          </div>
          
          <h1 className="text-[clamp(3.5rem,14vw,6rem)] md:text-[clamp(4rem,8.5vw,8rem)] leading-[1.05] py-2 font-display uppercase tracking-normal flex flex-col mb-8">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="block"
            >
              OUR
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="block text-transparent [-webkit-text-stroke:1.5px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A]"
            >
              SERVICES.
            </motion.span>
          </h1>
          
          <div className="flex flex-wrap gap-[1rem] mb-[2.618rem]">
            {['Digital Transformation', 'Custom Software', 'Cloud Infrastructure', 'UI/UX Design'].map((tag, i) => (
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
            We compose digital ecosystems. Mobile apps, dashboards, and integrations—all connected.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2.618rem] mb-[4.236rem]">
          {services.map((service, i) => (
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
                {service.icon}
              </div>
              <h3 className="text-[2rem] font-display uppercase leading-[1.1] mb-[1.618rem]">{service.title}</h3>
              <p className="font-sans font-light text-[1rem] text-[#64748B] leading-[1.618] flex-grow">
                {service.desc}
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
                Enterprise-Grade <br />
                <span className="text-transparent [-webkit-text-stroke:1px_white] md:[-webkit-text-stroke:2px_white]">Security.</span>
              </h3>
              <p className="font-sans font-light text-[1rem] text-slate-400 leading-[1.618] mb-8">
                We build systems that protect your data and your users. Our architecture is designed to withstand modern threats while maintaining high performance.
              </p>
              <Magnetic>
                <a href="/contact" className="relative overflow-hidden inline-flex items-center gap-3 px-6 py-3 bg-white border border-white text-[#0F172A] font-mono text-[0.75rem] tracking-widest uppercase rounded-full group">
                  <span className="relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-white">Let's Talk</span>
                  <div className="absolute inset-0 bg-[#2563EB] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                </a>
              </Magnetic>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-none p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
                <div>
                  <div className="text-4xl font-display mb-2">99.99%</div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest">Uptime SLA</div>
                </div>
                <Shield className="w-12 h-12 text-[#2563EB]" />
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70">Data Centers</span>
                  <span className="font-mono text-sm">Global</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70">DDoS Protection</span>
                  <span className="font-mono text-sm">Included</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70">Daily Backups</span>
                  <span className="font-mono text-sm">Automated</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
