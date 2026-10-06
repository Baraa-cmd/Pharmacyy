import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle } from 'lucide-react';

interface AlertDetail {
  id: string;
  title: string;
  body: string;
  time: string;
}

export const PushNotificationToast: React.FC = () => {
  const [activeAlert, setActiveAlert] = useState<AlertDetail | null>(null);

  useEffect(() => {
    const handlePushEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AlertDetail>;
      if (customEvent.detail) {
        setActiveAlert(customEvent.detail);

        // Auto dismiss after 7 seconds
        const timer = setTimeout(() => {
          setActiveAlert(null);
        }, 7000);

        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('app_push_alert', handlePushEvent);
    return () => {
      window.removeEventListener('app_push_alert', handlePushEvent);
    };
  }, []);

  if (!activeAlert) return null;

  return (
    <div 
      className="fixed top-3 left-3 right-3 z-[9999] max-w-md mx-auto animate-in slide-in-from-top-6 duration-300"
      dir="rtl"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl border border-amber-400/40 flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md animate-bounce">
          <Bell className="w-5 h-5 fill-slate-950" />
        </div>

        <div className="flex-1 text-right space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
              إشعار سحابي فوري 🔔
            </span>
            <span className="text-[10px] text-slate-400">{activeAlert.time}</span>
          </div>

          <h4 className="text-xs font-black text-white leading-tight">
            {activeAlert.title}
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {activeAlert.body}
          </p>
        </div>

        <button 
          onClick={() => setActiveAlert(null)}
          className="text-slate-400 hover:text-white p-1 rounded-full"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
