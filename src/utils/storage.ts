import { Doctor, Pharmacy, MedicalCenter, UserSubmission, HealthAlert, HumanitarianCase } from '../types';
import { 
  INITIAL_DOCTORS, 
  INITIAL_PHARMACIES, 
  MEDICAL_CENTERS, 
  INITIAL_HEALTH_ALERTS, 
  INITIAL_HUMANITARIAN_CASES 
} from '../data/mockMedicalData';

const FAVORITES_DOCTORS_KEY = 'dalili_fav_doctors';
const FAVORITES_PHARMACIES_KEY = 'dalili_fav_pharmacies';
const CUSTOM_DOCTORS_KEY = 'dalili_custom_doctors';
const CUSTOM_PHARMACIES_KEY = 'dalili_custom_pharmacies';
const SUBMISSIONS_KEY = 'dalili_submissions';
const HEALTH_ALERTS_KEY = 'dalili_health_alerts';
const HUMANITARIAN_CASES_KEY = 'dalili_humanitarian_cases';

export function getFavoriteDoctorIds(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_DOCTORS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteDoctor(id: string): string[] {
  const current = getFavoriteDoctorIds();
  const exists = current.includes(id);
  const updated = exists ? current.filter(item => item !== id) : [...current, id];
  try {
    localStorage.setItem(FAVORITES_DOCTORS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function getFavoritePharmacyIds(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_PHARMACIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleFavoritePharmacy(id: string): string[] {
  const current = getFavoritePharmacyIds();
  const exists = current.includes(id);
  const updated = exists ? current.filter(item => item !== id) : [...current, id];
  try {
    localStorage.setItem(FAVORITES_PHARMACIES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function getAllDoctors(): Doctor[] {
  try {
    const data = localStorage.getItem('deir_hafir_doctors');
    if (data === null) {
      localStorage.setItem('deir_hafir_doctors', JSON.stringify(INITIAL_DOCTORS));
      return INITIAL_DOCTORS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_DOCTORS;
  }
}

export function addCustomDoctor(doc: Doctor): void {
  try {
    const doctors = getAllDoctors();
    doctors.unshift(doc);
    localStorage.setItem('deir_hafir_doctors', JSON.stringify(doctors));
  } catch (e) {
    console.error(e);
  }
}

export function getAllPharmacies(): Pharmacy[] {
  try {
    const data = localStorage.getItem('deir_hafir_pharmacies');
    if (data === null) {
      localStorage.setItem('deir_hafir_pharmacies', JSON.stringify(INITIAL_PHARMACIES));
      return INITIAL_PHARMACIES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_PHARMACIES;
  }
}

export function addCustomPharmacy(pharmacy: Pharmacy): void {
  try {
    const pharmacies = getAllPharmacies();
    pharmacies.unshift(pharmacy);
    localStorage.setItem('deir_hafir_pharmacies', JSON.stringify(pharmacies));
  } catch (e) {
    console.error(e);
  }
}

export function getAllMedicalCenters(): MedicalCenter[] {
  return MEDICAL_CENTERS;
}

export function getSubmissions(): UserSubmission[] {
  try {
    const data = localStorage.getItem(SUBMISSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSubmission(sub: UserSubmission): void {
  try {
    const list = getSubmissions();
    list.unshift(sub);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

// 48. Health Alerts Storage Actions
export function getAllHealthAlerts(): HealthAlert[] {
  try {
    const data = localStorage.getItem('deir_hafir_health_alerts');
    if (data === null) {
      localStorage.setItem('deir_hafir_health_alerts', JSON.stringify(INITIAL_HEALTH_ALERTS));
      return INITIAL_HEALTH_ALERTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_HEALTH_ALERTS;
  }
}

export function addHealthAlert(alert: HealthAlert): void {
  try {
    const list = getAllHealthAlerts();
    list.unshift(alert);
    localStorage.setItem('deir_hafir_health_alerts', JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

// 49. Humanitarian Cases Storage Actions
export function getAllHumanitarianCases(): HumanitarianCase[] {
  try {
    const data = localStorage.getItem('deir_hafir_humanitarian_cases');
    if (data === null) {
      localStorage.setItem('deir_hafir_humanitarian_cases', JSON.stringify(INITIAL_HUMANITARIAN_CASES));
      return INITIAL_HUMANITARIAN_CASES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_HUMANITARIAN_CASES;
  }
}

export function addHumanitarianCase(c: HumanitarianCase): void {
  try {
    const list = getAllHumanitarianCases();
    list.unshift(c);
    localStorage.setItem(HUMANITARIAN_CASES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

export function donateToCase(id: string, amount: number): HumanitarianCase[] {
  try {
    const list = getAllHumanitarianCases();
    const updated = list.map(item => {
      if (item.id === id) {
        // Parse numerical values to increment
        const numericRequired = parseFloat(item.requiredAmount.replace(/[^0-9]/g, ''));
        const currentCollected = parseFloat(item.collectedAmount.replace(/[^0-9]/g, ''));
        const newCollected = Math.min(numericRequired, currentCollected + amount);
        const formattedCollected = newCollected.toLocaleString('ar-SY') + ' ل.س';
        const isCompleted = newCollected >= numericRequired;
        return {
          ...item,
          collectedAmount: formattedCollected,
          isCompleted
        };
      }
      return item;
    });
    localStorage.setItem(HUMANITARIAN_CASES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
    return getAllHumanitarianCases();
  }
}

export function resetAllData(): void {
  try {
    localStorage.removeItem('deir_hafir_doctors');
    localStorage.removeItem('deir_hafir_pharmacies');
    localStorage.removeItem('deir_hafir_health_alerts');
    localStorage.removeItem('deir_hafir_humanitarian_cases');
    localStorage.removeItem('deir_hafir_blood_requests');
    localStorage.removeItem('deir_hafir_medicine_inquiries');
    localStorage.removeItem(SUBMISSIONS_KEY);
    localStorage.removeItem(FAVORITES_DOCTORS_KEY);
    localStorage.removeItem(FAVORITES_PHARMACIES_KEY);
    localStorage.setItem('deir_hafir_doctors', JSON.stringify([]));
    localStorage.setItem('deir_hafir_pharmacies', JSON.stringify([]));
    localStorage.setItem('deir_hafir_health_alerts', JSON.stringify([]));
    localStorage.setItem('deir_hafir_humanitarian_cases', JSON.stringify([]));
    localStorage.setItem('deir_hafir_blood_requests', JSON.stringify([]));
    localStorage.setItem('deir_hafir_medicine_inquiries', JSON.stringify([]));
  } catch (e) {
    console.error(e);
  }
}

// WhatsApp URL generator
export function buildWhatsAppDoctorUrl(phone: string, doctorName: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '963' + cleanPhone.slice(1) : cleanPhone;
  const message = encodeURIComponent(`مرحباً دكتور ${doctorName}، أود الاستفسار عن كشفية العيادة ومواعيد الدوام المتاحة القادمة من فضلك.`);
  return `https://wa.me/${formattedPhone}?text=${message}`;
}

export function buildWhatsAppPharmacyMedicineUrl(phone: string, pharmacyName: string, medicineName?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '963' + cleanPhone.slice(1) : cleanPhone;
  const baseText = medicineName 
    ? `مرحباً صيدلية ${pharmacyName}، أود الاستفسار عن مدى توفر الدواء التالي لديكم: (${medicineName}) والجرعة المتاحة وسعره الحالي.`
    : `مرحباً صيدلية ${pharmacyName}، أود الاستفسار عن مدى توفر بعض الأدوية الطبية لديكم من فضلك.`;
  const message = encodeURIComponent(baseText);
  return `https://wa.me/${formattedPhone}?text=${message}`;
}

export function buildWhatsAppLabUrl(phone: string, labName: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '963' + cleanPhone.slice(1) : cleanPhone;
  const message = encodeURIComponent(`مرحباً ${labName}، أود الاستفسار من فضلكم عن تكلفة التحليل الطبي والأوراق/الصيام المطلوبة لإجرائه وتاريخ تسليم النتائج.`);
  return `https://wa.me/${formattedPhone}?text=${message}`;
}

export function buildWhatsAppHumanitarianDonateUrl(phone: string, caseTitle: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '963' + cleanPhone.slice(1) : cleanPhone;
  const message = encodeURIComponent(`مرحباً، أود المساهمة والتبرع المالي لصالح الحالة الطبية الإنسانية: (${caseTitle}). يرجى تزويدي بطريقة إيصال مبلغ التبرع المتاحة وشكراً جزيلاً لكم.`);
  return `https://wa.me/${formattedPhone}?text=${message}`;
}
