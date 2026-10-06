import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Map } from 'lucide-react';
import { Region, SubRegion } from '../types';

interface Props {
  regions: Region[];
  subRegions: SubRegion[];
  onAddRegion: (region: Region) => void;
  onUpdateRegion: (region: Region) => void;
  onDeleteRegion: (id: string) => void;
  onAddSubRegion: (sub: SubRegion) => void;
  onUpdateSubRegion: (sub: SubRegion) => void;
  onDeleteSubRegion: (id: string) => void;
}

export const AdminRegions: React.FC<Props> = ({ regions, subRegions, onAddRegion, onUpdateRegion, onDeleteRegion, onAddSubRegion, onUpdateSubRegion, onDeleteSubRegion }) => {
  const [isEditingRegion, setIsEditingRegion] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<Partial<Region>>({});

  const [isEditingSub, setIsEditingSub] = useState(false);
  const [currentSub, setCurrentSub] = useState<Partial<SubRegion>>({});

  const handleSaveRegion = () => {
    if (!currentRegion.name) return;
    if (currentRegion.id) onUpdateRegion(currentRegion as Region);
    else onAddRegion({ id: `reg-${Date.now()}`, name: currentRegion.name });
    setIsEditingRegion(false);
    setCurrentRegion({});
  };

  const handleSaveSub = () => {
    if (!currentSub.name || !currentSub.regionId) return;
    if (currentSub.id) onUpdateSubRegion(currentSub as SubRegion);
    else onAddSubRegion({ id: `sub-${Date.now()}`, regionId: currentSub.regionId, name: currentSub.name });
    setIsEditingSub(false);
    setCurrentSub({});
  };

  return (
    <div className="space-y-6">
      {/* Regions Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Map className="w-5 h-5 text-indigo-500"/> إدارة المناطق الرئيسية</h3>
          <button onClick={() => { setCurrentRegion({}); setIsEditingRegion(true); }} className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> إضافة منطقة</button>
        </div>

        {isEditingRegion && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
            <input type="text" placeholder="اسم المنطقة (مثال: منطقة دير حافر)" value={currentRegion.name || ''} onChange={e => setCurrentRegion({...currentRegion, name: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
            <div className="flex gap-2 pt-2">
              <button onClick={handleSaveRegion} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex-1">حفظ</button>
              <button onClick={() => setIsEditingRegion(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium">إلغاء</button>
            </div>
          </div>
        )}

        <div className="grid gap-3">
          {regions.map(r => (
            <div key={r.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="font-bold text-slate-800 text-sm">{r.name}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setCurrentRegion(r); setIsEditingRegion(true); }} className="p-1.5 text-blue-600 bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                <button onClick={() => onDeleteRegion(r.id)} className="p-1.5 text-rose-600 bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SubRegions Section */}
      <div>
        <div className="flex justify-between items-center mb-4 border-t pt-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Map className="w-5 h-5 text-teal-500"/> إدارة البلدات والقرى</h3>
          <button onClick={() => { setCurrentSub({ regionId: regions[0]?.id }); setIsEditingSub(true); }} className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> إضافة بلدة</button>
        </div>

        {isEditingSub && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
            <select value={currentSub.regionId || ''} onChange={e => setCurrentSub({...currentSub, regionId: e.target.value})} className="w-full p-2 border rounded-lg text-sm">
              <option value="">اختر المنطقة الرئيسية...</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input type="text" placeholder="اسم البلدة أو القرية" value={currentSub.name || ''} onChange={e => setCurrentSub({...currentSub, name: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
            <div className="flex gap-2 pt-2">
              <button onClick={handleSaveSub} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex-1">حفظ</button>
              <button onClick={() => setIsEditingSub(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium">إلغاء</button>
            </div>
          </div>
        )}

        <div className="grid gap-3">
          {subRegions.map(sub => {
            const regionName = regions.find(r => r.id === sub.regionId)?.name || 'منطقة غير معروفة';
            return (
              <div key={sub.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-sm">{sub.name}</div>
                  <div className="text-slate-500 text-xs">تتبع لـ: {regionName}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setCurrentSub(sub); setIsEditingSub(true); }} className="p-1.5 text-blue-600 bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => onDeleteSubRegion(sub.id)} className="p-1.5 text-rose-600 bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
