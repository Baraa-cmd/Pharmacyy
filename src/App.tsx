import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { DoctorsView } from './components/DoctorsView';
import { PharmaciesView } from './components/PharmaciesView';
import { EmergencyView } from './components/EmergencyView';
import { MedicalMapView } from './components/MedicalMapView';
import { MoreView } from './components/MoreView';
import { AlertsView } from './components/AlertsView';
import { HumanitarianView } from './components/HumanitarianView';
import { SplashScreen } from './components/SplashScreen';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ProviderPortal } from './components/ProviderPortal';

// Modals
import { DoctorDetailsModal } from './components/DoctorDetailsModal';
import { MedicineInquiryModal } from './components/MedicineInquiryModal';
import { LocationModal } from './components/LocationModal';
import { AddListingModal } from './components/AddListingModal';
import { BloodBankView } from './components/BloodBankView';
import { MedicineSearchView } from './components/MedicineSearchView';
import { PrintDirectoryModal } from './components/PrintDirectoryModal';
import { OfflineIndicator } from './components/OfflineIndicator';

// Types & Data
import { TabType, Doctor, Pharmacy, HealthAlert, HumanitarianCase, Coordinates, SpecialtyCategory, SystemUser, EmergencyContact, Region, SubRegion, BloodRequest, MedicineInquiry } from './types';
import { 
  getAllDoctors, 
  getAllPharmacies, 
  getAllHealthAlerts, 
  getAllHumanitarianCases,
  toggleFavoriteDoctor,
  toggleFavoritePharmacy,
  getFavoriteDoctorIds,
  getFavoritePharmacyIds,
  donateToCase
} from './utils/storage';
import {
  subscribeToDoctors,
  saveDoctorToCloud,
  deleteDoctorFromCloud,
  subscribeToPharmacies,
  savePharmacyToCloud,
  deletePharmacyFromCloud,
  subscribeToHealthAlerts,
  saveHealthAlertToCloud,
  deleteHealthAlertFromCloud,
  subscribeToHumanitarianCases,
  saveHumanitarianCaseToCloud,
  donateToCaseInCloud,
  subscribeToBloodRequests,
  saveBloodRequestToCloud,
  updateBloodRequestInCloud,
  subscribeToMedicineInquiries,
  saveMedicineInquiryToCloud,
  updateMedicineInquiryInCloud
} from './utils/firebaseService';
import { testFirestoreConnection } from './firebase';

export default function App() {
  // Splash & Auth States
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('deir_hafir_seen_splash');
  });

  const handleEnterApp = () => {
    sessionStorage.setItem('deir_hafir_seen_splash', 'true');
    setShowSplash(false);
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(() => {
    const saved = localStorage.getItem('deir_hafir_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('deir_hafir_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'u-admin', username: 'admin', password: 'admin123', role: 'admin', name: 'مدير النظام العام', status: 'active' },
      { id: 'u-doc-1', username: 'dr.ahmad', password: '123456', role: 'doctor', name: 'الدكتور أحمد المحمد', linkedEntityId: 'doc-1', status: 'active' },
      { id: 'u-pharm-1', username: 'pharmacy.salam', password: '123456', role: 'pharmacy', name: 'صيدلية السلام', linkedEntityId: 'pharm-1', status: 'active' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('deir_hafir_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('deir_hafir_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('deir_hafir_current_user');
    }
  }, [currentUser]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const saved = localStorage.getItem('deir_hafir_active_tab') as TabType;
    return saved || 'home';
  });

  useEffect(() => {
    localStorage.setItem('deir_hafir_active_tab', activeTab);
  }, [activeTab]);

  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyCategory>('all');

  // Core Lists States (synced with localStorage)
  const [doctors, setDoctors] = useState<Doctor[]>(() => getAllDoctors());
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(() => getAllPharmacies());
  
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem('deir_hafir_emergency_contacts');
    if (saved !== null) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [regions, setRegions] = useState<Region[]>(() => {
    const saved = localStorage.getItem('deir_hafir_regions');
    if (saved !== null) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [{ id: 'reg-1', name: 'منطقة دير حافر' }];
  });

  const [subRegions, setSubRegions] = useState<SubRegion[]>(() => {
    const saved = localStorage.getItem('deir_hafir_sub_regions');
    if (saved !== null) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'sub-1', regionId: 'reg-1', name: 'مدينة دير حافر' },
      { id: 'sub-2', regionId: 'reg-1', name: 'بلدة حميمة' },
      { id: 'sub-3', regionId: 'reg-1', name: 'قرية رسم الحرمل' }
    ];
  });

  const [alerts, setAlerts] = useState<HealthAlert[]>(() => getAllHealthAlerts());
  const [humanitarianCases, setHumanitarianCases] = useState<HumanitarianCase[]>(() => getAllHumanitarianCases());

  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() => {
    const saved = localStorage.getItem('deir_hafir_blood_requests');
    if (saved !== null) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [medicineInquiries, setMedicineInquiries] = useState<MedicineInquiry[]>(() => {
    const saved = localStorage.getItem('deir_hafir_medicine_inquiries');
    if (saved !== null) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [showPrintModal, setShowPrintModal] = useState(false);

  // LocalStorage Auto Sync Effects
  useEffect(() => {
    localStorage.setItem('deir_hafir_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('deir_hafir_pharmacies', JSON.stringify(pharmacies));
  }, [pharmacies]);

  useEffect(() => {
    localStorage.setItem('deir_hafir_emergency_contacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  useEffect(() => {
    localStorage.setItem('deir_hafir_regions', JSON.stringify(regions));
  }, [regions]);

  useEffect(() => {
    localStorage.setItem('deir_hafir_sub_regions', JSON.stringify(subRegions));
  }, [subRegions]);

  useEffect(() => {
    localStorage.setItem('deir_hafir_health_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('deir_hafir_humanitarian_cases', JSON.stringify(humanitarianCases));
  }, [humanitarianCases]);

  useEffect(() => {
    localStorage.setItem('deir_hafir_blood_requests', JSON.stringify(bloodRequests));
  }, [bloodRequests]);

  useEffect(() => {
    localStorage.setItem('deir_hafir_medicine_inquiries', JSON.stringify(medicineInquiries));
  }, [medicineInquiries]);

  // Favorite Lists
  const [favoriteDoctorIds, setFavoriteDoctorIds] = useState<string[]>([]);
  const [favoritePharmacyIds, setFavoritePharmacyIds] = useState<string[]>([]);

  // Modal Visibility States
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPharmacyForInquiry, setSelectedPharmacyForInquiry] = useState<Pharmacy | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [mapInitialSelectedId, setMapInitialSelectedId] = useState<string | null>(null);

  // Single Location Modal state
  const [locationModalItem, setLocationModalItem] = useState<{
    isOpen: boolean;
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
  }>({
    isOpen: false,
    title: '',
    type: 'doctor',
    address: ''
  });

  // Load Favorites Data
  const loadAllData = () => {
    setFavoriteDoctorIds(getFavoriteDoctorIds());
    setFavoritePharmacyIds(getFavoritePharmacyIds());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Firebase Realtime Subscriptions & Cloud Sync
  useEffect(() => {
    testFirestoreConnection();
    const unsubDoctors = subscribeToDoctors((cloudDoctors) => {
      if (cloudDoctors && cloudDoctors.length > 0) {
        setDoctors(cloudDoctors);
      }
    });
    const unsubPharmacies = subscribeToPharmacies((cloudPharmacies) => {
      if (cloudPharmacies && cloudPharmacies.length > 0) {
        setPharmacies(cloudPharmacies);
      }
    });
    const unsubAlerts = subscribeToHealthAlerts((cloudAlerts) => {
      if (cloudAlerts && cloudAlerts.length > 0) {
        setAlerts(cloudAlerts);
      }
    });
    const unsubCases = subscribeToHumanitarianCases((cloudCases) => {
      if (cloudCases && cloudCases.length > 0) {
        setHumanitarianCases(cloudCases);
      }
    });
    const unsubBlood = subscribeToBloodRequests((cloudBlood) => {
      setBloodRequests(cloudBlood);
    });
    const unsubInquiries = subscribeToMedicineInquiries((cloudInquiries) => {
      setMedicineInquiries(cloudInquiries);
    });

    return () => {
      unsubDoctors();
      unsubPharmacies();
      unsubAlerts();
      unsubCases();
      unsubBlood();
      unsubInquiries();
    };
  }, []);

  // CRUD Handlers for Users & Entities
  const handleAddUser = (user: SystemUser) => {
    setUsers(prev => [...prev, user]);
  };
  const handleUpdateUser = (updated: SystemUser) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };
  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleAddDoctor = (doc: Doctor) => {
    const updated = [doc, ...doctors];
    setDoctors(updated);
    localStorage.setItem('deir_hafir_doctors', JSON.stringify(updated));
    saveDoctorToCloud(doc);
  };
  const handleUpdateDoctor = (doc: Doctor) => {
    const updated = doctors.map(d => d.id === doc.id ? doc : d);
    setDoctors(updated);
    localStorage.setItem('deir_hafir_doctors', JSON.stringify(updated));
    saveDoctorToCloud(doc);
  };
  const handleDeleteDoctor = (id: string) => {
    const updated = doctors.filter(d => d.id !== id);
    setDoctors(updated);
    localStorage.setItem('deir_hafir_doctors', JSON.stringify(updated));
    deleteDoctorFromCloud(id);
  };

  const handleAddPharmacy = (pharm: Pharmacy) => {
    const updated = [pharm, ...pharmacies];
    setPharmacies(updated);
    localStorage.setItem('deir_hafir_pharmacies', JSON.stringify(updated));
    savePharmacyToCloud(pharm);
  };
  const handleUpdatePharmacy = (pharm: Pharmacy) => {
    const updated = pharmacies.map(p => p.id === pharm.id ? pharm : p);
    setPharmacies(updated);
    localStorage.setItem('deir_hafir_pharmacies', JSON.stringify(updated));
    savePharmacyToCloud(pharm);
  };
  const handleDeletePharmacy = (id: string) => {
    const updated = pharmacies.filter(p => p.id !== id);
    setPharmacies(updated);
    localStorage.setItem('deir_hafir_pharmacies', JSON.stringify(updated));
    deletePharmacyFromCloud(id);
  };

  const handleAddCase = (c: HumanitarianCase) => {
    const updated = [c, ...humanitarianCases];
    setHumanitarianCases(updated);
    localStorage.setItem('deir_hafir_humanitarian_cases', JSON.stringify(updated));
    saveHumanitarianCaseToCloud(c);
  };
  const handleUpdateCase = (c: HumanitarianCase) => {
    const updated = humanitarianCases.map(item => item.id === c.id ? c : item);
    setHumanitarianCases(updated);
    localStorage.setItem('deir_hafir_humanitarian_cases', JSON.stringify(updated));
    saveHumanitarianCaseToCloud(c);
  };
  const handleDeleteCase = (id: string) => {
    const updated = humanitarianCases.filter(item => item.id !== id);
    setHumanitarianCases(updated);
    localStorage.setItem('deir_hafir_humanitarian_cases', JSON.stringify(updated));
  };

  const handleAddAlert = (a: HealthAlert) => {
    const updated = [a, ...alerts];
    setAlerts(updated);
    localStorage.setItem('deir_hafir_health_alerts', JSON.stringify(updated));
    saveHealthAlertToCloud(a);
  };
  const handleDeleteAlert = (id: string) => {
    const updated = alerts.filter(item => item.id !== id);
    setAlerts(updated);
    localStorage.setItem('deir_hafir_health_alerts', JSON.stringify(updated));
    deleteHealthAlertFromCloud(id);
  };

  // Handlers for Favorites
  const handleToggleFavDoctor = (id: string) => {
    toggleFavoriteDoctor(id);
    setFavoriteDoctorIds(getFavoriteDoctorIds());
  };

  const handleToggleFavPharmacy = (id: string) => {
    toggleFavoritePharmacy(id);
    setFavoritePharmacyIds(getFavoritePharmacyIds());
  };

  // Handler for Humanitarian Donation
  const handleUpdateDonation = (caseId: string, amount: number) => {
    const targetCase = humanitarianCases.find(c => c.id === caseId);
    donateToCase(caseId, amount);
    setHumanitarianCases(getAllHumanitarianCases()); // Refresh cases
    if (targetCase) {
      donateToCaseInCloud(caseId, amount, targetCase);
    }
  };

  // Map Navigation shortcut
  const handleOpenOnMap = (id: string) => {
    setMapInitialSelectedId(id);
    setActiveTab('map');
  };

  // Tab contents router
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            doctors={doctors}
            pharmacies={pharmacies}
            emergencyContacts={emergencyContacts}
            healthAlerts={alerts}
            humanitarianCases={humanitarianCases}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setMapInitialSelectedId(null);
            }}
            onSelectSpecialty={(spec) => {
              setSelectedSpecialty(spec);
              setActiveTab('doctors');
            }}
            onSelectDoctor={(doc) => setSelectedDoctor(doc)}
            onOpenMedicineInquiry={(ph) => setSelectedPharmacyForInquiry(ph)}
            favoriteDoctorIds={favoriteDoctorIds}
            favoritePharmacyIds={favoritePharmacyIds}
            onToggleFavoriteDoctor={handleToggleFavDoctor}
            onOpenAddModal={() => setAddModalOpen(true)}
            onOpenPrintModal={() => setShowPrintModal(true)}
            onOpenLocationModal={(item) => {
              setLocationModalItem({
                isOpen: true,
                ...item
              });
            }}
          />
        );
      case 'doctors':
        return (
          <DoctorsView
            doctors={doctors}
            selectedSpecialty={selectedSpecialty}
            onSelectSpecialty={setSelectedSpecialty}
            favoriteDoctorIds={favoriteDoctorIds}
            onToggleFavoriteDoctor={handleToggleFavDoctor}
            onSelectDoctor={(doc) => setSelectedDoctor(doc)}
            onOpenAddModal={() => setAddModalOpen(true)}
            onOpenLocationModal={(item) => {
              setLocationModalItem({
                isOpen: true,
                ...item
              });
            }}
          />
        );
      case 'pharmacies':
        return (
          <PharmaciesView
            pharmacies={pharmacies}
            favoritePharmacyIds={favoritePharmacyIds}
            onToggleFavoritePharmacy={handleToggleFavPharmacy}
            onOpenMedicineInquiry={(ph) => setSelectedPharmacyForInquiry(ph)}
            onOpenAddModal={() => setAddModalOpen(true)}
            onOpenLocationModal={(item) => {
              setLocationModalItem({
                isOpen: true,
                ...item
              });
            }}
          />
        );
      case 'emergency':
        

        const medicalCenters = [
          {
            id: 'mc-1',
            name: 'مستوصف دير حافر الخيري العام',
            typeName: 'مستوصف صحي حكومي',
            type: 'center' as const,
            address: 'دير حافر - بجانب المجلس البلدي',
            landmark: 'خلف الساحة الرئيسية للبلدة',
            workingHours: '8:00 ص - 2:00 ظ (عطلة الجمعة والسبت)',
            phone: '0955112233',
            services: ['عيادة أسنان خيري', 'صيدلية اللقاح الوطني', 'ضماد وإسعاف أولي']
          },
          {
            id: 'mc-2',
            name: 'مختبر الشفاء للتحاليل الطبية الدقيقة',
            typeName: 'مختبر طبي خاص',
            type: 'lab' as const,
            address: 'دير حافر - شارع المصارف',
            landmark: 'مقابل بنك بيمو سابقاً',
            workingHours: '9:00 ص - 9:00 م (يومياً)',
            phone: '0966445566',
            whatsapp: '0966445566',
            services: ['تحاليل دم شاملة', 'هرمونات وفحص أورام', 'تحليل سكري وزمرة دم']
          },
          {
            id: 'mc-3',
            name: 'مركز الرازق للتصوير الشعاعي والإيكو',
            typeName: 'مركز أشعة تشخيصية',
            type: 'imaging' as const,
            address: 'دير حافر - الشارع العام للعيادات',
            landmark: 'فوق صيدلية السلام',
            workingHours: '10:00 ص - 8:00 م (عدا الجمعة)',
            phone: '0944998877',
            whatsapp: '0944998877',
            services: ['تصوير أشعة سينية X-Ray', 'تصوير إيكو ثلاثي الأبعاد', 'بانوراما أسنان']
          }
        ];

        return (
          <EmergencyView
            emergencyContacts={emergencyContacts}
            medicalCenters={medicalCenters}
            onOpenLocationModal={(item) => {
              setLocationModalItem({
                isOpen: true,
                ...item
              });
            }}
          />
        );
      case 'map':
        const emContactsForMap = [
          { id: 'ec-1', name: 'منظومة الإسعاف السريع دير حافر', phone: '0930123456', type: 'ambulance' as const, is24Hours: true, description: 'الاتصال المباشر لطلب سيارة إسعاف مجهزة للحالات الحرجة.' }
        ];

        const medCentersForMap = [
          { id: 'mc-1', name: 'مستوصف دير حافر الخيري العام', typeName: 'مستوصف صحي حكومي', type: 'center' as const, address: 'دير حافر - بجانب المجلس البلدي', workingHours: '8:00 ص - 2:00 ظ', phone: '0955112233' },
          { id: 'mc-2', name: 'مختبر الشفاء للتحاليل الطبية الدقيقة', typeName: 'مختبر طبي خاص', type: 'lab' as const, address: 'دير حافر - شارع المصارف', workingHours: '9:00 ص - 9:00 م', phone: '0966445566', whatsapp: '0966445566' }
        ];

        return (
          <MedicalMapView
            doctors={doctors}
            pharmacies={pharmacies}
            medicalCenters={medCentersForMap}
            emergencyContacts={emContactsForMap}
            initialSelectedId={mapInitialSelectedId}
            onSelectDoctor={(doc) => setSelectedDoctor(doc)}
            onOpenMedicineInquiry={(ph) => setSelectedPharmacyForInquiry(ph)}
          />
        );
      case 'more':
        return (
          <MoreView
            doctors={doctors}
            pharmacies={pharmacies}
            favoriteDoctorIds={favoriteDoctorIds}
            favoritePharmacyIds={favoritePharmacyIds}
            onToggleFavoriteDoctor={handleToggleFavDoctor}
            onToggleFavoritePharmacy={handleToggleFavPharmacy}
            onSelectDoctor={(doc) => setSelectedDoctor(doc)}
            onOpenAddModal={() => setAddModalOpen(true)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setMapInitialSelectedId(null);
            }}
          />
        );
      case 'blood_bank':
        return (
          <BloodBankView
            bloodRequests={bloodRequests}
            onAddBloodRequest={(r) => {
              setBloodRequests([r, ...bloodRequests]);
              saveBloodRequestToCloud(r);
            }}
            onFulfillBloodRequest={(id) => {
              setBloodRequests(bloodRequests.map(x => x.id === id ? { ...x, isFulfilled: true } : x));
              updateBloodRequestInCloud(id, { isFulfilled: true });
            }}
            emergencyContacts={emergencyContacts}
          />
        );
      case 'medicine_search':
        return (
          <MedicineSearchView
            pharmacies={pharmacies}
            medicineInquiries={medicineInquiries}
            onAddInquiry={(iq) => {
              setMedicineInquiries([iq, ...medicineInquiries]);
              saveMedicineInquiryToCloud(iq);
            }}
            onResolveInquiry={(id) => {
              setMedicineInquiries(
                medicineInquiries.map(x => x.id === id ? { ...x, isFound: true } : x)
              );
              updateMedicineInquiryInCloud(id, { isFound: true });
            }}
          />
        );
      case 'alerts':
        return <AlertsView alerts={alerts} />;
      case 'humanitarian':
        return (
          <HumanitarianView
            cases={humanitarianCases}
            onUpdateDonation={handleUpdateDonation}
          />
        );
      case 'admin_dashboard':
        return (
          <AdminDashboard
            currentUser={currentUser || { id: 'u-admin', username: 'admin', role: 'admin', name: 'المدير', status: 'active', password: '' }}
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            doctors={doctors}
            onAddDoctor={handleAddDoctor}
            onUpdateDoctor={handleUpdateDoctor}
            onDeleteDoctor={handleDeleteDoctor}
            pharmacies={pharmacies}
            onAddPharmacy={handleAddPharmacy}
            onUpdatePharmacy={handleUpdatePharmacy}
            onDeletePharmacy={handleDeletePharmacy}
            humanitarianCases={humanitarianCases}
            onAddCase={handleAddCase}
            onUpdateCase={handleUpdateCase}
            onDeleteCase={handleDeleteCase}
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onDeleteAlert={handleDeleteAlert}
            emergencyContacts={emergencyContacts}
            onAddContact={(c) => setEmergencyContacts([...emergencyContacts, c])}
            onUpdateContact={(c) => setEmergencyContacts(emergencyContacts.map(x => x.id === c.id ? c : x))}
            onDeleteContact={(id) => setEmergencyContacts(emergencyContacts.filter(x => x.id !== id))}
            regions={regions}
            subRegions={subRegions}
            onAddRegion={(r) => setRegions([...regions, r])}
            onUpdateRegion={(r) => setRegions(regions.map(x => x.id === r.id ? r : x))}
            onDeleteRegion={(id) => setRegions(regions.filter(x => x.id !== id))}
            onAddSubRegion={(s) => setSubRegions([...subRegions, s])}
            onUpdateSubRegion={(s) => setSubRegions(subRegions.map(x => x.id === s.id ? s : x))}
            onDeleteSubRegion={(id) => setSubRegions(subRegions.filter(x => x.id !== id))}
            onLogout={() => {
              setCurrentUser(null);
              setActiveTab('home');
            }}
          />
        );
      case 'provider_portal':
        return (
          <ProviderPortal
            currentUser={currentUser || { id: 'u-doc', username: 'dr', role: 'doctor', name: 'طبيب', status: 'active', password: '' }}
            doctors={doctors}
            pharmacies={pharmacies}
            onUpdateDoctor={handleUpdateDoctor}
            onUpdatePharmacy={handleUpdatePharmacy}
            onLogout={() => {
              setCurrentUser(null);
              setActiveTab('home');
            }}
          />
        );
      default:
        return null;
    }
  };

  if (showSplash) {
    return <SplashScreen onEnter={handleEnterApp} />;
  }

  return (
    <AndroidFrame>
      <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden select-none">
        {/* Header */}
        <Header 
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenDashboard={() => {
            if (currentUser?.role === 'admin') {
              setActiveTab('admin_dashboard');
            } else if (currentUser) {
              setActiveTab('provider_portal');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          onOpenAddModal={() => setAddModalOpen(true)}
          onNavigateEmergency={() => setActiveTab('emergency')}
          onNavigateMap={() => {
            setActiveTab('map');
            setMapInitialSelectedId(null);
          }}
          onNavigateAlerts={() => setActiveTab('alerts')}
          onNavigateHumanitarian={() => setActiveTab('humanitarian')}
          favoritesCount={favoriteDoctorIds.length + favoritePharmacyIds.length}
          alertsCount={alerts.length}
          onNavigateMore={() => setActiveTab('more')}
        />

        {/* Dynamic View Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative">
          {renderContent()}
        </div>

        {/* Navigation Bottom bar */}
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            setMapInitialSelectedId(null);
          }}
          favoritesCount={favoriteDoctorIds.length + favoritePharmacyIds.length}
        />

        {/* MODALS */}

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          users={users}
          onLogin={(user) => {
            setCurrentUser(user);
            if (user.role === 'admin') {
              setActiveTab('admin_dashboard');
            } else {
              setActiveTab('provider_portal');
            }
          }}
        />

        {/* Clinic details modal */}
        <DoctorDetailsModal
          doctor={selectedDoctor}
          isOpen={selectedDoctor !== null}
          onClose={() => setSelectedDoctor(null)}
          isFavorite={selectedDoctor ? favoriteDoctorIds.includes(selectedDoctor.id) : false}
          onToggleFavorite={handleToggleFavDoctor}
          onOpenLocationModal={(item) => {
            setLocationModalItem({
              isOpen: true,
              ...item
            });
          }}
        />

        {/* Medicine inquiry modal */}
        <MedicineInquiryModal
          pharmacy={selectedPharmacyForInquiry}
          isOpen={selectedPharmacyForInquiry !== null}
          onClose={() => setSelectedPharmacyForInquiry(null)}
        />

        {/* Single item coordinates Map preview modal */}
        <LocationModal
          isOpen={locationModalItem.isOpen}
          onClose={() => setLocationModalItem({ ...locationModalItem, isOpen: false })}
          title={locationModalItem.title}
          subtitle={locationModalItem.subtitle}
          type={locationModalItem.type}
          address={locationModalItem.address}
          landmark={locationModalItem.landmark}
          phone={locationModalItem.phone}
          whatsapp={locationModalItem.whatsapp}
          workingHours={locationModalItem.workingHours}
          coordinates={locationModalItem.coordinates}
          onOpenFullMap={() => {
            if (locationModalItem.id) {
              handleOpenOnMap(locationModalItem.id);
            } else {
              setActiveTab('map');
            }
          }}
        />

        {/* Community Submission modal */}
        <AddListingModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onRefreshData={loadAllData}
        />

        {/* Printable Directory Modal */}
        <PrintDirectoryModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          doctors={doctors}
          pharmacies={pharmacies}
          emergencyContacts={emergencyContacts}
        />

        {/* PWA Offline Indicator */}
        <OfflineIndicator />
      </div>
    </AndroidFrame>
  );
}
