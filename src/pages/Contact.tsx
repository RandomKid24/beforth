import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail, MapPin, Phone, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Magnetic } from '../components/Magnetic';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{name?: string, email?: string, message?: string}>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    const newErrors: {name?: string, email?: string, message?: string} = {};
    if (!name?.trim()) newErrors.name = "Name is required";
    if (!email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!message?.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // Reset status after a few seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

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
            className="bg-white text-[#0F172A] p-8 md:p-12 rounded-none border-2 border-[#0F172A] shadow-[8px_8px_0px_0px_#2563EB] relative"
          >
            <h3 className="text-[2rem] font-display uppercase leading-[1.1] mb-8 tracking-tight">Send a Message</h3>
            
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="name" className="block font-mono text-[0.75rem] tracking-widest uppercase text-[#0F172A] mb-2 font-bold">Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  required
                  className={`w-full bg-[#F8FAFC] border-2 ${errors.name ? 'border-red-500 focus:shadow-[4px_4px_0px_0px_#EF4444]' : 'border-[#0F172A] focus:shadow-[4px_4px_0px_0px_#2563EB]'} rounded-none px-4 py-3 font-sans text-[1rem] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:-translate-y-1 transition-all`}
                  placeholder="John Doe"
                />
                {errors.name && <span className="text-red-600 text-xs mt-2 block font-mono font-bold">{errors.name}</span>}
              </div>
              
              <div>
                <label htmlFor="email" className="block font-mono text-[0.75rem] tracking-widest uppercase text-[#0F172A] mb-2 font-bold">Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  required
                  className={`w-full bg-[#F8FAFC] border-2 ${errors.email ? 'border-red-500 focus:shadow-[4px_4px_0px_0px_#EF4444]' : 'border-[#0F172A] focus:shadow-[4px_4px_0px_0px_#2563EB]'} rounded-none px-4 py-3 font-sans text-[1rem] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:-translate-y-1 transition-all`}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="text-red-600 text-xs mt-2 block font-mono font-bold">{errors.email}</span>}
              </div>
              
              <div>
                <label htmlFor="message" className="block font-mono text-[0.75rem] tracking-widest uppercase text-[#0F172A] mb-2 font-bold">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className={`w-full bg-[#F8FAFC] border-2 ${errors.message ? 'border-red-500 focus:shadow-[4px_4px_0px_0px_#EF4444]' : 'border-[#0F172A] focus:shadow-[4px_4px_0px_0px_#2563EB]'} rounded-none px-4 py-3 font-sans text-[1rem] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:-translate-y-1 transition-all resize-none`}
                  placeholder="Tell us about your project..."
                />
                {errors.message && <span className="text-red-600 text-xs mt-2 block font-mono font-bold">{errors.message}</span>}
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2563EB] text-white border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:shadow-[6px_6px_0px_0px_#0F172A] hover:-translate-y-1 active:shadow-[0px_0px_0px_0px_#0F172A] active:translate-y-1 transition-all rounded-none py-4 font-mono uppercase tracking-widest text-[0.85rem] flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_#0F172A] disabled:hover:translate-y-0"
              >
                <span>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </span>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  className="flex items-center gap-2 text-emerald-600 font-mono text-[0.85rem] mt-4 justify-center overflow-hidden font-bold"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    Message sent successfully!
                  </motion.span>
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  className="flex items-center gap-2 text-red-600 font-mono text-[0.85rem] mt-4 justify-center overflow-hidden font-bold"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  >
                    <XCircle className="w-5 h-5" />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    Failed to send message. Please try again.
                  </motion.span>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
