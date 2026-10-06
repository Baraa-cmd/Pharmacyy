import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Phone, MapPin, Clock, Stethoscope, Pill } from 'lucide-react';
import { SpecialtyCategory, Doctor, Pharmacy } from '../types';
import { SPECIALTIES } from '../data/mockMedicalData';
import { addCustomDoctor, addCustomPharmacy, saveSubmission } from '../utils/storage';
import { saveDoctorToCloud, savePharmacyToCloud, saveUserSubmissionToCloud } from '../utils/firebaseService';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [listingType, setListingType] = useState<'doctor' | 'pharmacy'>('doctor');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState<SpecialtyCategory>('general');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [workingDays, setWorkingDays] = useState('');
  const [pharmacistName, setPharmacistName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (listingType === 'doctor') {
      const specObj = SPECIALTIES.find(s => s.id === specialty);
      const newDoctor: Doctor = {
        id: `custom-doc-${Date.now()}`,
        name: name.trim(),
        title: title.trim() || `طبيب أخصائي ${specObj?.name || ''}`,
        specialty: specialty,
        specialtyName: specObj?.name || 'طبيب عام',
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        address: address.trim() || 'دير حافر',
        landmark: landmark.trim(),
        workingDays: workingDays.trim() || 'السبت إلى الأربعاء',
        workingHours: workingHours.trim() || '9:00 ص - 2:00 ظ | 5:00 م - 8:00 م',
        isAvailableNow: true,
        experienceYears: 5,
        rating: 5.0,
        reviewsCount: 1,
        isVerified: false,
        notes: ''
      };
      addCustomDoctor(newDoctor);
      saveDoctorToCloud(newDoctor);
    } else {
      const newPharmacy: Pharmacy = {
        id: `custom-ph-${Date.now()}`,
        name: name.trim(),
        pharmacistName: pharmacistName.trim() || 'صيدلاني مجاز',
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        address: address.trim() || 'دير حافر',
        landmark: landmark.trim(),
        isDutyToday: false,
        dutyType: 'day',
        workingHours: workingHours.trim() || '8:30 ص - 9:00 م',
        isOpenNow: true,
        notes: '',
        services: ['قياس ضغط', 'حقن إبر']
      };
      addCustomPharmacy(newPharmacy);
      savePharmacyToCloud(newPharmacy);
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      type: listingType,
      name,
      categoryOrSpecialty: listingType === 'doctor' ? specialty : 'صيدلية',
      phone,
      whatsapp,
      address,
      workingHours,
      submittedAt: new Date().toISOString()
    };
    saveSubmission(newSub);
    saveUserSubmissionToCloud(newSub);

    setIsSuccess(true);
    onRefreshData();
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 animate-in slide-in-from-bottom-6 duration-200"
        dir="rtl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-right">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">إضافة منشأة طبية جديدة</h3>
              <p className="text-[11px] text-slate-500">سيتم إضافة البيانات للدليل فوراً محلياً وتخزينها للمراجعة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-base font-bold text-slate-800">تمت الإضافة بنجاح!</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              شكراً جزيلاً لك على مساهمتك الطيبة في بناء الدليل الطبي وتسهيل رعاية المرضى بالمدينة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-right">
            {/* Type selector */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setListingType('doctor')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  listingType === 'doctor' 
                    ? 'bg-white text-teal-800 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>إضافة عيادة طبيب</span>
              </button>
              <button
                type="button"
                onClick={() => setListingType('pharmacy')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  listingType === 'pharmacy' 
                    ? 'bg-white text-emerald-800 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Pill className="w-3.5 h-3.5" />
                <span>إضافة صيدلية</span>
              </button>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {listingType === 'doctor' ? 'اسم الطبيب بالكامل:' : 'اسم الصيدلية:'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={listingType === 'doctor' ? 'مثال: الدكتور خالد اليوسف' : 'مثال: صيدلية النور'}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
              />
            </div>

            {/* If doctor: specialty and title */}
            {listingType === 'doctor' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">التخصص:</label>
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value as SpecialtyCategory)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                    >
                      {SPECIALTIES.filter(s => s.id !== 'all').map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">الوصف الفرعي (اللقب الطبي):</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثال: أخصائي جراحة العظام والمفاصل"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الصيدلاني المسؤول:</label>
                <input
                  type="text"
                  value={pharmacistName}
                  onChange={(e) => setPharmacistName(e.target.value)}
                  placeholder="مثال: الصيدلاني نزار جاسم"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                />
              </div>
            )}

            {/* Phones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف للاتصال:</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xxxxxxxx"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">رقم الواتساب (اختياري):</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="09xxxxxxxx أو رمز دولي كامل"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Address & Landmark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">العنوان بالتفصيل:</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: دير حافر - الشارع العام"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">العلامة المميزة للوصول (اختياري):</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="مثال: بجانب ساحة الساعة"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Working Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">أيام الدوام:</label>
                <input
                  type="text"
                  value={workingDays}
                  onChange={(e) => setWorkingDays(e.target.value)}
                  placeholder="مثال: السبت إلى الخميس"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ساعات الدوام اليومي:</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="مثال: 9:00 ص - 2:00 ظ | 5:00 م - 8:30 م"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-2 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition active:scale-98"
              >
                حفظ وإضافة الآن
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
