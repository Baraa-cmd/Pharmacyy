import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { EmergencyContact } from '../types';

interface Props {
  emergencyContacts: EmergencyContact[];
  onAddContact: (contact: EmergencyContact) => void;
  onUpdateContact: (contact: EmergencyContact) => void;
  onDeleteContact: (id: string) => void;
}

export const AdminEmergency: React.FC<Props> = ({ emergencyContacts, onAddContact, onUpdateContact, onDeleteContact }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentContact, setCurrentContact] = useState<Partial<EmergencyContact>>({});

  const handleSave = () => {
    if (!currentContact.name || !currentContact.phone) return;
    
    if (currentContact.id) {
      onUpdateContact(currentContact as EmergencyContact);
    } else {
      onAddContact({
        ...currentContact,
        id: `ec-${Date.now()}`,
        type: currentContact.type || 'ambulance',
        is24Hours: currentContact.is24Hours ?? true
      } as EmergencyContact);
    }
    setIsEditing(false);
    setCurrentContact({});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-rose-500"/> إدارة أرقام الطوارئ</h3>
        <button onClick={() => { setCurrentContact({}); setIsEditing(true); }} className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> إضافة رقم</button>
      </div>

      {isEditing && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
          <input type="text" placeholder="الاسم (مثال: الدفاع المدني)" value={currentContact.name || ''} onChange={e => setCurrentContact({...currentContact, name: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
          <input type="text" placeholder="رقم الهاتف" value={currentContact.phone || ''} onChange={e => setCurrentContact({...currentContact, phone: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
          <input type="text" placeholder="الوصف" value={currentContact.description || ''} onChange={e => setCurrentContact({...currentContact, description: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
          <select value={currentContact.type || 'ambulance'} onChange={e => setCurrentContact({...currentContact, type: e.target.value as any})} className="w-full p-2 border rounded-lg text-sm">
            <option value="ambulance">إسعاف</option>
            <option value="civil_defense">دفاع مدني</option>
            <option value="red_crescent">هلال أحمر</option>
            <option value="blood_bank">بنك الدم</option>
            <option value="health_center">مركز صحي</option>
          </select>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex-1">حفظ</button>
            <button onClick={() => setIsEditing(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium">إلغاء</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {emergencyContacts.map(ec => (
          <div key={ec.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-sm">{ec.name}</div>
              <div className="text-slate-500 text-xs">{ec.phone} • {ec.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setCurrentContact(ec); setIsEditing(true); }} className="p-1.5 text-blue-600 bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4"/></button>
              <button onClick={() => onDeleteContact(ec.id)} className="p-1.5 text-rose-600 bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
