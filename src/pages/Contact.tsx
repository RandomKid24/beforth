import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MapPin, Phone, Sun, Moon, Sunrise, Sunset, ArrowRight } from 'lucide-react';
import Lottie from 'lottie-react';

const AvailabilityVisualizer = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = time.getHours();
  let status = "";
  let Icon = Sun;
  let color = "text-yellow-500";

  if (hour >= 0 && hour < 6) {
    status = "It's the middle of the night here, but drop a message and I'll see it with my morning coffee.";
    Icon = Moon;
    color = "text-indigo-400";
  } else if (hour >= 6 && hour < 9) {
    status = "Starting the day! Catching up on emails and ready for new projects.";
    Icon = Sunrise;
    color = "text-orange-400";
  } else if (hour >= 9 && hour < 17) {
    status = "I'm currently at my desk and accepting new projects.";
    Icon = Sun;
    color = "text-yellow-500";
  } else {
    status = "Winding down for the day, but I'll get back to you soon.";
    Icon = Sunset;
    color = "text-orange-500";
  }

  return (
    <div className="bg-[#0F172A] text-white p-6 md:p-8 rounded-none border-2 border-[#0F172A] shadow-[8px_8px_0px_0px_#2563EB] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-1000 group-hover:scale-150" />
      <div className="flex items-start gap-4 relative z-10">
        <div className={`p-3 rounded-full bg-white/10 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="font-mono text-xs text-slate-400 mb-1 uppercase tracking-widest">Local Time & Status</div>
          <div className="font-display text-2xl mb-2">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <p className="font-sans text-sm text-slate-300 leading-relaxed">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

const StandardForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [shake, setShake] = useState(false);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStatus('submitting');
    setErrors({});
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <div className="bg-white p-8 md:p-12 relative h-full flex flex-col rounded-none border border-[#0F172A]/10 shadow-xl overflow-hidden">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="flex-1 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, delay: 0.2 }}
              className="w-24 h-24 bg-[#2563EB]/10 text-[#2563EB] rounded-full flex items-center justify-center mb-8"
            >
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </motion.div>
            <motion.h4 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-[2rem] font-display uppercase leading-[1.1] mb-4 text-[#0F172A]"
            >
              Message Received
            </motion.h4>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="font-sans text-[#64748B] max-w-sm"
            >
              Thanks for reaching out. We'll review your details and get back to you within 24 hours.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="form-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col h-full"
          >
            <h3 className="text-[2.5rem] font-display uppercase leading-[1.1] mb-2 text-[#0F172A]">Let's Talk</h3>
            <p className="font-mono text-sm text-[#64748B] mb-8">Drop your details below and we'll get back to you.</p>
            
            <motion.form 
              onSubmit={handleSubmit} 
              noValidate 
              className="space-y-6 flex-1 flex flex-col"
              animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <div className="relative group">
                <div className="flex justify-between items-end mb-2">
                  <label htmlFor="name" className={`block font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 ${errors.name ? 'text-red-500' : focusedField === 'name' ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>Name</label>
                  <AnimatePresence>
                    {errors.name && (
                      <motion.span 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] text-red-500 font-mono"
                      >
                        {errors.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative overflow-hidden">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onFocus={() => { setFocusedField('name'); setErrors(prev => ({ ...prev, name: undefined })); }}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full bg-[#F8FAFC] border p-4 font-sans text-[#0F172A] outline-none transition-colors ${errors.name ? 'border-red-500/30 bg-red-50/50' : 'border-[#0F172A]/10'}`}
                    placeholder="John Doe"
                  />
                  <motion.div 
                    className={`absolute bottom-0 left-0 h-[2px] ${errors.name ? 'bg-red-500' : 'bg-[#2563EB]'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: (focusedField === 'name' || errors.name) ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="flex justify-between items-end mb-2">
                  <label htmlFor="email" className={`block font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 ${errors.email ? 'text-red-500' : focusedField === 'email' ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>Email</label>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.span 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] text-red-500 font-mono"
                      >
                        {errors.email}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative overflow-hidden">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onFocus={() => { setFocusedField('email'); setErrors(prev => ({ ...prev, email: undefined })); }}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-[#F8FAFC] border p-4 font-sans text-[#0F172A] outline-none transition-colors ${errors.email ? 'border-red-500/30 bg-red-50/50' : 'border-[#0F172A]/10'}`}
                    placeholder="john@example.com"
                  />
                  <motion.div 
                    className={`absolute bottom-0 left-0 h-[2px] ${errors.email ? 'bg-red-500' : 'bg-[#2563EB]'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: (focusedField === 'email' || errors.email) ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  />
                </div>
              </div>

              <div className="relative group flex-1 flex flex-col">
                <div className="flex justify-between items-end mb-2">
                  <label htmlFor="message" className={`block font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 ${errors.message ? 'text-red-500' : focusedField === 'message' ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>Message</label>
                  <AnimatePresence>
                    {errors.message && (
                      <motion.span 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] text-red-500 font-mono"
                      >
                        {errors.message}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative overflow-hidden flex-1 flex flex-col">
                  <textarea
                    id="message"
                    value={formData.message}
                    onFocus={() => { setFocusedField('message'); setErrors(prev => ({ ...prev, message: undefined })); }}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full flex-1 min-h-[150px] bg-[#F8FAFC] border p-4 font-sans text-[#0F172A] outline-none transition-colors resize-none ${errors.message ? 'border-red-500/30 bg-red-50/50' : 'border-[#0F172A]/10'}`}
                    placeholder="Tell us about your project..."
                  />
                  <motion.div 
                    className={`absolute bottom-0 left-0 h-[2px] ${errors.message ? 'bg-red-500' : 'bg-[#2563EB]'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: (focusedField === 'message' || errors.message) ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                className="w-full bg-[#0F172A] text-white font-mono text-xs uppercase tracking-widest py-4 px-8 rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 relative overflow-hidden group/btn mt-4 shadow-lg border border-[#0F172A]"
              >
                <div className="absolute inset-0 bg-[#2563EB] translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
                <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500 w-full h-[20px]">
                  <AnimatePresence mode="wait">
                    {status === 'submitting' ? (
                      <motion.div 
                        key="submitting" 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }} 
                        className="flex items-center gap-2 absolute"
                      >
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        SENDING...
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="idle" 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }} 
                        className="flex items-center gap-2 absolute"
                      >
                        SEND MESSAGE <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ContactPage() {
  return (
    <section className="min-h-screen w-full snap-start shrink-0 bg-[#F8FAFC] text-[#0F172A] pt-[15vh] pb-32 px-6 md:px-[10%] relative flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
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
          {/* Left Column: Info & Availability */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-[2.618rem]"
          >
            <AvailabilityVisualizer />

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

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <StandardForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

