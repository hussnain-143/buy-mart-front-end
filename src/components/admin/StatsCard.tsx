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
        <div className={`relative bg-secondary p-6 rounded-[2.5rem] border-2 border-white/5 hover:border-primary/50 transition-all duration-500 group overflow-hidden ${isCritical ? 'ring-4 ring-red-500/20' : ''}`}>
            {/* Background Accent Glow */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-[1.5rem] transition-all duration-500 ${
                        isCritical 
                        ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                        : 'bg-primary text-white shadow-[0_0_20px_rgba(255,111,0,0.4)]'
                    } group-hover:scale-110 group-hover:rotate-6`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend && (
                        <div className={`flex flex-col items-end`}>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${trend.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}%
                            </span>
                            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">vs last month</span>
                        </div>
                    )}
                </div>
                
                <div className="space-y-1">
                    <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{value}</p>
                        <div className="h-1 w-1 bg-primary rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Bottom Progress Bar Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                <div className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-primary'}`} style={{ width: '65%' }} />
            </div>
        </div>
    );
};
export default StatsCard;
