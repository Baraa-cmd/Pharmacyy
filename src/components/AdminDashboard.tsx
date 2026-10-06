import React, { useState } from 'react';
import { 
  Shield, Users, Stethoscope, Pill, HeartHandshake, Bell, Plus, 
  Trash2, Edit2, Ban, CheckCircle, AlertTriangle, X, Save, UserPlus, DollarSign, Map 
} from 'lucide-react';
import { SystemUser, Doctor, Pharmacy, HumanitarianCase, HealthAlert, EmergencyContact, Region, SubRegion } from '../types';
import { AdminEmergency } from './AdminEmergency';
import { AdminRegions } from './AdminRegions';

interface AdminDashboardProps {
  currentUser: SystemUser;
  users: SystemUser[];
  onAddUser: (user: SystemUser) => void;
  onUpdateUser: (user: SystemUser) => void;
  onDeleteUser: (userId: string) => void;
  
  doctors: Doctor[];
  onAddDoctor: (doc: Doctor) => void;
  onUpdateDoctor: (doc: Doctor) => void;
  onDeleteDoctor: (id: string) => void;

  pharmacies: Pharmacy[];
  onAddPharmacy: (pharm: Pharmacy) => void;
  onUpdatePharmacy: (pharm: Pharmacy) => void;
  onDeletePharmacy: (id: string) => void;

  humanitarianCases: HumanitarianCase[];
  onAddCase: (c: HumanitarianCase) => void;
  onUpdateCase: (c: HumanitarianCase) => void;
  onDeleteCase: (id: string) => void;

  alerts: HealthAlert[];
  
  emergencyContacts: EmergencyContact[];
  onAddContact: (contact: EmergencyContact) => void;
  onUpdateContact: (contact: EmergencyContact) => void;
  onDeleteContact: (id: string) => void;

  regions: Region[];
  subRegions: SubRegion[];
  onAddRegion: (region: Region) => void;
  onUpdateRegion: (region: Region) => void;
  onDeleteRegion: (id: string) => void;
  onAddSubRegion: (sub: SubRegion) => void;
  onUpdateSubRegion: (sub: SubRegion) => void;
  onDeleteSubRegion: (id: string) => void;
  onAddAlert: (a: HealthAlert) => void;
  onDeleteAlert: (id: string) => void;

  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  doctors,
  onAddDoctor,
  onUpdateDoctor,
  onDeleteDoctor,
  pharmacies,
  onAddPharmacy,
  onUpdatePharmacy,
  onDeletePharmacy,
  humanitarianCases,
  onAddCase,
  onUpdateCase,
  onDeleteCase,
  alerts,
  onAddAlert,
  onDeleteAlert,
  emergencyContacts, onAddContact, onUpdateContact, onDeleteContact,
  regions, subRegions, onAddRegion, onUpdateRegion, onDeleteRegion, onAddSubRegion, onUpdateSubRegion, onDeleteSubRegion,
  onLogout
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'doctors' | 'pharmacies' | 'campaigns' | 'alerts' | 'emergency' | 'regions'>('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  // New User Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'doctor' | 'pharmacy' | 'admin'>('doctor');

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: SystemUser = {
      id: `u-${Date.now()}`,
      username: newUsername.trim(),
      password: newPassword,
      role: newRole,
      name: newName.trim(),
      status: 'active'
    };
    onAddUser(newUser);
    setNewUsername('');
    setNewPassword('');
    setNewName('');
    setShowAddUserModal(false);
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-4xl mx-auto space-y-5 animate-fadeIn">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-teal-600/10 rounded-full blur-2xl"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-3xl shadow-inner">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-teal-500/30 text-teal-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-teal-400/30">
                  صلاحيات كاملة (Full Control)
                </span>
              </div>
              <h1 className="text-xl font-black mt-1">لوحة تحكم مدير النظام</h1>
              <p className="text-teal-200 text-xs mt-0.5">مرحباً بك، {currentUser.name}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition active:scale-95 border border-rose-500/50"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
            activeSubTab === 'users'
              ? 'bg-teal-800 text-white shadow-teal-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة حسابات المستخدمين ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('doctors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
            activeSubTab === 'doctors'
              ? 'bg-teal-800 text-white shadow-teal-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>الأطباء والعيادات ({doctors.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pharmacies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
            activeSubTab === 'pharmacies'
              ? 'bg-teal-800 text-white shadow-teal-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>الصيدليات ({pharmacies.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('campaigns')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
            activeSubTab === 'campaigns'
              ? 'bg-teal-800 text-white shadow-teal-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>حملات التبرع ({humanitarianCases.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
            activeSubTab === 'alerts'
              ? 'bg-teal-800 text-white shadow-teal-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>التنبيهات وحملات اللقاح ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('emergency')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
            activeSubTab === 'emergency'
              ? 'bg-teal-800 text-white shadow-teal-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Shield className="w-4 h-4 text-rose-400" />
          <span>أرقام الطوارئ ({emergencyContacts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('regions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
            activeSubTab === 'regions'
              ? 'bg-teal-800 text-white shadow-teal-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Map className="w-4 h-4 text-indigo-400" />
          <span>المناطق والقرى ({regions.length})</span>
        </button>
      </div>

      {/* SUB TAB 1: USERS MANAGEMENT */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">إدارة حسابات الأطباء والصيادلة والمدراء</h2>
              <p className="text-xs text-slate-500">إنشاء حسابات جديدة، تعليق الحسابات، أو حذفها.</p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة حساب جديد</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 rounded-r-xl">الاسم / الطبيب / الصيدلية</th>
                  <th className="p-3">اسم المستخدم</th>
                  <th className="p-3">الصلاحية (الدور)</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3 rounded-l-xl text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-600 font-mono">{u.username}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'doctor' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.role === 'admin' ? 'مدير النظام' : u.role === 'doctor' ? 'طبيب' : 'صيدلية'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'suspended' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.status === 'suspended' ? 'معلق' : 'نشط'}
                      </span>
                    </td>
                    <td className="p-3 flex items-center justify-center gap-1.5">
                      {u.id !== 'u-admin' && (
                        <>
                          <button
                            onClick={() => onUpdateUser({
                              ...u,
                              status: u.status === 'suspended' ? 'active' : 'suspended'
                            })}
                            className={`p-1.5 rounded-lg transition ${
                              u.status === 'suspended' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                            title={u.status === 'suspended' ? 'تنشيط الحساب' : 'تعليق الحساب'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteUser(u.id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                            title="حذف الحساب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 2: DOCTORS MANAGEMENT */}
      {activeSubTab === 'doctors' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">إدارة الأطباء والعيادات المسجلة</h2>
              <p className="text-xs text-slate-500">تعديل بيانات الأطباء أو حذفهم بالكامل.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doctors.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-slate-900 text-sm">{doc.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                      {doc.specialtyName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{doc.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">📍 {doc.address} | ☎️ {doc.phone}</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      const newName = prompt('تعديل اسم الطبيب:', doc.name);
                      if (newName) {
                        onUpdateDoctor({ ...doc, name: newName });
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>
                  <button
                    onClick={() => onDeleteDoctor(doc.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: PHARMACIES MANAGEMENT */}
      {activeSubTab === 'pharmacies' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">إدارة الصيدليات وصيدليات المناوبة</h2>
              <p className="text-xs text-slate-500">التحكم بحالة المناوبة اليومية وبيانات الصيدليات.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pharmacies.map((pharm) => (
              <div key={pharm.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-slate-900 text-sm">{pharm.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      pharm.isDutyToday ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {pharm.isDutyToday ? 'مناوبة اليوم 🟢' : 'دوام عادي'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">الصيدلاني: {pharm.pharmacistName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">📍 {pharm.address} | ☎️ {pharm.phone}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => onUpdatePharmacy({ ...pharm, isDutyToday: !pharm.isDutyToday })}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      pharm.isDutyToday ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {pharm.isDutyToday ? 'إلغاء المناوبة' : 'تعيين مناوب اليوم'}
                  </button>
                  <button
                    onClick={() => onDeletePharmacy(pharm.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: CAMPAIGNS MANAGEMENT */}
      {activeSubTab === 'campaigns' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">إدارة حملات التبرع والحالات الإنسانية</h2>
              <p className="text-xs text-slate-500">إضافة أو حذف أو تعديل مبالغ التبرعات وحالة الحالات.</p>
            </div>
            <button
              onClick={() => {
                const title = prompt('عنوان الحالة الإنسانية:');
                const patientName = prompt('اسم المريض:');
                const condition = prompt('التشخيص أو الوصف الطبي:');
                const requiredAmount = prompt('المبلغ المطلوب (مثال: 5,000,000 ل.س):');
                const hospital = prompt('المشفى أو المركز المعالج:');
                const phone = prompt('رقم التواصل:');
                if (title && patientName && requiredAmount) {
                  const newC: HumanitarianCase = {
                    id: `case-${Date.now()}`,
                    title,
                    patientName,
                    age: 'غير محدد',
                    condition: condition || 'حاجة عاجلة للعلاج',
                    requiredAmount,
                    collectedAmount: '0 ل.س',
                    hospital: hospital || 'مشفى دير حافر',
                    phone: phone || '0933000000',
                    isCompleted: false
                  };
                  onAddCase(newC);
                }
              }}
              className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حالة تبرع</span>
            </button>
          </div>

          <div className="space-y-3">
            {humanitarianCases.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-sm">{c.title}</h3>
                    {c.isCompleted && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        مكتمل التبرع ✅
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">المريض: <strong className="text-slate-900">{c.patientName}</strong> | المطلوب: <strong className="text-teal-700">{c.requiredAmount}</strong></p>
                  <p className="text-[11px] text-slate-500 mt-0.5">المشفى: {c.hospital} | التواصل: {c.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newCollected = prompt('تحديث المبلغ المجمع الحالي:', c.collectedAmount);
                      if (newCollected !== null) {
                        onUpdateCase({ ...c, collectedAmount: newCollected });
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition"
                  >
                    تحديث التبرعات
                  </button>
                  <button
                    onClick={() => onDeleteCase(c.id)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 5: ALERTS MANAGEMENT */}
      {activeSubTab === 'emergency' && (
          <AdminEmergency 
            emergencyContacts={emergencyContacts} 
            onAddContact={onAddContact} 
            onUpdateContact={onUpdateContact} 
            onDeleteContact={onDeleteContact} 
          />
        )}
        
        {activeSubTab === 'regions' && (
          <AdminRegions 
            regions={regions} subRegions={subRegions} 
            onAddRegion={onAddRegion} onUpdateRegion={onUpdateRegion} onDeleteRegion={onDeleteRegion}
            onAddSubRegion={onAddSubRegion} onUpdateSubRegion={onUpdateSubRegion} onDeleteSubRegion={onDeleteSubRegion}
          />
        )}

        {activeSubTab === 'alerts' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">إدارة التنبيهات الصحية وحملات اللقاح</h2>
              <p className="text-xs text-slate-500">نشر تعاميم صحية أو حملات لقاح فورية للمواطنين.</p>
            </div>
            <button
              onClick={() => {
                const title = prompt('عنوان التنبيه أو الحملة:');
                const content = prompt('تفاصيل التنبيه أو التعميم:');
                if (title && content) {
                  const newA: HealthAlert = {
                    id: `alert-${Date.now()}`,
                    title,
                    content,
                    type: 'vaccine',
                    date: 'اليوم'
                  };
                  onAddAlert(newA);
                }
              }}
              className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة تنبيه صحي</span>
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">{a.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{a.content}</p>
                </div>
                <button
                  onClick={() => onDeleteAlert(a.id)}
                  className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 6: EMERGENCY CONTACTS */}
      {activeSubTab === 'emergency' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
          <AdminEmergency 
            emergencyContacts={emergencyContacts} 
            onAddContact={onAddContact} 
            onUpdateContact={onUpdateContact} 
            onDeleteContact={onDeleteContact} 
          />
        </div>
      )}

      {/* SUB TAB 7: REGIONS & TOWNS */}
      {activeSubTab === 'regions' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
          <AdminRegions 
            regions={regions} 
            subRegions={subRegions} 
            onAddRegion={onAddRegion} 
            onUpdateRegion={onUpdateRegion} 
            onDeleteRegion={onDeleteRegion}
            onAddSubRegion={onAddSubRegion} 
            onUpdateSubRegion={onUpdateSubRegion} 
            onDeleteSubRegion={onDeleteSubRegion}
          />
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-slate-900">إنشاء حساب جديد</h3>
            <p className="text-xs text-slate-500">أنشئ حساباً لطبيب أو صيدلية وامنحه الصلاحية المناسبة.</p>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم صاحب الحساب أو العيادة:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: د. سامر الحامد"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المستخدم (Username):</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="مثال: dr.samer"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور:</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الدور والصلاحية:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-white"
                >
                  <option value="doctor">طبيب (Doctor)</option>
                  <option value="pharmacy">صيدلية (Pharmacy)</option>
                  <option value="admin">مدير النظام (Admin)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition"
              >
                حفظ وإنشاء الحساب
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
