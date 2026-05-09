/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Activity {
  id: string;
  title: string;
  date: string; // ISO format: YYYY-MM-DD
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  performanceInfo: string;
}

export type ViewType = 'chatbot' | 'activity' | 'admin';

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
}
