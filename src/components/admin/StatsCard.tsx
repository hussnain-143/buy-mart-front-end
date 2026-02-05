import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;

}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <div
      className="
        relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6
        shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg hover:border-primary/50
      "
    >
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-2xl rounded-full"></div>

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-primary/70 to-transparent"></div>

      <div className="relative flex items-start justify-between mb-6">
        {/* Icon */}
        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="relative space-y-2">
        <p className="text-secondary text-xs font-semibold uppercase tracking-wider">
          {title}
        </p>

        <h3 className="text-3xl font-extrabold text-primary tracking-tight tabular-nums">
          {value}
        </h3>
      </div>
    </div>
  );
};


export default StatsCard;
