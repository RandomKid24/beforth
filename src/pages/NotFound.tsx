import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <section className="min-h-screen w-full bg-[#0F172A] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#2563EB]/10 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#2563EB]/5 blur-[120px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 text-center flex flex-col items-center max-w-2xl"
      >
        <h1 className="text-[8rem] md:text-[12rem] font-display leading-none tracking-tighter text-transparent [-webkit-text-stroke:2px_#2563EB] mb-4">
          404
        </h1>
        <h2 className="text-3xl md:text-5xl font-display uppercase mb-6 text-white">
          bruh... you're lost fr fr
        </h2>
        <p className="text-[#94A3B8] font-mono text-lg md:text-xl mb-12 max-w-md mx-auto lowercase">
          this page is giving... absolutely nothing. no cap, the link is dead. touch grass or go back home.
        </p>

        <Link 
          to="/"
          className="relative overflow-hidden px-8 py-4 bg-[#2563EB] text-white rounded-full font-mono text-sm uppercase tracking-widest group flex items-center justify-center transition-all duration-500 hover:scale-105"
        >
          <span className="relative z-10">take me home</span>
          <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          <span className="absolute z-10 text-[#0F172A] translate-y-[150%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">take me home</span>
        </Link>
      </motion.div>
    </section>
  );
}
