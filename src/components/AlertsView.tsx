import React from 'react';
import { Bell, AlertTriangle, ShieldCheck, Info, HeartPulse } from 'lucide-react';
import { HealthAlert } from '../types';

interface AlertsViewProps {
  alerts: HealthAlert[];
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts }) => {
  return (
    <div className="space-y-4 pb-24 px-3.5 pt-3">
      {/* Title */}
      <div>
        <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
          <Bell className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span>مركز الإشعارات والتنبيهات الصحية</span>
        </h2>
        <p className="text-[11px] text-slate-500">
          آخر التحذيرات الطبية، التوجيهات الوقائية، وحملات اللقاح المعتمدة بدير حافر
        </p>
      </div>

      {/* Lists of Alerts */}
      <div className="space-y-3.5">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
            <span className="text-3xl">🔔</span>
            <h4 className="text-sm font-bold text-slate-800">لا توجد تنبيهات نشطة</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              لم يتم إصدار أي تنبيهات صحية أو حملات لقاح جديدة لليوم. تابع هذه الصفحة باستمرار للبقاء على اطلاع.
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const isVaccine = alert.type === 'vaccine';
            const isWarning = alert.type === 'warning';

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-3xl p-4 border shadow-xs transition-all relative overflow-hidden text-right ${
                  isWarning 
                    ? 'border-rose-200 bg-rose-50/10' 
                    : isVaccine 
                    ? 'border-emerald-200 bg-emerald-50/10' 
                    : 'border-blue-200 bg-blue-50/10'
                }`}
                dir="rtl"
              >
                {/* Visual Accent Strip */}
                <div className={`absolute top-0 right-0 bottom-0 w-1 ${
                  isWarning ? 'bg-rose-500' : isVaccine ? 'bg-emerald-500' : 'bg-blue-500'
                }`}></div>

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isWarning 
                      ? 'bg-rose-50 text-rose-700 border-rose-100' 
                      : isVaccine 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-blue-50 text-blue-700 border-blue-100'
                  }`}>
                    {isWarning ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isVaccine ? (
                      <HeartPulse className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isWarning 
                          ? 'bg-rose-100 text-rose-800' 
                          : isVaccine 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isWarning ? 'تحذير صحي عاجل' : isVaccine ? 'حملة لقاح وطني' : 'إرشاد وتثقيف طبي'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{alert.date}</span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-tight pt-1">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                      {alert.content}
                    </p>
                  </div>
                </div>

                {/* Additional Guidance Info */}
                <div className="mt-3.5 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-teal-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    توجيهات معتمدة من الكادر الطبي
                  </span>
                  <span>دليلي الطبي دير حافر</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
