/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bot } from 'lucide-react';
import { FeaturesSection } from './FeaturesSection';

export const IntroBox: React.FC = () => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
         <Bot size={120} />
      </div>
      <h2 className="text-accent font-bold text-sm md:text-base mb-3 tracking-wider uppercase">
        SITANGGUH (Sistem Informasi Tanggap Agenda Harian)
      </h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-2xl">
        Inovasi digital berbasis web dengan T-Bot — asisten AI cerdas — 
        untuk dokumentasi agenda kegiatan harian dan penyelesaian tugas yang cepat, transparan, dan akuntabel.
      </p>

      <FeaturesSection />
    </div>
  );
};
