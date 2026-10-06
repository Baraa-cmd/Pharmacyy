import React from 'react';
import { TabType } from '../types';
import { Home, Stethoscope, Pill, MapPin, ShieldAlert, Menu } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, favoritesCount }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'الرئيسية', icon: Home },
    { id: 'doctors' as TabType, label: 'الأطباء', icon: Stethoscope },
    { id: 'pharmacies' as TabType, label: 'الصيدليات', icon: Pill, isDutyBadge: true },
    { id: 'map' as TabType, label: 'الخريطة', icon: MapPin, isMap: true },
    { id: 'emergency' as TabType, label: 'الطوارئ', icon: ShieldAlert, isEmergency: true },
    { id: 'more' as TabType, label: 'المزيد', icon: Menu, hasBadge: favoritesCount > 0, badgeCount: favoritesCount },
  ];

  return (
    <nav 
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="التنقل الرئيسي"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-200 rounded-xl ${
                isActive 
                  ? 'text-teal-700 font-bold' 
                  : 'text-slate-500 hover:text-slate-700 font-medium'
              }`}
            >
              {/* Active Indicator Pill */}
              <div 
                className={`relative flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${
                  isActive 
                    ? tab.isBloodBank ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-800 scale-105'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                
                {/* Blood bank pulsating dot */}
                {tab.isBloodBank && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                )}
                {/* Duty pill marker */}
                {tab.isDutyBadge && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
                {/* Favorites/More badge */}
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight">
                    {tab.badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
                isActive 
                  ? tab.isEmergency ? 'text-rose-700 font-bold' : 'text-teal-800 font-bold'
                  : 'text-slate-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
