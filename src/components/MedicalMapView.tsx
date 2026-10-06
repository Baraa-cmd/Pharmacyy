import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Layers, 
  Compass, 
  Filter, 
  X, 
  ChevronDown,
  Moon,
  Clock
} from 'lucide-react';
import { Doctor, Pharmacy, MedicalCenter, EmergencyContact, MapPlace, Coordinates } from '../types';
import { DEIR_HAFIR_CENTER, getGoogleMapsUrl } from '../data/mockMedicalData';
import { buildWhatsAppDoctorUrl, buildWhatsAppPharmacyMedicineUrl, buildWhatsAppLabUrl } from '../utils/storage';

interface MedicalMapViewProps {
  doctors: Doctor[];
  pharmacies: Pharmacy[];
  medicalCenters: MedicalCenter[];
  emergencyContacts: EmergencyContact[];
  initialSelectedId?: string | null;
  onSelectDoctor?: (doctor: Doctor) => void;
  onOpenMedicineInquiry?: (pharmacy: Pharmacy) => void;
  onClose?: () => void;
}

export const MedicalMapView: React.FC<MedicalMapViewProps> = ({
  doctors,
  pharmacies,
  medicalCenters,
  emergencyContacts,
  initialSelectedId,
  onSelectDoctor,
  onOpenMedicineInquiry,
  onClose
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const [activeCategory, setActiveCategory] = useState<'all' | 'doctors' | 'pharmacies' | 'duty' | 'centers' | 'emergency'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite'>('streets');
  const [showListDrawer, setShowListDrawer] = useState(false);

  // Combine all items into unified MapPlace list
  const allPlaces: MapPlace[] = [
    ...doctors.map((d): MapPlace => ({
      id: d.id,
      name: d.name,
      subtitle: `${d.specialtyName} | ${d.title}`,
      category: 'doctor',
      categoryLabel: d.specialtyName,
      coordinates: d.coordinates || { lat: DEIR_HAFIR_CENTER.lat + (Math.random() - 0.5) * 0.006, lng: DEIR_HAFIR_CENTER.lng + (Math.random() - 0.5) * 0.006 },
      address: d.address,
      landmark: d.landmark,
      workingHours: `${d.workingDays}: ${d.workingHours}`,
      phone: d.phone,
      whatsapp: d.whatsapp,
      isOpenNow: d.isAvailableNow,
      rawItem: d
    })),
    ...pharmacies.map((p): MapPlace => ({
      id: p.id,
      name: p.name,
      subtitle: `${p.pharmacistName} ${p.isDutyToday ? '(صيدلية مناوبة)' : ''}`,
      category: p.isDutyToday ? 'duty_pharmacy' : 'pharmacy',
      categoryLabel: p.isDutyToday ? 'مناوبة اليوم' : 'صيدلية',
      coordinates: p.coordinates || { lat: DEIR_HAFIR_CENTER.lat + (Math.random() - 0.5) * 0.006, lng: DEIR_HAFIR_CENTER.lng + (Math.random() - 0.5) * 0.006 },
      address: p.address,
      landmark: p.landmark,
      workingHours: p.workingHours,
      phone: p.phone,
      whatsapp: p.whatsapp,
      isOpenNow: p.isOpenNow,
      isDutyToday: p.isDutyToday,
      rawItem: p
    })),
    ...medicalCenters.map((c): MapPlace => ({
      id: c.id,
      name: c.name,
      subtitle: c.typeName,
      category: 'center',
      categoryLabel: c.typeName,
      coordinates: c.coordinates || { lat: DEIR_HAFIR_CENTER.lat + (Math.random() - 0.5) * 0.006, lng: DEIR_HAFIR_CENTER.lng + (Math.random() - 0.5) * 0.006 },
      address: c.address,
      landmark: c.landmark,
      workingHours: c.workingHours,
      phone: c.phone,
      whatsapp: c.whatsapp,
      isOpenNow: true,
      rawItem: c
    })),
    ...emergencyContacts.map((e): MapPlace => ({
      id: e.id,
      name: e.name,
      subtitle: e.description,
      category: 'emergency',
      categoryLabel: 'طوارئ',
      coordinates: e.coordinates || { lat: DEIR_HAFIR_CENTER.lat + (Math.random() - 0.5) * 0.006, lng: DEIR_HAFIR_CENTER.lng + (Math.random() - 0.5) * 0.006 },
      address: 'دير حافر',
      workingHours: 'خدمة 24/7',
      phone: e.phone,
      isOpenNow: true,
      rawItem: e
    }))
  ];

  // Filter places based on active category & search query
  const filteredPlaces = allPlaces.filter((place) => {
    if (activeCategory === 'doctors' && place.category !== 'doctor') return false;
    if (activeCategory === 'pharmacies' && place.category !== 'pharmacy' && place.category !== 'duty_pharmacy') return false;
    if (activeCategory === 'duty' && place.category !== 'duty_pharmacy') return false;
    if (activeCategory === 'centers' && place.category !== 'center') return false;
    if (activeCategory === 'emergency' && place.category !== 'emergency') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = place.name.toLowerCase().includes(q);
      const matchSub = place.subtitle.toLowerCase().includes(q);
      const matchAddress = place.address.toLowerCase().includes(q);
      const matchLandmark = (place.landmark || '').toLowerCase().includes(q);
      if (!matchName && !matchSub && !matchAddress && !matchLandmark) return false;
    }
    return true;
  });

  // Helper to create custom HTML pin for Leaflet
  const createCustomIcon = (place: MapPlace, isSelected: boolean) => {
    let iconChar = '🩺';
    let gradient = 'from-teal-600 to-emerald-700';
    let shadowColor = 'shadow-teal-500/50';
    let pulseRing = '';

    if (place.category === 'duty_pharmacy') {
      iconChar = '🌙';
      gradient = 'from-emerald-500 via-teal-600 to-emerald-800';
      shadowColor = 'shadow-emerald-500/80';
      pulseRing = '<div class="absolute inset-0 rounded-2xl bg-emerald-400 animate-ping opacity-40"></div>';
    } else if (place.category === 'pharmacy') {
      iconChar = '💊';
      gradient = 'from-emerald-600 to-teal-700';
      shadowColor = 'shadow-emerald-500/50';
    } else if (place.category === 'center') {
      iconChar = '🏥';
      gradient = 'from-blue-600 to-indigo-700';
      shadowColor = 'shadow-blue-500/50';
    } else if (place.category === 'emergency') {
      iconChar = '🚨';
      gradient = 'from-rose-600 to-red-700';
      shadowColor = 'shadow-rose-500/60';
      pulseRing = '<div class="absolute inset-0 rounded-2xl bg-rose-500 animate-ping opacity-40"></div>';
    }

    const scale = isSelected ? 'scale-125 z-50' : 'hover:scale-110';
    const border = isSelected ? 'ring-4 ring-amber-400 border-2 border-white' : 'border-2 border-white';

    const html = `
      <div class="relative flex flex-col items-center justify-center transition-all duration-200 ${scale}">
        ${pulseRing}
        <div class="relative w-10 h-10 rounded-2xl bg-gradient-to-tr ${gradient} ${border} ${shadowColor} shadow-xl flex items-center justify-center text-base font-black select-none text-white cursor-pointer transform -rotate-45">
          <span class="transform rotate-45">${iconChar}</span>
        </div>
        <div class="w-2.5 h-2.5 bg-slate-900 rounded-full opacity-30 mt-1 blur-[1px]"></div>
        ${isSelected ? `
          <div class="absolute -top-7 bg-slate-900/95 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-2xl whitespace-nowrap border border-slate-700/80 select-none backdrop-blur-sm animate-bounce">
            ${place.name}
          </div>
        ` : ''}
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-leaflet-marker',
      iconSize: [40, 50],
      iconAnchor: [20, 45],
      popupAnchor: [0, -40]
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [DEIR_HAFIR_CENTER.lat, DEIR_HAFIR_CENTER.lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      // Add Zoom Control at bottom-left
      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; OpenStreetMap | دليلي الطبي')
        .addTo(map);

      // Initial Street Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Markers when filteredPlaces or selectedPlace changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current.clear();

    // Add new markers
    filteredPlaces.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const icon = createCustomIcon(place, isSelected);
      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon,
        title: place.name
      }).addTo(map);

      marker.on('click', (e) => {
        (e.originalEvent as any)._markerClicked = true;
        setSelectedPlace(place);
        map.flyTo([place.coordinates.lat, place.coordinates.lng], 16.5, {
          duration: 0.8
        });
      });

      markersRef.current.set(place.id, marker);
    });
  }, [filteredPlaces, selectedPlace]);

  // Handle initialSelectedId
  useEffect(() => {
    if (initialSelectedId && mapInstanceRef.current) {
      const target = allPlaces.find(p => p.id === initialSelectedId);
      if (target) {
        setSelectedPlace(target);
        mapInstanceRef.current.flyTo([target.coordinates.lat, target.coordinates.lng], 17, {
          duration: 1
        });
      }
    }
  }, [initialSelectedId]);

  // Handle Layer change (Streets vs Satellite)
  const toggleMapLayer = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (mapLayer === 'streets') {
      // Switch to Satellite (Esri World Imagery)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri'
      }).addTo(map);
      setMapLayer('satellite');
    } else {
      // Switch to standard OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
      setMapLayer('streets');
    }
  };

  // Get User Current Location
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationError('المتصفح لا يدعم الوصول لموقعك الحالي');
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords: Coordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(coords);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 16, { duration: 1 });
          
          // Add User Marker
          const userIcon = L.divIcon({
            html: `
              <div class="relative flex items-center justify-center">
                <div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg ring-4 ring-blue-300/60 animate-ping absolute"></div>
                <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md z-10"></div>
              </div>
            `,
            className: 'user-location-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          L.marker([coords.lat, coords.lng], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup('<div class="text-xs font-bold text-slate-800 p-1">أنت هنا حالياً</div>')
            .openPopup();
        }
      },
      () => {
        setIsLocating(false);
        setLocationError('يرجى تفعيل الـ GPS والتحقق من إذن الموقع');
        setTimeout(() => setLocationError(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Reset Map to Deir Hafer Center
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([DEIR_HAFIR_CENTER.lat, DEIR_HAFIR_CENTER.lng], 15, { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-125px)] min-h-[520px] bg-slate-100 overflow-hidden flex flex-col">
      {/* Top Floating Header & Filter Panel */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] space-y-2 pointer-events-none">
        {/* Search Bar in Map */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 p-1.5 flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute right-3 w-4 h-4 text-teal-600 pointer-events-none" />
            <input
              id="map-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مكان بالخريطة..."
              className="w-full bg-slate-50 text-xs pr-9 pl-7 py-2 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={() => setShowListDrawer(!showListDrawer)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 ${
              showListDrawer 
                ? 'bg-teal-700 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="تصفية النتائج"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تصفية</span>
            <span className="bg-teal-800/20 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {filteredPlaces.length}
            </span>
          </button>
        </div>

        {/* Categories Horizontal Pills */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition shrink-0 ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white/95 text-slate-700 hover:bg-white border border-slate-200'
            }`}
          >
            الكل ({allPlaces.length})
          </button>
          <button
            onClick={() => setActiveCategory('doctors')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition shrink-0 flex items-center gap-1 ${
              activeCategory === 'doctors'
                ? 'bg-teal-700 text-white'
                : 'bg-white/95 text-teal-800 hover:bg-white border border-slate-200'
            }`}
          >
            <span>أطباء ({doctors.length})</span>
          </button>
          <button
            onClick={() => setActiveCategory('duty')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition shrink-0 flex items-center gap-1 ${
              activeCategory === 'duty'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Moon className="w-3 h-3 fill-emerald-600" />
            <span>مناوب ليلى ({pharmacies.filter(p => p.isDutyToday).length})</span>
          </button>
          <button
            onClick={() => setActiveCategory('pharmacies')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition shrink-0 ${
              activeCategory === 'pharmacies'
                ? 'bg-emerald-700 text-white'
                : 'bg-white/95 text-emerald-800 hover:bg-white border border-slate-200'
            }`}
          >
            صيدليات ({pharmacies.length})
          </button>
          <button
            onClick={() => setActiveCategory('centers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition shrink-0 ${
              activeCategory === 'centers'
                ? 'bg-blue-700 text-white'
                : 'bg-white/95 text-blue-800 hover:bg-white border border-slate-200'
            }`}
          >
            مراكز وتحاليل ({medicalCenters.length})
          </button>
          <button
            onClick={() => setActiveCategory('emergency')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition shrink-0 ${
              activeCategory === 'emergency'
                ? 'bg-rose-600 text-white'
                : 'bg-white/95 text-rose-800 hover:bg-white border border-slate-200'
            }`}
          >
            مراكز إغاثة ({emergencyContacts.length})
          </button>
        </div>
      </div>

      {/* Floating Map Controls (Right Side) */}
      <div className="absolute right-3 top-28 z-[1000] flex flex-col gap-2 pointer-events-auto">
        {/* Locate Me */}
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className="w-10 h-10 rounded-2xl bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-teal-50 hover:text-teal-700 active:scale-95 transition"
          title="موقعي الحالي"
        >
          <Compass className={`w-5 h-5 ${isLocating ? 'animate-spin text-teal-600' : ''}`} />
        </button>
        {/* Re-center on Deir Hafer */}
        <button
          onClick={handleRecenter}
          className="w-10 h-10 rounded-2xl bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-teal-50 hover:text-teal-700 active:scale-95 transition text-xs font-bold"
          title="إعادة تمركز على دير حافر"
        >
          📍
        </button>
        {/* Toggle Satellite / Street view */}
        <button
          onClick={toggleMapLayer}
          className={`w-10 h-10 rounded-2xl shadow-md border flex items-center justify-center active:scale-95 transition ${
            mapLayer === 'satellite'
              ? 'bg-emerald-700 text-white border-emerald-800'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
          }`}
          title={mapLayer === 'streets' ? 'عرض القمر الصناعي' : 'عرض الخريطة العادية'}
        >
          <Layers className="w-5 h-5" />
        </button>
      </div>

      {/* Location Error Toast */}
      {locationError && (
        <div className="absolute top-28 left-4 right-16 z-[1000] bg-rose-900 text-white text-xs font-bold p-2.5 rounded-xl shadow-lg border border-rose-700 text-center animate-fade-in">
          {locationError}
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-10"
        style={{ minHeight: '100%' }}
      />

      {/* Bottom Floating Info Card for Selected Place */}
      {selectedPlace && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-white rounded-3xl p-4 shadow-2xl border border-slate-200/90 animate-slide-up">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1 text-right" dir="rtl">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 border ${
                selectedPlace.category === 'duty_pharmacy' 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-300/50' 
                  : selectedPlace.category === 'doctor'
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : selectedPlace.category === 'center'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {selectedPlace.category === 'doctor' ? '👨‍⚕️' : 
                 selectedPlace.category === 'duty_pharmacy' ? '🌙' : 
                 selectedPlace.category === 'pharmacy' ? '💊' : 
                 selectedPlace.category === 'center' ? '🔬' : '🚨'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black text-slate-900">{selectedPlace.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                    selectedPlace.category === 'duty_pharmacy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedPlace.categoryLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">{selectedPlace.subtitle}</p>
                
                {/* Full Address */}
                <p className="text-xs text-slate-700 mt-1.5 flex items-start gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    {selectedPlace.address}
                    {selectedPlace.landmark ? ` (${selectedPlace.landmark})` : ''}
                  </span>
                </p>
                {/* Working hours */}
                <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-teal-700 shrink-0" />
                  <span>{selectedPlace.workingHours}</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedPlace(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100">
            <a 
              href={`tel:${selectedPlace.phone}`}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-2 rounded-xl flex items-center justify-center gap-1 shadow-sm active:scale-95 transition"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>اتصال سريع</span>
            </a>
            {selectedPlace.whatsapp ? (
              <a 
                href={
                  selectedPlace.category === 'doctor'
                    ? buildWhatsAppDoctorUrl(selectedPlace.whatsapp, selectedPlace.name)
                    : selectedPlace.category === 'center'
                    ? buildWhatsAppLabUrl(selectedPlace.whatsapp, selectedPlace.name)
                    : buildWhatsAppPharmacyMedicineUrl(selectedPlace.whatsapp, selectedPlace.name)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-2 rounded-xl flex items-center justify-center gap-1 shadow-sm active:scale-95 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </a>
            ) : (
              <div className="bg-slate-100 text-slate-400 text-xs py-2 px-2 rounded-xl flex items-center justify-center">
                <span>لا يوجد واتساب</span>
              </div>
            )}
            <a 
              href={getGoogleMapsUrl(selectedPlace.coordinates.lat, selectedPlace.coordinates.lng, selectedPlace.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs py-2 px-2 rounded-xl flex items-center justify-center gap-1 border border-teal-200/80 active:scale-95 transition"
            >
              <Navigation className="w-3.5 h-3.5 text-teal-700" />
              <span>ملاحة جوجل</span>
            </a>
          </div>
        </div>
      )}

      {/* Side List Drawer */}
      {showListDrawer && (
        <div className="absolute inset-y-0 left-0 right-0 z-[1050] bg-slate-900/40 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-4 max-h-[75vh] flex flex-col shadow-2xl animate-slide-up" dir="rtl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-black text-slate-900">
                  المراكز المتوفرة بالخريطة ({filteredPlaces.length})
                </h3>
              </div>
              <button 
                onClick={() => setShowListDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-3 space-y-2 text-right">
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  onClick={() => {
                    setSelectedPlace(place);
                    setShowListDrawer(false);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([place.coordinates.lat, place.coordinates.lng], 17, { duration: 0.8 });
                    }
                  }}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 cursor-pointer transition flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg">
                      {place.category === 'doctor' ? '👨‍⚕️' : 
                       place.category === 'duty_pharmacy' ? '🌙' : 
                       place.category === 'pharmacy' ? '💊' : 
                       place.category === 'center' ? '🔬' : '🚨'}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900">{place.name}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                          {place.categoryLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{place.subtitle}</p>
                      <p className="text-[11px] text-slate-700 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>{place.address} {place.landmark ? `(${place.landmark})` : ''}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-teal-100 text-teal-800 font-bold px-2 py-1 rounded-xl shrink-0">
                    تحديد
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
