import React, { useEffect, useState } from 'react';
import { Heart, ShieldCheck, ArrowLeft } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 200);

    const timer = setTimeout(() => {
      onEnter();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onEnter]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B132B] text-white flex flex-col items-center justify-between p-6 select-none animate-fadeIn">
      {/* Top Badge */}
      <div className="pt-12 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-800/80 text-teal-300 text-xs font-bold border border-teal-500/30 shadow-sm mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>المنصة الصحية الأولى في ديرحافر</span>
        </span>
      </div>

      {/* Center Hero */}
      <div className="flex flex-col items-center text-center max-w-sm px-4">
        <div className="mb-6 transform hover:scale-105 transition duration-300">
          <AppLogo size="xl" className="shadow-2xl shadow-emerald-950/50" />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2 text-white">
          صحتك
        </h1>
        <div className="text-emerald-400 font-bold text-sm mb-4 tracking-wide">
          منصتك الطبية والصحية المتكاملة
        </div>
        <p className="text-slate-300 text-xs leading-relaxed max-w-xs">
          دليلك الشامل للعيادات الطبية، صيدليات المناوبة، المراكز الصحية، وحالات الطوارئ والإنسانية.
        </p>
      </div>

      {/* Bottom Loading & Action */}
      <div className="w-full max-w-xs pb-8 flex flex-col items-center">
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6 border border-slate-700">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full transition-all duration-200 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <button
          onClick={onEnter}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition active:scale-95 border border-emerald-400/30"
        >
          <span>دخول التطبيق</span>
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>نعمل لأجل صحتك وسلامتك</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
        </div>
      </div>
    </div>
  );
};

