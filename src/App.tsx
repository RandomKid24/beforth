import React, { useState, useEffect, useRef, useContext } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, LayoutGrid, Smartphone, Monitor, Linkedin, Twitter, Search, Bell, User, Truck, Package, MapPin, BarChart3, Settings, Activity, Clock, CheckCircle2, AlertCircle, Users, DollarSign, CreditCard, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Magnetic } from './components/Magnetic';

export const ScrollContext = React.createContext<React.RefObject<HTMLDivElement | null> | null>(null);

// --- STRICT 4-COLOR PALETTE ---
// 1. Cream (Background/Light): #0F172A
// 2. Slate (Dark/Text/Background): #FFFFFF
// 3. Sage (Accent/Hover): #2563EB
// 4. Pale (Subtle borders/text): #64748B

import { CustomCursor } from "./components/ui/custom-cursor";
import ServicesPage from './pages/Services';
import AboutPage from './pages/About';
import TeamPage from './pages/Team';
import ContactPage from './pages/Contact';

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full z-50 px-6 md:px-[5%] py-6 flex justify-between items-center mix-blend-difference text-white pointer-events-none"
      >
        <Link to="/" className="font-display text-2xl tracking-widest uppercase pointer-events-auto cursor-pointer hover:scale-105 transition-transform p-2 -ml-2">
          BEFORTH
        </Link>
        
        <div className="hidden md:flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
          <Link to="/" className={`pointer-events-auto px-3 py-4 hover:text-white/70 transition-colors relative group ${pathname === '/' ? 'text-white/70' : ''}`}>
            Home
            <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-[1px] bg-white transition-all duration-300 ${pathname === '/' ? 'w-[calc(100%-1.5rem)]' : 'w-0 group-hover:w-[calc(100%-1.5rem)]'}`} />
          </Link>
          <Link to="/services" className={`pointer-events-auto px-3 py-4 hover:text-white/70 transition-colors relative group ${pathname === '/services' ? 'text-white/70' : ''}`}>
            Services
            <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-[1px] bg-white transition-all duration-300 ${pathname === '/services' ? 'w-[calc(100%-1.5rem)]' : 'w-0 group-hover:w-[calc(100%-1.5rem)]'}`} />
          </Link>
          <Link to="/about" className={`pointer-events-auto px-3 py-4 hover:text-white/70 transition-colors relative group ${pathname === '/about' ? 'text-white/70' : ''}`}>
            About
            <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-[1px] bg-white transition-all duration-300 ${pathname === '/about' ? 'w-[calc(100%-1.5rem)]' : 'w-0 group-hover:w-[calc(100%-1.5rem)]'}`} />
          </Link>
          <Link to="/team" className={`pointer-events-auto px-3 py-4 hover:text-white/70 transition-colors relative group ${pathname === '/team' ? 'text-white/70' : ''}`}>
            Team
            <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-[1px] bg-white transition-all duration-300 ${pathname === '/team' ? 'w-[calc(100%-1.5rem)]' : 'w-0 group-hover:w-[calc(100%-1.5rem)]'}`} />
          </Link>
          <Link to="/contact" className={`pointer-events-auto px-3 py-4 hover:text-white/70 transition-colors relative group ${pathname === '/contact' ? 'text-white/70' : ''}`}>
            Contact
            <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-[1px] bg-white transition-all duration-300 ${pathname === '/contact' ? 'w-[calc(100%-1.5rem)]' : 'w-0 group-hover:w-[calc(100%-1.5rem)]'}`} />
          </Link>
        </div>

        <div className="hidden md:block">
          <Magnetic>
            <Link to="/contact" className="pointer-events-auto relative overflow-hidden px-6 py-3 border border-white rounded-full font-mono text-xs uppercase tracking-widest group inline-block">
              <span className="relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-black">Let's Talk</span>
              <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            </Link>
          </Magnetic>
        </div>

        <Magnetic>
          <motion.button 
            className="md:hidden pointer-events-auto z-50 w-12 h-12 flex flex-col justify-center items-center gap-1.5 -mr-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`w-6 h-[2px] bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`w-6 h-[2px] bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-[2px] bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </motion.button>
        </Magnetic>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={{
              closed: {
                opacity: 0,
                y: "-100%",
                transition: {
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  when: "afterChildren",
                  staggerChildren: 0.05,
                  staggerDirection: -1
                }
              },
              open: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  when: "beforeChildren",
                  staggerChildren: 0.1
                }
              }
            }}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-[#0F172A] text-white flex flex-col items-center justify-center gap-2"
          >
            {[
              { path: "/", label: "Home" },
              { path: "/services", label: "Services" },
              { path: "/about", label: "About" },
              { path: "/team", label: "Team" },
              { path: "/contact", label: "Contact" },
            ].map((item) => (
              <motion.div
                key={item.path}
                variants={{
                  closed: { opacity: 0, y: 20 },
                  open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="w-full"
              >
                <Link 
                  to={item.path} 
                  onClick={() => setIsOpen(false)} 
                  className={`block font-display text-4xl uppercase tracking-widest hover:text-[#2563EB] transition-colors w-full text-center py-6 ${pathname === item.path ? 'text-[#2563EB]' : ''}`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  const containerRef = useContext(ScrollContext);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    container: containerRef || undefined,
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const yText1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yText2 = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yText3 = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  // Parallax background elements
  const yBg1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yBg2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yBg3 = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const rotateBg1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotateBg2 = useTransform(scrollYProgress, [0, 1], [0, -45]);

  return (
    <section ref={sectionRef} className="min-h-screen w-full snap-start shrink-0 bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-center px-6 md:px-[10%] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: yBg1, rotate: rotateBg1 }}
          className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#2563EB]/5 blur-[120px]"
        />
        <motion.div
          style={{ y: yBg2, rotate: rotateBg2 }}
          className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#2563EB]/5 blur-[100px]"
        />
        <motion.div
          style={{ y: yBg3 }}
          className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] rounded-full bg-[#0F172A]/5 blur-[80px]"
        />
        
        {/* Grid Pattern with Parallax */}
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]) }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        />
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto mt-24 md:mt-24 flex flex-col md:flex-row items-center justify-between flex-1 py-[10vh]">
        
        {/* 61.8% Width for Main Content */}
        <div className="w-full md:w-[61.8%] flex flex-col justify-center h-full">
          <motion.div 
            style={{ opacity: opacityText }}
            className="mb-[3.82rem]"
          >
            <h1 className="text-[clamp(3.5rem,14vw,6rem)] md:text-[clamp(4rem,8.5vw,8rem)] leading-[1.05] py-2 font-display uppercase tracking-normal flex flex-col">
              <motion.div style={{ y: yText1 }} className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%", rotate: 5 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="block origin-top-left"
                >
                  WE SHIP
                </motion.span>
              </motion.div>
              <motion.div style={{ y: yText2 }} className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%", rotate: 5 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="block origin-top-left text-transparent [-webkit-text-stroke:1.5px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A]"
                >
                  BANGER
                </motion.span>
              </motion.div>
              <motion.div style={{ y: yText3 }} className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%", rotate: 5 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="block origin-top-left"
                >
                  APPS.
                </motion.span>
              </motion.div>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-[42.36rem]"
          >
            <div className="flex flex-wrap gap-[1rem] mb-[2.618rem]">
              {['Custom ERPs', 'Mobile Apps', 'Web Platforms', 'HRMS & CRM'].map((tag, i) => (
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

            <p className="text-[1rem] md:text-[1.2rem] font-sans text-[#64748B] font-light leading-[1.618] mb-[1.618rem]">
              We replace boring spreadsheets with custom software that actually slaps. <strong className="text-[#0F172A] font-medium">No cap, just clean code and good vibes.</strong>
            </p>
            <p className="text-[1rem] md:text-[1.2rem] font-sans text-[#0F172A] font-medium">
              You focus on the bag. We'll handle the tech.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-[4.236rem]"
          >
            <Magnetic>
              <a href="#cta" className="pointer-events-auto relative overflow-hidden px-8 py-4 border border-[#0F172A] rounded-full font-mono text-xs uppercase tracking-widest group inline-flex items-center gap-3 bg-[#0F172A] text-white">
                <span className="relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-[#0F172A]">START A PROJECT</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-[#0F172A] group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* 38.2% Width for Visual Element - Multi-Device Mockups */}
        <div className="hidden md:flex w-[38.2%] h-full items-center justify-center relative pointer-events-none" style={{ perspective: '2000px' }}>
          <motion.div 
            initial={{ opacity: 0, rotateY: 20, rotateX: 10, x: 50 }}
            animate={{ opacity: 1, rotateY: -15, rotateX: 5, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full aspect-square"
            style={{ transformStyle: 'preserve-3d', y: yImage }}
          >
            {/* 1. ERP Dashboard (100% width, 1.618:1 aspect) */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute top-[10%] right-0 w-full aspect-[1.618/1] bg-[#F8FAFC] border border-[#2563EB]/30 rounded-sm shadow-2xl flex flex-col overflow-hidden"
              style={{ transform: 'translateZ(-50px)' }}
            >
              {/* Top Header */}
              <div className="h-[1.618rem] border-b border-[#2563EB]/30 flex items-center px-3 justify-between bg-[#F8FAFC]/50">
                <div className="font-mono text-[0.45rem] tracking-widest text-[#64748B]">ERP_SYSTEM</div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]/50" />
                </div>
              </div>
              <div className="flex flex-1 p-3 gap-3">
                {/* Sidebar */}
                <div className="w-[14.6%] flex flex-col gap-3 border-r border-[#2563EB]/20 pr-3 pt-1">
                  <div className="h-1 w-full bg-[#020617]/80 rounded-full" />
                  <div className="h-1 w-[61.8%] bg-[#2563EB]/50 rounded-full" />
                  <div className="h-1 w-[100%] bg-[#2563EB]/50 rounded-full" />
                  <div className="h-1 w-[38.2%] bg-[#2563EB]/50 rounded-full" />
                </div>
                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-6 border border-[#2563EB]/20 rounded-sm bg-[#2563EB]/5" />
                    <div className="h-6 border border-[#2563EB]/20 rounded-sm bg-[#2563EB]/5" />
                    <div className="h-6 border border-[#2563EB]/20 rounded-sm bg-[#2563EB]/5" />
                  </div>
                  <div className="flex-1 border border-[#2563EB]/20 rounded-sm bg-[#2563EB]/5 flex items-end p-2 gap-1.5">
                    {[38.2, 61.8, 23.6, 100, 61.8, 85.4].map((h, i) => (
                      <div key={i} className={`flex-1 rounded-t-[1px] ${i === 3 ? 'bg-[#020617]' : 'bg-[#2563EB]/40'}`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. Web Platform (61.8% width, 1.618:1 aspect) */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="absolute bottom-[23.6%] left-[-10%] w-[61.8%] aspect-[1.618/1] bg-[#F8FAFC] border border-[#2563EB]/40 rounded-sm shadow-2xl flex flex-col overflow-hidden backdrop-blur-md"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="h-[1.2rem] border-b border-[#2563EB]/30 flex items-center px-2 justify-between bg-[#F8FAFC]/80">
                <div className="w-[23.6%] h-1 bg-[#020617]/80 rounded-full" />
                <div className="flex gap-1.5">
                  <div className="w-3 h-1 bg-[#2563EB]/50 rounded-full" />
                  <div className="w-3 h-1 bg-[#2563EB]/50 rounded-full" />
                </div>
              </div>
              <div className="flex-1 p-3 flex flex-col items-center justify-center gap-2">
                <div className="w-[61.8%] h-1.5 bg-[#020617] rounded-full" />
                <div className="w-[38.2%] h-1.5 bg-[#020617]/70 rounded-full" />
                <div className="w-[85.4%] h-8 mt-2 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-sm" />
              </div>
            </motion.div>

            {/* 3. Mobile App (38.2% width, 1:2 aspect approximately for phone) */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="absolute bottom-[5%] right-[14.6%] w-[38.2%] aspect-[1/2] bg-[#F8FAFC] border border-[#2563EB]/50 rounded-[1rem] shadow-2xl flex flex-col overflow-hidden"
              style={{ transform: 'translateZ(60px)' }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[38.2%] h-2 bg-[#F8FAFC] border-b border-x border-[#2563EB]/50 rounded-b-md z-10" />
              <div className="flex-1 p-3 pt-5 flex flex-col gap-3">
                <div className="w-full aspect-square rounded-full border-[3px] border-[#2563EB]/20 flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="40%" stroke="#0F172A" strokeWidth="3" fill="none" strokeDasharray="100" strokeDashoffset="38.2" strokeLinecap="round" />
                  </svg>
                  <div className="text-[#0F172A] font-display text-sm">62%</div>
                </div>
                <div className="flex flex-col gap-1.5 mt-auto">
                  <div className="w-full h-5 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-sm flex items-center px-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB]/50" />
                  </div>
                  <div className="w-full h-5 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-sm flex items-center px-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#020617]/80" />
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Contrast() {
  const containerRef = useContext(ScrollContext);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    container: containerRef || undefined,
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const yRight = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={sectionRef} className="min-h-screen py-24 md:py-0 w-full snap-start shrink-0 bg-[#020617] text-[#F8FAFC] flex flex-col justify-center px-6 md:px-[10%] relative overflow-hidden">
      {/* Golden Ratio Grid: 1fr to 1.618fr */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_1.618fr] gap-[4.236rem]">
        <motion.div 
          initial={{opacity:0, x:-50}} 
          whileInView={{opacity:1, x:0}} 
          transition={{duration:0.8}}
          style={{ y: yLeft }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-[2.618rem] md:text-[4.236rem] font-display uppercase mb-[2.618rem] leading-[1.05] pb-2">
            Off-the-shelf<br/>
            <span className="text-transparent [-webkit-text-stroke:1px_#FFFFFF]">is broken.</span>
          </h2>
          <ul className="space-y-[1.618rem] font-mono text-[0.85rem] md:text-[1rem] text-[#94A3B8]">
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ x: 10 }} 
              className="flex items-start gap-[1rem] transition-transform duration-300 cursor-default"
            >
              <div className="w-2 h-2 bg-[#94A3B8]/40 rounded-full shrink-0 mt-2"/> 
              <div className="flex-1 line-through decoration-[#94A3B8]/40">
                Paying monthly for features you never use
              </div>
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ x: 10 }} 
              className="flex items-start gap-[1rem] transition-transform duration-300 cursor-default"
            >
              <div className="w-2 h-2 bg-[#94A3B8]/40 rounded-full shrink-0 mt-2"/> 
              <div className="flex-1 line-through decoration-[#94A3B8]/40">
                Changing your business to fit the software
              </div>
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ x: 10 }} 
              className="flex items-start gap-[1rem] transition-transform duration-300 cursor-default"
            >
              <div className="w-2 h-2 bg-[#94A3B8]/40 rounded-full shrink-0 mt-2"/> 
              <div className="flex-1 line-through decoration-[#94A3B8]/40">
                Scattered data across 5 different apps
              </div>
            </motion.li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{opacity:0, x:50}} 
          whileInView={{opacity:1, x:0}} 
          transition={{duration:0.8, delay: 0.2}}
          style={{ y: yRight }}
          className="bg-[#F8FAFC] text-[#0F172A] p-[4.236rem] flex flex-col justify-center rounded-sm shadow-2xl"
        >
          <h2 className="text-[2.618rem] md:text-[4.236rem] font-display uppercase mb-[2.618rem] leading-[1.05] pb-2">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-[#0F172A] to-[#2563EB]"
            >
              Custom fits
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-[#0F172A]"
            >
              perfectly.
            </motion.span>
          </h2>
          <ul className="space-y-[1.618rem] font-mono text-[0.85rem] md:text-[1rem] text-[#64748B]">
            <motion.li whileHover={{ x: 10 }} className="flex items-start gap-[1rem] transition-transform duration-300 cursor-default">
              <div className="w-2 h-2 bg-[#2563EB] rounded-full shrink-0 mt-2"/> 
              <span className="text-[#0F172A] flex-1">Built exactly for your unique workflows</span>
            </motion.li>
            <motion.li whileHover={{ x: 10 }} className="flex items-start gap-[1rem] transition-transform duration-300 cursor-default">
              <div className="w-2 h-2 bg-[#2563EB] rounded-full shrink-0 mt-2"/> 
              <span className="text-[#0F172A] flex-1">Own your data, no monthly per-user fees</span>
            </motion.li>
            <motion.li whileHover={{ x: 10 }} className="flex items-start gap-[1rem] transition-transform duration-300 cursor-default">
              <div className="w-2 h-2 bg-[#2563EB] rounded-full shrink-0 mt-2"/> 
              <span className="text-[#0F172A] flex-1">One unified dashboard for everything</span>
            </motion.li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

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

function ServicesSection() {
  const containerRef = useContext(ScrollContext);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    container: containerRef || undefined,
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yMarquee = useTransform(scrollYProgress, [0, 1], ["-50px", "150px"]);

  return (
    <section id="services" ref={sectionRef} className="min-h-screen w-full snap-start shrink-0 bg-[#F8FAFC] text-[#0F172A] flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-[#2563EB]/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-0 w-1/4 h-1/3 bg-[#2563EB]/5 rounded-full blur-[120px]"
        />
      </div>

      {/* Dark filler to extend the Contrast section's background down to the slant */}
      <div className="absolute top-[-10rem] left-0 w-[110%] -translate-x-[5%] h-[15rem] bg-[#020617] -rotate-2 z-10" />

      <motion.div 
        style={{ y: yMarquee }}
        className="absolute top-8 md:top-12 left-0 w-[110%] -translate-x-[5%] -rotate-2 bg-[#020617] py-[1.618rem] z-20 border-y border-[#2563EB] shadow-xl"
      >
        <div className="flex whitespace-nowrap animate-marquee items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-[2.618rem] md:text-[4.236rem] leading-[1.05] py-2 md:py-4 font-display uppercase text-transparent [-webkit-text-stroke:1px_#FFFFFF] mx-[1.618rem] tracking-wide">
              BUILD <span className="text-[#2563EB] mx-[1rem]">•</span> SCALE <span className="text-[#2563EB] mx-[1rem]">•</span> INNOVATE <span className="text-[#2563EB] mx-[1rem]">•</span>
            </span>
          ))}
        </div>
      </motion.div>

      <div className="flex-1 flex items-center px-6 md:px-[5%] pt-[14rem] md:pt-[16rem] lg:pt-[18rem] pb-[4.236rem]">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 h-full">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`group flex flex-col p-[2.618rem] border-[#2563EB]/30 hover:bg-[#2563EB]/10 transition-colors duration-500 hover-target cursor-pointer
                ${index !== 0 ? 'border-t md:border-t-0 md:border-l' : ''}
              `}
            >
              <div className="font-mono text-[0.75rem] tracking-widest text-[#2563EB] mb-[2.618rem] uppercase">
                {service.id} — {service.category}
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  bounce: 0.6,
                  duration: 0.8,
                  delay: index * 0.2 + 0.3 
                }}
              >
                <service.icon className="w-[2.618rem] h-[2.618rem] mb-[1.618rem] text-[#64748B] group-hover:text-[#2563EB] transition-colors duration-300" strokeWidth={1.5} />
              </motion.div>
              
              <h3 className="text-[2.618rem] font-display uppercase tracking-wide mb-[1.618rem] text-[#0F172A] leading-[1.05] pt-2 pb-2">
                {service.title}
              </h3>
              
              <p className="text-[#64748B] font-sans font-light leading-[1.618] mb-auto text-[1rem]">
                {service.desc}
              </p>
              
              <div className="flex flex-wrap gap-[0.618rem] my-[2.618rem]">
                {service.tags.map(tag => (
                  <motion.span 
                    key={tag} 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-[0.618rem] py-[0.382rem] border border-[#2563EB]/50 text-[#64748B] font-mono text-[0.65rem] tracking-widest uppercase group-hover:border-[#0F172A] group-hover:text-[#0F172A] transition-colors duration-300 cursor-default"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
              
              <div className="inline-flex items-center gap-[1rem] font-mono text-[0.75rem] tracking-widest uppercase text-[#0F172A] group-hover:text-[#2563EB] transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 group-hover:after:origin-bottom-left group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:bg-[#2563EB]">
                EXPLORE <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  const containerRef = useContext(ScrollContext);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    container: containerRef || undefined,
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const yRight = useTransform(scrollYProgress, [0, 1], ["15%", "0%"]);

  return (
    <section id="work" ref={sectionRef} className="min-h-screen py-24 md:py-0 w-full snap-start shrink-0 bg-[#020617] text-[#F8FAFC] flex flex-col justify-center px-6 md:px-[10%] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-[#2563EB]/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -40, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-[#2563EB]/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex justify-between items-end mb-[4.236rem]">
          <h2 className="text-[4.236rem] md:text-[6.854rem] font-display uppercase leading-[1.05]">
            <span className="block pt-2 pb-2">RECENT</span>
            <span className="block pt-2 pb-2">WORK</span>
          </h2>
          <Magnetic>
            <a href="#" className="hidden md:flex items-center gap-[1rem] font-mono text-[0.85rem] hover-target group tracking-widest uppercase relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:bg-white transition-opacity hover:opacity-100 opacity-70">
              VIEW ALL <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300"/>
            </a>
          </Magnetic>
        </div>
        
        {/* Golden Ratio Grid: 1.618fr to 1fr */}
        <div className="grid grid-cols-1 md:grid-cols-[1.618fr_1fr] gap-[2.618rem] md:gap-[4.236rem]">
          <motion.div 
            initial={{opacity:0, scale:0.95}} 
            whileInView={{opacity:1, scale:1}} 
            transition={{duration:0.8}} 
            style={{ y: yLeft }}
            className="group hover-target cursor-pointer flex flex-col justify-end"
          >
            {/* Golden Rectangle Aspect Ratio */}
            <div className="w-full aspect-[1.618/1] bg-[#0a0a0a] mb-[1.618rem] overflow-hidden relative rounded-sm border border-[#262626] font-mono text-[0.45rem] md:text-[0.55rem] text-[#a3a3a3] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[#262626] px-3 py-2">
                <div className="text-white font-bold tracking-widest">LOGISTICSHUB</div>
                <div className="flex gap-2">
                  <div className="px-2 py-0.5 border border-[#262626] rounded-sm hover:bg-[#1a1a1a] transition-colors cursor-pointer">EXPORT</div>
                  <div className="px-2 py-0.5 bg-white text-black rounded-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer">+ SHIPMENT</div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-[20%] border-r border-[#262626] flex flex-col p-2 gap-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-white bg-[#1a1a1a] rounded-sm">
                    <div className="w-1 h-1 rounded-full bg-[#10b981]"></div>
                    DASHBOARD
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 hover:text-white transition-colors cursor-pointer">
                    <div className="w-1 h-1 rounded-full bg-transparent"></div>
                    SHIPMENTS
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 hover:text-white transition-colors cursor-pointer">
                    <div className="w-1 h-1 rounded-full bg-transparent"></div>
                    VENDORS
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 hover:text-white transition-colors cursor-pointer">
                    <div className="w-1 h-1 rounded-full bg-transparent"></div>
                    ROUTES
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 hover:text-white transition-colors cursor-pointer">
                    <div className="w-1 h-1 rounded-full bg-transparent"></div>
                    REPORTS
                  </div>
                </div>
                
                {/* Main Area */}
                <div className="flex-1 flex flex-col">
                  {/* Top Bar */}
                  <div className="px-3 py-2 border-b border-[#262626] text-white tracking-widest">
                    OPERATIONS CENTER
                  </div>
                  
                  {/* Stats */}
                  <div className="flex border-b border-[#262626]">
                    <div className="flex-1 p-3 border-r border-[#262626] flex flex-col gap-1">
                      <div className="text-white text-lg md:text-2xl font-bold leading-none">284</div>
                      <div className="text-[#10b981] flex items-center gap-1"><ArrowUpRight className="w-2 h-2 md:w-3 md:h-3"/> 12 Today</div>
                    </div>
                    <div className="flex-1 p-3 border-r border-[#262626] flex flex-col gap-1">
                      <div className="text-white text-lg md:text-2xl font-bold leading-none">94.2%</div>
                      <div className="text-[#10b981] flex items-center gap-1"><ArrowUpRight className="w-2 h-2 md:w-3 md:h-3"/> +0.5%</div>
                    </div>
                    <div className="flex-1 p-3 flex flex-col gap-1">
                      <div className="text-white text-lg md:text-2xl font-bold leading-none">17</div>
                      <div className="text-[#ef4444] flex items-center gap-1">Action!</div>
                    </div>
                  </div>
                  
                  {/* Table */}
                  <div className="flex-1 flex flex-col p-3 gap-2 overflow-hidden">
                    <div className="flex justify-between border-b border-[#262626] pb-1 uppercase tracking-widest text-[0.4rem] md:text-[0.45rem]">
                      <div className="w-1/4">SHIPMENT</div>
                      <div className="w-1/4">DESTINATION</div>
                      <div className="w-1/4 text-right">ETA</div>
                      <div className="w-1/4 text-right">STATUS</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "SHP-8921", dest: "Mumbai", eta: "Dec 12", status: "ON TIME", color: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20" },
                        { id: "SHP-8922", dest: "Delhi", eta: "Dec 12", status: "DELAYED", color: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20" },
                        { id: "SHP-8923", dest: "Bangalore", eta: "Dec 13", status: "ON TIME", color: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20" },
                        { id: "SHP-8924", dest: "Chennai", eta: "Dec 13", status: "PENDING", color: "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20" },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="w-1/4 text-white">{row.id}</div>
                          <div className="w-1/4">{row.dest}</div>
                          <div className="w-1/4 text-right">{row.eta}</div>
                          <div className="w-1/4 flex justify-end">
                            <span className={`px-1.5 py-0.5 border rounded-sm text-[0.35rem] md:text-[0.4rem] tracking-wider ${row.color}`}>
                              {row.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-start mt-4">
              <div className="pr-4">
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-display uppercase mb-2 leading-tight tracking-wide font-normal py-1"
                >
                  Global Logistics ERP
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="font-sans text-sm md:text-base font-normal text-slate-400 tracking-wide leading-relaxed"
                >
                  Supply Chain <span className="text-blue-500 mx-1.5">•</span> React <span className="text-blue-500 mx-1.5">•</span> Node.js
                </motion.p>
              </div>
              <ArrowRight className="w-6 h-6 shrink-0 -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-slate-50 mt-2"/>
            </div>
          </motion.div>

          <motion.div 
            initial={{opacity:0, scale:0.95}} 
            whileInView={{opacity:1, scale:1}} 
            transition={{duration:0.8, delay:0.2}} 
            style={{ y: yRight }}
            className="group hover-target cursor-pointer flex flex-col justify-end"
          >
            {/* Golden Rectangle Aspect Ratio */}
            <div className="w-full aspect-[1.618/1] bg-[#0a0a0a] mb-[1.618rem] overflow-hidden relative rounded-sm border border-[#262626] font-mono text-[0.45rem] md:text-[0.55rem] text-[#a3a3a3] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[#262626] px-3 py-2">
                <div className="text-white font-bold tracking-widest">SALESPULSE CRM</div>
                <div className="flex gap-2">
                  <div className="px-2 py-0.5 border border-[#262626] rounded-sm hover:bg-[#1a1a1a] transition-colors cursor-pointer">EXPORT</div>
                  <div className="px-2 py-0.5 bg-white text-black rounded-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer">+ ADD LEAD</div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Left Panel */}
                <div className="w-1/2 border-r border-[#262626] flex flex-col">
                  <div className="flex justify-between items-center px-3 py-2 border-b border-[#262626] uppercase tracking-widest text-[0.4rem] md:text-[0.45rem]">
                    <div>SALES PIPELINE</div>
                    <div>THIS MONTH</div>
                  </div>
                  
                  {/* Bars */}
                  <div className="flex-1 flex flex-col justify-center gap-2 md:gap-3 px-3 py-2">
                    {[
                      { label: "NEW LEADS", width: "100%", val: "85", color: "bg-[#262626]" },
                      { label: "CONTACTED", width: "80%", val: "62", color: "bg-[#333333]" },
                      { label: "QUALIFIED", width: "60%", val: "38", color: "bg-[#404040]" },
                      { label: "PROPOSAL", width: "40%", val: "24", color: "bg-[#525252]" },
                      { label: "CLOSED WON", width: "20%", val: "14", color: "bg-[#10b981]" },
                    ].map((bar, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-16 md:w-20 truncate">{bar.label}</div>
                        <div className="flex-1 h-1.5 md:h-2 bg-[#1a1a1a] rounded-sm overflow-hidden">
                          <div className={`h-full ${bar.color}`} style={{ width: bar.width }} />
                        </div>
                        <div className="w-4 text-right text-white">{bar.val}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats Bottom */}
                  <div className="flex border-t border-[#262626]">
                    <div className="flex-1 p-2 border-r border-[#262626] flex flex-col gap-0.5">
                      <div className="text-white text-sm md:text-lg font-bold leading-none">₹18.4L</div>
                      <div className="text-[#10b981] flex items-center gap-0.5"><ArrowUpRight className="w-1.5 h-1.5 md:w-2 md:h-2"/> 32%</div>
                    </div>
                    <div className="flex-1 p-2 border-r border-[#262626] flex flex-col gap-0.5">
                      <div className="text-white text-sm md:text-lg font-bold leading-none">14</div>
                      <div className="text-[#10b981] flex items-center gap-0.5"><ArrowUpRight className="w-1.5 h-1.5 md:w-2 md:h-2"/> 4</div>
                    </div>
                    <div className="flex-1 p-2 flex flex-col gap-0.5">
                      <div className="text-white text-sm md:text-lg font-bold leading-none">16.8%</div>
                      <div className="text-[#ef4444] flex items-center gap-0.5"><ArrowDownRight className="w-1.5 h-1.5 md:w-2 md:h-2"/> 2%</div>
                    </div>
                  </div>
                </div>
                
                {/* Right Panel */}
                <div className="w-1/2 flex flex-col">
                  {/* Trend */}
                  <div className="flex-1 border-b border-[#262626] flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center px-3 py-2 z-10 uppercase tracking-widest text-[0.4rem] md:text-[0.45rem]">
                      <div>LEAD TREND</div>
                      <div>30 DAYS</div>
                    </div>
                    <div className="absolute inset-0 pt-6">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                        <defs>
                          <linearGradient id="dark-chart-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,35 Q20,30 40,25 T80,15 T100,5" fill="none" stroke="#525252" strokeWidth="1" />
                        <path d="M0,35 Q20,30 40,25 T80,15 T100,5 L100,40 L0,40 Z" fill="url(#dark-chart-gradient)" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Recent Leads */}
                  <div className="flex-1 flex flex-col p-3 gap-2">
                    <div className="pb-1 uppercase tracking-widest text-[0.4rem] md:text-[0.45rem]">RECENT LEADS</div>
                    <div className="flex flex-col gap-2">
                      {[
                        { name: "Ravi Textiles Pvt Ltd", loc: "Mumbai", status: "HOT", color: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20" },
                        { name: "Gupta Industries", loc: "Delhi", status: "WARM", color: "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20" },
                        { name: "Mehta Exports", loc: "Surat", status: "HOT", color: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20" },
                        { name: "Singh Agro Ltd", loc: "Nashik", status: "COLD", color: "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20" },
                      ].map((lead, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#1a1a1a] border border-[#262626]" />
                            <div className="text-white truncate max-w-[80px] md:max-w-[120px]">{lead.name}</div>
                          </div>
                          <div className="flex items-center gap-2 md:gap-4">
                            <div className="hidden sm:block">{lead.loc}</div>
                            <span className={`px-1.5 py-0.5 border rounded-sm text-[0.35rem] md:text-[0.4rem] tracking-wider ${lead.color}`}>
                              {lead.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-start mt-4">
              <div className="pr-4">
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-display uppercase mb-2 leading-tight tracking-wide font-normal py-1"
                >
                  Fintech CRM App
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="font-sans text-sm md:text-base font-normal text-slate-400 tracking-wide leading-relaxed"
                >
                  Finance <span className="text-blue-500 mx-1.5">•</span> React Native <span className="text-blue-500 mx-1.5">•</span> PostgreSQL
                </motion.p>
              </div>
              <ArrowRight className="w-6 h-6 shrink-0 -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-slate-50 mt-2"/>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  { num: "01", title: "DISCOVERY", desc: "We map your exact business workflows and identify bottlenecks before writing code.", details: ["Stakeholder Interviews", "Process Mapping", "Technical Feasibility", "Project Roadmap"] },
  { num: "02", title: "ARCHITECTURE", desc: "We design the database, system architecture, and user flows for maximum scalability.", details: ["Database Schema Design", "API Contract Definition", "UI/UX Wireframing", "Security Planning"] },
  { num: "03", title: "DEVELOPMENT", desc: "We build your system in agile sprints, showing you tangible progress every week.", details: ["Agile Sprints", "Continuous Integration", "Automated Testing", "Weekly Demos"] },
  { num: "04", title: "DEPLOYMENT", desc: "We launch the software, train your team, and provide ongoing maintenance and support.", details: ["Cloud Infrastructure Setup", "Data Migration", "User Training", "24/7 Monitoring"] }
];

function Process() {
  const containerRef = useContext(ScrollContext);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    container: containerRef || undefined,
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section id="process" ref={sectionRef} className="min-h-screen py-24 md:py-0 w-full snap-start shrink-0 bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-center px-6 md:px-[10%] relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* 61.8% Width for Title */}
        <motion.div style={{ y: yTitle }} className="mb-[4.236rem] md:w-[61.8%]">
          <motion.h2 
            initial={{opacity:0, y:40, filter: "blur(10px)"}} 
            whileInView={{opacity:1, y:0, filter: "blur(0px)"}} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{duration:1, ease: [0.16, 1, 0.3, 1]}}
            className="text-[4.236rem] md:text-[6.854rem] font-display uppercase text-transparent [-webkit-text-stroke:1px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A] leading-[1.05] pb-2"
          >
            HOW WE WORK
          </motion.h2>
        </motion.div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[2.618rem] relative z-10 pb-12 md:pb-24">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                className="h-full"
              >
                <motion.div
                  initial={{opacity:0, y:40, filter: "blur(10px)"}} 
                  whileInView={{opacity:1, y:0, filter: "blur(0px)"}} 
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1]}}
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                  className={`pt-[1.618rem] hover-target group cursor-pointer h-full flex flex-col transition-colors duration-500`}
                >
                  <div className="flex justify-between items-center mb-[1.618rem] relative">
                    <div className="font-mono text-[0.75rem] tracking-widest text-[#2563EB] group-hover:scale-110 group-hover:-translate-y-1 origin-left transition-transform duration-500">{step.num}</div>
                  <motion.div 
                    animate={{ rotate: activeStep === i ? 45 : 0, backgroundColor: activeStep === i ? '#2563EB' : 'transparent', color: activeStep === i ? '#fff' : '#2563EB' }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-500"
                  >
                    <span className="text-lg leading-none mb-[2px]">+</span>
                  </motion.div>
                </div>
                <h3 className="text-[1.618rem] font-display uppercase mb-[1rem] group-hover:text-[#2563EB] group-hover:translate-x-2 transition-all duration-500">{step.title}</h3>
                <p className="font-sans font-light text-[0.85rem] text-[#64748B] leading-[1.618] group-hover:text-[#0F172A] transition-colors duration-500">{step.desc}</p>
                
                <AnimatePresence>
                  {activeStep === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, filter: "blur(4px)" }}
                      animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                      exit={{ height: 0, opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-6 space-y-3 pt-2">
                        {step.details.map((detail, idx) => (
                          <motion.li 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
                            className="flex items-start gap-3 text-[0.85rem] text-[#0F172A]"
                          >
                            <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-full mt-1.5 shrink-0" />
                            <span className="leading-relaxed">{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useContext(ScrollContext);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    container: containerRef || undefined,
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section id="cta" ref={sectionRef} className="min-h-screen py-24 w-full snap-start shrink-0 bg-[#2563EB] text-[#F8FAFC] flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Marquee */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 flex flex-col justify-center gap-4 md:gap-8 opacity-90"
      >
        <div className="animate-marquee flex whitespace-nowrap">
          <h2 className="text-[25vw] md:text-[20vw] leading-[1.05] py-2 md:py-4 font-display uppercase tracking-normal text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.4)] md:[-webkit-text-stroke:4px_rgba(255,255,255,0.4)] pr-8">
            LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — 
          </h2>
        </div>
        <div className="animate-marquee-reverse flex whitespace-nowrap">
          <h2 className="text-[25vw] md:text-[20vw] leading-[1.05] py-2 md:py-4 font-display uppercase tracking-normal text-[#F8FAFC] pr-8">
            LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — 
          </h2>
        </div>
        <div className="animate-marquee-fast flex whitespace-nowrap">
          <h2 className="text-[25vw] md:text-[20vw] leading-[1.05] py-2 md:py-4 font-display uppercase tracking-normal text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.4)] md:[-webkit-text-stroke:4px_rgba(255,255,255,0.4)] pr-8">
            LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — LET'S BUILD IT — 
          </h2>
        </div>
      </motion.div>

      {/* Floating Center Button */}
      <div className="z-10 absolute inset-0 flex items-center justify-center pointer-events-none">
        <Magnetic>
          <motion.a
            href="mailto:hello@beforth.in"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto relative w-[160px] h-[160px] md:w-[240px] md:h-[240px] rounded-full flex flex-col items-center justify-center overflow-hidden shadow-2xl group/btn"
          >
            {/* Default Dark Gradient */}
            <motion.div 
              className="absolute inset-0 bg-[linear-gradient(45deg,#020617,#0F172A,#1E293B,#020617)] bg-[length:300%_300%]"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Hover Colorful Gradient */}
            <motion.div 
              className="absolute inset-0 bg-[linear-gradient(120deg,#2563EB,#4F46E5,#7C3AED,#2563EB)] bg-[length:300%_300%]"
              initial={{ opacity: 0 }}
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                opacity: isHovered ? 1 : 0
              }}
              transition={{ 
                backgroundPosition: { duration: 12, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.4, ease: "easeInOut" }
              }}
            />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {/* Text Micro-interaction */}
              <div className="h-6 md:h-8 overflow-hidden relative w-24 flex justify-center mb-2">
                <motion.span 
                  className="font-mono text-[0.85rem] md:text-[1rem] tracking-widest uppercase absolute text-[#F8FAFC]"
                  animate={{ y: isHovered ? -30 : 0, opacity: isHovered ? 0 : 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  START
                </motion.span>
                <motion.span 
                  className="font-mono text-[0.85rem] md:text-[1rem] tracking-widest uppercase absolute text-[#F8FAFC]"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: isHovered ? 0 : 30, opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  BUILD
                </motion.span>
              </div>
              
              {/* Arrow */}
              <motion.div
                className="text-[#F8FAFC]"
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover/btn:translate-x-2 transition-transform duration-300" />
              </motion.div>
            </div>
          </motion.a>
        </Magnetic>
      </div>

      <div className="absolute bottom-[1.618rem] left-0 w-full px-[2.618rem] flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] md:text-[0.75rem] tracking-widest uppercase text-[#F8FAFC]/80 z-20">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          © {new Date().getFullYear()} BEFORTH
        </motion.span>
        <div className="flex items-center gap-6">
          <motion.a 
            href="https://linkedin.com/company/beforth" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }}
            whileHover={{ scale: 1.1, y: -2, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
          >
            <Linkedin className="w-4 h-4" />
            <span className="hidden md:inline">LinkedIn</span>
          </motion.a>
          <motion.a 
            href="https://twitter.com/beforth" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } }}
            whileHover={{ scale: 1.1, y: -2, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
          >
            <Twitter className="w-4 h-4" />
            <span className="hidden md:inline">Twitter</span>
          </motion.a>
        </div>
        <motion.span 
          className="hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          BESPOKE SYSTEMS
        </motion.span>
      </div>
    </section>
  );
}

const PageTransition = ({ children }: { children: React.ReactNode, key?: React.Key }) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  return (
    <ScrollContext.Provider value={scrollRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          width: max-content;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 25s linear infinite;
          width: max-content;
        }
        .animate-marquee-fast {
          animation: marquee 15s linear infinite;
          width: max-content;
        }

        /* Hide scrollbar for clean snap experience */
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <div ref={scrollRef} className="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-[#F8FAFC] cursor-none selection:bg-[#2563EB] selection:text-[#0F172A]">
        <CustomCursor cursorType="arrow-pointer" color="#0F172A" size={24} />
        <Navbar />
        <AnimatePresence mode="wait" onExitComplete={() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo(0, 0);
          }
        }}>
          <PageTransition key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={
                <>
                  <Hero />
                  <Contrast />
                  <ServicesSection />
                  <Work />
                  <Process />
                  <CTA />
                </>
              } />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </div>
    </ScrollContext.Provider>
  );
}
