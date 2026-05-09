import React from 'react';
import { FeatureCard } from './FeatureCard';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Tendik Asisten",
      description: "Melaporkan agenda harian & tugas secara otomatis",
      icon: "📋"
    },
    {
      title: "Transparansi",
      description: "Siswa & Guru dapat melaporkan kendala layanan",
      icon: "🔍"
    },
    {
      title: "Akuntabilitas",
      description: "Laporan diubah menjadi tiket tugas penanggung jawab",
      icon: "✅"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};
