/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Calendar as CalendarIcon, Settings, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewType } from '../types';

interface SidebarProps {
  activeTab: ViewType;
  setActiveTab: (tab: ViewType) => void;
  isAdmin: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  return (
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
  );
};
