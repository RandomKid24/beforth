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

const TypewriterLine = ({ text, typing, speed = 20, onComplete }: { text: string, typing?: boolean, speed?: number, onComplete?: () => void }) => {
  const [displayed, setDisplayed] = useState(typing ? '' : text);
  const [isDone, setIsDone] = useState(!typing);
  
  useEffect(() => {
    if (!typing) {
      setDisplayed(text);
      setIsDone(true);
      return;
    }
    
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsDone(true);
        onComplete?.();
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, typing, speed, onComplete]);

  return <span>{displayed}{typing && !isDone && <span className="inline-block w-2 h-4 bg-slate-400 animate-pulse ml-1 align-middle" />}</span>;
};

type HistoryLine = 
  | { id: string, type: 'system', text: string, typing?: boolean }
  | { id: string, type: 'interaction', prompt: string, input: string }
  | { id: string, type: 'error', text: string, typing?: boolean };

const TerminalForm = () => {
  const [step, setStep] = useState(-1);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasBooted = useRef(false);

  const prompts: Record<number, string> = {
    0: 'enter_name:',
    1: 'enter_email:',
    2: 'type_message:',
    3: 'confirm (y/n):',
    5: 'session_ended:'
  };

  // Boot sequence
  useEffect(() => {
    if (step !== -1 || hasBooted.current) return;
    hasBooted.current = true;
    
    const bootMessages = [
      "Initializing secure connection... [OK]",
      "Loading modules & bypassing mainframe... [OK]",
      "Connection established."
    ];
    
    let delay = 0;
    bootMessages.forEach((msg, index) => {
      setTimeout(() => {
        setHistory(h => [...h, { id: `boot-${index}`, type: 'system', text: msg, typing: true }]);
        if (index === bootMessages.length - 1) {
          setTimeout(() => {
            setStep(0);
            setIsTyping(false);
          }, 400);
        }
      }, delay);
      delay += 500;
    });
  }, [step]);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, step, input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([]);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
      return;
    }

    if (e.key === 'Enter') {
      if (isTyping) return;
      
      const currentInput = input.trim();
      setInput('');
      setHistoryIndex(-1);
      
      if (currentInput) {
        setCommandHistory(prev => [...prev, currentInput]);
      }

      const newHistory = [...history];
      const addInteraction = () => newHistory.push({ id: Date.now().toString() + '-int', type: 'interaction', prompt: prompts[step] || '>', input: currentInput });
      const addSystem = (text: string, isError = false) => newHistory.push({ id: Date.now().toString() + '-sys', type: isError ? 'error' : 'system', text, typing: true });

      const lowerInput = currentInput.toLowerCase();
      
      // Easter Eggs
      if (['help', 'clear', 'whoami', 'sudo', 'date'].includes(lowerInput)) {
        addInteraction();
        if (lowerInput === 'clear') {
          setHistory([]);
          return;
        }
        if (lowerInput === 'help') {
          addSystem("Available commands: help, clear, whoami, sudo, date. Or just answer the prompt.");
        } else if (lowerInput === 'whoami') {
          addSystem("guest@beforth. You are a highly valued potential client.");
        } else if (lowerInput === 'sudo') {
          addSystem("bash: sudo: permission denied. This incident will be reported.", true);
        } else if (lowerInput === 'date') {
          addSystem(new Date().toString());
        }
        setHistory(newHistory);
        return;
      }

      if (!currentInput) {
         addInteraction();
         addSystem("[ERR_EMPTY_INPUT]: Value cannot be null. Please retry.", true);
         setHistory(newHistory);
         return;
      }

      if (step === 0) {
        setFormData({ ...formData, name: currentInput });
        addInteraction();
        setStep(1);
      } else if (step === 1) {
        addInteraction();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentInput)) {
          addSystem('[ERR_INVALID_EMAIL]: Format not recognized. Please try again.', true);
        } else {
          setFormData({ ...formData, email: currentInput });
          setStep(2);
        }
      } else if (step === 2) {
        setFormData({ ...formData, message: currentInput });
        addInteraction();
        addSystem('Are you sure you want to send this message? (y/n)');
        setStep(3);
      } else if (step === 3) {
        addInteraction();
        if (lowerInput === 'y' || lowerInput === 'yes') {
          setStep(4);
          setIsTyping(true);
          addSystem('Transmitting data...');
          
          setTimeout(() => {
            setHistory(h => [...h, { id: Date.now().toString(), type: 'system', text: 'Message sent successfully! We will be in touch.', typing: true }]);
            setStep(5);
            setIsTyping(false);
          }, 2000);
        } else {
          addSystem('Message sending cancelled. Type "reset" to start over.');
          setStep(5);
        }
      } else if (step === 5) {
          addInteraction();
          if (lowerInput === 'reset') {
              setStep(0);
              setHistory([{ id: Date.now().toString(), type: 'system', text: 'Connection re-established.', typing: true }]);
              setFormData({ name: '', email: '', message: '' });
          } else {
              addSystem('Session ended. Type "reset" to start over.');
          }
      }
      
      setHistory(newHistory);
    }
  };

  return (
    <motion.div 
      className="bg-[#0F172A] text-[#10B981] p-6 md:p-8 rounded-none font-mono text-base md:text-lg h-[600px] md:h-[700px] overflow-y-auto cursor-text flex flex-col relative"
      onClick={() => inputRef.current?.focus()}
      ref={containerRef}
      animate={{
        borderColor: isFocused ? '#3B82F6' : '#0F172A',
        boxShadow: isFocused 
          ? '0 0 20px rgba(59, 130, 246, 0.4), 8px 8px 0px 0px #2563EB' 
          : '0 0 0px rgba(59, 130, 246, 0), 8px 8px 0px 0px #2563EB'
      }}
      style={{ borderWidth: '2px', borderStyle: 'solid', fontFamily: "'Courier New', Courier, monospace" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-2 mb-4 sticky top-0 bg-[#0F172A] pb-2 z-10">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="ml-4 text-xs md:text-sm text-slate-500 uppercase tracking-widest flex items-center" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>guest@beforth: ~/contact</div>
      </div>
      
      <div className="flex-1 space-y-1.5 leading-tight">
        {history.map((line) => (
          <div key={line.id} className={line.type === 'system' ? 'text-slate-400' : line.type === 'error' ? 'text-red-400' : 'text-white'}>
            {line.type === 'interaction' ? (
              <span className="flex gap-2">
                <span className="text-pink-500">❯</span> 
                <span className="text-[#3B82F6]">{line.prompt}</span>
                <span className="text-white">{line.input}</span>
              </span>
            ) : (
              <TypewriterLine text={line.text} typing={line.typing} speed={5} />
            )}
          </div>
        ))}
        
        {step >= 0 && step !== 4 && (
          <motion.div 
            className="flex items-center gap-2 mt-2 p-1 -ml-1 rounded"
            animate={{
              backgroundColor: isFocused ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              boxShadow: isFocused ? 'inset 2px 0 0 0 #3B82F6' : 'inset 0 0 0 0 transparent',
              textShadow: isFocused ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none'
            }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-pink-500">❯</span>
            <span className="text-[#3B82F6]">{prompts[step]}</span>
            <div className="relative flex-1 flex items-center">
              <span className="text-white whitespace-pre-wrap break-all">{input}</span>
              <span className={`w-2.5 h-5 bg-[#10B981] ml-0.5 inline-block shrink-0 ${isFocused ? 'animate-pulse' : 'opacity-50'}`} />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="absolute inset-0 opacity-0 cursor-text w-full"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                disabled={isTyping}
              />
            </div>
          </motion.div>
        )}
        {step === 5 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-4 border-t border-slate-800"
          >
            <button 
              onClick={() => {
                setStep(0);
                setHistory([
                  { id: Date.now().toString(), type: 'system', text: 'Connection re-established.', typing: true }
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
    </motion.div>
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

