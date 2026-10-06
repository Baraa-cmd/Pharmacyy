import React, { useState } from 'react';
import { HeartHandshake, DollarSign, Phone, MessageCircle, Sparkles, Check } from 'lucide-react';
import { HumanitarianCase } from '../types';
import { buildWhatsAppHumanitarianDonateUrl } from '../utils/storage';

interface HumanitarianViewProps {
  cases: HumanitarianCase[];
  onUpdateDonation: (id: string, amount: number) => void;
}

export const HumanitarianView: React.FC<HumanitarianViewProps> = ({ cases, onUpdateDonation }) => {
  const [donateInput, setDonateInput] = useState<Record<string, string>>({});
  const [successCaseId, setSuccessCaseId] = useState<string | null>(null);

  const handleDonateSubmit = (caseId: string, item: HumanitarianCase) => {
    const amount = parseFloat(donateInput[caseId] || '');
    if (isNaN(amount) || amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح للتبرع!');
      return;
    }

    onUpdateDonation(caseId, amount);
    setDonateInput({ ...donateInput, [caseId]: '' });
    setSuccessCaseId(caseId);

    // Open WhatsApp after donation simulation to contact the case coordinator
    const cleanPhone = item.whatsapp || item.phone;
    const whatsappUrl = buildWhatsAppHumanitarianDonateUrl(cleanPhone, item.title);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setSuccessCaseId(null);
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-24 px-3.5 pt-3">
      {/* Title */}
      <div>
        <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
          <HeartHandshake className="w-5 h-5 text-rose-500" />
          <span>مساعدات الحالات الإنسانية العاجلة</span>
        </h2>
        <p className="text-[11px] text-slate-500">
          دعم الأسر المتعففة والمرضى العاجزين عن تأمين تكلفة العمليات والأدوية المزمنة
        </p>
      </div>

      {/* Intro info card */}
      <div className="bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-200/80 p-3.5 rounded-2xl text-xs text-rose-950 space-y-1 text-right" dir="rtl">
        <div className="flex items-center gap-1.5 font-bold mb-1">
          <Sparkles className="w-4 h-4 text-rose-600" />
          <span>صدقة جارية وباب للخير والشفاء</span>
        </div>
        <p className="leading-relaxed text-slate-700 font-medium">
          المرضى وعائلاتهم في هذه القائمة تم مراجعة تقاريرهم الطبية بدقة مع الأطباء والمنسقين المحليين. يمكنك التبرع بكامل التكلفة أو جزء منها، والاتصال بالمنسق فوراً للمساعدة المباشرة.
        </p>
      </div>

      {/* Cases list */}
      <div className="space-y-4">
        {cases.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
            <span className="text-3xl">🤝</span>
            <h4 className="text-sm font-bold text-slate-800">لا توجد حالات معروضة حالياً</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              الحمد لله، تم إغلاق وتغطية كافة الحالات الطبية السابقة بنجاح. سنعلمكم فور وجود أي حالة جديدة.
            </p>
          </div>
        ) : (
          cases.map((item) => {
            const targetVal = parseFloat(item.requiredAmount.replace(/[^0-9]/g, '')) || 1;
            const collectedVal = parseFloat(item.collectedAmount.replace(/[^0-9]/g, '')) || 0;
            const percent = Math.min(Math.round((collectedVal / targetVal) * 100), 100);
            const remaining = Math.max(targetVal - collectedVal, 0);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-4.5 border transition-all relative text-right ${
                  item.isCompleted 
                    ? 'border-emerald-200 bg-emerald-50/5' 
                    : 'border-slate-200/90 shadow-xs'
                }`}
                dir="rtl"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-2">
                  {item.isCompleted ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full">
                      مكتملة ومغطاة بالكامل ✓
                    </span>
                  ) : (
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded-full">
                      حالة عاجلة طارئة
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-500">المنسق: {item.patientName}</span>
                </div>

                {/* Case Info */}
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.condition}
                  </p>
                </div>

                {/* Details list */}
                <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-100 text-xs text-slate-600 space-y-1 font-medium">
                  <p><strong className="text-slate-800">المريض:</strong> {item.patientName} ({item.age})</p>
                  <p><strong className="text-slate-800">المكان العلاجي:</strong> {item.hospital}</p>
                </div>

                {/* Donation Tracker Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-800">نسبة الاكتمال: {percent}%</span>
                    <span className="text-slate-500">
                      المتبقي للهدف:{' '}
                      <strong className="text-rose-600 font-bold">
                        {remaining.toLocaleString('ar-SY')} ل.س
                      </strong>
                    </span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.isCompleted 
                          ? 'bg-emerald-500' 
                          : 'bg-gradient-to-r from-rose-500 to-amber-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {/* Stats Breakdown */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                    <span>المدفوع: {item.collectedAmount}</span>
                    <span>الهدف الكلي: {item.requiredAmount}</span>
                  </div>
                </div>

                {/* Quick Donation Panel */}
                {!item.isCompleted && (
                  successCaseId === item.id ? (
                    <div className="bg-emerald-50 text-emerald-950 p-3 rounded-2xl border border-emerald-200 text-center text-xs font-bold flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 animate-bounce" />
                      <span>جاري إرسال المساهمة الطيبة وفتح وتواصل واتساب للتنسيق...</span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
                      <div className="relative flex-1">
                        <DollarSign className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-teal-600" />
                        <input
                          type="number"
                          placeholder="أدخل مبلغ المساهمة (مثال: 50000)..."
                          value={donateInput[item.id] || ''}
                          onChange={(e) => setDonateInput({ ...donateInput, [item.id]: e.target.value })}
                          className="w-full text-xs pr-7 pl-2 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 text-right font-bold"
                          dir="rtl"
                        />
                      </div>
                      <button
                        onClick={() => handleDonateSubmit(item.id, item)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition active:scale-95 shrink-0"
                      >
                        سجل تبرعاً
                      </button>
                    </div>
                  )
                )}

                {/* Actions: Whatsapp and Call Coordinator */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={`tel:${item.phone}`}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>اتصال بالمنسق</span>
                  </a>
                  <a
                    href={buildWhatsAppHumanitarianDonateUrl(item.whatsapp || item.phone, item.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>تنسيق واتساب</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
