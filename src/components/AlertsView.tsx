import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, ShieldCheck, Info, HeartPulse, Send, CheckCircle2, Volume2, Sparkles } from 'lucide-react';
import { HealthAlert } from '../types';
import { requestNotificationPermission, getNotificationPermissionState, sendPushNotification } from '../utils/notificationService';

interface AlertsViewProps {
  alerts: HealthAlert[];
  onAddAlert?: (alert: HealthAlert) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts, onAddAlert }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [testTitle, setTestTitle] = useState('حملة لقاح وطنية عاجلة 💉');
  const [testBody, setTestBody] = useState('انطلاق حملة اللقاح الشاملة في مستوصف دير حافر الخيري اليوم.');
  const [isTestSuccess, setIsTestSuccess] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermissionState());
  }, []);

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
  };

  const handleSendTestPush = async () => {
    if (permission !== 'granted') {
      const res = await requestNotificationPermission();
      setPermission(res);
    }
    await sendPushNotification(testTitle, testBody);
    setIsTestSuccess(true);
    setTimeout(() => setIsTestSuccess(false), 3000);
  };

  const handlePublishToFirebase = () => {
    if (onAddAlert) {
      const newAlert: HealthAlert = {
        id: `alert-${Date.now()}`,
        title: testTitle,
        content: testBody,
        type: 'vaccine',
        date: 'الآن'
      };
      onAddAlert(newAlert);
      handleSendTestPush();
    }
  };

  return (
    <div className="space-y-4 pb-24 px-3.5 pt-3 text-right" dir="rtl">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
            <Bell className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>مركز الإشعارات والتنبيهات الصحية</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            آخر التحذيرات الطبية، التوجيهات الوقائية، وحملات اللقاح المعتمدة بدير حافر
          </p>
        </div>
        <button
          onClick={() => setShowTestPanel(!showTestPanel)}
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition active:scale-95 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showTestPanel ? 'إخفاء الاختبار' : 'تجربة إشعار'}</span>
        </button>
      </div>

      {/* Interactive Notification Testing Panel */}
      {showTestPanel && (
        <div className="bg-gradient-to-br from-amber-50 via-white to-teal-50/40 rounded-3xl p-4 border border-amber-200/80 shadow-md space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4 fill-slate-950" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs">لوحة تجربة إرسال الإشعارات</h3>
                <p className="text-[10px] text-slate-500">اختبر وصول الإشعار وصوت التنبيه إلى هاتفك وجهازك فوراً</p>
              </div>
            </div>
            
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              permission === 'granted'
                ? 'bg-emerald-100 text-emerald-800'
                : permission === 'denied'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {permission === 'granted' ? '✅ الإشعارات مفعلة' : permission === 'denied' ? '❌ محظورة بالمتصفح' : '⚠️ بانتظار الإذن'}
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">عنوان الإشعار التجريبي:</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">نص الإشعار:</label>
              <textarea
                rows={2}
                value={testBody}
                onChange={(e) => setTestBody(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
          </div>

          {isTestSuccess && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>تم إطلاق الإشعار بنجاح وصوت النغمة الآن! 🔔</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            {permission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                طلب إذن التنبيهات
              </button>
            )}

            <button
              onClick={handleSendTestPush}
              className="flex-1 py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>إرسال إشعار تجريبي للجهاز</span>
            </button>

            {onAddAlert && (
              <button
                onClick={handlePublishToFirebase}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs active:scale-95"
                title="نشر الإشعار في Firebase لجميع الأجهزة"
              >
                <Send className="w-3.5 h-3.5" />
                <span>نشر للجميع في السحابة</span>
              </button>
            )}
          </div>
        </div>
      )}

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

