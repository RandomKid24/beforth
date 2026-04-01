import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Linkedin, Github } from 'lucide-react';

export default function ContactPage() {
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
            <span className="font-mono text-[0.85rem] tracking-widest uppercase text-slate-500">Contact</span>
          </div>

          <h1 className="hero-heading mb-12">
            <span className="block">LET'S</span>
            <span className="block text-transparent [-webkit-text-stroke:1.5px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A]">TALK.</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.618fr] gap-12 md:gap-24 items-start">
            {/* Contact Details */}
            <div className="flex flex-col gap-12">
              <p className="text-[1rem] font-sans text-slate-700 font-light leading-relaxed mb-6">
                Have a project in mind or just want to say hi? Reach out using the form, or through our direct channels.
              </p>
              
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4 group/item">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-none border border-primary/20 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                    <Mail className="w-5 h-5 text-primary group-hover/item:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-slate-500 mb-1">Email Us</div>
                    <div className="font-display text-xl uppercase">support@beforth.in</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 group/item">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-none border border-primary/20 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                    <Phone className="w-5 h-5 text-primary group-hover/item:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-slate-500 mb-1">Call Us</div>
                    <div className="font-display text-xl uppercase">+91 93222 34220</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 group/item">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-none border border-primary/20 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                    <MapPin className="w-5 h-5 text-primary group-hover/item:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-slate-500 mb-1">Visit Us</div>
                    <div className="font-display text-xl uppercase">Office #404, Tech Park, <br />Mumbai, India</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 mt-6">
                <a href="https://www.instagram.com/beforth.in" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors hover:scale-125 duration-300"><Instagram className="w-5 h-5" /></a>
                <a href="https://in.linkedin.com/company/beforth" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors hover:scale-125 duration-300"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="text-slate-500 hover:text-primary transition-colors hover:scale-125 duration-300"><Github className="w-5 h-5" /></a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-12 border border-slate-900/10 relative shadow-2xl md:-mt-20">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest uppercase text-slate-500">Name</label>
                      <input type="text" className="bg-slate-50 border border-slate-200 p-4 focus:border-primary outline-none transition-colors" placeholder="Your Name" />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest uppercase text-slate-500">Email</label>
                      <input type="email" className="bg-slate-50 border border-slate-200 p-4 focus:border-primary outline-none transition-colors" placeholder="Your Email" />
                   </div>
                </div>

                <div className="flex flex-col gap-2">
                   <label className="font-mono text-[10px] tracking-widest uppercase text-slate-500">Subject</label>
                   <select className="bg-slate-50 border border-slate-200 p-4 focus:border-primary outline-none transition-colors appearance-none">
                      <option>General Inquiry</option>
                      <option>Project Request</option>
                      <option>Career Opportunities</option>
                   </select>
                </div>

                <div className="flex flex-col gap-2">
                   <label className="font-mono text-[10px] tracking-widest uppercase text-slate-500">Message</label>
                   <textarea rows={6} className="bg-slate-50 border border-slate-200 p-4 focus:border-primary outline-none transition-colors resize-none" placeholder="How can we help?" />
                </div>

                <button className="relative overflow-hidden group py-4 bg-slate-950 text-white font-mono text-[0.85rem] tracking-widest uppercase flex items-center justify-center gap-3 mt-4">
                   <span className="relative z-10 transition-colors duration-500 group-hover:text-white">Send Message</span>
                   <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                   <div className="absolute inset-0 bg-primary translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Global Presence Section */}
      <section className="min-h-screen snap-start flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="dark-section group w-full"
        >
          <div className="card-hover-border" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto w-full">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-display uppercase mb-6 leading-tight">
                Global <br />
                <span className="text-transparent [-webkit-text-stroke:1px_white]">Presence.</span>
              </h2>
              <p className="font-sans font-light text-slate-400 leading-relaxed">
                While our HQ is in India, we ship banger apps to clients worldwide. Distance is just a number in the digital age.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:gap-16">
               {[
                 { loc: "Mumbai", role: "Headquarters" },
                 { loc: "Seattle", role: "Hub One" },
                 { loc: "London", role: "Hub Two" },
                 { loc: "Sydney", role: "Hub Three" }
               ].map((hub, i) => (
                 <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex flex-col gap-2"
                 >
                    <span className="font-display text-2xl uppercase">{hub.loc}</span>
                    <span className="font-mono text-[10px] tracking-widest text-[#2563EB] uppercase">{hub.role}</span>
                 </motion.div>
               ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
