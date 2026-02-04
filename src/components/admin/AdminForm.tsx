import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const AdminInput: React.FC<InputProps> = ({ label, ...props }) => (
    <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">{label}</label>
        <input
            {...props}
            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-secondary placeholder:text-gray-400 font-medium"
        />
    </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
}

export const AdminSelect: React.FC<SelectProps> = ({ label, options, ...props }) => (
    <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">{label}</label>
        <select
            {...props}
            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-secondary font-medium cursor-pointer"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

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
        primary: "bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5",
        secondary: "bg-gradient-to-r from-secondary to-secondary/80 text-white hover:shadow-lg hover:shadow-secondary/30 hover:-translate-y-0.5",
        danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5",
        ghost: "bg-white/50 backdrop-blur-sm text-gray-600 hover:bg-gray-100/80 border border-gray-200",
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
