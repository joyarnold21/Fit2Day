import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  }[size];

  const textStyles = {
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
    xl: 'text-3xl font-black tracking-tight',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Minimalist hanger combined with checkmark logo */}
      <div className="relative flex items-center justify-center">
        <div className={`bg-zinc-950 text-white rounded-xl flex items-center justify-center shadow-sm p-1.5 transition-transform hover:scale-105 duration-200 ${iconDimensions}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-white"
          >
            {/* Minimalist Hanger Hook */}
            <path d="M12 3a2.5 2.5 0 0 0-2.5 2.5c0 1.2.9 2.2 2 2.4L12 9" />
            {/* Hanger Shoulder Structure */}
            <path d="M12 9L3.5 14.5a1.5 1.5 0 0 0 .8 2.7H7" />
            {/* Integrated Checkmark Path for the Right Wing */}
            <path d="M12 9l8.5 5.5a1.5 1.5 0 0 1-.8 2.7H17" />
            {/* Clean Checkmark Accent Base */}
            <path d="M8 17.5l3.2 3.2L20.5 10.5" stroke="#2563EB" strokeWidth="2.6" />
          </svg>
        </div>
        {/* Subtle electric blue glowing dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center leading-none">
            <span className={`text-zinc-950 ${textStyles}`}>
              Fit<span className="text-blue-600">2</span>Day
            </span>
          </div>
          <span className="text-[9px] tracking-wider uppercase font-semibold text-zinc-400 mt-0.5">
            AI Stylist
          </span>
        </div>
      )}
    </div>
  );
};
