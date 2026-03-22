import React from 'react';
import { motion } from 'motion/react';

const tags = [
  "The Bridge Traditional ↔ Digital",
  "Process-focused",
  "Reliable",
  "Long-term",
  "Clarity"
];

const contentBlocks = [
  {
    label: "Who we are",
    sub: "Our Story",
    title: "Born from the friction of tradition.",
    body: (
      <>
        <p className="mb-6">
          Beforth began with a simple observation: the world's most essential businesses were being held back by their own history—relying on paper, manual entry, and fragmented spreadsheets.
        </p>
        <p>
          We started by helping early clients bridge the gap between legacy operations and modern capability. Today, we've grown into a partner for traditional businesses that refuse to settle.
        </p>
      </>
    )
  },
  {
    label: "What We Do",
    title: "Digitization as a competitive weapon.",
    body: (
      <>
        <p className="mb-6">
          We partner with mid-sized businesses to digitize core operations. Unlike generic software vendors, we deliver bespoke systems designed for your specific workflows.
        </p>
        <p>
          We serve pharma, retail, wholesale, jewellery, textiles, and e-commerce. We don't sell features; we architect your internal success.
        </p>
      </>
    )
  },
  {
    label: "Why Beforth",
    title: "Process-first. Long-term. Intentional.",
    body: (
      <>
        <p className="mb-6">
          We believe that technology should be invisible. We focus on the underlying process before we ever write a single line of code.
        </p>
        <p>
          We aren't here for the one-off project; we are here for the long-haul evolution of your business, ensuring your systems scale as you do.
        </p>
      </>
    )
  },
  {
    label: "The Mission",
    title: "We exist because complexity kills.",
    body: (
      <>
        <blockquote className="border-l-2 border-[#2563EB] pl-6 py-2 my-8 text-xl md:text-2xl font-display tracking-wide text-[#0F172A] bg-[#2563EB]/5 rounded-r-lg">
          "We started because operational debt is a silent killer of growth."
        </blockquote>
        <p>
          Every business reaches a point where spreadsheets become a burden. We exist to reclaim that lost time and fix the debt that keeps you from competing.
        </p>
      </>
    )
  }
];

const principles = [
  {
    title: "We Show Up When It Matters Most",
    desc: "Launches. Digitization. Scaling. We do our best work when the stakes are highest—helping you move from paper to digital and make decisions that move your business forward, fast."
  },
  {
    title: "Your Systems Must Perform",
    desc: "There are plenty of apps in the world. We build systems that actually work—driving clarity, control, and results for your business. Good design is table stakes; we deliver solutions that perform."
  },
  {
    title: "We're In It For The Long Haul",
    desc: "From implementation to support, we align with your goals from the start. We don't do one-offs. Instead, we build robust systems designed to scale and consistently deliver value over time."
  },
  {
    title: "Doing Great Work, With Great People",
    desc: "We believe in working with good people, doing good things, to generate exceptional results—accelerating both business growth and personal success."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#2563EB] selection:text-white pb-24 md:pb-0">
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-48 pb-20 px-6 md:px-[10%] max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-display uppercase tracking-normal text-[#0F172A] mb-8 leading-[0.9]">
            ABOUT <br/>
            <span className="text-transparent [-webkit-text-stroke:1.5px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A]">BEFORTH.</span>
          </h1>
          
          <p className="text-[1.2rem] md:text-[1.5rem] font-sans text-[#64748B] font-light leading-[1.618] max-w-3xl mb-12">
            We transform traditional business operations into structured, efficient digital systems. <strong className="text-[#0F172A] font-medium">Paper ledgers become dashboards. Manual entries become records.</strong>
          </p>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag, index) => (
              <motion.span 
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.05), ease: [0.16, 1, 0.3, 1] }}
                className="px-4 py-2 rounded-full border border-[#2563EB]/20 text-[#0F172A] font-mono text-xs tracking-widest uppercase bg-[#2563EB]/5"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <div className="bg-[#2563EB] py-6 overflow-hidden flex whitespace-nowrap border-y border-[#0F172A]/10">
        <div className="animate-marquee flex items-center">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-2xl md:text-4xl font-display uppercase text-white mx-8 tracking-wide">
              Process-focused <span className="mx-8 opacity-50">•</span> Multi-industry <span className="mx-8 opacity-50">•</span> Long-term <span className="mx-8 opacity-50">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Editorial Content Sections */}
      <section className="py-24 md:py-32 px-6 md:px-[10%] max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-24 md:gap-32">
          {contentBlocks.map((block, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16"
            >
              {/* Sticky Label Column */}
              <div className="relative">
                <h2 className="font-mono text-sm tracking-widest uppercase text-[#2563EB] md:sticky md:top-32">
                  // {block.label}
                </h2>
              </div>
              
              {/* Content Column */}
              <div>
                {block.sub && (
                  <h3 className="text-lg md:text-xl font-sans text-[#64748B] mb-4 uppercase tracking-widest">
                    {block.sub}
                  </h3>
                )}
                <h3 className="text-[2.5rem] md:text-[4rem] font-display uppercase leading-[0.9] text-[#0F172A] mb-8">
                  {block.title}
                </h3>
                <div className="text-[1.1rem] md:text-[1.25rem] font-sans text-[#64748B] font-light leading-[1.618]">
                  {block.body}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Principles Section */}
      <section className="bg-[#020617] text-white py-24 md:py-32 px-6 md:px-[10%]">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20"
          >
            <h2 className="text-[3rem] md:text-[5rem] font-display uppercase leading-[0.9] max-w-4xl">
              Four Principles <br/>
              <span className="text-transparent [-webkit-text-stroke:1px_#FFFFFF] md:[-webkit-text-stroke:2px_#FFFFFF]">We Never Get Bored Of Talking About</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {principles.map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-white/20 pt-8 group"
              >
                <div className="font-display text-[3rem] md:text-[4rem] text-[#2563EB] mb-6 leading-none group-hover:scale-110 origin-left transition-transform duration-500">
                  0{i+1}
                </div>
                <h3 className="text-[1.5rem] md:text-[2rem] font-display uppercase tracking-wide mb-4 text-white">
                  {p.title}
                </h3>
                <p className="text-[1rem] md:text-[1.1rem] font-sans text-slate-400 font-light leading-[1.618]">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
