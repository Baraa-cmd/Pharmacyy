import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  X, 
  MapPin, 
  Navigation, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Clock, 
  Compass, 
  Building2  
} from 'lucide-react';
import { Coordinates } from '../types';
import { DEIR_HAFIR_CENTER, getGoogleMapsUrl } from '../data/mockMedicalData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  type: 'doctor' | 'pharmacy' | 'center' | 'emergency';
  address: string;
  landmark?: string;
  phone?: string;
  whatsapp?: string;
  workingHours?: string;
  coordinates?: Coordinates;
  onOpenFullMap?: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  type,
  address,
  landmark,
  phone,
  whatsapp,
  workingHours,
  coordinates,
  onOpenFullMap
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const targetCoords = coordinates || DEIR_HAFIR_CENTER;

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Small delay to ensure modal DOM is mounted
    const timer = setTimeout(() => {
      if (mapContainerRef.current && !mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [targetCoords.lat, targetCoords.lng],
          zoom: 16,
          zoomControl: false,
          attributionControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        L.control.zoom({ position: 'bottomleft' }).addTo(map);

        // Custom marker
        const pinIcon = L.divIcon({
          html: `
            <div class="relative flex flex-col items-center justify-center">
              <div class="w-10 h-10 rounded-2xl bg-teal-700 text-white border-2 border-white shadow-xl flex items-center justify-center text-lg font-bold ring-4 ring-teal-300/50">
                <span>${type === 'doctor' ? '👨‍⚕️' : type === 'pharmacy' ? '💊' : type === 'center' ? '🔬' : '🚨'}</span>
              </div>
              <div class="w-2.5 h-2.5 rotate-45 bg-teal-700 -mt-1 shadow-sm"></div>
            </div>
          `,
          className: 'custom-single-marker',
          iconSize: [40, 48],
          iconAnchor: [20, 46]
        });

        L.marker([targetCoords.lat, targetCoords.lng], { icon: pinIcon })
          .addTo(map)
          .bindPopup(`<div class="text-xs font-bold text-slate-900">${title}</div>`)
          .openPopup();

        mapInstanceRef.current = map;
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, targetCoords.lat, targetCoords.lng, title, type]);

  if (!isOpen) return null;

  const googleMapsLink = getGoogleMapsUrl(targetCoords.lat, targetCoords.lng, `${title} - دير حافر`);

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-4 flex items-center justify-between text-right" dir="rtl">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg border border-white/20">
              {type === 'doctor' ? '👨‍⚕️' : type === 'pharmacy' ? '💊' : type === 'center' ? '🔬' : '🚨'}
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{title}</h3>
              {subtitle && <p className="text-[11px] text-teal-200">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-200 hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Canvas Preview */}
        <div className="relative w-full h-52 bg-slate-200">
          <div ref={mapContainerRef} className="w-full h-full" />
          {/* Floating full map button */}
          {onOpenFullMap && (
            <button
              onClick={() => {
                onClose();
                onOpenFullMap();
              }}
              className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md text-teal-900 font-bold text-xs py-1.5 px-3 rounded-xl shadow-md border border-slate-200 hover:bg-teal-50 flex items-center gap-1 transition"
            >
              <Compass className="w-3.5 h-3.5 text-teal-700" />
              <span>عرض الخريطة الكاملة</span>
            </button>
          )}
        </div>

        {/* Location & Detailed Address Content */}
        <div className="p-4 space-y-3 overflow-y-auto text-right" dir="rtl">
          {/* Address Box */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">العنوان التفصيلي:</strong>
                <span className="text-slate-700 leading-relaxed block mt-0.5">{address}</span>
              </div>
            </div>
            {landmark && (
              <div className="pt-1.5 border-t border-slate-200/60 flex items-start gap-2 text-slate-600">
                <Building2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 font-bold">العلامة المميزة للوصول:</strong>
                  <span className="text-slate-700 block mt-0.5">{landmark}</span>
                </div>
              </div>
            )}
            {workingHours && (
              <div className="pt-1.5 border-t border-slate-200/60 flex items-start gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 font-bold">ساعات الدوام اليومي:</strong>
                  <span className="text-slate-700 block mt-0.5">{workingHours}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {/* Direct Google Maps Navigation */}
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
            >
              <Navigation className="w-4 h-4" />
              <span>ملاحة عبر خرائط Google</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {/* Call & WhatsApp Quick Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>اتصال مباشر</span>
                </a>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>دردشة واتساب</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
