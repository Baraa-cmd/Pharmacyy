import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start">
      {/* Main Container - Responsive for mobile and desktop screens */}
      <div className="w-full max-w-lg bg-slate-50 min-h-screen shadow-md flex flex-col relative">
        {/* App Main Content Container */}
        <div className="flex-1 overflow-y-auto relative">
          {children}
        </div>
      </div>
    </div>
  );
};
