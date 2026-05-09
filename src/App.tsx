/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// MVC View Components
import { Sidebar } from './components/Sidebar';
import { IntroBox } from './components/IntroBox';
import { ChatInterface } from './components/Chat/ChatInterface';
import { CalendarView } from './components/Calendar/CalendarView';
import { AdminPortal } from './components/Admin/AdminPortal';

// Controller Hook
import { useChatController } from './hooks/useChatController';

// Model & Data
import { FAQ, Activity, Staff, ViewType } from './types';
import { 
  ADMIN_PASSWORD, 
  INDONESIAN_HOLIDAYS, 
  INITIAL_FAQS, 
  INITIAL_ACTIVITIES,
  INITIAL_STAFF
} from './constants';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewType>('chatbot');
  const [isLoading, setIsLoading] = useState(true);
  
  // Model state (Data)
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  
  // Auth state
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Controller
  const chat = useChatController(faqs, staff);

  // Calendar logic
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Sync with LocalStorage
  useEffect(() => {
    const saved = {
      faqs: localStorage.getItem('smp6_faqs'),
      acts: localStorage.getItem('smp6_activities'),
      staf: localStorage.getItem('smp6_staff')
    };
    setFaqs(saved.faqs ? JSON.parse(saved.faqs) : INITIAL_FAQS);
    setActivities(saved.acts ? JSON.parse(saved.acts) : INITIAL_ACTIVITIES);
    setStaff(saved.staf ? JSON.parse(saved.staf) : INITIAL_STAFF);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('smp6_faqs', JSON.stringify(faqs));
      localStorage.setItem('smp6_activities', JSON.stringify(activities));
      localStorage.setItem('smp6_staff', JSON.stringify(staff));
    }
  }, [faqs, activities, staff, isLoading]);

  // Auth Handlers
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true); setPasswordInput(''); setAuthError('');
    } else setAuthError('Password salah!');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505]">
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center">
          <div className="text-4xl font-black tracking-tighter mb-4 italic">SMP<span className="text-accent underline font-serif">6</span></div>
          <Loader2 size={24} className="text-accent animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row font-sans text-[#F5F5F5] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />

      <main className="flex-1 overflow-y-auto relative h-[calc(100vh-60px)] md:h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'chatbot' && (
            <motion.div key="chat" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col p-6 md:p-10 max-w-5xl mx-auto space-y-8">
              <Header />
              <IntroBox />
              <ChatInterface {...chat} staff={staff} />
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <CalendarView 
              currentDate={currentDate} 
              selectedDate={selectedDate} 
              setSelectedDate={setSelectedDate} 
              activities={activities}
              isHoliday={(d) => INDONESIAN_HOLIDAYS[d.substring(5)] || INDONESIAN_HOLIDAYS[d]}
              changeMonth={(o) => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + o, 1))}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPortal 
              isAdmin={isAdmin} handleAdminLogin={handleAdminLogin} handleLogout={() => { setIsAdmin(false); setActiveTab('chatbot'); }}
              passwordInput={passwordInput} setPasswordInput={setPasswordInput} authError={authError}
              activities={activities} setActivities={setActivities} faqs={faqs} setFaqs={setFaqs} staff={staff} setStaff={setStaff}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4">
      <div>
        <h2 className="text-[9px] uppercase tracking-[0.4em] text-accent font-bold mb-0.5">SMP 6 PEKALONGAN</h2>
        <h1 className="text-xl font-black tracking-tight uppercase">SITANGGUH Portal <span className="text-accent/60">(T-Bot)</span></h1>
      </div>
      <div className="flex items-center gap-2 text-[9px] font-mono text-white/30 bg-white/5 px-3 py-1 rounded-full border border-white/5">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> SITANGGUH_ONLINE
      </div>
    </div>
  );
}

