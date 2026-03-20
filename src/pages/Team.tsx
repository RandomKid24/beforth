import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';
import { Magnetic } from '../components/Magnetic';

export default function TeamPage() {
  const team = [
    { name: "ALEX RIVERA", role: "FOUNDER & CEO", image: "https://picsum.photos/seed/alex/600/800" },
    { name: "SARAH CHEN", role: "HEAD OF DESIGN", image: "https://picsum.photos/seed/sarah/600/800" },
    { name: "MARCUS J.", role: "LEAD ENGINEER", image: "https://picsum.photos/seed/marcus/600/800" },
    { name: "ELENA R.", role: "PRODUCT MGR", image: "https://picsum.photos/seed/elena/600/800" },
    { name: "DAVID K.", role: "FRONTEND DEV", image: "https://picsum.photos/seed/david/600/800" },
    { name: "MIA T.", role: "UX RESEARCHER", image: "https://picsum.photos/seed/mia/600/800" }
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
            <span className="font-mono text-[0.85rem] tracking-widest uppercase text-[#64748B]">Our People</span>
          </div>
          
          <h1 className="text-[clamp(3.5rem,14vw,6rem)] md:text-[clamp(4rem,8.5vw,8rem)] leading-[1.05] py-2 font-display uppercase tracking-normal flex flex-col mb-8">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="block"
            >
              THE
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="block text-transparent [-webkit-text-stroke:1.5px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A]"
            >
              SQUAD.
            </motion.span>
          </h1>
          
          <div className="flex flex-wrap gap-[1rem] mb-[2.618rem]">
            {['Engineers', 'Designers', 'Strategists', 'Creators'].map((tag, i) => (
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
            A collective of passionate makers, thinkers, and doers dedicated to building exceptional digital products.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2.618rem] mb-[4.236rem]">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white p-6 rounded-none border border-[#0F172A]/10 relative group flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />
              
              <div className="w-full aspect-[3/4] mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-[#2563EB]/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src={member.image} 
                  alt={member.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              
              <h3 className="text-[1.5rem] font-display uppercase leading-[1.1] mb-2">{member.name}</h3>
              <p className="font-mono text-[0.75rem] text-[#2563EB] tracking-widest uppercase mb-4">
                {member.role}
              </p>
              
              <div className="flex gap-4 mt-auto pt-4 border-t border-[#0F172A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a href="#" className="text-[#64748B] hover:text-[#2563EB] transition-colors"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="text-[#64748B] hover:text-[#2563EB] transition-colors"><Linkedin className="w-4 h-4" /></a>
                <a href="#" className="text-[#64748B] hover:text-[#2563EB] transition-colors"><Github className="w-4 h-4" /></a>
              </div>
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-[clamp(2.5rem,4vw,3rem)] font-display uppercase leading-[1.1] mb-4">
                Want to join <br />
                <span className="text-transparent [-webkit-text-stroke:1px_white] md:[-webkit-text-stroke:2px_white]">the team?</span>
              </h3>
              <p className="font-sans font-light text-[1rem] text-slate-400 leading-[1.618]">
                We're always looking for talented individuals who are passionate about creating exceptional digital experiences. Check out our open positions.
              </p>
            </div>
            <Magnetic>
              <a href="/contact" className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 bg-white border border-white text-[#0F172A] font-mono text-[0.85rem] tracking-widest uppercase rounded-full group shrink-0">
                <span className="relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-white">View Openings</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-white group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-[#2563EB] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
