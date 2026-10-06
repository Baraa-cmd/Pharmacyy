import React from 'react';
import { MapPin, Bell, ShieldAlert, HeartHandshake, PlusCircle, User, Shield } from 'lucide-react';
import { SystemUser } from '../types';
import { AppLogo } from './AppLogo';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenAddModal: () => void;
  onNavigateEmergency: () => void;
  onNavigateMap: () => void;
  onNavigateAlerts: () => void;
  onNavigateHumanitarian: () => void;
  favoritesCount: number;
  alertsCount: number;
  onNavigateMore: () => void;
  currentUser: SystemUser | null;
  onOpenAuthModal: () => void;
  onOpenDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onNavigateEmergency,
  onNavigateMap,
  onNavigateAlerts,
  onNavigateHumanitarian,
  favoritesCount,
  alertsCount,
  onNavigateMore,
  currentUser,
  onOpenAuthModal,
  onOpenDashboard
}) => {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-[#0B132B] via-slate-900 to-teal-950 text-white shadow-md border-b border-teal-500/20">
      {/* System Style Top Bar */}
      <div className="px-4 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-medium text-teal-100/90 border-b border-slate-800">
        <button 
          onClick={onNavigateMap}
          className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-900 px-2.5 py-0.5 rounded-full transition text-right border border-teal-500/30"
          title="تصفح الخريطة الطبية"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="font-bold text-white tracking-wide">صحتك</span>
          <span className="text-teal-300 text-[10px]">الخريطة النشطة</span>
        </button>
        <div className="flex items-center gap-2">
          <PWAInstallButton variant="header" />
          {currentUser ? (
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded-full font-bold text-[10px] transition shadow-sm"
            >
              <Shield className="w-3 h-3" />
              <span>{currentUser.role === 'admin' ? 'لوحة المدير' : 'بوابة المزود'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-teal-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] transition border border-teal-500/30"
            >
              <User className="w-3 h-3" />
              <span>تسجيل الدخول</span>
            </button>
          )}
        </div>
      </div>
      {/* Main App Bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <AppLogo size="md" />
          <div>
            <h1 className="text-lg font-black tracking-tight leading-tight text-white">
              صحتك
            </h1>
            <p className="text-[11px] text-teal-200 font-normal">
              المنصة الطبية الشاملة
            </p>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Health Alerts Bell */}
          <button
            id="header-btn-alerts"
            onClick={onNavigateAlerts}
            className="relative p-1.5 bg-teal-900/40 hover:bg-teal-900/70 text-teal-100 rounded-xl transition active:scale-95"
            title="الإشعارات الصحية وحملات اللقاح"
          >
            <Bell className={`w-4 h-4 ${alertsCount > 0 ? 'text-amber-300 animate-swing' : ''}`} />
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {alertsCount}
              </span>
            )}
          </button>
          {/* Humanitarian Case Heart-Handshake */}
          <button
            id="header-btn-humanitarian"
            onClick={onNavigateHumanitarian}
            className="p-1.5 bg-teal-900/40 hover:bg-teal-900/70 text-teal-100 rounded-xl transition active:scale-95"
            title="الحالات الطبية الإنسانية"
          >
            <HeartHandshake className="w-4 h-4 text-rose-300" />
          </button>
          <button
            id="header-btn-emergency"
            onClick={onNavigateEmergency}
            className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-sm transition active:scale-95 border border-rose-500/50"
            title="أرقام الطوارئ"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">طوارئ</span>
          </button>
          <button
            id="header-btn-add"
            onClick={onOpenAddModal}
            className="flex items-center gap-1 bg-teal-600/80 hover:bg-teal-600 text-white text-xs font-medium px-2 py-1.5 rounded-xl transition active:scale-95 border border-teal-500/30"
            title="إضافة عيادة/صيدلية"
          >
            <PlusCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
