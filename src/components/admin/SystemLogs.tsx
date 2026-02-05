import React from 'react';
import {
    ShieldCheck,
    User,
    AlertCircle,
    Database,
    Settings,
    Clock
} from 'lucide-react';

interface LogEntry {
    id: string;
    type: 'security' | 'user' | 'system' | 'error';
    message: string;
    time: string;
    description?: string;
}

const logs: LogEntry[] = [
    {
        id: '1',
        type: 'security',
        message: 'Suspicious Login Attempt Blocked',
        time: '10:42 AM',
        description: 'IP 192.168.1.105 blocked after 3 failed attempts.'
    },
    {
        id: '2',
        type: 'user',
        message: 'New Vendor Registration',
        time: '09:15 AM',
        description: 'TechGadgets Inc. submitted verification docs.'
    },
    {
        id: '3',
        type: 'system',
        message: 'Database Backup Completed',
        time: '04:00 AM',
        description: 'Daily automated backup (size: 4.2GB).'
    },
    {
        id: '4',
        type: 'error',
        message: 'Payment Gateway Timeout',
        time: 'Yesterday',
        description: 'Transaction ID #TXN-8821 timed out.'
    },
    {
        id: '5',
        type: 'user',
        message: 'Admin Role Updated',
        time: 'Yesterday',
        description: 'User "Sarah Connor" promoted to Super Admin.'
    },
];

const getIcon = (type: string) => {
    switch (type) {
        case 'security': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
        case 'user': return <User className="w-4 h-4 text-blue-500" />;
        case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
        default: return <Database className="w-4 h-4 text-purple-500" />;
    }
};

const getBgColor = (type: string) => {
    switch (type) {
        case 'security': return 'bg-emerald-50 border-emerald-100';
        case 'user': return 'bg-blue-50 border-blue-100';
        case 'error': return 'bg-red-50 border-red-100';
        default: return 'bg-purple-50 border-purple-100';
    }
};

const SystemLogs: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-gray-900 font-bold text-lg tracking-tight flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-400" />
                        System Logs
                    </h3>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1 pl-7">Recent Platform Activity</p>
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                    <Clock className="w-4 h-4" />
                </button>
            </div>

            <div className="relative pl-4 space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-100" />

                {logs.map((log) => (
                    <div key={log.id} className="relative flex gap-4 group">
                        {/* Timeline Dot */}
                        <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center border-2 shadow-sm transition-transform group-hover:scale-110 bg-white ${getBgColor(log.type).replace('bg-', 'border-')}`}>
                            {getIcon(log.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-2">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                                    {log.message}
                                </h4>
                                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                    {log.time}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                {log.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50">
                <button className="w-full text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors py-2">
                    View Full Audit Log
                </button>
            </div>
        </div>
    );
};

export default SystemLogs;
