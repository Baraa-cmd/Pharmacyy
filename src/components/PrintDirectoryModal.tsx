import React from 'react';
import { Printer, X, Download, ShieldCheck, MapPin, Phone, FileText } from 'lucide-react';
import { Doctor, Pharmacy, EmergencyContact } from '../types';

interface PrintDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  pharmacies: Pharmacy[];
  emergencyContacts: EmergencyContact[];
}

export const PrintDirectoryModal: React.FC<PrintDirectoryModalProps> = ({
  isOpen,
  onClose,
  doctors,
  pharmacies,
  emergencyContacts
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 w-full max-w-2xl shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">طباعة واستخراج الدليل الطبي الورقي</h3>
              <p className="text-[11px] text-slate-500">نسخة جاهزة للطباعة وتعليقها بالمنازل والمحلات بمدينة دير حافر</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg w-7 h-7 flex items-center justify-center rounded-full bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons for Print */}
        <div className="flex items-center justify-between bg-teal-50 p-3 rounded-2xl border border-teal-200 print:hidden">
          <span className="text-xs font-bold text-teal-900">جاهز للطباعة أو الحفظ كملف PDF</span>
          <button
            onClick={handlePrint}
            className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الدليل الآن 🖨️</span>
          </button>
        </div>

        {/* Print Printable Sheet */}
        <div className="p-6 border border-slate-300 rounded-2xl space-y-6 bg-white text-slate-900 font-sans" id="printable-directory-sheet">
          {/* Sheet Header */}
          <div className="text-center border-b-2 border-teal-800 pb-4 space-y-1">
            <h1 className="text-xl font-black text-teal-950">الدليل الطبي الموحد - مدينة دير حافر وقراها</h1>
            <p className="text-xs font-bold text-slate-600">جدول أرقام الطوارئ والعيادات وصيدليات المناوبة</p>
            <p className="text-[10px] text-slate-400">تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>

          {/* Emergency Section */}
          <div className="space-y-2">
            <h2 className="text-sm font-black text-rose-800 border-r-4 border-rose-600 pr-2">أرقام الطوارئ والإسعاف السريع</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {emergencyContacts.map(ec => (
                <div key={ec.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                  <span className="font-bold">{ec.name}</span>
                  <span className="font-mono font-black text-rose-700 dir-ltr">{ec.phone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Doctors Section */}
          <div className="space-y-2">
            <h2 className="text-sm font-black text-teal-800 border-r-4 border-teal-600 pr-2">قائمة أطباء دير حافر والعيادات</h2>
            <table className="w-full text-xs text-right border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold">
                  <th className="p-1.5 border border-slate-300">اسم الطبيب</th>
                  <th className="p-1.5 border border-slate-300">التخصص</th>
                  <th className="p-1.5 border border-slate-300">العنوان والعيادة</th>
                  <th className="p-1.5 border border-slate-300">رقم التواصل</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doc => (
                  <tr key={doc.id} className="border-b border-slate-200">
                    <td className="p-1.5 border border-slate-300 font-bold">{doc.name}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-700">{doc.specialtyName}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-600">{doc.address}</td>
                    <td className="p-1.5 border border-slate-300 font-mono font-bold text-teal-800 dir-ltr">{doc.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pharmacies Section */}
          <div className="space-y-2">
            <h2 className="text-sm font-black text-emerald-800 border-r-4 border-emerald-600 pr-2">الصيدليات بمدينة دير حافر</h2>
            <table className="w-full text-xs text-right border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold">
                  <th className="p-1.5 border border-slate-300">اسم الصيدلية</th>
                  <th className="p-1.5 border border-slate-300">الصيدلي المسؤول</th>
                  <th className="p-1.5 border border-slate-300">العنوان</th>
                  <th className="p-1.5 border border-slate-300">الهاتف</th>
                </tr>
              </thead>
              <tbody>
                {pharmacies.map(ph => (
                  <tr key={ph.id} className="border-b border-slate-200">
                    <td className="p-1.5 border border-slate-300 font-bold">{ph.name}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-700">{ph.pharmacistName}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-600">{ph.address}</td>
                    <td className="p-1.5 border border-slate-300 font-mono font-bold text-emerald-800 dir-ltr">{ph.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sheet Footer */}
          <div className="text-center pt-4 border-t border-slate-200 text-[10px] text-slate-500">
            تم استخراج هذا الدليل من تطبيق "صحتك - دليلي الطبي بمدينة دير حافر"
          </div>
        </div>
      </div>
    </div>
  );
};
