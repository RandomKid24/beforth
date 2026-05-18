import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, ChevronDown } from 'lucide-react';

function CustomDropdown({ options, value, onChange }: { options: string[], value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 p-4 flex items-center justify-between focus:border-primary outline-none transition-colors text-left"
      >
        <span className="font-sans text-sm text-slate-700">
          {value}
        </span>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="absolute z-50 top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-xl border border-slate-900/5 shadow-2xl py-2 overflow-hidden"
          >
            {options.map((option, i) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full text-left px-6 py-3 hover:bg-primary/5 hover:text-primary transition-colors font-sans text-sm text-slate-900"
              >
                {option}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const [statusIndex, setStatusIndex] = useState(0);
  const [time, setTime] = useState(new Date());
  
  const statuses = [
    "On standby · Reaching out to you as soon as possible",
    "Always here · Ready for your next big idea",
    "On standby · Connecting with you shortly",
    "Ready for your brief · Reaching out soon"
  ];

  useEffect(() => {
    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 5000);
    
    const timeTimer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(statusTimer);
      clearInterval(timeTimer);
    };
  }, [statuses.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const responseText = await response.text();
      let data: { message?: string } = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            response.ok
              ? 'The server returned an unreadable response.'
              : 'The contact endpoint is unavailable or returned an invalid response.'
          );
        }
      }

      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      setSubmitStatus('success');
      setSubmitMessage('Your message has been sent successfully!');
      
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
      setSubject('General Inquiry');
      
      setTimeout(() => setSubmitStatus('idle'), 5000); // Hide success message after 5s
    } catch (error: any) {
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Failed to send the message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <section className="min-h-screen snap-start flex flex-col pt-48">
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

          <h1 className="hero-heading mb-6">
            <span className="block">LET'S</span>
            <span className="block text-transparent [-webkit-text-stroke:1.5px_#0F172A] md:[-webkit-text-stroke:2px_#0F172A]">TALK.</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.618fr] gap-12 md:gap-24 items-start">
            {/* Contact Details */}
            <div className="flex flex-col gap-10">
              <div>
                <p className="text-[1rem] font-sans text-slate-700 font-light leading-relaxed mb-8">
                  Have a project in mind or just want to say hi? Reach out using the form, or through our direct channels.
                </p>
                
                {/* Availability Card */}
                <div className="bg-white border border-slate-900/10 p-6 relative shadow-lg mb-8">
                   <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/40" />
                   <div className="flex flex-col gap-5">
                      <div className="flex items-center gap-4">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#22C55E] transition-colors" />
                         <div className="flex flex-col">
                            <span className="font-mono text-[10px] tracking-widest text-slate-400">Local Time</span>
                            <div className="flex items-center gap-[0.1em] h-5 overflow-hidden">
                               {time.toLocaleTimeString('en-US', { 
                                 hour12: true, 
                                 hour: '2-digit', 
                                 minute: '2-digit', 
                                 second: '2-digit' 
                               }).split("").map((char, i) => (
                                 <AnimatePresence mode="popLayout" key={i}>
                                   <motion.span
                                     key={char + i}
                                     initial={{ y: 15, opacity: 0 }}
                                     animate={{ y: 0, opacity: 1 }}
                                     exit={{ y: -15, opacity: 0 }}
                                     transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                     className="font-sans text-sm text-slate-900 font-medium tracking-tight inline-block whitespace-pre"
                                   >
                                     {char}
                                   </motion.span>
                                 </AnimatePresence>
                               ))}
                               <span className="ml-1 font-mono text-[9px] text-slate-400 uppercase tracking-widest">IST</span>
                            </div>
                         </div>
                      </div>
                      <div className="w-full h-px bg-slate-900/5" />
                      <div className="flex items-center gap-4">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                         <div className="flex flex-col overflow-hidden">
                            <span className="font-mono text-[10px] tracking-widest text-slate-400">Availability</span>
                            <div className="h-6 relative overflow-hidden">
                              <AnimatePresence mode="wait">
                                <motion.div 
                                  key={statusIndex}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="flex flex-wrap gap-[0.1em]"
                                >
                                  {statuses[statusIndex].split("").map((char, i) => (
                                    <motion.span
                                      key={i}
                                      variants={{
                                        hidden: { opacity: 0, y: 15 },
                                        visible: { opacity: 1, y: 0 },
                                        exit: { opacity: 0, y: -15 }
                                      }}
                                      transition={{
                                        duration: 0.5,
                                        delay: i * 0.015,
                                        ease: [0.16, 1, 0.3, 1]
                                      }}
                                      className="font-sans text-sm text-primary font-medium tracking-tight whitespace-pre"
                                    >
                                      {char}
                                    </motion.span>
                                  ))}
                                </motion.div>
                              </AnimatePresence>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4 group/item">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-none border border-primary/20 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                    <Mail className="w-5 h-5 text-primary group-hover/item:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-slate-500 mb-1">Email Us</div>
                    <a href="mailto:support@beforth.in" className="font-display text-xl uppercase block transition-colors hover:text-primary">support@beforth.in</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group/item">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-none border border-primary/20 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                    <Phone className="w-5 h-5 text-primary group-hover/item:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-slate-500 mb-1">Call Us</div>
                    <a href="tel:+919766183834" className="font-display text-xl uppercase block transition-colors hover:text-primary">+91 97661 83834</a>
                  </div>
                </div>

              </div>

            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-12 border border-slate-900/10 relative shadow-2xl md:-mt-20">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest uppercase text-slate-500">Name</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} required className="bg-slate-50 border border-slate-200 p-4 focus:border-primary outline-none transition-colors" placeholder="Your Name" />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest uppercase text-slate-500">Email</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-slate-50 border border-slate-200 p-4 focus:border-primary outline-none transition-colors" placeholder="Your Email" />
                   </div>
                </div>

                <div className="flex flex-col gap-2">
                   <label className="font-mono text-[10px] tracking-widest uppercase text-slate-500">Subject</label>
                   <CustomDropdown 
                      options={['General Inquiry', 'Project Request', 'Career Opportunities']} 
                      value={subject} 
                      onChange={setSubject} 
                   />
                </div>

                <div className="flex flex-col gap-2">
                   <label className="font-mono text-[10px] tracking-widest uppercase text-slate-500">Message</label>
                   <textarea rows={6} value={message} onChange={e => setMessage(e.target.value)} required className="bg-slate-50 border border-slate-200 p-4 focus:border-primary outline-none transition-colors resize-none" placeholder="How can we help?" />
                </div>

                {submitStatus === 'error' && (
                  <div className="text-red-500 text-sm font-sans">{submitMessage}</div>
                )}
                {submitStatus === 'success' && (
                  <div className="text-[#22C55E] text-sm font-sans">{submitMessage}</div>
                )}

                <button disabled={isSubmitting} type="submit" className="relative overflow-hidden group py-4 bg-slate-950 text-white font-mono text-[0.85rem] tracking-widest uppercase flex items-center justify-center gap-3 mt-4 disabled:opacity-70 transition-all hover:shadow-lg">
                   <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                     {isSubmitting ? 'Sending...' : 'Send Message'}
                   </span>
                   {!isSubmitting && <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
                   <div className="absolute inset-0 bg-primary translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
