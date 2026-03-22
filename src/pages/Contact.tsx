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
            <span className="font-mono text-[0.85rem] tracking-widest uppercase text-slate-500">Get In Touch</span>
          </div>
          
          <h1 className="hero-heading mb-8">
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
              className="block text-transparent [-webkit-text-stroke:1.5px_var(--color-slate-900)] md:[-webkit-text-stroke:2px_var(--color-slate-900)]"
            >
              TALK.
            </motion.span>
          </h1>
          
          <p className="text-[1rem] md:text-[1.2rem] font-sans text-slate-500 font-light leading-[1.618] max-w-2xl">
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
            <div className="card group">
              <div className="card-hover-border" />
              <div className="icon-box">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-[2rem] font-display uppercase leading-[1.1] mb-2">Email Us</h3>
              <a href="mailto:hello@beforth.com" className="font-mono text-base text-slate-500 hover:text-primary transition-colors">hello@beforth.com</a>
            </div>

            <div className="card group">
              <div className="card-hover-border" />
              <div className="icon-box">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-[2rem] font-display uppercase leading-[1.1] mb-2">Visit Us</h3>
              <p className="font-mono text-base text-slate-500">123 Innovation Dr.<br/>Tech City, NY 10001</p>
            </div>
            
            <div className="card group">
              <div className="card-hover-border" />
              <div className="icon-box">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-[2rem] font-display uppercase leading-[1.1] mb-2">Call Us</h3>
              <a href="tel:+15551234567" className="font-mono text-base text-slate-500 hover:text-primary transition-colors">+1 (555) 123-4567</a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white text-slate-900 p-8 md:p-12 rounded-none border-2 border-slate-900 shadow-[8px_8px_0px_0px_var(--color-primary)] relative"
          >
            <h3 className="text-[2rem] font-display uppercase leading-[1.1] mb-8 tracking-tight">Send a Message</h3>
            
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="name" className="block font-mono text-[0.85rem] tracking-widest uppercase text-slate-900 mb-2 font-bold">Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  required
                  className={`w-full bg-slate-50 border-2 ${errors.name ? 'border-red-500 focus:shadow-[4px_4px_0px_0px_var(--color-red-500)]' : 'border-slate-900 focus:shadow-[4px_4px_0px_0px_var(--color-primary)]'} rounded-none px-4 py-3 font-sans text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:-translate-y-1 transition-all`}
                  placeholder="John Doe"
                />
                {errors.name && <span className="text-red-600 text-sm mt-2 block font-mono font-bold">{errors.name}</span>}
              </div>
              
              <div>
                <label htmlFor="email" className="block font-mono text-[0.85rem] tracking-widest uppercase text-slate-900 mb-2 font-bold">Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  required
                  className={`w-full bg-slate-50 border-2 ${errors.email ? 'border-red-500 focus:shadow-[4px_4px_0px_0px_var(--color-red-500)]' : 'border-slate-900 focus:shadow-[4px_4px_0px_0px_var(--color-primary)]'} rounded-none px-4 py-3 font-sans text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:-translate-y-1 transition-all`}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="text-red-600 text-sm mt-2 block font-mono font-bold">{errors.email}</span>}
              </div>
              
              <div>
                <label htmlFor="message" className="block font-mono text-[0.85rem] tracking-widest uppercase text-slate-900 mb-2 font-bold">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className={`w-full bg-slate-50 border-2 ${errors.message ? 'border-red-500 focus:shadow-[4px_4px_0px_0px_var(--color-red-500)]' : 'border-slate-900 focus:shadow-[4px_4px_0px_0px_var(--color-primary)]'} rounded-none px-4 py-3 font-sans text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:-translate-y-1 transition-all resize-none`}
                  placeholder="Tell us about your project..."
                />
                {errors.message && <span className="text-red-600 text-sm mt-2 block font-mono font-bold">{errors.message}</span>}
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_var(--color-slate-900)] hover:shadow-[6px_6px_0px_0px_var(--color-slate-900)] hover:-translate-y-1 active:shadow-[0px_0px_0px_0px_var(--color-slate-900)] active:translate-y-1 transition-all rounded-none py-4 font-mono uppercase tracking-widest text-sm flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_var(--color-slate-900)] disabled:hover:translate-y-0"
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
                  className="flex items-center gap-2 text-emerald-600 font-mono text-sm mt-4 justify-center overflow-hidden font-bold"
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
                  className="flex items-center gap-2 text-red-600 font-mono text-sm mt-4 justify-center overflow-hidden font-bold"
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
