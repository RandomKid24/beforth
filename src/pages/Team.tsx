import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';
import { Magnetic } from '../components/Magnetic';

function TeamMemberCard({ member, index }: { member: any, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  
  const yImage = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white p-6 rounded-none border border-slate-900/10 relative group flex flex-col h-full flex-1"
    >
      {/* Animated Borders */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-900 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-20" />
      <div className="absolute top-0 right-0 w-[2px] h-full bg-slate-900 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-20" />
      <div className="absolute bottom-0 right-0 w-full h-[2px] bg-slate-900 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-20" />
      <div className="absolute bottom-0 left-0 w-[2px] h-full bg-slate-900 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-20" />
      
      <div className="w-full aspect-[3/4] mb-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <motion.div style={{ y: yImage }} className="absolute inset-[-15%] w-[130%] h-[130%]">
          <img 
            src={member.image} 
            alt={member.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
        </motion.div>
      </div>
      
      <h3 className="text-[2rem] font-display uppercase leading-[1.1] mb-2">{member.name}</h3>
      <p className="font-mono text-sm text-primary tracking-widest uppercase mb-4">
        {member.role}
      </p>
      
      <div className="flex gap-4 mt-auto pt-4 border-t border-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <a href="#" className="text-slate-500 hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></a>
        <a href="#" className="text-slate-500 hover:text-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
        <a href="#" className="text-slate-500 hover:text-primary transition-colors"><Github className="w-4 h-4" /></a>
      </div>
    </motion.div>
  );
}

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
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-[4.236rem]"
        >
          <div className="flex items-center gap-3 mb-[1.618rem]">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[0.85rem] tracking-widest uppercase text-slate-500">Our People</span>
          </div>
          
          <h1 className="hero-heading mb-8">
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
              className="block text-transparent [-webkit-text-stroke:1.5px_var(--color-slate-900)] md:[-webkit-text-stroke:2px_var(--color-slate-900)]"
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
                className="badge"
              >
                {tag}
              </motion.span>
            ))}
          </div>
          
          <p className="text-[1rem] md:text-[1.2rem] font-sans text-slate-500 font-light leading-[1.618] max-w-2xl">
            A collective of passionate makers, thinkers, and doers dedicated to building exceptional digital products.
          </p>
        </motion.div>

        {/* Team Grid / Carousel */}
        <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none sm:grid-cols-2 lg:grid-cols-3 gap-[1.5rem] sm:gap-[2.618rem] mb-[4.236rem] pb-8 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {team.map((member, i) => (
            <div key={i} className="min-w-[85vw] sm:min-w-0 snap-center shrink-0 flex flex-col">
              <TeamMemberCard member={member} index={i} />
            </div>
          ))}
        </div>

        {/* Dark Contrast Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="dark-section group"
        >
          <div className="card-hover-border" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-[clamp(2.5rem,5vw,3.5rem)] font-display uppercase leading-[1.1] mb-4">
                Want to join <br />
                <span className="text-transparent [-webkit-text-stroke:1px_white] md:[-webkit-text-stroke:2px_white]">the team?</span>
              </h3>
              <p className="font-sans font-light text-[1rem] text-slate-400 leading-[1.618]">
                We're always looking for talented individuals who are passionate about creating exceptional digital experiences. Check out our open positions.
              </p>
            </div>
            <Magnetic>
              <a href="/contact" className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 bg-white border border-white text-slate-900 font-mono text-[0.85rem] tracking-widest uppercase rounded-full group shrink-0">
                <span className="relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-white">View Openings</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-white group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-primary translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
