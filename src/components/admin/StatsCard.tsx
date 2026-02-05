import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    isCritical?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, isCritical }) => {
    return (
        <div className={`relative bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/40 hover:border-primary/40 transition-all duration-500 group hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 overflow-hidden ${isCritical ? 'ring-2 ring-red-500/20 shadow-lg shadow-red-500/5' : ''
            }`}>
            {/* Pulse Effect for critical metrics */}
            {isCritical && (
                <div className="absolute top-4 right-4 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl transition-all duration-500 shadow-inner ${isCritical
                        ? 'bg-gradient-to-br from-red-500/20 to-red-500/5 text-red-500 group-hover:from-red-500 group-hover:to-red-600 group-hover:text-white'
                        : 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary group-hover:from-primary group-hover:to-primary/80 group-hover:text-white'
                    }`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 ${trend.isUp ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                        }`}>
                        {trend.isUp ? '▲' : '▼'} {Math.abs(trend.value)}%
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-gray-400 text-[10px] font-black mb-1 uppercase tracking-[0.2em]">{title}</h3>
                <p className="text-3xl font-[900] text-secondary tracking-tighter tabular-nums">{value}</p>
            </div>
        </div>
    );
};
export default StatsCard;
