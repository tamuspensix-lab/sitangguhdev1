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

export const ADMIN_PASSWORD = "admin123";

export const INDONESIAN_HOLIDAYS: Record<string, string> = {
  '01-01': 'Tahun Baru Masehi',
  '05-01': 'Hari Buruh Internasional',
  '06-01': 'Hari Lahir Pancasila',
  '08-17': 'Hari Kemerdekaan RI',
  '12-25': 'Hari Raya Natal',
  '2026-02-17': 'Tahun Baru Imlek',
  '2026-03-19': 'Hari Suci Nyepi',
  '2026-03-20': 'Hari Raya Idul Fitri',
  '2026-03-21': 'Hari Raya Idul Fitri',
  '2026-04-03': 'Wafat Yesus Kristus',
  '2026-05-14': 'Kenaikan Yesus Kristus',
  '2026-05-27': 'Hari Raya Idul Adha',
  '2026-06-16': 'Tahun Baru Islam',
  '2026-08-26': 'Maulid Nabi Muhammad SAW',
};

export const INITIAL_FAQS: FAQ[] = [
  { id: '1', question: 'Kapan pendaftaran siswa baru dibuka?', answer: 'Pendaftaran siswa baru (PPDB) biasanya dibuka pada bulan Juni. Informasi selengkapnya bisa dicek di situs resmi sekolah.' },
  { id: '2', question: 'Apa saja ekstrakurikuler di SMP 6?', answer: 'Kami memiliki berbagai ekskul seperti Pramuka, Basket, PMR, Seni Musik, dan Robotik.' },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: '1', title: 'Upacara Hari Kemerdekaan', date: '2026-08-17' },
  { id: '2', title: 'Ujian Tengah Semester', date: '2026-10-12' },
];

export const INITIAL_STAFF: Staff[] = [
  { id: '1', name: 'Budi Santoso', role: 'Kepala Sekolah', performanceInfo: 'Berfokus pada manajemen kurikulum dan kedisiplinan siswa.' },
  { id: '2', name: 'Ani Wijaya', role: 'Guru Matematika', performanceInfo: 'Dikenal sangat sabar dan ahli dalam menjelaskan materi sulit.' },
];
