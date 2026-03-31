import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const GRID_SIZE = 40; // px
const CELLS_COUNT = 800; // Total cells to cover screen

const GridCell = () => {
  const delay = useMemo(() => Math.random() * 5, []);
  const duration = useMemo(() => 2 + Math.random() * 4, []);
  
  return (
    <motion.div
      initial={{ opacity: 0.03 }}
      animate={{ 
        opacity: [0.03, 0.1, 0.03],
        backgroundColor: ["transparent", "rgba(37, 99, 235, 0.1)", "transparent"]
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut" 
      }}
      className="border-[0.5px] border-slate-900/5 w-full h-full"
    />
  );
};

export default function NotFound() {
  const cells = useMemo(() => Array.from({ length: CELLS_COUNT }), []);

  return (
    <section className="h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center px-6 relative overflow-hidden snap-start">
      
      {/* 21st.dev Inspired Interactive Grid */}
      <div className="absolute inset-0 z-0 flex flex-wrap content-start overflow-hidden opacity-50 pointer-events-none">
        {cells.map((_, i) => (
          <div key={i} style={{ width: GRID_SIZE, height: GRID_SIZE }}>
            <GridCell />
          </div>
        ))}
      </div>

      {/* Modern Mesh Gradient Overlay */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-primary/10 blur-[100px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 flex flex-col items-center text-center max-w-4xl"
      >
        <div className="relative mb-6">
          <h1 className="text-[8rem] md:text-[12rem] font-display leading-[0.8] tracking-tighter text-slate-900 select-none">
            404
          </h1>
          <div className="absolute -top-2 -right-6 font-mono text-[10px] text-primary border border-primary/20 px-2 py-0.5 rounded-sm bg-white/50 backdrop-blur-sm">
            VOID_ERROR
          </div>
        </div>

        <div className="relative mb-8">
          <h2 className="text-3xl md:text-5xl font-display uppercase leading-tight">
            Banger App<br />
            <span className="text-transparent [-webkit-text-stroke:1px_#0F172A]">Not Found.</span>
          </h2>
        </div>

        <p className="text-slate-500 font-sans text-[1rem] font-light max-w-sm mb-10 leading-relaxed">
          The requested coordinate is currently <span className="font-medium text-slate-900">offline.</span> Check Your entry or return to Home.
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Link 
            to="/"
            className="skeuo-btn group min-w-[220px]"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-primary">Return to Home</span>
          </Link>
          
          <Link 
            to="/contact"
            className="font-mono text-[10px] tracking-widest uppercase hover:text-primary transition-colors py-2 px-4"
          >
            Report Issue
          </Link>
        </div>
      </motion.div>

      {/* Modern Minimal Serial Indicators */}
      <div className="absolute bottom-6 left-12 hidden md:flex items-center gap-6 opacity-30">
        <div className="font-mono text-[9px] text-slate-500 tracking-wider">
          ST_ID. {Math.random().toString(16).slice(2, 8).toUpperCase()}
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-300" />
        <div className="font-mono text-[9px] text-slate-500 tracking-wider">
          {new Date().getUTCFullYear()}.v404
        </div>
      </div>
    </section>
  );
}
