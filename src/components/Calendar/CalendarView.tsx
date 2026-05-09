/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';
import { Activity } from '../types';

interface CalendarViewProps {
  currentDate: Date;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  activities: Activity[];
  isHoliday: (dateStr: string) => string | undefined;
  changeMonth: (offset: number) => void;
  isAdmin: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  activities,
  isHoliday,
  changeMonth,
  isAdmin
}) => {
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

  return (
    <motion.div 
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
  );
};
