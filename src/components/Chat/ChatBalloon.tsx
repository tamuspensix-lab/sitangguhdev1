/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChatMessage } from '../../types';

interface ChatBalloonProps {
  message: ChatMessage;
}

export const ChatBalloon: React.FC<ChatBalloonProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[85%] md:max-w-[75%] relative group`}>
        {/* Modern Balloon Tail */}
        <div className={`absolute top-[1px] w-4 h-4 transition-colors ${
          isUser 
          ? 'right-[-7px] bg-[#005c4b] [clip-path:polygon(0_0,0_100%,100%_0)]' 
          : 'left-[-7px] bg-[#202c33] [clip-path:polygon(100%_0,0_0,100%_100%)]'
        }`} />
        
        <div className={`py-2 px-4 shadow-xl transition-all hover:brightness-110 ${
          isUser 
          ? 'bg-[#005c4b] text-white rounded-[1.2rem] rounded-tr-none' 
          : 'bg-[#202c33] text-[#e9edef] rounded-[1.2rem] rounded-tl-none border border-white/5'
        }`}>
          <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
          
          <div className="flex justify-end items-center gap-1.5 mt-1.5 leading-none">
            <span className="opacity-40 text-[9px] font-mono tracking-tighter">
              {message.timestamp}
            </span>
            {isUser && (
              <span className="text-[#53bdeb] text-[10px] font-bold tracking-[-2px]">
                ✓✓
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
