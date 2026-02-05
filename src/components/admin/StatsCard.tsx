import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

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
        <div className={`relative overflow-hidden p-6 rounded-[2rem] border transition-all duration-500 group
            ${isCritical
                ? 'bg-red-950/20 border-red-500/20 hover:border-red-500/50 hover:bg-red-900/20'
                : 'bg-indigo-950/20 border-indigo-500/20 hover:border-cyan-400/50 hover:bg-indigo-900/20'
            } backdrop-blur-3xl shadow-xl hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]`}
        >
            {/* Ambient Background Glow */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-40 transition-all duration-700
                ${isCritical ? 'bg-red-600' : 'bg-cyan-500 group-hover:bg-purple-500'}`}
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
                        ${isCritical
                            ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                            : 'bg-cyan-500/10 border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                        }`}
                    >
                        <Icon className="w-6 h-6" />
                    </div>

                    {trend && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider backdrop-blur-md
                            ${trend.isUp
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            }`}
                        >
                            {trend.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-black tracking-tight tabular-nums bg-clip-text text-transparent bg-gradient-to-r 
                            ${isCritical ? 'from-white to-red-200' : 'from-white to-cyan-100'}`}
                        >
                            {value}
                        </span>

                        {/* Animated Indicator Dot */}
                        <div className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 
                                ${isCritical ? 'bg-red-500' : 'bg-cyan-400'}`}
                            />
                            <span className={`relative inline-flex rounded-full h-2 w-2 
                                ${isCritical ? 'bg-red-500' : 'bg-cyan-500'}`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Cyber Line */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent">
                <div className={`h-full transition-all duration-1000 ease-out
                    ${isCritical ? 'bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0' : 'bg-gradient-to-r from-cyan-400/0 via-cyan-400 to-cyan-400/0'}`}
                    style={{ width: '0%', marginLeft: '0%' }}
                />
            </div>

            {/* Hover Glint Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    );
};

export default StatsCard;
