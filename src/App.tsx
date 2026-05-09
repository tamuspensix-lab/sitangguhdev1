/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Home, 
  Calendar as CalendarIcon, 
  Settings, 
  Send, 
  Bot, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FeaturesSection } from './components/FeaturesSection';
import { 
  FAQ, 
  Activity, 
  Staff,
  ViewType, 
  ADMIN_PASSWORD, 
  INDONESIAN_HOLIDAYS, 
  INITIAL_FAQS, 
  INITIAL_ACTIVITIES,
  INITIAL_STAFF
} from './constants';
import { getGeminiResponse } from './lib/gemini';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewType>('chatbot');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data Persistence
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  
  // Auth state
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Chat state
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Halo! Saya T-Bot AIS, asisten digital SITANGGUH SMP 6 Pekalongan. Ada yang bisa saya bantu terkait agenda atau layanan sekolah hari ini?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Initialization
  useEffect(() => {
    const savedFaqs = localStorage.getItem('smp6_faqs');
    const savedActivities = localStorage.getItem('smp6_activities');
    const savedStaff = localStorage.getItem('smp6_staff');
    
    setFaqs(savedFaqs ? JSON.parse(savedFaqs) : INITIAL_FAQS);
    setActivities(savedActivities ? JSON.parse(savedActivities) : INITIAL_ACTIVITIES);
    setStaff(savedStaff ? JSON.parse(savedStaff) : INITIAL_STAFF);
    
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Sync data to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('smp6_faqs', JSON.stringify(faqs));
      localStorage.setItem('smp6_activities', JSON.stringify(activities));
      localStorage.setItem('smp6_staff', JSON.stringify(staff));
    }
  }, [faqs, activities, staff, isLoading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isBotThinking, activeTab]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPasswordInput('');
      setAuthError('');
    } else {
      setAuthError('Password salah!');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveTab('chatbot');
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isBotThinking) return;
    
    const userMsg = { role: 'user' as const, text };
    setChatHistory(prev => [...prev, userMsg]);
    setUserInput('');
    setIsBotThinking(true);

    // Context check for local templates
    const match = faqs.find(f => 
      text.toLowerCase().includes(f.question.toLowerCase()) || 
      f.question.toLowerCase().includes(text.toLowerCase())
    );

    if (match) {
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'bot', text: match.answer }]);
        setIsBotThinking(false);
      }, 3000);
    } else {
      const faqContext = faqs.map(f => `Pertanyaan: ${f.question}, Jawaban: ${f.answer}`).join(' | ');
      const staffContext = staff.map(s => `Staf: ${s.name}, Peran: ${s.role}, Info Kinerja: ${s.performanceInfo}`).join(' | ');
      const contextString = `${faqContext} ||| ${staffContext}`;
      
      // Start both the AI call and a 3s timer
      const startTime = Date.now();
      const aiResponse = await getGeminiResponse(text, contextString);
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);

      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'bot', text: aiResponse }]);
        setIsBotThinking(false);
      }, remainingTime);
    }
  };

  // Calendar Helpers
  const isHoliday = (dateStr: string) => {
    const monthDay = dateStr.substring(5);
    return INDONESIAN_HOLIDAYS[dateStr] || INDONESIAN_HOLIDAYS[monthDay];
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysCount; i++) {
        days.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
    }
    return days;
  }, [currentDate]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505]">
        <motion.div
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center"
        >
          <div className="text-4xl font-black tracking-tighter mb-4">
            SMP<span className="text-accent italic font-serif">6</span>
          </div>
          <div className="h-[1px] w-12 bg-white/20 mb-4" />
          <Loader2 size={24} className="text-accent animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row font-sans text-[#F5F5F5] overflow-hidden selection:bg-accent selection:text-black">
      
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-[80px] border-b md:border-b-0 md:border-r border-white/10 flex flex-row md:flex-col items-center py-6 md:py-10 justify-between z-50 bg-[#050505]">
        <div className="hidden md:block [writing-mode:vertical-rl] rotate-180 text-[10px] tracking-[0.4em] uppercase font-bold text-white/40 italic">
          SMP 6 Pekalongan
        </div>
        

        <div className="flex flex-row md:flex-col items-center justify-center gap-6 md:gap-10 w-full px-4 md:px-0">
          {[
            { id: 'chatbot', icon: Home },
            { id: 'activity', icon: CalendarIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ViewType)}
              className={`relative transition-all group ${
                activeTab === item.id ? 'text-accent' : 'text-white/20 hover:text-white/60'
              }`}
            >
              <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 1.5} />
              {activeTab === item.id && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 md:bottom-auto md:-right-4 w-1 h-1 bg-accent rounded-full" 
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 mb-2">
          <button 
            onClick={() => setActiveTab('admin')}
            className={`transition-all ${activeTab === 'admin' ? 'text-accent' : 'text-white/20 hover:text-white/60'}`}
          >
            {isAdmin ? <ShieldCheck size={20} /> : <Settings size={20} />}
          </button>
          <div className="text-[10px] font-mono opacity-20 hidden md:block">2026</div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative h-[calc(100vh-60px)] md:h-screen scroll-smooth">
        <AnimatePresence mode="wait">
          {activeTab === 'chatbot' && (
            <motion.div 
              key="chatbot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col p-6 md:p-16 max-w-6xl mx-auto w-full"
            >
              <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold mb-1">SMP 6 PEKALONGAN</h2>
                  <h1 className="text-2xl font-bold tracking-tight">SITANGGUH Portal (T-Bot)</h1>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-white/40">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  SITANGGUH_CONNECTED
                </div>
              </div>

              {/* SITANGGUH Narrative Intro */}
              <div className="mb-10 bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl shadow-xl">
                <h2 className="text-accent text-[10px] uppercase font-bold tracking-[0.5em] mb-4">
                  SITANGGUH (SISTEM INFORMASI TANGGAP AGENDA HARIAN NASKAH GIAT GUNA UNGGUL HASIL)
                </h2>
                <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-3xl">
                  Inovasi digital berbasis web yang menggunakan T-Bot — asisten chatbot cerdas berbasis AI — 
                  untuk membantu tenaga kependidikan mendokumentasikan agenda kegiatan harian dan penyelesaian tugas dengan cepat dan akuntabel.
                </p>

                <FeaturesSection />
                
                <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                   <p className="text-xs text-white/40 italic font-medium uppercase tracking-widest">Ada yang bisa T-Bot bantu hari ini?</p>
                </div>
              </div>

              <div className="bg-[#f0f2f5] border border-white/10 flex-1 flex flex-col overflow-hidden relative shadow-2xl rounded-2xl">
                {/* Chat Bodies */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95">
                  {chatHistory.map((chat, i) => (
                    <div 
                      key={i} 
                      className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                    >
                      <div className={`max-w-[85%] md:max-w-[70%] relative group`}>
                        {/* Tail for Balloon */}
                        <div className={`absolute top-0 w-3 h-3 ${
                          chat.role === 'user' 
                          ? 'right-[-8px] bg-[#dcf8c6] [clip-path:polygon(0_0,0_100%,100%_0)]' 
                          : 'left-[-8px] bg-white [clip-path:polygon(100%_0,0_0,100%_100%)]'
                        }`} />
                        
                        <div className={`p-3 px-4 text-sm md:text-base leading-relaxed shadow-md ${
                          chat.role === 'user' 
                          ? 'bg-[#dcf8c6] text-[#075e54] rounded-2xl rounded-tr-none' 
                          : 'bg-white text-[#4a4a4a] rounded-2xl rounded-tl-none'
                        }`}>
                          {chat.text.replace(/\*\*/g, '')}
                          <div className="flex justify-end items-center gap-1 mt-1 opacity-40 text-[9px] font-mono">
                            {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            {chat.role === 'user' && <span className="text-blue-500">✓✓</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isBotThinking && (
                    <div className="flex justify-start mb-2">
                      <div className="relative">
                        <div className="absolute top-0 left-[-8px] w-3 h-3 bg-white [clip-path:polygon(100%_0,0_0,100%_100%)]" />
                        <div className="bg-white p-3 px-4 rounded-2xl rounded-tl-none flex gap-1 shadow-md">
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Staff Selection Area */}
                <div className="px-4 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
                  <div className="bg-white/50 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 whitespace-nowrap flex items-center gap-1 border border-white/20">
                    Pilih Staf:
                  </div>
                  {staff.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => handleSendMessage(`Gimana kinerja ${s.name}?`)}
                      className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-[#075e54] whitespace-nowrap border border-[#dcf8c6] hover:bg-[#dcf8c6] transition-colors shadow-sm"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-8 md:p-10 border-t border-white/10 bg-[#070707] flex flex-col md:flex-row gap-4 items-center shrink-0">
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative group">
                      <button 
                        onClick={() => {
                          const dropdown = document.getElementById('staff-dropdown');
                          dropdown?.classList.toggle('hidden');
                        }}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-accent hover:border-accent transition-all flex items-center gap-2"
                        title="Pilih Staf"
                      >
                        <Bot size={20} />
                        <span className="text-[10px] uppercase tracking-widest font-bold hidden md:inline">Fokus Staf</span>
                      </button>
                      <div id="staff-dropdown" className="absolute bottom-full left-0 mb-4 w-64 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl hidden z-[100] max-h-60 overflow-y-auto overflow-x-hidden">
                        <div className="p-4 border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Pilih Objek Staf</div>
                        {staff.map(s => (
                          <button 
                            key={s.id}
                            onClick={() => {
                              handleSendMessage(`Ceritakan tentang kinerja ${s.name}`);
                              document.getElementById('staff-dropdown')?.classList.add('hidden');
                            }}
                            className="w-full text-left p-4 hover:bg-accent/10 border-b border-white/5 last:border-0 transition-colors group"
                          >
                            <p className="font-bold text-white group-hover:text-accent text-sm truncate">{s.name}</p>
                            <p className="text-[10px] text-white/30 truncate">{s.role}</p>
                          </button>
                        ))}
                        {staff.length === 0 && (
                          <div className="p-6 text-center text-white/20 text-[10px] uppercase font-bold italic">Data Staf Kosong</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 relative w-full group">
                    <input 
                      type="text" 
                      autoFocus
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(userInput)}
                      placeholder={isBotThinking ? "Tunggu sebentar..." : "Ketik pesan untuk membalas..."}
                      disabled={isBotThinking}
                      className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-accent transition-all text-lg font-light tracking-tight placeholder:text-white/10 text-white disabled:opacity-30"
                    />
                    <div className="absolute bottom-0 left-0 h-[1px] bg-accent w-0 group-focus-within:w-full transition-all duration-500" />
                  </div>
                  <button 
                    onClick={() => handleSendMessage(userInput)}
                    className="w-full md:w-auto px-10 py-5 bg-accent text-black font-bold uppercase tracking-widest text-[11px] hover:bg-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isBotThinking || !userInput.trim()}
                  >
                    {isBotThinking ? "Analysing..." : "Submit Reply"} <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div 
              key="activity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-12 h-full"
            >
              {/* Calendar Control */}
              <div className="col-span-12 xl:col-span-8 p-6 md:p-16 flex flex-col border-r border-white/10">
                <div className="mb-16">
                  <h2 className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold mb-4">Academic Calendar</h2>
                  <div className="flex items-end justify-between">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                      {currentDate.toLocaleString('id-ID', { month: 'long' })}<br/>
                      <span className="italic font-serif font-light text-white/40">{currentDate.getFullYear()}</span>
                    </h1>
                    <div className="flex gap-4 pb-2">
                      <button onClick={() => changeMonth(-1)} className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                        <ChevronLeft size={18} />
                      </button>
                      <button onClick={() => changeMonth(1)} className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 overflow-hidden">
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
                    <div key={d} className={`bg-[#050505] py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] ${i === 0 ? 'text-accent' : 'text-white/20'}`}>{d}</div>
                  ))}
                  {calendarDays.map((day, i) => {
                    if (!day) return <div key={i} className="bg-[#050505] aspect-square" />;
                    const dayNum = day.split('-')[2].replace(/^0+/, '');
                    const isSelected = selectedDate === day;
                    const hasActivity = activities.some(a => a.date === day);
                    const isToday = day === new Date().toISOString().split('T')[0];
                    const isSun = new Date(day).getDay() === 0 || !!isHoliday(day);

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(day)}
                        className={`bg-[#050505] aspect-square relative group p-4 flex flex-col items-start justify-between border-t border-l border-white/5 transition-all ${
                          isSelected ? 'bg-[#111]' : 'hover:bg-[#0A0A0A]'
                        }`}
                      >
                        <span className={`text-xl font-bold tracking-tighter ${
                          isSelected ? 'text-accent' : isSun ? 'text-accent/40' : 'text-white/60'
                        }`}>
                          {dayNum}
                        </span>
                        {(hasActivity || isToday) && (
                          <div className={`w-full h-[2px] ${isToday ? 'bg-white' : 'bg-accent/40'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Details */}
              <div className="col-span-12 xl:col-span-4 bg-[#0A0A0A] p-8 md:p-12 border-l border-white/10 flex flex-col h-full overflow-y-auto">
                <div className="mb-12">
                  <div className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-2 font-mono">Selected_Date</div>
                  <h3 className="text-4xl font-serif italic font-light">
                    {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                  </h3>
                </div>
                
                <div className="space-y-12">
                  {isHoliday(selectedDate) && (
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-accent mb-2">Notice</div>
                      <p className="text-xl font-light italic text-accent/80 tracking-tight">{isHoliday(selectedDate)}</p>
                    </div>
                  )}

                  <div className="space-y-8">
                    {activities.filter(a => a.date === selectedDate).map(a => (
                      <div key={a.id} className="relative pl-6 border-l border-accent">
                        <div className="text-[10px] uppercase tracking-widest opacity-30 mb-2 font-mono">Activity_LOG</div>
                        <p className="text-xl font-bold tracking-tight text-white/90">{a.title}</p>
                      </div>
                    ))}
                    {activities.filter(a => a.date === selectedDate).length === 0 && (
                      <div className="py-20 text-center opacity-10">
                        <LayoutDashboard className="mx-auto mb-6" size={60} strokeWidth={0.5} />
                        <p className="text-[10px] uppercase tracking-widest">No Records Found</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="mt-auto pt-10 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-4">Admin Privileged</p>
                    <button className="text-[11px] font-bold uppercase tracking-widest text-[#F5F5F5] opacity-50 hover:opacity-100 transition-opacity">
                      Quick Entry Mode
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col p-6 md:p-16 max-w-6xl mx-auto w-full"
            >
              {!isAdmin ? (
                <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto">
                  <div className="mb-12 text-center">
                    <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 text-accent">
                      <Lock size={32} strokeWidth={1} />
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter mb-4 italic font-serif">Security Portal</h2>
                    <p className="text-[10px] uppercase tracking-[0.5em] text-white/40">Credential Required</p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="w-full space-y-12">
                    <div className="relative">
                      <input 
                        type="password" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-transparent border-b border-white/10 py-6 outline-none focus:border-accent transition-all text-center text-3xl font-bold tracking-[0.5em] placeholder:text-white/5"
                        placeholder="••••••••"
                      />
                      {authError && (
                        <motion.p 
                          initial={{ y: 10, opacity: 0 }} 
                          animate={{ y: 0, opacity: 1 }}
                          className="absolute -bottom-8 left-0 right-0 text-center text-[10px] font-black uppercase text-accent tracking-widest"
                        >
                          {authError}
                        </motion.p>
                      )}
                    </div>
                    <button className="w-full py-6 bg-accent text-black font-bold uppercase tracking-widest text-[11px] hover:bg-white transition-all shadow-xl shadow-accent/10">
                      Validate Access
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-16 pb-20">
                  <div className="flex items-end justify-between border-b border-white/10 pb-8">
                    <div>
                      <h2 className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold mb-2">Administrator</h2>
                      <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">System Control</h1>
                    </div>
                    <button onClick={handleLogout} className="text-white/40 hover:text-accent font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 border border-white/10 px-6 py-3 rounded-full transition-all">
                       <LogOut size={14} /> Kill Session
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Activity Manager */}
                    <div className="space-y-8 flex flex-col">
                      <div className="flex items-center gap-4">
                        <div className="w-px h-8 bg-accent" />
                        <h3 className="font-bold text-xl uppercase tracking-tighter">Event Protocol</h3>
                      </div>
                      
                      <div className="space-y-12 bg-[#0A0A0A] p-10 border border-white/5">
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Title_Field</label>
                          <input 
                            id="new-activity-title"
                            type="text" 
                            placeholder="Enter activity name" 
                            className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-all text-xl font-light italic font-serif" 
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Date_Field</label>
                          <input 
                            id="new-activity-date"
                            type="date" 
                            className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-all text-xl uppercase font-mono font-light text-white/80" 
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const titleEl = document.getElementById('new-activity-title') as HTMLInputElement;
                            const dateEl = document.getElementById('new-activity-date') as HTMLInputElement;
                            const title = titleEl.value;
                            const date = dateEl.value;
                            if (title && date) {
                              setActivities(prev => [...prev, { id: Date.now().toString(), title, date }]);
                              titleEl.value = '';
                              dateEl.value = '';
                            }
                          }}
                          className="w-full bg-white text-black font-bold py-5 uppercase tracking-widest text-[11px] hover:bg-accent transition-colors shadow-2xl shadow-white/5"
                        >
                          Execute Write
                        </button>
                      </div>

                      <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-4">
                         {activities.slice().sort((a,b) => b.date.localeCompare(a.date)).map(a => (
                           <div key={a.id} className="flex justify-between items-center p-6 border border-white/5 bg-[#070707] hover:border-white/20 transition-all">
                             <div>
                               <p className="text-[10px] text-accent font-mono uppercase tracking-[0.2em] mb-1">{a.date}</p>
                               <p className="font-bold text-white/80 tracking-tight text-lg">{a.title}</p>
                             </div>
                             <button onClick={() => setActivities(prev => prev.filter(at => at.id !== a.id))} className="text-white/20 hover:text-accent transition-colors">
                               <Trash2 size={18} strokeWidth={1.5} />
                             </button>
                           </div>
                         ))}
                      </div>
                    </div>

                    {/* FAQ Manager */}
                    <div className="space-y-8 flex flex-col">
                      <div className="flex items-center gap-4">
                        <div className="w-px h-8 bg-accent" />
                        <h3 className="font-bold text-xl uppercase tracking-tighter">Knowledge Base</h3>
                      </div>

                      <div className="space-y-12 bg-[#0A0A0A] p-10 border border-white/5">
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Prompt_Entry</label>
                          <input id="new-faq-q" type="text" placeholder="Key search term" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-all text-xl font-light italic font-serif" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Response_Payload</label>
                          <textarea id="new-faq-a" placeholder="System output string" className="w-full bg-transparent border-b border-white/10 py-4 h-32 outline-none focus:border-accent transition-all text-lg font-light leading-relaxed" />
                        </div>
                        <button 
                          onClick={() => {
                            const qEl = document.getElementById('new-faq-q') as HTMLInputElement;
                            const aEl = document.getElementById('new-faq-a') as HTMLTextAreaElement;
                            const q = qEl.value;
                            const a = aEl.value;
                            if (q && a) {
                              setFaqs(prev => [...prev, { id: Date.now().toString(), question: q, answer: a }]);
                              qEl.value = '';
                              aEl.value = '';
                            }
                          }}
                          className="w-full bg-white text-black font-bold py-5 uppercase tracking-widest text-[11px] hover:bg-accent transition-colors shadow-2xl shadow-white/5"
                        >
                          Push to Cloud
                        </button>
                      </div>

                      <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-4">
                        {faqs.map(f => (
                          <div key={f.id} className="flex justify-between items-center p-6 border border-white/5 bg-[#070707] hover:border-white/20 transition-all">
                            <div className="flex-1 mr-4 overflow-hidden">
                              <p className="font-bold text-white/90 truncate tracking-tight text-lg">{f.question}</p>
                              <p className="text-[10px] text-white/30 truncate uppercase tracking-widest transition-opacity group-hover:opacity-100">{f.answer}</p>
                            </div>
                            <button onClick={() => setFaqs(prev => prev.filter(x => x.id !== f.id))} className="text-white/20 hover:text-accent transition-colors">
                              <Trash2 size={18} strokeWidth={1.5} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Staff Manager */}
                    <div className="space-y-8 flex flex-col lg:col-span-2">
                      <div className="flex items-center gap-4">
                        <div className="w-px h-8 bg-accent" />
                        <h3 className="font-bold text-xl uppercase tracking-tighter">Internal Staff Record</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8 bg-[#0A0A0A] p-10 border border-white/5">
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Full_Name</label>
                            <input id="new-staff-name" type="text" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-all text-xl font-light italic font-serif" />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Role_Title</label>
                            <input id="new-staff-role" type="text" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-all text-xl font-light italic font-serif" />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Performance_Summary</label>
                            <textarea id="new-staff-info" className="w-full bg-transparent border-b border-white/10 py-4 h-32 outline-none focus:border-accent transition-all text-lg font-light leading-relaxed" />
                          </div>
                          <button 
                            onClick={() => {
                              const nameEl = document.getElementById('new-staff-name') as HTMLInputElement;
                              const roleEl = document.getElementById('new-staff-role') as HTMLInputElement;
                              const infoEl = document.getElementById('new-staff-info') as HTMLTextAreaElement;
                              const name = nameEl.value;
                              const role = roleEl.value;
                              const info = infoEl.value;
                              if (name && role && info) {
                                setStaff(prev => [...prev, { id: Date.now().toString(), name, role, performanceInfo: info }]);
                                nameEl.value = '';
                                roleEl.value = '';
                                infoEl.value = '';
                              }
                            }}
                            className="w-full bg-white text-black font-bold py-5 uppercase tracking-widest text-[11px] hover:bg-accent transition-colors shadow-2xl shadow-white/5"
                          >
                            Register Identity
                          </button>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                          {staff.map(s => (
                            <div key={s.id} className="p-6 border border-white/5 bg-[#070707] hover:border-white/20 transition-all flex justify-between items-start">
                              <div className="flex-1 mr-4">
                                <p className="text-[10px] text-accent font-mono uppercase tracking-[0.2em] mb-1">{s.role}</p>
                                <p className="font-bold text-white/90 tracking-tight text-xl mb-2">{s.name}</p>
                                <p className="text-xs text-white/40 leading-relaxed italic">{s.performanceInfo}</p>
                              </div>
                              <button onClick={() => setStaff(prev => prev.filter(x => x.id !== s.id))} className="text-white/20 hover:text-accent transition-colors">
                                <Trash2 size={18} strokeWidth={1.5} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
