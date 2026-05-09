/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, FAQ, Staff } from '../types';
import { getGeminiResponse } from '../lib/gemini';

export function useChatController(faqs: FAQ[], staff: Staff[]) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      role: 'bot', 
      text: 'Halo! Saya T-Bot AIS, asisten digital SITANGGUH SMP 6 Pekalongan. Ada yang bisa saya bantu terkait agenda atau layanan sekolah hari ini?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isBotThinking]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isBotThinking) return;
    
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { role: 'user', text, timestamp };
    
    setChatHistory(prev => [...prev, userMsg]);
    setUserInput('');
    setIsBotThinking(true);

    // AI Context construction
    const faqContext = faqs.map(f => `Pertanyaan: ${f.question}, Jawaban: ${f.answer}`).join(' | ');
    const staffContext = staff.map(s => `Staf: ${s.name}, Peran: ${s.role}, Info Kinerja: ${s.performanceInfo}`).join(' | ');
    const contextString = `${faqContext} ||| ${staffContext}`;
    
    // Minimum think time for "professional" feel
    const startTime = Date.now();
    const aiResponse = await getGeminiResponse(text, contextString);
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 2000 - elapsedTime);

    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'bot', 
        text: aiResponse, 
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsBotThinking(false);
    }, remainingTime);
  };

  return {
    chatHistory,
    userInput,
    setUserInput,
    isBotThinking,
    handleSendMessage,
    chatEndRef
  };
}
