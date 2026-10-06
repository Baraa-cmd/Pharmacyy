import React, { useState } from 'react';
import { Droplet, Plus, Phone, MessageCircle, AlertCircle, ShieldAlert, CheckCircle2, Search, Heart, User } from 'lucide-react';
import { BloodRequest, EmergencyContact } from '../types';

interface BloodBankViewProps {
  bloodRequests: BloodRequest[];
  onAddBloodRequest: (request: BloodRequest) => void;
  onFulfillBloodRequest: (id: string) => void;
  emergencyContacts: EmergencyContact[];
}

export const BloodBankView: React.FC<BloodBankViewProps> = ({
  bloodRequests,
  onAddBloodRequest,
  onFulfillBloodRequest,
  emergencyContacts
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [hospital, setHospital] = useState('مشفى دير حافر الوطني');
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [phone, setPhone] = useState('');
  const [urgency, setUrgency] = useState<'critical' | 'high' | 'normal'>('critical');
  const [notes, setNotes] = useState('');

  const bloodTypes = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredRequests = bloodRequests.filter(req => {
    if (selectedType !== 'all' && req.bloodType !== selectedType) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone) return;

    const newRequest: BloodRequest = {
      id: `br-${Date.now()}`,
      patientName,
      bloodType,
      hospital,
      unitsNeeded: Number(unitsNeeded),
      phone,
      urgency,
      createdAt: 'الآن',
      isFulfilled: false,
      notes
    };

    onAddBloodRequest(newRequest);
    setIsModalOpen(false);
    setPatientName('');
    setPhone('');
    setNotes('');
  };

  return (
    <div className="space-y-4 pb-24 px-3.5 pt-3">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-800 via-rose-800 to-slate-900 text-white rounded-3xl p-4 shadow-md border border-red-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-rose-300 flex items-center justify-center text-2xl font-black shrink-0 shadow-inner border border-white/10">
              🩸
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                <span className="text-[10px] font-bold text-rose-200 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-500/30">
                  خدمة إنسانية عاجلة
                </span>
              </div>
              <h2 className="text-base font-black text-white mt-0.5">بنك الدم واستغاثات التبرع</h2>
              <p className="text-[11px] text-rose-100/90">دير حافر - تلبية طلبات الفصائل النادرة والإسعافية</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-3.5 bg-white text-red-950 hover:bg-rose-50 font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
        >
          <Plus className="w-4 h-4 text-red-700" />
          <span>تسجيل طلب استغاثة تبرع بالدم</span>
        </button>
      </div>

      {/* Blood Type Filter Pills */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
          <Droplet className="w-3.5 h-3.5 text-red-600" />
          <span>تصفية حسب زمرة الدم المطلوب:</span>
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {bloodTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition shrink-0 border ${
                selectedType === type
                  ? 'bg-red-600 text-white border-red-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {type === 'all' ? 'جميع الزمر 🩸' : `فصيلة ${type}`}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>طلبات التبرع النشطة ({filteredRequests.length})</span>
          </h3>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs">
            <Droplet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">لا توجد نداءات تبرع مسجلة لهذه الفصيلة حالياً.</p>
            <p className="text-[11px] text-slate-400 mt-1">يمكنك إضافة طلب جديد بالضغط على الزر أعلاه.</p>
          </div>
        ) : (
          filteredRequests.map(req => (
            <div 
              key={req.id} 
              className={`bg-white rounded-2xl p-3.5 border shadow-xs transition ${
                req.isFulfilled 
                  ? 'border-slate-200 opacity-60' 
                  : req.urgency === 'critical' 
                    ? 'border-red-300 bg-red-50/20' 
                    : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black text-white shrink-0 shadow-sm ${
                    req.urgency === 'critical' ? 'bg-red-600' : 'bg-rose-700'
                  }`}>
                    <span className="text-sm leading-none">{req.bloodType}</span>
                    <span className="text-[9px] font-normal mt-0.5">{req.unitsNeeded} كيس</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-slate-900">{req.patientName}</h4>
                      {req.urgency === 'critical' && (
                        <span className="text-[9px] font-bold bg-red-100 text-red-700 px-2 py-0.2 rounded-full border border-red-200">
                          حالة حارجة جداً
                        </span>
                      )}
                      {req.isFulfilled && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
                          تم التلبية ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">المشفى: <strong>{req.hospital}</strong></p>
                    {req.notes && <p className="text-[10px] text-slate-500 mt-0.5 italic">"{req.notes}"</p>}
                    <p className="text-[9px] text-slate-400 mt-1">تاريخ الطلب: {req.createdAt}</p>
                  </div>
                </div>
              </div>

              {!req.isFulfilled && (
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100">
                  <a
                    href={`tel:${req.phone}`}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>اتصال للتبرع</span>
                  </a>
                  <button
                    onClick={() => onFulfillBloodRequest(req.id)}
                    className="bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 font-bold text-[11px] py-1.5 px-3 rounded-xl flex items-center justify-center gap-1 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم تأمين الدم</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-black text-slate-900">تسجيل نداء استغاثة للتبرع بالدم</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg w-6 h-6 flex items-center justify-center rounded-full bg-slate-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم المريض أو وصف الحالة *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="مثال: مريض بمركز الجراحة الإسعافية"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">زمرة الدم *</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none bg-white font-extrabold text-red-700"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">عدد الأكياس المطلوبة *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المشفى / المركز الطبي *</label>
                <input
                  type="text"
                  required
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="مثال: مشفى دير حافر الوطني"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">رقم هاتف المرافق أو للتبرع *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xxxxxxxx"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none font-mono dir-ltr"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">مستوى الاستعجال</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none bg-white"
                >
                  <option value="critical">حرجة للغاية (خلال ساعات)</option>
                  <option value="high">مستعجلة (خلال اليوم)</option>
                  <option value="normal">عادية (خلال أيام)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ملاحظات إضافية</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي تفاصيل أخرى توضح مكان التبرع والتواصل..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md"
                >
                  نشر طلب الاستغاثة
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-200"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
