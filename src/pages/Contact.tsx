import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { Magnetic } from '../components/Magnetic';

export default function ContactPage() {
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
            <span className="font-mono text-[0.85rem] tracking-widest uppercase text-[#64748B]">Get In Touch</span>
          </div>
          
          <h1 className="text-[clamp(3.5rem,14vw,6rem)] md:text-[clamp(4rem,8.5vw,8rem)] leading-[1.05] py-2 font-display uppercase tracking-normal flex flex-col mb-8">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="block"
            >
              LET'S
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="block text-transparent [-webkit-text-stroke:1.5px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A]"
            >
              TALK.
            </motion.span>
          </h1>
          
          <p className="text-[1rem] md:text-[1.2rem] font-sans text-[#64748B] font-light leading-[1.618] max-w-2xl">
            Ready to start your next project? Drop us a line and let's build something extraordinary together.
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[4.236rem] mb-[4.236rem]">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-[2.618rem]"
          >
            <div className="bg-white p-8 md:p-12 rounded-none border border-[#0F172A]/10 relative group flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="w-12 h-12 bg-[#2563EB]/10 text-[#2563EB] rounded-none flex items-center justify-center mb-6 border border-[#2563EB]/20">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-[1.5rem] font-display uppercase leading-[1.1] mb-2">Email Us</h3>
              <a href="mailto:hello@beforth.com" className="font-mono text-[1rem] text-[#64748B] hover:text-[#2563EB] transition-colors">hello@beforth.com</a>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-none border border-[#0F172A]/10 relative group flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="w-12 h-12 bg-[#2563EB]/10 text-[#2563EB] rounded-none flex items-center justify-center mb-6 border border-[#2563EB]/20">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-[1.5rem] font-display uppercase leading-[1.1] mb-2">Visit Us</h3>
              <p className="font-mono text-[1rem] text-[#64748B]">123 Innovation Dr.<br/>Tech City, NY 10001</p>
            </div>
            
            <div className="bg-white p-8 md:p-12 rounded-none border border-[#0F172A]/10 relative group flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="w-12 h-12 bg-[#2563EB]/10 text-[#2563EB] rounded-none flex items-center justify-center mb-6 border border-[#2563EB]/20">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-[1.5rem] font-display uppercase leading-[1.1] mb-2">Call Us</h3>
              <a href="tel:+15551234567" className="font-mono text-[1rem] text-[#64748B] hover:text-[#2563EB] transition-colors">+1 (555) 123-4567</a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#020617] text-white p-8 md:p-12 rounded-none relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <h3 className="text-[2rem] font-display uppercase leading-[1.1] mb-[2.618rem]">Send a Message</h3>
            
            <form className="space-y-8">
              <div>
                <label htmlFor="name" className="block font-mono text-[0.75rem] tracking-widest uppercase text-white/50 mb-2">Name</label>
                <input 
                  type="text" 
                  id="name"
                  className="w-full bg-transparent border-b border-white/20 py-3 font-sans text-[1rem] text-white placeholder:text-white/20 focus:outline-none focus:border-[#2563EB] transition-colors"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block font-mono text-[0.75rem] tracking-widest uppercase text-white/50 mb-2">Email</label>
                <input 
                  type="email" 
                  id="email"
                  className="w-full bg-transparent border-b border-white/20 py-3 font-sans text-[1rem] text-white placeholder:text-white/20 focus:outline-none focus:border-[#2563EB] transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block font-mono text-[0.75rem] tracking-widest uppercase text-white/50 mb-2">Message</label>
                <textarea 
                  id="message"
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 py-3 font-sans text-[1rem] text-white placeholder:text-white/20 focus:outline-none focus:border-[#2563EB] transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              
              <Magnetic>
                <button 
                  type="button"
                  className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 bg-white border border-white text-[#0F172A] font-mono text-[0.85rem] tracking-widest uppercase rounded-full group w-full justify-center mt-4"
                >
                  <span className="relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-white">Send Message</span>
                  <ArrowRight className="w-4 h-4 relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-white group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-[#2563EB] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                </button>
              </Magnetic>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
