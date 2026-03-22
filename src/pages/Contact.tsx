import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

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

type HistoryLine = 
  | { type: 'system', text: string }
  | { type: 'interaction', prompt: string, input: string };

const TerminalForm = () => {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: 'system', text: 'Initializing secure connection...' },
    { type: 'system', text: 'Connection established.' }
  ]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const prompts = [
    'enter_name:',
    'enter_email:',
    'type_message:'
  ];

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, step]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      const currentInput = input.trim();
      setInput('');
      
      const newHistory = [...history];
      
      if (step === 0) {
        setFormData({ ...formData, name: currentInput });
        newHistory.push({ type: 'interaction', prompt: prompts[0], input: currentInput });
        setStep(1);
      } else if (step === 1) {
        newHistory.push({ type: 'interaction', prompt: prompts[1], input: currentInput });
        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentInput)) {
          newHistory.push({ type: 'system', text: 'Error: Invalid email format. Please try again.' });
        } else {
          setFormData({ ...formData, email: currentInput });
          setStep(2);
        }
      } else if (step === 2) {
        setFormData({ ...formData, message: currentInput });
        newHistory.push({ type: 'interaction', prompt: prompts[2], input: currentInput });
        setStep(3);
        newHistory.push({ type: 'system', text: 'Transmitting data...' });
        
        // Simulate sending
        setTimeout(() => {
          setHistory(h => [...h, { type: 'system', text: 'Message sent successfully! We will be in touch.' }]);
          setStep(4);
        }, 1500);
      }
      
      setHistory(newHistory);
    }
  };

  return (
    <div 
      className="bg-[#0F172A] text-[#10B981] p-6 md:p-8 rounded-none border-2 border-[#0F172A] shadow-[8px_8px_0px_0px_#2563EB] font-mono text-sm md:text-base h-[500px] overflow-y-auto cursor-text flex flex-col relative"
      onClick={() => inputRef.current?.focus()}
      ref={containerRef}
    >
      <div className="flex gap-2 mb-6 sticky top-0 bg-[#0F172A] pb-4 z-10">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="ml-4 text-xs text-slate-500 uppercase tracking-widest flex items-center">guest@beforth: ~/contact</div>
      </div>
      
      <div className="flex-1 space-y-3">
        {history.map((line, i) => (
          <div key={i} className={line.type === 'system' ? 'text-slate-400' : 'text-white'}>
            {line.type === 'interaction' ? (
              <span className="flex gap-2">
                <span className="text-pink-500">❯</span> 
                <span className="text-[#3B82F6]">{line.prompt}</span>
                <span className="text-white">{line.input}</span>
              </span>
            ) : (
              line.text
            )}
          </div>
        ))}
        
        {step < 3 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-pink-500">❯</span>
            <span className="text-[#3B82F6]">{prompts[step]}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none flex-1 text-white caret-[#10B981]"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        )}
        {step === 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-4 border-t border-slate-800"
          >
            <button 
              onClick={() => {
                setStep(0);
                setHistory([
                  { type: 'system', text: 'Connection re-established.' }
                ]);
                setFormData({ name: '', email: '', message: '' });
              }}
              className="text-[#3B82F6] hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="text-pink-500">❯</span> [ Send another message ]
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

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

          {/* Right Column: Terminal Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <TerminalForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

