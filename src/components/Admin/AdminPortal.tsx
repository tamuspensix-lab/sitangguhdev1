/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock, LogOut, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FAQ, Activity, Staff } from '../types';

interface AdminPortalProps {
  isAdmin: boolean;
  handleAdminLogin: (e: React.FormEvent) => void;
  handleLogout: () => void;
  passwordInput: string;
  setPasswordInput: (val: string) => void;
  authError: string;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  faqs: FAQ[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQ[]>>;
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isAdmin,
  handleAdminLogin,
  handleLogout,
  passwordInput,
  setPasswordInput,
  authError,
  activities,
  setActivities,
  faqs,
  setFaqs,
  staff,
  setStaff
}) => {
  if (!isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto h-full">
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
    );
  }

  return (
    <div className="space-y-16 pb-20 p-6 md:p-16 w-full max-w-6xl mx-auto">
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
              <input id="new-activity-title" type="text" placeholder="Enter activity name" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-all text-xl font-light italic font-serif" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Date_Field</label>
              <input id="new-activity-date" type="date" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-all text-xl uppercase font-mono font-light text-white/80" />
            </div>
            <button 
              onClick={() => {
                const titleEl = document.getElementById('new-activity-title') as HTMLInputElement;
                const dateEl = document.getElementById('new-activity-date') as HTMLInputElement;
                if (titleEl.value && dateEl.value) {
                  setActivities(prev => [...prev, { id: Date.now().toString(), title: titleEl.value, date: dateEl.value }]);
                  titleEl.value = '';
                  dateEl.value = '';
                }
              }}
              className="w-full bg-white text-black font-bold py-5 uppercase tracking-widest text-[11px] hover:bg-accent transition-colors"
            >
              Execute Write
            </button>
          </div>

          <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-4">
             {activities.slice().sort((a,b) => b.date.localeCompare(a.date)).map(a => (
               <div key={a.id} className="flex justify-between items-center p-6 border border-white/5 bg-[#070707]">
                 <div>
                   <p className="text-[10px] text-accent font-mono uppercase tracking-[0.2em] mb-1">{a.date}</p>
                   <p className="font-bold text-white/80 tracking-tight text-lg">{a.title}</p>
                 </div>
                 <button onClick={() => setActivities(prev => prev.filter(at => at.id !== a.id))} className="text-white/20 hover:text-accent">
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
                if (qEl.value && aEl.value) {
                  setFaqs(prev => [...prev, { id: Date.now().toString(), question: qEl.value, answer: aEl.value }]);
                  qEl.value = '';
                  aEl.value = '';
                }
              }}
              className="w-full bg-white text-black font-bold py-5 uppercase tracking-widest text-[11px] hover:bg-accent transition-colors"
            >
              Push to Cloud
            </button>
          </div>

          <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-4">
            {faqs.map(f => (
              <div key={f.id} className="flex justify-between items-center p-6 border border-white/5 bg-[#070707]">
                <div className="flex-1 mr-4 overflow-hidden">
                  <p className="font-bold text-white/90 truncate tracking-tight text-lg">{f.question}</p>
                  <p className="text-[10px] text-white/30 truncate uppercase tracking-widest">{f.answer}</p>
                </div>
                <button onClick={() => setFaqs(prev => prev.filter(x => x.id !== f.id))} className="text-white/20 hover:text-accent">
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
                  const nEl = document.getElementById('new-staff-name') as HTMLInputElement;
                  const rEl = document.getElementById('new-staff-role') as HTMLInputElement;
                  const iEl = document.getElementById('new-staff-info') as HTMLTextAreaElement;
                  if (nEl.value && rEl.value && iEl.value) {
                    setStaff(prev => [...prev, { id: Date.now().toString(), name: nEl.value, role: rEl.value, performanceInfo: iEl.value }]);
                    nEl.value = ''; rEl.value = ''; iEl.value = '';
                  }
                }}
                className="w-full bg-white text-black font-bold py-5 uppercase tracking-widest text-[11px] hover:bg-accent transition-colors"
              >
                Register Identity
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
              {staff.map(s => (
                <div key={s.id} className="p-6 border border-white/5 bg-[#070707] flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <p className="text-[10px] text-accent font-mono uppercase tracking-[0.2em] mb-1">{s.role}</p>
                    <p className="font-bold text-white/90 tracking-tight text-xl mb-2">{s.name}</p>
                    <p className="text-xs text-white/40 leading-relaxed italic">{s.performanceInfo}</p>
                  </div>
                  <button onClick={() => setStaff(prev => prev.filter(x => x.id !== s.id))} className="text-white/20 hover:text-accent">
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
