import React, { useState } from 'react';
import { 
  Search, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Heart, 
  Moon
} from 'lucide-react';
import { Pharmacy, Coordinates } from '../types';

interface PharmaciesViewProps {
  pharmacies: Pharmacy[];
  favoritePharmacyIds: string[];
  onToggleFavoritePharmacy: (id: string) => void;
  onOpenMedicineInquiry: (pharmacy: Pharmacy) => void;
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

export const PharmaciesView: React.FC<PharmaciesViewProps> = ({
  pharmacies,
  favoritePharmacyIds,
  onToggleFavoritePharmacy,
  onOpenMedicineInquiry,
  onOpenAddModal,
  onOpenLocationModal
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'duty' | 'open'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPharmacies = pharmacies.filter((ph) => {
    if (activeFilter === 'duty' && !ph.isDutyToday) return false;
    if (activeFilter === 'open' && !ph.isOpenNow) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = ph.name.toLowerCase().includes(q);
      const matchAddress = ph.address.toLowerCase().includes(q);
      const matchPharmacist = ph.pharmacistName.toLowerCase().includes(q);
      const matchLandmark = (ph.landmark || '').toLowerCase().includes(q);
      if (!matchName && !matchAddress && !matchPharmacist && !matchLandmark) return false;
    }
    return true;
  });

  return (
    <div className="space-y-3.5 pb-24 px-3.5 pt-3">
      {/* Title & Add */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900">دليل الصيدليات وصيدليات المناوبة</h2>
          <p className="text-[11px] text-slate-500">
            أرقام ومواقع وعناوين الصيدليات بدير حافر
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200/80 transition"
        >
          + أضف صيدلية
        </button>
      </div>

      {/* On-duty notice card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-3.5 shadow-sm border border-emerald-700/50">
        <div className="flex items-center gap-2 mb-1.5">
          <Moon className="w-4 h-4 text-amber-300 fill-amber-300" />
          <h3 className="text-xs font-bold text-white">صيدليات المناوبة الليلية (الطوارئ)</h3>
        </div>
        <p className="text-[11px] text-emerald-100 leading-relaxed">
          تتناوب الصيدليات في المدينة ليلاً لتأمين الأدوية الإسعافية الطارئة. في حال عدم توفر دواء معين، يمكنك الضغط على زر "استفسار دواء" للاتصال بالصيدلية المناوبة مباشرة عبر واتساب.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-emerald-600 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن صيدلية، صيدلاني، أو منطقة..."
          className="w-full bg-white text-xs pr-10 pl-9 py-2.5 rounded-2xl border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeFilter === 'all'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          كل الصيدليات ({pharmacies.length})
        </button>
        <button
          onClick={() => setActiveFilter('duty')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeFilter === 'duty'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Moon className="w-3 h-3" />
          <span>المناوبة ({pharmacies.filter(p => p.isDutyToday).length})</span>
        </button>
        <button
          onClick={() => setActiveFilter('open')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeFilter === 'open'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>المفتوحة الآن</span>
        </button>
      </div>

      {/* Pharmacies List */}
      <div className="space-y-3">
        {filteredPharmacies.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
            <span className="text-3xl">💊</span>
            <h4 className="text-sm font-bold text-slate-800">لا توجد صيدليات مطابقة</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              لم نجد أي صيدلية مطابقة لخيارات التصفية الحالية، يرجى تصفير البحث أو مراجعة تبويب المناوبة.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-2 text-xs bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl"
            >
              عرض كل الصيدليات
            </button>
          </div>
        ) : (
          filteredPharmacies.map((ph) => {
            const isFav = favoritePharmacyIds.includes(ph.id);
            return (
              <div
                key={ph.id}
                className={`bg-white rounded-2xl p-4 border transition ${
                  ph.isDutyToday 
                    ? 'border-emerald-300 shadow-xs ring-1 ring-emerald-400/20' 
                    : 'border-slate-200/90 shadow-xs hover:border-emerald-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 border ${
                      ph.isDutyToday 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      💊
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-black text-slate-900">{ph.name}</h3>
                        {ph.isDutyToday && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Moon className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                            مناوبة {ph.dutyType === '24h' ? '(24 ساعة)' : '(ليلية)'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{ph.pharmacistName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleFavoritePharmacy(ph.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition shrink-0"
                    title="حفظ الصيدلية"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="mt-3 bg-slate-50/90 rounded-xl p-2.5 text-xs text-slate-700 space-y-1.5 border border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <span className="font-semibold text-slate-900">{ph.address}</span>
                      {ph.landmark && (
                        <span className="text-slate-600 block mt-0.5">العلامة المميزة: {ph.landmark}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 text-xs pt-0.5 border-t border-slate-200/50">
                    <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="leading-relaxed"><strong className="text-slate-900">ساعات الدوام اليومي:</strong> {ph.workingHours}</span>
                  </div>
                  {/* Services Chips */}
                  {ph.services && ph.services.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {ph.services.map((svc, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  )}
                  {ph.notes && (
                    <p className="text-[11px] text-emerald-900 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100/80 font-medium leading-relaxed">
                      ملاحظة: {ph.notes}
                    </p>
                  )}
                </div>

                {/* Action Buttons: Call, Inquiry, Location */}
                <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                  <a
                    href={`tel:${ph.phone}`}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-1.5 rounded-xl flex items-center justify-center gap-1 shadow-xs active:scale-95 transition text-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>اتصال صيدلي</span>
                  </a>
                  <button
                    onClick={() => onOpenMedicineInquiry(ph)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-1.5 rounded-xl flex items-center justify-center gap-1 shadow-xs active:scale-95 transition text-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>استفسار دواء</span>
                  </button>
                  {/* Location Button */}
                  <button
                    onClick={() => {
                      if (onOpenLocationModal) {
                        onOpenLocationModal({
                          title: ph.name,
                          subtitle: ph.pharmacistName,
                          type: 'pharmacy',
                          address: ph.address,
                          landmark: ph.landmark,
                          phone: ph.phone,
                          whatsapp: ph.whatsapp,
                          workingHours: ph.workingHours,
                          coordinates: ph.coordinates,
                          id: ph.id
                        });
                      }
                    }}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs py-2 px-1.5 rounded-xl flex items-center justify-center gap-1 border border-amber-200 transition active:scale-95 text-center"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>الموقع</span>
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
