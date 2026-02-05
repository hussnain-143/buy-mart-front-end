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
        <div className={`
            p-6 rounded-2xl bg-white border transition-all duration-300
            ${isCritical
                ? 'border-red-100 shadow-[0_4px_20px_-10px_rgba(239,68,68,0.2)]'
                : 'border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100'
            }
        `}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${isCritical ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-600'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <span className={`
                        text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1
                        ${trend.isUp
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }
                    `}>
                        {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight tabular-nums">
                    {value}
                </h3>
            </div>
        </div>
    );
};

export default StatsCard;
