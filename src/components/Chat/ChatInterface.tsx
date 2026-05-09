/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ChatMessage, Staff } from '../../types';
import { ChatBalloon } from './ChatBalloon';

interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  userInput: string;
  setUserInput: (val: string) => void;
  isBotThinking: boolean;
  handleSendMessage: (text: string) => void;
  staff: Staff[];
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatHistory,
  userInput,
  setUserInput,
  isBotThinking,
  handleSendMessage,
  staff,
  chatEndRef
}) => {
  return (
    <div className="bg-zinc-900/50 border border-white/5 flex-1 min-h-[550px] flex flex-col overflow-hidden relative shadow-2xl rounded-[2rem]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95">
        {chatHistory.map((chat, i) => (
          <ChatBalloon key={i} message={chat} />
        ))}
        {isBotThinking && (
          <div className="flex justify-start mb-2">
            <div className="relative">
              <div className="absolute top-0 left-[-6px] w-3 h-3 bg-[#202c33] [clip-path:polygon(100%_0,0_0,100%_100%)]" />
              <div className="bg-[#202c33] p-3 px-5 rounded-2xl rounded-tl-none flex gap-1.5 shadow-lg border border-white/5">
                <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Access Area */}
      <div className="px-6 py-3 bg-[#111b21] flex gap-2 overflow-x-auto scrollbar-hide border-y border-white/5">
         <div className="text-[9px] uppercase font-bold text-white/30 py-1.5 pr-2 border-r border-white/5 whitespace-nowrap self-center">Fokus Staf:</div>
         {staff.map(s => (
          <button 
            key={s.id}
            onClick={() => handleSendMessage(`Ceritakan tentang kinerja ${s.name}`)}
            className="bg-white/5 hover:bg-accent/10 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-medium text-white/70 hover:text-accent transition-all whitespace-nowrap"
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Input Field Area */}
      <div className="p-6 md:p-8 bg-[#111b21] flex gap-4 items-center shrink-0">
        <div className="flex-1 bg-[#2a3942] rounded-2xl p-2 px-6 flex items-center shadow-inner group focus-within:ring-1 ring-accent/20 transition-all">
          <input 
            type="text" 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(userInput)}
            placeholder={isBotThinking ? "T-Bot sedang berpikir..." : "Tanyakan sesuatu ke T-Bot..."}
            disabled={isBotThinking}
            className="w-full bg-transparent border-none py-3 outline-none text-white placeholder:text-white/20 text-base"
          />
        </div>
        <button 
          onClick={() => handleSendMessage(userInput)}
          className="w-12 h-12 md:w-14 md:h-14 bg-accent text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:grayscale"
          disabled={isBotThinking || !userInput.trim()}
        >
          {isBotThinking ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
        </button>
      </div>
    </div>
  );
};
