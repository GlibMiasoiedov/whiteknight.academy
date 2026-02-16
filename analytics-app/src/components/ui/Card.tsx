import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    active?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'p-6', onClick, active }) => (
    <div
        onClick={onClick}
        className={`
      relative rounded-xl border bg-[#0F1623] transition-all duration-300 group
      ${active ? 'border-white/20 ring-1 ring-white/10' : 'border-white/5 hover:border-white/10'}
      ${padding} ${className} ${onClick ? 'cursor-pointer hover:shadow-xl hover:bg-[#131C2D]' : ''}
    `}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        {children}
    </div>
);

export default Card;
