import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
}

export const AdminButton: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading,
    className = '',
    ...props
}) => {
    const baseStyles = "px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white shadow-[0_10px_20px_rgba(255,111,0,0.3)] hover:shadow-[0_15px_30px_rgba(255,111,0,0.4)] hover:-translate-y-1 active:scale-95 uppercase text-[10px] font-black tracking-widest",
        secondary: "bg-secondary text-white border-2 border-white/5 hover:border-primary/50 hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:scale-95 uppercase text-[10px] font-black tracking-widest",
        danger: "bg-red-500 text-white shadow-[0_10px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_15px_30px_rgba(239,68,68,0.4)] hover:-translate-y-1 active:scale-95 uppercase text-[10px] font-black tracking-widest",
        ghost: "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5 uppercase text-[10px] font-black tracking-widest",
    };

    return (
        <button
            {...props}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : children}
        </button>
    );
};
