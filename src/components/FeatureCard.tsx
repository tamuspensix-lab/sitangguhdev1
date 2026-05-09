import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-accent/50 transition-all group">
      <div className="text-accent text-xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-white font-semibold mb-2 text-sm">{title}</h3>
      <p className="text-white/50 text-[10px] leading-relaxed">{description}</p>
    </div>
  );
};
