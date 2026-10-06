import React, { useState } from 'react';
import { 
  Heart, 
  PlusCircle, 
  Smartphone, 
  Share2, 
  Info, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Trash2,
  Bell,
  HeartHandshake,
  Send,
  ChevronLeft
} from 'lucide-react';
import { Doctor, Pharmacy, TabType } from '../types';
import { saveSubmission, buildWhatsAppDoctorUrl } from '../utils/storage';

interface MoreViewProps {
  doctors: Doctor[];
  pharmacies: Pharmacy[];
  favoriteDoctorIds: string[];
  favoritePharmacyIds: string[];
  onToggleFavoriteDoctor: (id: string) => void;
  onToggleFavoritePharmacy: (id: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onOpenAddModal: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const MoreView: React.FC<MoreViewProps> = ({
  doctors,
  pharmacies,
  favoriteDoctorIds,
  favoritePharmacyIds,
  onToggleFavoriteDoctor,
  onToggleFavoritePharmacy,
  onSelectDoctor,
  onOpenAddModal,
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<'favorites' | 'install' | 'feedback' | 'about'>('favorites');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const favDoctors = doctors.filter(d => favoriteDoctorIds.includes(d.id));
  const favPharmacies = pharmacies.filter(p => favoritePharmacyIds.includes(p.id));
  const totalFavorites = favDoctors.length + favPharmacies.length;

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSubmission({
      id: `fb-${Date.now()}`,
      type: 'center',
      name: feedbackName,
      categoryOrSpecialty: 'ملاحظة ومراجعة التطبيق',
      phone: '',
      address: '',
      workingHours: '',
      submittedAt: new Date().toISOString()
    });
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackName('');
      setFeedbackNote('');
      setFeedbackSuccess(false);
    }, 2500);
  };

  const handleShareApp = async () => {
    const text = 'دليلي الطبي دير حافر - دليل العيادات وصيدليات المناوبة والطوارئ بمدينة دير حافر في جيبك!';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'دليلي الطبي - دير حافر',
          text,
          url: window.location.href,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط مشاركة التطبيق بنجاح!');
    }
  };

  return (
    <div className="space-y-4 pb-24 px-3.5 pt-3">
      {/* Profile / App Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white rounded-3xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-teal-800 flex items-center justify-center text-2xl font-black shrink-0 shadow-inner">
            ⚕️
          </div>
          <div>
            <h2 className="text-sm font-black text-white">دليلي الطبي - دير حافر</h2>
            <p className="text-[11px] text-teal-200">الإصدار 1.0 (تحديث مستمر)</p>
          </div>
        </div>
        {/* Quick Tabs inside More */}
        <div className="grid grid-cols-4 gap-1.5 mt-3.5 pt-3 border-t border-teal-700/50">
          <button
            onClick={() => setActiveSection('favorites')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition ${
              activeSection === 'favorites' ? 'bg-white text-teal-900 shadow-xs' : 'text-teal-200 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${totalFavorites > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            <span>المحفوظات ({totalFavorites})</span>
          </button>
          <button
            onClick={() => setActiveSection('install')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition ${
              activeSection === 'install' ? 'bg-white text-teal-900 shadow-xs' : 'text-teal-200 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>تثبيت التطبيق</span>
          </button>
          <button
            onClick={() => setActiveSection('feedback')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition ${
              activeSection === 'feedback' ? 'bg-white text-teal-900 shadow-xs' : 'text-teal-200 hover:text-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>تواصل معنا</span>
          </button>
          <button
            onClick={() => setActiveSection('about')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition ${
              activeSection === 'about' ? 'bg-white text-teal-900 shadow-xs' : 'text-teal-200 hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>عن المشروع</span>
          </button>
        </div>
      </div>

      {/* Main Feature Shortcuts Grid */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onNavigateTab('blood_bank')}
          className="bg-red-50 hover:bg-red-100 p-3 rounded-2xl border border-red-200 text-right flex items-center justify-between transition shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🩸</span>
            <span className="text-xs font-bold text-red-950">قسم بنك الدم</span>
          </div>
          <ChevronLeft className="w-3.5 h-3.5 text-red-700" />
        </button>

        <button
          onClick={() => onNavigateTab('medicine_search')}
          className="bg-teal-50 hover:bg-teal-100 p-3 rounded-2xl border border-teal-200 text-right flex items-center justify-between transition shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">💊</span>
            <span className="text-xs font-bold text-teal-950">بحث عن دواء مفقود</span>
          </div>
          <ChevronLeft className="w-3.5 h-3.5 text-teal-700" />
        </button>

        <button
          onClick={() => onNavigateTab('map')}
          className="bg-emerald-50 hover:bg-emerald-100 p-3 rounded-2xl border border-emerald-200 text-right flex items-center justify-between transition shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🗺️</span>
            <span className="text-xs font-bold text-emerald-950">الخريطة الطبية</span>
          </div>
          <ChevronLeft className="w-3.5 h-3.5 text-emerald-700" />
        </button>

        <button
          onClick={() => onNavigateTab('emergency')}
          className="bg-rose-50 hover:bg-rose-100 p-3 rounded-2xl border border-rose-200 text-right flex items-center justify-between transition shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🚑</span>
            <span className="text-xs font-bold text-rose-950">طوارئ وإغاثة</span>
          </div>
          <ChevronLeft className="w-3.5 h-3.5 text-rose-700" />
        </button>
      </div>

      {/* Suggested Sections Shortcuts (Suggestion 48 & 49) */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onNavigateTab('alerts')}
          className="bg-amber-50 hover:bg-amber-100/80 p-3 rounded-2xl border border-amber-200 text-right flex items-center justify-between transition shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-950">التنبيهات وحملات الصحة</span>
          </div>
          <ChevronLeft className="w-3.5 h-3.5 text-amber-700" />
        </button>

        <button
          onClick={() => onNavigateTab('humanitarian')}
          className="bg-rose-50 hover:bg-rose-100/80 p-3 rounded-2xl border border-rose-200 text-right flex items-center justify-between transition shadow-xs"
        >
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-rose-700" />
            <span className="text-xs font-bold text-rose-950">مساعدات الحالات الإنسانية</span>
          </div>
          <ChevronLeft className="w-3.5 h-3.5 text-rose-700" />
        </button>
      </div>

      {/* Action: Add Listing Banner */}
      <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">إضافة منشأة طبية</h4>
            <p className="text-[10px] text-emerald-700">ساهم بتحديث الدليل الطبي</p>
          </div>
        </div>
        <button
          onClick={onOpenAddModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl active:scale-95 transition"
        >
          أضف الآن
        </button>
      </div>

      {/* Share Button */}
      <button
        onClick={handleShareApp}
        className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold shadow-xs active:scale-98 transition"
      >
        <Share2 className="w-4 h-4 text-teal-600" />
        <span>شارك التطبيق مع أصدقائك</span>
      </button>

      {/* 1. FAVORITES SECTION */}
      {activeSection === 'favorites' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>عيادات وصيدليات محفوظة ({totalFavorites})</span>
            </h3>
          </div>

          {totalFavorites === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
              <span className="text-3xl">❤️</span>
              <h4 className="text-xs font-bold text-slate-800">قائمة المحفوظات فارغة</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                احفظ عيادات أطبائك المفضلين أو الصيدليات التي تتعامل معها لتظهر هنا للوصول السريع بدون إنترنت.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => onNavigateTab('doctors')}
                  className="bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                >
                  تصفح الأطباء
                </button>
                <button
                  onClick={() => onNavigateTab('pharmacies')}
                  className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                >
                  تصفح الصيدليات
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Saved Doctors */}
              {favDoctors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-teal-900">الأطباء المحفوظون:</p>
                  {favDoctors.map(doc => (
                    <div key={doc.id} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                      <div 
                        onClick={() => onSelectDoctor(doc)}
                        className="flex items-center gap-2.5 cursor-pointer flex-1 text-right"
                      >
                        <span className="text-lg">👨‍⚕️</span>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                          <p className="text-[10px] text-slate-500">{doc.specialtyName} | {doc.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a 
                          href={`tel:${doc.phone}`}
                          className="p-2 bg-teal-50 text-teal-700 rounded-xl"
                          title="اتصال مباشر"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => onToggleFavoriteDoctor(doc.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                          title="حذف من المحفوظات"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Saved Pharmacies */}
              {favPharmacies.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-emerald-900">الصيدليات المحفوظة:</p>
                  {favPharmacies.map(ph => (
                    <div key={ph.id} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5 flex-1 text-right">
                        <span className="text-lg">💊</span>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{ph.name}</p>
                          <p className="text-[10px] text-slate-500">{ph.address} | {ph.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a 
                          href={`tel:${ph.phone}`}
                          className="p-2 bg-emerald-50 text-emerald-700 rounded-xl"
                          title="اتصال مباشر"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => onToggleFavoritePharmacy(ph.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                          title="حذف من المحفوظات"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. PWA / INSTALL INSTRUCTIONS SECTION */}
      {activeSection === 'install' && (
        <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 text-slate-700 text-right" dir="rtl">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
            <Smartphone className="w-4 h-4 text-teal-600" />
            <span>تثبيت التطبيق على الشاشة الرئيسية (PWA):</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <p className="font-bold text-slate-900">أجهزة أندرويد (Google Chrome):</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] pr-2">
                <li>افتح التطبيق عبر متصفح <strong>Google Chrome</strong> المعتمد.</li>
                <li>اضغط على زر الخيارات <strong>(المزيد ┇ )</strong> أعلى يسار المتصفح.</li>
                <li>اضغط على <strong>"تثبيت التطبيق" (Install App)</strong> أو <strong>"الإضافة للشاشة الرئيسية"</strong>.</li>
                <li>اضغط تثبيت، وسيظهر التطبيق كأيقونة على هاتفك فوراً!</li>
              </ol>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <p className="font-bold text-slate-900">أجهزة آيفون (Safari):</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] pr-2">
                <li>افتح التطبيق عبر متصفح <strong>Safari</strong> الرسمي.</li>
                <li>اضغط على زر <strong>(مشاركة 📤)</strong> في الشريط السفلي.</li>
                <li>اختر من القائمة المتاحة <strong>"الإضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* 3. FEEDBACK & DATA CORRECTION */}
      {activeSection === 'feedback' && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-slate-700 text-right" dir="rtl">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-teal-600" />
            <span>تواصل معنا للإبلاغ أو للتصحيح</span>
          </h3>
          {feedbackSuccess ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1.5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold text-emerald-900">تم إرسال رسالتك بنجاح وسنقوم بمراجعتها فوراً.</p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  اسم المرسل أو الجهة الطبية:
                </label>
                <input
                  type="text"
                  required
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="مثال: د. أحمد المحمد أو صيدلية السلام"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  مضمون الرسالة أو التعديل المطلوب:
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="اكتب ملاحظتك بالتفصيل هنا..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال الرسالة لإدارة الدليل</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* 4. ABOUT SECTION */}
      {activeSection === 'about' && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-slate-700 text-xs leading-relaxed text-right" dir="rtl">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚕️</span>
            <h3 className="font-bold text-slate-900 text-sm">عن مشروع "دليلي الطبي"</h3>
          </div>
          <p>
            تطبيق <strong>دليلي الطبي دير حافر</strong> هو مبادرة تطوعية مجانية غير ربحية تهدف لجمع وتنظيم أرقام هواتف وعناوين وأوقات دوام العيادات الطبية، الصيدليات المناوبة، والمختبرات ومراكز الأشعة في مدينة دير حافر وريفها، لتسهيل وصول المواطنين للرعاية الطبية بأسرع وقت ممكن.
          </p>
          <div className="bg-teal-50 p-2.5 rounded-xl border border-teal-100 text-teal-900">
            <strong>ملاحظة للمستخدمين:</strong> يتم تحديث ومراجعة كافة البيانات المتوفرة في التطبيق بشكل دوري بالتعاون مع الكادر الطبي المحلي، ويرجى التواصل معنا عبر نموذج تصحيح البيانات في حال رصد أي خطأ.
          </div>
        </div>
      )}
    </div>
  );
};
