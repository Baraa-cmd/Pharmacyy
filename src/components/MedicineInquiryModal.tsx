import React, { useState } from 'react';
import { Pharmacy } from '../types';
import { X, Send, Pill, AlertCircle } from 'lucide-react';
import { buildWhatsAppPharmacyMedicineUrl } from '../utils/storage';

interface MedicineInquiryModalProps {
  pharmacy: Pharmacy | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineInquiryModal: React.FC<MedicineInquiryModalProps> = ({
  pharmacy,
  isOpen,
  onClose,
}) => {
  const [medicineName, setMedicineName] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen || !pharmacy) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = pharmacy.whatsapp || pharmacy.phone;
    const combinedQuery = medicineName.trim() + (note.trim() ? ` (ملاحظات: ${note.trim()})` : '');
    const url = buildWhatsAppPharmacyMedicineUrl(cleanPhone, pharmacy.name, combinedQuery);
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 animate-in slide-in-from-bottom-6 duration-200"
        dir="rtl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-slate-800 text-sm">استفسار عن دواء محدد</h3>
              <p className="text-xs text-slate-500">{pharmacy.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم الدواء المطلوب (عربي أو إنجليزي):
            </label>
            <input
              type="text"
              required
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="مثال: بنادول، سيروفلوكسين، أسبيرين..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              عيار الدواء أو أي ملاحظات أخرى (اختياري):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثال: عيار 500 ملغ، شراب وليس حبوب"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-start gap-2 text-xs text-emerald-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <p className="leading-relaxed">
              سيقوم هذا النموذج بإنشاء رسالة واتساب منسقة ومؤتمتة وإرسالها فوراً إلى هاتف الصيدلي للتأكد من توفر الدواء لديه وتوفير عناء المشوار عليك.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال عبر واتساب</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
