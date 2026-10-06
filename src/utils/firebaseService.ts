import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  Doctor, 
  Pharmacy, 
  HealthAlert, 
  HumanitarianCase, 
  EmergencyContact, 
  BloodRequest, 
  MedicineInquiry, 
  UserSubmission 
} from '../types';
import { 
  INITIAL_DOCTORS, 
  INITIAL_PHARMACIES, 
  INITIAL_HEALTH_ALERTS, 
  INITIAL_HUMANITARIAN_CASES 
} from '../data/mockMedicalData';

// Sync Doctors
export function subscribeToDoctors(callback: (doctors: Doctor[]) => void) {
  const collPath = 'doctors';
  return onSnapshot(collection(db, collPath), (snapshot) => {
    if (!snapshot.empty) {
      const list: Doctor[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Doctor);
      });
      callback(list);
    } else {
      // If Firestore is empty initially, seed it from initial data
      seedInitialDoctors();
      callback(INITIAL_DOCTORS);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collPath);
  });
}

export async function saveDoctorToCloud(doctor: Doctor) {
  try {
    await setDoc(doc(db, 'doctors', doctor.id), doctor);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `doctors/${doctor.id}`);
  }
}

export async function deleteDoctorFromCloud(id: string) {
  try {
    await deleteDoc(doc(db, 'doctors', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `doctors/${id}`);
  }
}

async function seedInitialDoctors() {
  try {
    const batch = writeBatch(db);
    INITIAL_DOCTORS.forEach(docItem => {
      const docRef = doc(db, 'doctors', docItem.id);
      batch.set(docRef, docItem);
    });
    await batch.commit();
  } catch (e) {
    console.warn('Initial doctors seed skipped/offline');
  }
}

// Sync Pharmacies
export function subscribeToPharmacies(callback: (pharmacies: Pharmacy[]) => void) {
  const collPath = 'pharmacies';
  return onSnapshot(collection(db, collPath), (snapshot) => {
    if (!snapshot.empty) {
      const list: Pharmacy[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Pharmacy);
      });
      callback(list);
    } else {
      seedInitialPharmacies();
      callback(INITIAL_PHARMACIES);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collPath);
  });
}

export async function savePharmacyToCloud(pharmacy: Pharmacy) {
  try {
    await setDoc(doc(db, 'pharmacies', pharmacy.id), pharmacy);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `pharmacies/${pharmacy.id}`);
  }
}

export async function deletePharmacyFromCloud(id: string) {
  try {
    await deleteDoc(doc(db, 'pharmacies', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `pharmacies/${id}`);
  }
}

async function seedInitialPharmacies() {
  try {
    const batch = writeBatch(db);
    INITIAL_PHARMACIES.forEach(item => {
      const docRef = doc(db, 'pharmacies', item.id);
      batch.set(docRef, item);
    });
    await batch.commit();
  } catch (e) {
    console.warn('Initial pharmacies seed skipped/offline');
  }
}

// Sync Health Alerts
export function subscribeToHealthAlerts(callback: (alerts: HealthAlert[]) => void) {
  const collPath = 'health_alerts';
  return onSnapshot(collection(db, collPath), (snapshot) => {
    if (!snapshot.empty) {
      const list: HealthAlert[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as HealthAlert);
      });
      callback(list);
    } else {
      seedInitialHealthAlerts();
      callback(INITIAL_HEALTH_ALERTS);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collPath);
  });
}

export async function saveHealthAlertToCloud(alert: HealthAlert) {
  try {
    await setDoc(doc(db, 'health_alerts', alert.id), alert);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `health_alerts/${alert.id}`);
  }
}

export async function deleteHealthAlertFromCloud(id: string) {
  try {
    await deleteDoc(doc(db, 'health_alerts', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `health_alerts/${id}`);
  }
}

async function seedInitialHealthAlerts() {
  try {
    const batch = writeBatch(db);
    INITIAL_HEALTH_ALERTS.forEach(item => {
      const docRef = doc(db, 'health_alerts', item.id);
      batch.set(docRef, item);
    });
    await batch.commit();
  } catch (e) {
    console.warn('Initial health alerts seed skipped');
  }
}

// Sync Humanitarian Cases
export function subscribeToHumanitarianCases(callback: (cases: HumanitarianCase[]) => void) {
  const collPath = 'humanitarian_cases';
  return onSnapshot(collection(db, collPath), (snapshot) => {
    if (!snapshot.empty) {
      const list: HumanitarianCase[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as HumanitarianCase);
      });
      callback(list);
    } else {
      seedInitialHumanitarianCases();
      callback(INITIAL_HUMANITARIAN_CASES);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collPath);
  });
}

export async function saveHumanitarianCaseToCloud(hCase: HumanitarianCase) {
  try {
    await setDoc(doc(db, 'humanitarian_cases', hCase.id), hCase);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `humanitarian_cases/${hCase.id}`);
  }
}

export async function donateToCaseInCloud(id: string, amount: number, currentCase: HumanitarianCase) {
  try {
    const numericRequired = parseFloat(currentCase.requiredAmount.replace(/[^0-9]/g, '')) || 0;
    const currentCollected = parseFloat(currentCase.collectedAmount.replace(/[^0-9]/g, '')) || 0;
    const newCollected = Math.min(numericRequired, currentCollected + amount);
    const formattedCollected = newCollected.toLocaleString('ar-SY') + ' ل.س';
    const isCompleted = newCollected >= numericRequired;

    await updateDoc(doc(db, 'humanitarian_cases', id), {
      collectedAmount: formattedCollected,
      isCompleted
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `humanitarian_cases/${id}`);
  }
}

async function seedInitialHumanitarianCases() {
  try {
    const batch = writeBatch(db);
    INITIAL_HUMANITARIAN_CASES.forEach(item => {
      const docRef = doc(db, 'humanitarian_cases', item.id);
      batch.set(docRef, item);
    });
    await batch.commit();
  } catch (e) {
    console.warn('Initial humanitarian cases seed skipped');
  }
}

// Sync Blood Requests
export function subscribeToBloodRequests(callback: (requests: BloodRequest[]) => void) {
  const collPath = 'blood_requests';
  return onSnapshot(collection(db, collPath), (snapshot) => {
    const list: BloodRequest[] = [];
    snapshot.forEach(docSnap => {
      list.push({ ...docSnap.data(), id: docSnap.id } as BloodRequest);
    });
    callback(list);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collPath);
  });
}

export async function saveBloodRequestToCloud(req: BloodRequest) {
  try {
    await setDoc(doc(db, 'blood_requests', req.id), req);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `blood_requests/${req.id}`);
  }
}

export async function updateBloodRequestInCloud(id: string, updates: Partial<BloodRequest>) {
  try {
    await updateDoc(doc(db, 'blood_requests', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `blood_requests/${id}`);
  }
}

// Sync Medicine Inquiries
export function subscribeToMedicineInquiries(callback: (inquiries: MedicineInquiry[]) => void) {
  const collPath = 'medicine_inquiries';
  return onSnapshot(collection(db, collPath), (snapshot) => {
    const list: MedicineInquiry[] = [];
    snapshot.forEach(docSnap => {
      list.push({ ...docSnap.data(), id: docSnap.id } as MedicineInquiry);
    });
    callback(list);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collPath);
  });
}

export async function saveMedicineInquiryToCloud(inquiry: MedicineInquiry) {
  try {
    await setDoc(doc(db, 'medicine_inquiries', inquiry.id), inquiry);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `medicine_inquiries/${inquiry.id}`);
  }
}

export async function updateMedicineInquiryInCloud(id: string, updates: Partial<MedicineInquiry>) {
  try {
    await updateDoc(doc(db, 'medicine_inquiries', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `medicine_inquiries/${id}`);
  }
}

// Sync User Submissions
export function subscribeToSubmissions(callback: (subs: UserSubmission[]) => void) {
  const collPath = 'user_submissions';
  return onSnapshot(collection(db, collPath), (snapshot) => {
    const list: UserSubmission[] = [];
    snapshot.forEach(docSnap => {
      list.push({ ...docSnap.data(), id: docSnap.id } as UserSubmission);
    });
    callback(list);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collPath);
  });
}

export async function saveUserSubmissionToCloud(sub: UserSubmission) {
  try {
    await setDoc(doc(db, 'user_submissions', sub.id), sub);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `user_submissions/${sub.id}`);
  }
}
