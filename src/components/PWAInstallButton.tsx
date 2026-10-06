import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, X, Smartphone, CheckCircle } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' | 'menu' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as standalone PWA, hide install button
  if (isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Header compact button
  if (variant === 'header') {
    if (isInstallable) {
      return (
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all duration-200 animate-pulse hover:animate-none"
          title="تثبيت التطبيق على جهازك"
        >
          <Download className="w-3.5 h-3.5" />
          <span>تثبيت التطبيق</span>
        </button>
      );
    }

    if (isIOS) {
      return (
        <>
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700/80 hover:bg-teal-800 text-white rounded-xl text-xs font-medium transition"
            title="تثبيت التطبيق على آيفون"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>تثبيت على الآيفون</span>
          </button>

          {showIOSGuide && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800 relative">
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="absolute top-4 left-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100 shadow-inner">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">تثبيت التطبيق على آيفون</h3>
                    <p className="text-xs text-slate-500">يعمل بدون إنترنت وتصفح سريع</p>
                  </div>
                </div>

                <div className="space-y-3 my-4 bg-slate-50 p-4 rounded-xl text-xs leading-relaxed border border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] shrink-0">1</span>
                    <p className="text-slate-700">
                      اضغط على زر المشاركة <strong>(Share / <Share2 className="w-3 h-3 inline text-teal-600 mx-0.5" />)</strong> في أسفل شريط سفاري.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] shrink-0">2</span>
                    <p className="text-slate-700">
                      مرر للأسفل واضغط على <strong>"إضافة إلى الصفحة الرئيسية" (Add to Home Screen)</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] shrink-0">3</span>
                    <p className="text-slate-700">
                      اضغط <strong>"إضافة" (Add)</strong> بالأعلى ليظهر التطبيق مع تطبيقاتك.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="mt-2 w-full rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition"
                >
                  فهمت ذلك
                </button>
              </div>
            </div>
          )}
        </>
      );
    }
  }

  // Banner variant (for home page or bottom prompt)
  if (variant === 'banner') {
    if (isInstallable || isIOS) {
      return (
        <div className="bg-gradient-to-r from-teal-800 to-emerald-800 text-white rounded-2xl p-4 shadow-lg border border-teal-600/30 flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">ثبّت تطبيق صحتك على جوالك</h4>
              <p className="text-xs text-teal-100">استمتع بتصفح سريع، والعمل بدون إنترنت، ووصول فوري</p>
            </div>
          </div>
          {isInstallable ? (
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="shrink-0 px-4 py-2 bg-white text-teal-800 font-bold rounded-xl text-xs hover:bg-teal-50 active:scale-95 transition shadow"
            >
              تثبيت الآن
            </button>
          ) : (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="shrink-0 px-4 py-2 bg-white text-teal-800 font-bold rounded-xl text-xs hover:bg-teal-50 active:scale-95 transition shadow"
            >
              طريقة التثبيت
            </button>
          )}
        </div>
      );
    }
  }

  return null;
};
