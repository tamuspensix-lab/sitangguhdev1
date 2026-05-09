/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChatMessage } from '../../types';

interface ChatBalloonProps {
  message: ChatMessage;
}

export const ChatBalloon: React.FC<ChatBalloonProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[85%] md:max-w-[75%] relative group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
        {/* Balloon Tail */}
        <div className={`absolute top-0 w-3 h-3 ${
          isUser 
          ? 'right-[-6px] bg-[#054d44] [clip-path:polygon(0_0,0_100%,100%_0)]' 
          : 'left-[-6px] bg-[#202c33] [clip-path:polygon(100%_0,0_0,100%_100%)]'
        }`} />
        
        <div className={`p-3 px-5 text-sm md:text-base leading-relaxed shadow-lg ${
          isUser 
          ? 'bg-[#054d44] text-white rounded-2xl rounded-tr-none' 
          : 'bg-[#202c33] text-[#e9edef] rounded-2xl rounded-tl-none'
        }`}>
          {message.text}
          <div className="flex justify-end items-center gap-1 mt-1 opacity-40 text-[9px] font-mono">
            {message.timestamp}
            {isUser && <span className="text-blue-400 font-bold">✓✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
