import React from 'react';
import { Send, FileText, UserPlus, Database, Settings2, Globe2 } from 'lucide-react';
import { AdminButton } from './AdminForm';

const actions = [
    { icon: Globe2, label: 'Deploy Regional Node', color: 'primary' },
    { icon: FileText, label: 'Export Global Audit', color: 'secondary' },
    { icon: UserPlus, label: 'Enlist Admin Officer', color: 'primary' },
    { icon: Database, label: 'Purge Temporary Cache', color: 'secondary' },
    { icon: Settings2, label: 'Modify Access Keys', color: 'secondary' },
    { icon: Send, label: 'Broadcast System Alert', color: 'primary' },
];

const QuickActions: React.FC = () => {
    return (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/40 h-full hover:shadow-2xl transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-8 bg-primary rounded-full group-hover:h-10 transition-all duration-500" />
                <h3 className="text-secondary font-black text-xl tracking-tight uppercase">Quick Governance</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border border-gray-100 hover:border-primary/40 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/10 group/btn`}
                    >
                        <div className={`p-4 rounded-2xl ${action.color === 'primary'
                                ? 'bg-primary/10 text-primary group-hover/btn:bg-primary group-hover/btn:text-white'
                                : 'bg-secondary/5 text-secondary group-hover/btn:bg-secondary group-hover/btn:text-white'
                            } transition-all duration-500 shadow-inner`}>
                            <action.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest text-center">{action.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50">
                <AdminButton className="w-full !py-4 shadow-xl shadow-primary/20">
                    Super Admin Console
                </AdminButton>
            </div>
        </div>
    );
};

export default QuickActions;
