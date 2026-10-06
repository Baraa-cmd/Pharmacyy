import React, { useState } from 'react';
import { 
  Phone, 
  ShieldAlert, 
  Activity, 
  Flame, 
  Bone, 
  Droplet, 
  Zap, 
  AlertTriangle, 
  Building2, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Clock,
  HeartPulse
} from 'lucide-react';
import { EmergencyContact, MedicalCenter, Coordinates } from '../types';
import { FIRST_AID_TOPICS } from '../data/mockMedicalData';
import { buildWhatsAppLabUrl } from '../utils/storage';

interface EmergencyViewProps {
  emergencyContacts: EmergencyContact[];
  medicalCenters: MedicalCenter[];
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

export const EmergencyView: React.FC<EmergencyViewProps> = ({
  emergencyContacts,
  medicalCenters,
  onOpenLocationModal
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'hotlines' | 'centers' | 'firstaid'>('hotlines');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>('fa-1');

  const topicIconMap: Record<string, any> = {
    Flame,
    Bone,
    Activity,
    Zap,
    Droplet
  };

  return (
    <div className="space-y-4 pb-24 px-3.5 pt-3">
      {/* Title */}
      <div>
        <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>قسم الإغاثة والخدمات العاجلة</span>
        </h2>
        <p className="text-[11px] text-slate-500">
          دليل الأرقام السريعة، مستشفيات المدينة، وموسوعة الإسعاف الأولي
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setSelectedSubTab('hotlines')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            selectedSubTab === 'hotlines'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>خطوط الطوارئ</span>
        </button>
        <button
          onClick={() => setSelectedSubTab('centers')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            selectedSubTab === 'centers'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>المشافي والمختبرات</span>
        </button>
        <button
          onClick={() => setSelectedSubTab('firstaid')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            selectedSubTab === 'firstaid'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>مسعف منزلي</span>
        </button>
      </div>

      {/* 1. Hotlines SubTab */}
      {selectedSubTab === 'hotlines' && (
        <div className="space-y-3">
          <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-xs text-rose-950 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>تنبيه طبي عاجل:</strong> في حال إصابة خطيرة لا تحرك المريض عشوائياً، بل اتصل بالإسعاف مباشرة عبر الأزرار السريعة أدناه واطلب التوجيه الطبي المباشر.
            </p>
          </div>
          <div className="space-y-2.5">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-rose-300 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center text-xl shrink-0 border border-rose-100">
                    {contact.type === 'ambulance' ? '🚑' : 
                     contact.type === 'civil_defense' ? '🚒' : 
                     contact.type === 'blood_bank' ? '🩸' : 
                     contact.type === 'red_crescent' ? '❤️' : '🏥'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-black text-slate-900">{contact.name}</h3>
                      {contact.is24Hours && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          24 ساعة
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{contact.description}</p>
                    <span className="text-xs text-rose-700 font-mono font-bold mt-1 inline-block" dir="ltr">
                      {contact.phone}
                    </span>
                  </div>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs p-3 rounded-2xl shadow-sm transition active:scale-95 flex items-center gap-1.5 shrink-0"
                >
                  <Phone className="w-4 h-4 animate-bounce" />
                  <span className="hidden xs:inline">اتصال</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Medical Centers & Labs SubTab */}
      {selectedSubTab === 'centers' && (
        <div className="space-y-3">
          {medicalCenters.map((center) => (
            <div
              key={center.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 hover:border-teal-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center text-xl shrink-0 border border-teal-100">
                    {center.type === 'lab' ? '🔬' : center.type === 'imaging' ? '🩻' : '🏥'}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{center.name}</h3>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-md">
                      {center.typeName}
                    </span>
                  </div>
                </div>
              </div>
              {/* Info */}
              <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700 space-y-1.5 border border-slate-100">
                <p className="flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{center.address} {center.landmark ? `(${center.landmark})` : ''}</span>
                </p>
                <p className="flex items-center gap-1.5 text-xs text-slate-600 pt-0.5 border-t border-slate-200/40">
                  <Clock className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span><strong>أوقات العمل:</strong> {center.workingHours}</span>
                </p>
              </div>
              {/* Services List */}
              {center.services && center.services.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700">التحاليل والخدمات المتاحة:</span>
                  <div className="flex flex-wrap gap-1">
                    {center.services.map((svc, i) => (
                      <span key={i} className="text-[10px] bg-teal-50 text-teal-900 border border-teal-100 px-2 py-0.5 rounded-md font-medium">
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100">
                <a
                  href={`tel:${center.phone}`}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition active:scale-95 text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>اتصال</span>
                </a>
                {center.whatsapp ? (
                  <a
                    href={buildWhatsAppLabUrl(center.whatsapp, center.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition active:scale-95 text-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>واتساب</span>
                  </a>
                ) : (
                  <div className="bg-slate-100 text-slate-400 text-xs py-2 px-1 rounded-xl flex items-center justify-center">
                    -
                  </div>
                )}
                <button
                  onClick={() => {
                    if (onOpenLocationModal) {
                      onOpenLocationModal({
                        title: center.name,
                        subtitle: center.typeName,
                        type: 'center',
                        address: center.address,
                        landmark: center.landmark,
                        phone: center.phone,
                        whatsapp: center.whatsapp,
                        workingHours: center.workingHours,
                        coordinates: center.coordinates,
                        id: center.id
                      });
                    }
                  }}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition active:scale-95 text-center border border-amber-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>الموقع</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. First Aid SubTab */}
      {selectedSubTab === 'firstaid' && (
        <div className="space-y-2.5">
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <HeartPulse className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>مرشد الإسعاف الذاتي المنزلي:</strong> تعلم الخطوات الصحيحة للإنقاذ الطارئ وتجنب الممارسات الخاطئة الشائعة التي تسبب الضرر للمريض.
            </p>
          </div>
          {FIRST_AID_TOPICS.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            const IconComp = topicIconMap[topic.icon] || Activity;
            return (
              <div
                key={topic.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                  className="w-full p-3.5 text-right flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1 text-right">
                      <h4 className="text-xs font-black text-slate-900">{topic.title}</h4>
                      <p className="text-xs text-slate-600 leading-snug truncate">{topic.summary}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 rotate-90 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="p-3.5 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-2.5 text-xs text-slate-700">
                    <div className="space-y-1.5 pt-2">
                      <p className="font-bold text-slate-900 text-xs">خطوات الإسعاف السليم:</p>
                      {topic.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="leading-relaxed text-xs text-slate-800">{step}</p>
                        </div>
                      ))}
                    </div>
                    {topic.warning && (
                      <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <p className="font-medium leading-relaxed">{topic.warning}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
