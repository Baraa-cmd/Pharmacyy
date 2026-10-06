import React, { useState } from 'react';
import { 
  Search, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Heart, 
  ShieldCheck, 
  Star, 
  Stethoscope
} from 'lucide-react';
import { Doctor, SpecialtyCategory, Coordinates } from '../types';
import { SPECIALTIES } from '../data/mockMedicalData';
import { buildWhatsAppDoctorUrl } from '../utils/storage';

interface DoctorsViewProps {
  doctors: Doctor[];
  selectedSpecialty: SpecialtyCategory;
  onSelectSpecialty: (specialty: SpecialtyCategory) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  favoriteDoctorIds: string[];
  onToggleFavoriteDoctor: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenLocationModal?: (item: {
    title: string;
    subtitle?: string;
    type: 'doctor' | 'pharmacy' | 'center' | 'emergency';
    address: string;
    landmark?: string;
    phone?: string;
    whatsapp?: string;
    workingHours?: string;
    coordinates?: Coordinates;
    id?: string;
  }) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  doctors,
  selectedSpecialty,
  onSelectSpecialty,
  onSelectDoctor,
  favoriteDoctorIds,
  onToggleFavoriteDoctor,
  onOpenAddModal,
  onOpenLocationModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(false);

  // Filtering
  const filteredDoctors = doctors.filter((doc) => {
    // Specialty match
    if (selectedSpecialty !== 'all' && doc.specialty !== selectedSpecialty) {
      return false;
    }
    // Availability match
    if (onlyAvailableNow && !doc.isAvailableNow) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchSpecialty = doc.specialtyName.toLowerCase().includes(q);
      const matchAddress = doc.address.toLowerCase().includes(q);
      const matchLandmark = (doc.landmark || '').toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchSpecialty && !matchAddress && !matchLandmark) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-3.5 pb-24 px-3.5 pt-3">
      {/* Header & Search */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">دليل الأطباء بدير حافر</h2>
            <p className="text-[11px] text-slate-500">
              {filteredDoctors.length} {filteredDoctors.length === 1 ? 'عيادة متوفرة' : 'عيادات متوفرة'}
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold px-3 py-1.5 rounded-xl border border-teal-200/80 transition"
          >
            + أضف عيادة
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-teal-600 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن طبيب بالاسم، التخصص أو العنوان..."
            className="w-full bg-white text-xs pr-10 pl-9 py-2.5 rounded-2xl border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>

        {/* Specialty Scroll Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar pt-0.5" dir="rtl">
          {SPECIALTIES.map((spec) => {
            const isSelected = selectedSpecialty === spec.id;
            return (
              <button
                key={spec.id}
                onClick={() => onSelectSpecialty(spec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-sm scale-102'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {spec.name}
              </button>
            );
          })}
        </div>

        {/* Quick Filters: Availability Toggle */}
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200/70 text-xs">
          <button
            onClick={() => setOnlyAvailableNow(!onlyAvailableNow)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition ${
              onlyAvailableNow
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyAvailableNow ? 'bg-white' : 'bg-emerald-500'}`}></span>
            <span>مفتوح الآن فقط</span>
          </button>
          {selectedSpecialty !== 'all' && (
            <button
              onClick={() => onSelectSpecialty('all')}
              className="text-[11px] text-rose-600 font-bold hover:underline"
            >
              إعادة فلترة
            </button>
          )}
        </div>
      </div>

      {/* Doctor Cards List */}
      <div className="space-y-3">
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
            <span className="text-3xl">👨‍⚕️</span>
            <h4 className="text-sm font-bold text-slate-800">لا توجد عيادات مطابقة</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              لم نجد أي عيادة تطابق خيارات التصفية الحالية، يرجى إعادة تعيين خيارات البحث.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectSpecialty('all');
                setOnlyAvailableNow(false);
              }}
              className="mt-2 text-xs bg-teal-700 text-white font-bold px-4 py-2 rounded-xl"
            >
              عرض كل العيادات
            </button>
          </div>
        ) : (
          filteredDoctors.map((doc) => {
            const isFav = favoriteDoctorIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-teal-300 transition"
              >
                {/* Top: Name & Badges */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xl shrink-0 border border-teal-100">
                      👨‍⚕️
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-black text-slate-900">{doc.name}</h3>
                        <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-bold">
                          {doc.specialtyName}
                        </span>
                        {doc.isVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            موثق
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">{doc.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleFavoriteDoctor(doc.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition shrink-0"
                    title="حفظ في المفضلة"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Details Grid */}
                <div className="mt-3 bg-slate-50/80 rounded-xl p-2.5 text-xs text-slate-700 space-y-1.5 border border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <span className="font-semibold text-slate-900">{doc.address}</span>
                      {doc.landmark && (
                        <span className="text-slate-600 block mt-0.5">العلامة المميزة: {doc.landmark}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 text-xs pt-0.5 border-t border-slate-200/50">
                    <Clock className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <span className="leading-relaxed"><strong className="text-slate-900">أيام الدوام:</strong> {doc.workingDays} | {doc.workingHours}</span>
                  </div>
                  {doc.notes && (
                    <div className="text-[11px] text-teal-900 bg-teal-50/60 p-2 rounded-lg border border-teal-100 mt-1 leading-relaxed">
                      ملاحظة: {doc.notes}
                    </div>
                  )}
                  {/* Availability badge */}
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    {doc.isAvailableNow ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        متاح الآن بالعيادة
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">مغلق حالياً</span>
                    )}
                    {doc.rating && (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {doc.rating} ({doc.reviewsCount} تقييم)
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                  <a
                    href={`tel:${doc.phone}`}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2 px-1 rounded-xl flex items-center justify-center gap-1 shadow-xs active:scale-95 transition text-center"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>اتصال</span>
                  </a>
                  {doc.whatsapp ? (
                    <a
                      href={buildWhatsAppDoctorUrl(doc.whatsapp, doc.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-1 rounded-xl flex items-center justify-center gap-1 shadow-xs active:scale-95 transition text-center"
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>واتساب</span>
                    </a>
                  ) : (
                    <div className="bg-slate-100 text-slate-400 text-xs py-2 px-1 rounded-xl flex items-center justify-center text-center">
                      <span>-</span>
                    </div>
                  )}
                  {/* Location / Map Button */}
                  <button
                    onClick={() => {
                      if (onOpenLocationModal) {
                        onOpenLocationModal({
                          title: doc.name,
                          subtitle: `${doc.specialtyName} | ${doc.title}`,
                          type: 'doctor',
                          address: doc.address,
                          landmark: doc.landmark,
                          phone: doc.phone,
                          whatsapp: doc.whatsapp,
                          workingHours: `${doc.workingDays}: ${doc.workingHours}`,
                          coordinates: doc.coordinates,
                          id: doc.id
                        });
                      }
                    }}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition active:scale-95 text-center border border-amber-200"
                    title="عرض الموقع الجغرافي"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>موقع</span>
                  </button>
                  <button
                    onClick={() => onSelectDoctor(doc)}
                    className="py-2 px-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition text-center"
                  >
                    تفاصيل
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
