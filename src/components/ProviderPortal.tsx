import React, { useState } from 'react';
import { Stethoscope, Pill, Clock, Phone, MapPin, CheckCircle, Save, AlertCircle } from 'lucide-react';
import { SystemUser, Doctor, Pharmacy } from '../types';

interface ProviderPortalProps {
  currentUser: SystemUser;
  doctors: Doctor[];
  pharmacies: Pharmacy[];
  onUpdateDoctor: (doc: Doctor) => void;
  onUpdatePharmacy: (pharm: Pharmacy) => void;
  onLogout: () => void;
}

export const ProviderPortal: React.FC<ProviderPortalProps> = ({
  currentUser,
  doctors,
  pharmacies,
  onUpdateDoctor,
  onUpdatePharmacy,
  onLogout
}) => {
  // Find linked entity
  const linkedDoctor = currentUser.role === 'doctor' 
    ? doctors.find((d) => d.id === currentUser.linkedEntityId || d.name === currentUser.name) || doctors[0]
    : null;

  const linkedPharmacy = currentUser.role === 'pharmacy'
    ? pharmacies.find((p) => p.id === currentUser.linkedEntityId || p.name === currentUser.name) || pharmacies[0]
    : null;

  // Editable states
  const [docState, setDocState] = useState<Doctor | null>(linkedDoctor || null);
  const [pharmState, setPharmState] = useState<Pharmacy | null>(linkedPharmacy || null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (docState) {
      onUpdateDoctor(docState);
      setSuccessMsg('تم حفظ وتحديث بيانات العيادة بنجاح!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleSavePharmacy = (e: React.FormEvent) => {
    e.preventDefault();
    if (pharmState) {
      onUpdatePharmacy(pharmState);
      setSuccessMsg('تم حفظ وتحديث بيانات الصيدلية بنجاح!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-2xl mx-auto space-y-5 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white rounded-3xl p-6 shadow-xl relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl">
              {currentUser.role === 'doctor' ? '🩺' : '💊'}
            </div>
            <div>
              <span className="bg-teal-700/80 text-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-600/50">
                {currentUser.role === 'doctor' ? 'حساب طبيب معتمد' : 'حساب صيدلية معتمد'}
              </span>
              <h1 className="text-xl font-black mt-1">{currentUser.name}</h1>
              <p className="text-teal-200 text-xs">إدارة البيانات الخاصة بك في دليل دير حافر الطبي</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Notice about permissions */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">ملاحظة الصلاحيات:</span> يمكنك كمزود خدمة (طبيب أو صيدلية) تحديث حالة تواجدك، أوقات العمل، ورقم الهاتف الخاص بك حصراً، بينما إدارة الحسابات العامة والحملات من صلاحيات مدير النظام حصراً.
        </div>
      </div>

      {/* DOCTOR EDIT FORM */}
      {currentUser.role === 'doctor' && docState && (
        <form onSubmit={handleSaveDoctor} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-700" />
            <span>تعديل معلومات العيادة والطبيب</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الاسم واللقب الطبي:</label>
            <input
              type="text"
              value={docState.name}
              onChange={(e) => setDocState({ ...docState, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">التخصص والاختصاص الدقيق:</label>
            <input
              type="text"
              value={docState.title}
              onChange={(e) => setDocState({ ...docState, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف:</label>
              <input
                type="text"
                value={docState.phone}
                onChange={(e) => setDocState({ ...docState, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">أيام العمل:</label>
              <input
                type="text"
                value={docState.workingDays}
                onChange={(e) => setDocState({ ...docState, workingDays: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ساعات الدوام:</label>
            <input
              type="text"
              value={docState.workingHours}
              onChange={(e) => setDocState({ ...docState, workingHours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
            <div>
              <div className="text-xs font-bold text-teal-900">حالة التواجد الآن في العيادة</div>
              <div className="text-[10px] text-teal-700">تفعيل هذا الخيار يُظهر للمرضى أنك متواجد ومستقبل الحالات الآن.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={docState.isAvailableNow}
                onChange={(e) => setDocState({ ...docState, isAvailableNow: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التعديلات</span>
          </button>
        </form>
      )}

      {/* PHARMACY EDIT FORM */}
      {currentUser.role === 'pharmacy' && pharmState && (
        <form onSubmit={handleSavePharmacy} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-700" />
            <span>تعديل معلومات الصيدلية ومناوبة اليوم</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم الصيدلية:</label>
            <input
              type="text"
              value={pharmState.name}
              onChange={(e) => setPharmState({ ...pharmState, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم الصيدلاني المسؤول:</label>
              <input
                type="text"
                value={pharmState.pharmacistName}
                onChange={(e) => setPharmState({ ...pharmState, pharmacistName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف:</label>
              <input
                type="text"
                value={pharmState.phone}
                onChange={(e) => setPharmState({ ...pharmState, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div>
              <div className="text-xs font-bold text-emerald-900">صيدلية مناوبة اليوم 🟢</div>
              <div className="text-[10px] text-emerald-700">تفعيل هذا الخيار يدرج صيدليتك في قائمة صيدليات المناوبة الرسمية بمدينة دير حافر.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pharmState.isDutyToday}
                onChange={(e) => setPharmState({ ...pharmState, isDutyToday: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التعديلات</span>
          </button>
        </form>
      )}
    </div>
  );
};
