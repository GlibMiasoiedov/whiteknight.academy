import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
    fullWidth?: boolean;
    icon?: LucideIcon;
    themeColor?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg'; // Added size support based on usage in CenterColumn
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    children,
    onClick,
    fullWidth,
    icon: Icon,
    themeColor,
    className = '',
    disabled = false,
    size = 'md',
    style: styleProp,
    ...props
}) => {
    const baseStyle = "rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeStyles = {
        xs: "h-7 px-2 text-[10px]",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        md: "h-10 px-4 text-sm"
    };

    let style: React.CSSProperties = { ...styleProp };
    let variantClass = "";

    if (variant === 'primary') {
        const color = themeColor || '#8B5CF6';
        style = { ...style, backgroundColor: color };
        variantClass = `text-white shadow-[0_0_20px_-5px_${color}80] hover:brightness-110 border border-white/10`;
    } else if (variant === 'secondary') {
        variantClass = "border border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm";
    } else if (variant === 'ghost') {
        variantClass = "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent";
    } else if (variant === 'gradient') {
        variantClass = "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-none shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:brightness-110";
    }

    return (
        <button
            onClick={onClick}
            style={!disabled ? style : {}}
            disabled={disabled}
            className={`${baseStyle} ${sizeStyles[size]} ${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {Icon && <Icon size={16} className="relative z-10 flex-shrink-0" />}
            <span className="relative z-10">{children}</span>
            {variant === 'primary' && !disabled && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />}
        </button>
    );
};
export default Button;
