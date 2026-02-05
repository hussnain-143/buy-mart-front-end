import React from 'react';

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

const SystemLogs: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">

      {/* Background Glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/15 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/10 blur-3xl rounded-full"></div>

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-primary/70 to-transparent"></div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div>
          <h3 className="text-secondary font-bold text-lg tracking-tight flex items-center gap-2">
            System Logs
          </h3>
          <p className="text-secondary/70 text-xs font-semibold uppercase tracking-wider mt-1">
            Recent Platform Activity
          </p>
        </div>
      </div>

      {/* Logs List */}
      <div className="relative pl-4 space-y-4 overflow-y-auto h-[220px] scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-gray-100 flex-1">
        {/* Vertical Line */}
        <div className="absolute left-[8px] top-1 bottom-0 w-0.5 bg-primary/30" />

        {logs.map((log) => (
          <div key={log.id} className="relative flex flex-col group">
            {/* Content */}
            <div className="flex justify-between items-start pl-4">
              <h4 className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">
                {log.message}
              </h4>
              <span className="text-[10px] font-bold text-secondary/50 bg-secondary/10 px-2 py-1 rounded-md">
                {log.time}
              </span>
            </div>
            <p className="text-xs text-secondary/60 mt-1 leading-relaxed pl-4">
              {log.description}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-50">
        <button className="w-full text-xs font-bold text-secondary/50 hover:text-primary uppercase tracking-widest transition-colors py-2">
          View Full Audit Log
        </button>
      </div>
    </div>
  );
};

export default SystemLogs;
