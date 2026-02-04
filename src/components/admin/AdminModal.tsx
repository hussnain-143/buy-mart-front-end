import React from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/20 backdrop-blur-md transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100/50">
                    <h3 className="text-2xl font-extrabold text-secondary tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-secondary hover:bg-gray-100/50 rounded-xl transition-all duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex justify-end gap-3 p-8 bg-gray-50/50 border-t border-gray-100/50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminModal;
