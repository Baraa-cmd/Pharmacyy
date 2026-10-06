import React, { useState } from 'react';
import { Search, Plus, Pill, Phone, MessageCircle, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { MedicineInquiry, Pharmacy } from '../types';

interface MedicineSearchViewProps {
  pharmacies: Pharmacy[];
  medicineInquiries: MedicineInquiry[];
  onAddInquiry: (inquiry: MedicineInquiry) => void;
  onResolveInquiry: (id: string) => void;
}

export const MedicineSearchView: React.FC<MedicineSearchViewProps> = ({
  pharmacies,
  medicineInquiries,
  onAddInquiry,
  onResolveInquiry
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [medicineName, setMedicineName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');

  const filteredInquiries = medicineInquiries.filter(iq => 
    iq.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    iq.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName || !patientPhone) return;

    const newInquiry: MedicineInquiry = {
      id: `mi-${Date.now()}`,
      medicineName,
      patientPhone,
      notes,
      createdAt: 'الآن',
      isFound: false
    };

    onAddInquiry(newInquiry);
    setIsModalOpen(false);
    setMedicineName('');
    setPatientPhone('');
    setNotes('');
  };

  return (
    <div className="space-y-4 pb-24 px-3.5 pt-3">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white rounded-3xl p-4 shadow-md border border-teal-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-teal-300 flex items-center justify-center text-2xl font-black shrink-0 shadow-inner border border-white/10">
            💊
          </div>
          <div>
            <span className="text-[10px] font-bold text-teal-200 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-500/30">
              قسم البحث السريع
            </span>
            <h2 className="text-base font-black text-white mt-0.5">خدمة البحث عن الدواء المفقود</h2>
            <p className="text-[11px] text-teal-100/90">دير حافر - الربط المباشر بين المرضى وصيدليات المدينة</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-3.5 bg-white text-teal-950 hover:bg-teal-50 font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>طلب دواء غير متوفر بمدينة دير حافر</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-teal-600 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث باسم الدواء المطلوبة في طلبات الأهالي..."
          className="w-full bg-white text-xs pr-10 pl-4 py-3 rounded-2xl border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />
      </div>

      {/* List of Medicine Requests */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
          <Pill className="w-4 h-4 text-emerald-600" />
          <span>قائمة الأدوية المفقودة المطلوبة حالياً ({filteredInquiries.length})</span>
        </h3>

        {filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs">
            <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">لا توجد طلبات أدوية مفقودة مطابقة لبحثك.</p>
            <p className="text-[11px] text-slate-400 mt-1">يمكنك تسجيل طلبك ليظهر للصيدليات والأهالي.</p>
          </div>
        ) : (
          filteredInquiries.map(iq => (
            <div 
              key={iq.id}
              className={`bg-white rounded-2xl p-3.5 border shadow-xs transition ${
                iq.isFound ? 'border-slate-200 opacity-60' : 'border-teal-100 bg-teal-50/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black shrink-0 text-lg">
                    💊
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-slate-900">{iq.medicineName}</h4>
                      {iq.isFound ? (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
                          تم العثور عليه ✓
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full">
                          مطلوب حالياً
                        </span>
                      )}
                    </div>
                    {iq.notes && <p className="text-[11px] text-slate-600 mt-1">{iq.notes}</p>}
                    <p className="text-[9px] text-slate-400 mt-1">تاريخ الطلب: {iq.createdAt}</p>
                  </div>
                </div>
              </div>

              {!iq.isFound && (
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100">
                  <a
                    href={`tel:${iq.patientPhone}`}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>لدي هذا الدواء (اتصال)</span>
                  </a>
                  <button
                    onClick={() => onResolveInquiry(iq.id)}
                    className="bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 font-bold text-[11px] py-1.5 px-3 rounded-xl flex items-center justify-center gap-1 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم توفير الدواء</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">تسجيل طلب دواء مفقود</h3>
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
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم الدواء المطلوب بالتفصيل *</label>
                <input
                  type="text"
                  required
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="مثال: انسولين لانتوس (Lantus Pen) 100iu"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف للتواصل أو الواتساب *</label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="09xxxxxxxx"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-mono dir-ltr"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">تفاصيل إضافية أو العيار</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اذكر كمية الجرعات المطلوبة أو أي بدائل مسموحة..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md"
                >
                  نشر طلب الدواء المفقود
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
