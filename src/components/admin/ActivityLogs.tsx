import React from 'react';
import { Shield, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LogEntry {
    id: string;
    action: string;
    admin: string;
    time: string;
    status: 'critical' | 'info' | 'success' | 'warning';
}

const logs: LogEntry[] = [
    { id: '1', action: 'New Vendor Verified', admin: 'Root_Sys', time: '2 mins ago', status: 'success' },
    { id: '2', action: 'System Backup Complete', admin: 'Auto_Cron', time: '14 mins ago', status: 'info' },
    { id: '3', action: 'Security Protocol Level 4 Engagement', admin: 'Chief_Sec', time: '1 hour ago', status: 'warning' },
    { id: '4', action: 'Vendor "TechHaven" Banned', admin: 'Root_Sys', time: '3 hours ago', status: 'critical' },
];

const getStatusColor = (status: LogEntry['status']) => {
    switch (status) {
        case 'critical': return 'text-red-500 bg-red-50';
        case 'warning': return 'text-amber-500 bg-amber-50';
        case 'success': return 'text-emerald-500 bg-emerald-50';
        default: return 'text-blue-500 bg-blue-50';
    }
};

const getStatusIcon = (status: LogEntry['status']) => {
    switch (status) {
        case 'critical': return AlertCircle;
        case 'success': return CheckCircle2;
        default: return Shield;
    }
};

const ActivityLogs: React.FC = () => {
    return (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/40 h-full hover:shadow-2xl transition-all duration-500 group">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-primary rounded-full group-hover:h-10 transition-all duration-500" />
                    <h3 className="text-secondary font-black text-xl tracking-tight uppercase">Audit Logs</h3>
                </div>
                <button className="text-primary text-[10px] font-black tracking-widest uppercase hover:underline">View Intelligence</button>
            </div>

            <div className="space-y-6">
                {logs.map((log) => {
                    const Icon = getStatusIcon(log.status);
                    return (
                        <div key={log.id} className="flex gap-4 relative group/item">
                            <div className="flex flex-col items-center gap-1">
                                <div className={`p-2 rounded-xl ${getStatusColor(log.status)} shadow-sm group-hover/item:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="w-px h-full bg-gray-100 group-last:hidden" />
                            </div>
                            <div className="pb-6">
                                <h4 className="text-sm font-black text-secondary tracking-tight mb-1">{log.action}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.admin}</span>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-300 uppercase">
                                        <Clock className="w-3 h-3" />
                                        {log.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityLogs;
