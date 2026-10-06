import React from 'react';
import { Doctor } from '../types';
import { 
  X, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Award, 
  Star, 
  Info,
  Map
} from 'lucide-react';
import { buildWhatsAppDoctorUrl } from '../utils/storage';

interface DoctorDetailsModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenLocationModal?: (item: any) => void;
}

export const DoctorDetailsModal: React.FC<DoctorDetailsModalProps> = ({
  doctor,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenLocationModal
}) => {
  if (!isOpen || !doctor) return null;

  const handleShare = async () => {
    const text = `دليلي الطبي - دير حافر:\n${doctor.name} - ${doctor.title}\nالعنوان: ${doctor.address} (${doctor.landmark || ''})\nالدوام: ${doctor.workingDays} (${doctor.workingHours})\nرقم التواصل: ${doctor.phone}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: doctor.name, text });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('تم نسخ تفاصيل العيادة بنجاح لمشاركتها!');
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
        dir="rtl"
      >
        {/* Header with image/pattern */}
        <div className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white p-5 rounded-t-3xl text-right">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-md font-bold">
                {doctor.specialtyName}
              </span>
              {doctor.isVerified && (
                <span className="inline-flex items-center gap-1 bg-emerald-500/30 text-emerald-300 text-xs px-2 py-0.5 rounded-full border border-emerald-400/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  حساب موثق
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleFavorite(doctor.id)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                title="إضافة للمفضلة"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-400 fill-rose-400' : 'text-white'}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                title="مشاركة تفاصيل الطبيب"
              >
                <Share2 className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                title="إغلاق"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          
          <div className="flex items-start gap-3.5 mt-2">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-2xl shrink-0 shadow-inner">
              👨‍⚕️
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">{doctor.name}</h2>
              <p className="text-teal-100 text-xs mt-1 leading-relaxed">{doctor.title}</p>
              
              <div className="flex items-center gap-3 mt-2 text-xs text-teal-200">
                {doctor.experienceYears && (
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    خبرة {doctor.experienceYears} سنوات
                  </span>
                )}
                {doctor.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {doctor.rating} ({doctor.reviewsCount || 20}+ مراجعة)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-slate-700 text-right">
          {/* Status badge */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-600">الحالة الميدانية للعيادة الآن:</span>
            {doctor.isAvailableNow ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                مفتوح الآن لاستقبال المرضى
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                مغلق حالياً
              </span>
            )}
          </div>

          {/* Working Schedule */}
          <div className="bg-teal-50/60 rounded-2xl p-4 border border-teal-100 space-y-2.5">
            <h3 className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-700" />
              أوقات الدوام الرسمي في العيادة
            </h3>
            <div className="text-xs space-y-1 text-slate-700 pr-5">
              <p><span className="font-semibold text-slate-900">أيام الدوام:</span> {doctor.workingDays}</p>
              <p className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span className="font-semibold text-slate-900">ساعات الدوام:</span> {doctor.workingHours}
              </p>
            </div>
          </div>

          {/* Location & Landmark with Location Action Button */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                العنوان بالتفصيل
              </h3>
              
              <button
                onClick={() => {
                  if (onOpenLocationModal) {
                    onOpenLocationModal({
                      title: doctor.name,
                      subtitle: `${doctor.specialtyName} | ${doctor.title}`,
                      type: 'doctor',
                      address: doctor.address,
                      landmark: doctor.landmark,
                      phone: doctor.phone,
                      whatsapp: doctor.whatsapp,
                      workingHours: `${doctor.workingDays}: ${doctor.workingHours}`,
                      coordinates: doctor.coordinates,
                      id: doctor.id
                    });
                  }
                }}
                className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-xl border border-amber-300 flex items-center gap-1 transition"
              >
                <Map className="w-3.5 h-3.5 text-amber-800" />
                <span>الخريطة والموقع</span>
              </button>
            </div>
            <div className="text-xs space-y-1.5 text-slate-700 pr-2">
              <p className="font-medium text-slate-900 leading-relaxed">{doctor.address}</p>
              {doctor.landmark && (
                <p className="text-teal-800 bg-teal-100/70 inline-block px-2.5 py-1 rounded-lg text-xs font-semibold">
                  العلامة المميزة: {doctor.landmark}
                </p>
              )}
            </div>
          </div>

          {/* Notes & Equipment */}
          {doctor.notes && (
            <div className="bg-amber-50/70 rounded-2xl p-3.5 border border-amber-200/70 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                {doctor.notes}
              </p>
            </div>
          )}
        </div>

        {/* Action Bottom Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2.5">
          <a
            id={`modal-call-btn-${doctor.id}`}
            href={`tel:${doctor.phone}`}
            className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
          >
            <Phone className="w-4 h-4" />
            <span>اتصال عيادة</span>
          </a>
          {doctor.whatsapp && (
            <a
              id={`modal-whatsapp-btn-${doctor.id}`}
              href={buildWhatsAppDoctorUrl(doctor.whatsapp, doctor.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>مراسلة واتساب</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
