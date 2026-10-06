import React, { useState } from 'react';
import { 
  Search, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  ChevronLeft, 
  Heart,
  Baby,
  HeartPulse,
  Users,
  Bone,
  Activity,
  Smile,
  Eye,
  Headphones,
  Stethoscope,
  Pill,
  ShieldCheck,
  Compass,
  Bell,
  HeartHandshake,
  DollarSign,
  Droplet,
  Printer
} from 'lucide-react';
import { Doctor, Pharmacy, EmergencyContact, SpecialtyCategory, TabType, Coordinates, HealthAlert, HumanitarianCase } from '../types';
import { SPECIALTIES } from '../data/mockMedicalData';
import { buildWhatsAppDoctorUrl, buildWhatsAppHumanitarianDonateUrl } from '../utils/storage';

interface HomeViewProps {
  doctors: Doctor[];
  pharmacies: Pharmacy[];
  emergencyContacts: EmergencyContact[];
  healthAlerts: HealthAlert[];
  humanitarianCases: HumanitarianCase[];
  onNavigateTab: (tab: TabType) => void;
  onSelectSpecialty: (specialty: SpecialtyCategory) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onOpenMedicineInquiry: (pharmacy: Pharmacy) => void;
  favoriteDoctorIds: string[];
  favoritePharmacyIds: string[];
  onToggleFavoriteDoctor: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenPrintModal?: () => void;
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

export const HomeView: React.FC<HomeViewProps> = ({
  doctors,
  pharmacies,
  emergencyContacts,
  healthAlerts,
  humanitarianCases,
  onNavigateTab,
  onSelectSpecialty,
  onSelectDoctor,
  onOpenMedicineInquiry,
  favoriteDoctorIds,
  onToggleFavoriteDoctor,
  onOpenAddModal,
  onOpenPrintModal,
  onOpenLocationModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Find duty pharmacies
  const dutyPharmacies = pharmacies.filter(p => p.isDutyToday);
  const primaryDutyPharmacy = dutyPharmacies[0] || pharmacies[0];

  // Available doctors right now
  const availableDoctors = doctors.filter(d => d.isAvailableNow).slice(0, 4);

  // Search filter across doctors & pharmacies
  const filteredDoctors = searchQuery.trim() ? doctors.filter(d => 
    d.name.includes(searchQuery.trim()) || 
    d.title.includes(searchQuery.trim()) ||
    d.specialtyName.includes(searchQuery.trim()) ||
    d.address.includes(searchQuery.trim())
  ) : [];

  const filteredPharmacies = searchQuery.trim() ? pharmacies.filter(p => 
    p.name.includes(searchQuery.trim()) ||
    p.address.includes(searchQuery.trim()) ||
    p.pharmacistName.includes(searchQuery.trim())
  ) : [];

  const iconMap: Record<string, any> = {
    Baby,
    HeartPulse,
    Users,
    Bone,
    Activity,
    Smile,
    Eye,
    Headphones,
    Sparkles,
    ShieldAlert,
    Stethoscope
  };

  const latestAlert = healthAlerts[0];
  const activeHumanitarianCases = humanitarianCases.filter(c => !c.isCompleted).slice(0, 2);

  return (
    <div className="space-y-4 pb-20 px-3.5 pt-3">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute right-3.5 w-4 h-4 text-teal-600 pointer-events-none" />
          <input
            id="home-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن طبيب، صيدلية، تخصص..."
            className="w-full bg-white text-xs pr-10 pl-9 py-3 rounded-2xl border border-slate-200/80 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>

        {/* Live Search Popup Results */}
        {searchQuery.trim() && (
          <div className="absolute top-full right-0 left-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-30 max-h-80 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-xs font-bold text-slate-700">
              <span>نتائج البحث عن "{searchQuery}"</span>
              <span className="text-[11px] text-teal-700 font-normal">
                {filteredDoctors.length + filteredPharmacies.length} نتيجة
              </span>
            </div>
            {filteredDoctors.length === 0 && filteredPharmacies.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-500">لا توجد نتائج مطابقة لبحثك.</p>
            ) : (
              <>
                {filteredDoctors.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-teal-800">الأطباء والعيادات:</p>
                    {filteredDoctors.map(doc => (
                      <div 
                        key={doc.id}
                        onClick={() => {
                          onSelectDoctor(doc);
                          setSearchQuery('');
                        }}
                        className="p-2 hover:bg-teal-50 rounded-xl cursor-pointer flex items-center justify-between transition border border-transparent hover:border-teal-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">👨‍⚕️</span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{doc.name}</p>
                            <p className="text-[10px] text-slate-500">{doc.specialtyName} | {doc.address}</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-medium">عرض</span>
                      </div>
                    ))}
                  </div>
                )}
                {filteredPharmacies.length > 0 && (
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-emerald-800">الصيدليات:</p>
                    {filteredPharmacies.map(ph => (
                      <div 
                        key={ph.id}
                        onClick={() => {
                          onNavigateTab('pharmacies');
                          setSearchQuery('');
                        }}
                        className="p-2 hover:bg-emerald-50 rounded-xl cursor-pointer flex items-center justify-between transition border border-transparent hover:border-emerald-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">💊</span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{ph.name}</p>
                            <p className="text-[10px] text-slate-500">{ph.address}</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-medium">عرض</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* 48. Health Alert Banner (Suggestion 48) */}
      {latestAlert && (
        <div 
          onClick={() => onNavigateTab('alerts')}
          className="cursor-pointer bg-amber-50 hover:bg-amber-100/80 p-3 rounded-2xl border border-amber-200 flex items-start gap-2.5 shadow-xs transition active:scale-98"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800 bg-amber-200/50 px-2 py-0.2 rounded">تنبيه صحي هام</span>
              <span className="text-[9px] text-slate-400">{latestAlert.date}</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 mt-1 truncate">{latestAlert.title}</h4>
            <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{latestAlert.content}</p>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-400 self-center shrink-0" />
        </div>
      )}

      {/* Compact Duty Pharmacy Card */}
      {primaryDutyPharmacy && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-3 shadow-md border border-emerald-600/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center text-xl shrink-0 shadow-inner">
                🏥
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    صيدلية المناوبة الحالية
                  </span>
                </div>
                <h3 className="text-sm font-black text-white truncate">{primaryDutyPharmacy.name}</h3>
                <p className="text-[11px] text-teal-100/90 truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>{primaryDutyPharmacy.address}</span>
                  <span className="text-teal-300/80">• {primaryDutyPharmacy.workingHours}</span>
                </p>
              </div>
            </div>

            <button 
              onClick={() => onNavigateTab('pharmacies')}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-teal-100 shrink-0 transition"
              title="عرض كل الصيدليات"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/10">
            <a 
              id="duty-call-btn"
              href={`tel:${primaryDutyPharmacy.phone}`}
              className="bg-white text-teal-950 hover:bg-teal-50 font-extrabold text-[11px] py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-sm active:scale-95 transition"
            >
              <Phone className="w-3 h-3 text-emerald-700" />
              <span>اتصال</span>
            </a>
            <button 
              id="duty-whatsapp-btn"
              onClick={() => onOpenMedicineInquiry(primaryDutyPharmacy)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-sm active:scale-95 transition"
            >
              <MessageCircle className="w-3 h-3" />
              <span>استفسار</span>
            </button>
            <button 
              id="duty-location-btn"
              onClick={() => {
                if (onOpenLocationModal) {
                  onOpenLocationModal({
                    title: primaryDutyPharmacy.name,
                    subtitle: primaryDutyPharmacy.pharmacistName,
                    type: 'pharmacy',
                    address: primaryDutyPharmacy.address,
                    landmark: primaryDutyPharmacy.landmark,
                    phone: primaryDutyPharmacy.phone,
                    whatsapp: primaryDutyPharmacy.whatsapp,
                    workingHours: primaryDutyPharmacy.workingHours,
                    coordinates: primaryDutyPharmacy.coordinates,
                    id: primaryDutyPharmacy.id
                  });
                } else {
                  onNavigateTab('map');
                }
              }}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-sm active:scale-95 transition"
            >
              <MapPin className="w-3 h-3 text-slate-950" />
              <span>الموقع</span>
            </button>
          </div>
        </div>
      )}

      {/* Fast Emergency Numbers Strip */}
      <div className="bg-rose-50/80 rounded-2xl p-3 border border-rose-100 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h4 className="text-xs font-bold text-rose-900">أرقام الإغاثة والنجدة السريعة</h4>
          </div>
          <button 
            onClick={() => onNavigateTab('emergency')}
            className="text-[10px] text-rose-700 hover:text-rose-900 font-bold flex items-center gap-0.5"
          >
            كل الأرقام
            <ChevronLeft className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <a 
            href="tel:0933000112"
            className="bg-white hover:bg-rose-100/50 p-2 rounded-xl text-center border border-rose-200 transition active:scale-95 flex flex-col items-center justify-center"
          >
            <span className="text-base mb-0.5">🚑</span>
            <span className="text-[11px] font-bold text-rose-900 leading-tight">الإسعاف السريع</span>
            <span className="text-[9px] text-rose-600 font-mono mt-0.5">0933000112</span>
          </a>
          <a 
            href="tel:0217654321"
            className="bg-white hover:bg-rose-100/50 p-2 rounded-xl text-center border border-rose-200 transition active:scale-95 flex flex-col items-center justify-center"
          >
            <span className="text-base mb-0.5">🏥</span>
            <span className="text-[11px] font-bold text-rose-900 leading-tight">المستوصف</span>
            <span className="text-[9px] text-rose-600 font-mono mt-0.5">0217654321</span>
          </a>
          <a 
            href="tel:113"
            className="bg-white hover:bg-rose-100/50 p-2 rounded-xl text-center border border-rose-200 transition active:scale-95 flex flex-col items-center justify-center"
          >
            <span className="text-base mb-0.5">🚒</span>
            <span className="text-[11px] font-bold text-rose-900 leading-tight">الدفاع المدني</span>
            <span className="text-[9px] text-rose-600 font-mono mt-0.5">113</span>
          </a>
        </div>
      </div>

      {/* Specialties Quick Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800">التخصصات والعيادات الطبية</h3>
            <p className="text-[10px] text-slate-500">اختر الاختصاص لفلترة وتصفح الأطباء</p>
          </div>
          <button 
            onClick={() => onNavigateTab('doctors')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-0.5"
          >
            كل الأطباء
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {SPECIALTIES.filter(s => s.id !== 'all').slice(0, 8).map((spec) => {
            const IconComponent = iconMap[spec.iconName] || Stethoscope;
            const count = doctors.filter(d => d.specialty === spec.id).length;
            return (
              <button
                key={spec.id}
                onClick={() => {
                  onSelectSpecialty(spec.id);
                  onNavigateTab('doctors');
                }}
                className="bg-white hover:bg-teal-50/70 p-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center transition-all hover:border-teal-200 active:scale-95 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition ${spec.color}`}>
                  <IconComponent className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-teal-800 leading-tight">
                  {spec.name}
                </span>
                <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                  {count} {count === 1 ? 'طبيب' : 'أطباء'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 49. Humanitarian Medical Cases Section (Suggestion 49) */}
      {activeHumanitarianCases.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-black text-slate-800">الحالات الإنسانية المفتوحة</h3>
            </div>
            <button 
              onClick={() => onNavigateTab('humanitarian')}
              className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-0.5"
            >
              تصفح الحالات
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeHumanitarianCases.map((c) => {
              const req = parseFloat(c.requiredAmount.replace(/[^0-9]/g, '')) || 1;
              const col = parseFloat(c.collectedAmount.replace(/[^0-9]/g, '')) || 0;
              const percent = Math.min(100, Math.round((col / req) * 100));
              return (
                <div 
                  key={c.id}
                  className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{c.title}</h4>
                      <p className="text-[10px] text-slate-500">المريض: {c.patientName} ({c.age})</p>
                    </div>
                    <span className="text-[9px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded shrink-0">حالة نشطة</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{c.condition}</p>
                  
                  {/* Donation Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">المجموع: {c.collectedAmount}</span>
                      <span className="font-extrabold text-teal-700">{percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span>الهدف: {c.requiredAmount}</span>
                    </div>
                  </div>
                  
                  <a 
                    href={buildWhatsAppHumanitarianDonateUrl(c.phone, c.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition text-center border border-teal-200/80"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>مساهمة وتبرع مالي</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Doctors Right Now */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-sm font-black text-slate-800">أطباء متواجدون بالعيادة الآن</h3>
          </div>
          <button 
            onClick={() => {
              onSelectSpecialty('all');
              onNavigateTab('doctors');
            }}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-0.5"
          >
            كل الأطباء
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-2.5">
          {availableDoctors.map((doc) => {
            const isFav = favoriteDoctorIds.includes(doc.id);
            return (
              <div 
                key={doc.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div 
                    onClick={() => onSelectDoctor(doc)}
                    className="flex items-start gap-3 cursor-pointer flex-1"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-lg shrink-0 border border-teal-100">
                      👨‍⚕️
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-black text-slate-900">{doc.name}</h4>
                        <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.2 rounded-md font-bold">
                          {doc.specialtyName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{doc.title}</p>
                      
                      <p className="text-[11px] text-slate-700 mt-1 flex items-start gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-tight">{doc.address} {doc.landmark ? `(${doc.landmark})` : ''}</span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onToggleFavoriteDoctor(doc.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition shrink-0"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                  <a 
                    href={`tel:${doc.phone}`}
                    className="bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition active:scale-95 text-center"
                  >
                    <Phone className="w-3 h-3 text-teal-700 shrink-0" />
                    <span>اتصال</span>
                  </a>
                  {doc.whatsapp ? (
                    <a 
                      href={buildWhatsAppDoctorUrl(doc.whatsapp, doc.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition active:scale-95 text-center"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>واتساب</span>
                    </a>
                  ) : (
                    <button 
                      onClick={() => onSelectDoctor(doc)}
                      className="bg-slate-50 text-slate-500 text-[11px] py-2 px-1 rounded-xl"
                    >
                      تفاصيل
                    </button>
                  )}
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
                      } else {
                        onNavigateTab('map');
                      }
                    }}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition active:scale-95 text-center border border-amber-200/80"
                  >
                    <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
                    <span>خريطة</span>
                  </button>
                  <button 
                    onClick={() => onSelectDoctor(doc)}
                    className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold text-center"
                  >
                    عرض المزيد
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Add Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-3.5 rounded-2xl border border-teal-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-base shrink-0">
            +
          </div>
          <div>
            <h4 className="text-xs font-bold text-teal-950">هل أنت طبيب أو صيدلاني بالمدينة؟</h4>
            <p className="text-[10px] text-teal-700">ساهم معنا بإضافة عيادتك أو صيدليتك مجاناً</p>
          </div>
        </div>
        <button 
          onClick={onOpenAddModal}
          className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition active:scale-95 shrink-0"
        >
          أضف الآن
        </button>
      </div>
    </div>
  );
};
