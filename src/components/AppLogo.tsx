import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-16 h-16 rounded-3xl',
    xl: 'w-24 h-24 rounded-3xl'
  };

  return (
    <div className={`overflow-hidden shadow-md border border-emerald-500/30 flex items-center justify-center bg-[#0B132B] ${sizeClasses[size]} ${className}`}>
      <img 
        src="/logo.jpg" 
        alt="شعار صحتك" 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
