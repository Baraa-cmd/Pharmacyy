export type TabType = 'home' | 'doctors' | 'pharmacies' | 'map' | 'emergency' | 'more' | 'alerts' | 'humanitarian' | 'admin_dashboard' | 'provider_portal' | 'blood_bank' | 'medicine_search';

export type UserRole = 'admin' | 'doctor' | 'pharmacy' | 'guest';

export interface SystemUser {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  linkedEntityId?: string; // id of doctor or pharmacy if applicable
  status: 'active' | 'suspended';
}

export type SpecialtyCategory = 
  | 'all'
  | 'pediatrics'       // أطفال
  | 'internal'         // داخلية
  | 'gynecology'       // نسائية
  | 'orthopedics'      // عظمية
  | 'surgery'          // جراحة
  | 'ophthalmology'    // عينية
  | 'ent'              // أذن أنف حنجرة
  | 'dermatology'      // جلدية
  | 'dental'           // أسنان
  | 'urology'          // بولية
  | 'general';         // عام

export interface SpecialtyItem {
  id: SpecialtyCategory;
  name: string;
  iconName: string;
  color: string;
  count?: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Doctor {
  id: string;
  name: string;
  title: string; // e.g. "أخصائي أمراض الأطفال"
  specialty: SpecialtyCategory;
  specialtyName: string;
  phone: string;
  whatsapp?: string;
  address: string; // e.g. "دير حافر - الشارع العام"
  landmark?: string; // e.g. "غرب ساحة الساعة"
  workingDays: string; // e.g. "السبت إلى الأربعاء"
  workingHours: string; // e.g. "9:00 ص - 2:00 ب.ظ"
  isAvailableNow: boolean;
  coordinates?: Coordinates;
  notes?: string;
  experienceYears?: number;
  consultationFee?: string;
  rating?: number;
  reviewsCount?: number;
  isVerified?: boolean;
}

export interface Pharmacy {
  id: string;
  name: string;
  pharmacistName: string;
  phone: string;
  whatsapp?: string;
  address: string;
  landmark?: string;
  isDutyToday: boolean; // مناوبة اليوم
  dutyType?: '24h' | 'night' | 'day'; // ليلية / 24 ساعة / نهارية
  workingHours: string;
  isOpenNow: boolean;
  coordinates?: Coordinates;
  notes?: string;
  services?: string[]; // قياس ضغط، إبر، الخ
}

export interface EmergencyContact {
  id: string;
  name: string;
  description: string;
  phone: string;
  type: 'ambulance' | 'health_center' | 'civil_defense' | 'red_crescent' | 'blood_bank';
  is24Hours: boolean;
  coordinates?: Coordinates;
}

export interface MedicalCenter {
  id: string;
  name: string;
  type: 'health_center' | 'lab' | 'imaging' | 'clinic_complex';
  typeName: string;
  phone: string;
  whatsapp?: string;
  address: string;
  landmark?: string;
  workingHours: string;
  services: string[];
  coordinates?: Coordinates;
}

export interface MapPlace {
  id: string;
  name: string;
  subtitle: string;
  category: 'doctor' | 'pharmacy' | 'duty_pharmacy' | 'center' | 'emergency';
  categoryLabel: string;
  coordinates: Coordinates;
  address: string;
  landmark?: string;
  workingHours: string;
  phone: string;
  whatsapp?: string;
  isOpenNow?: boolean;
  isDutyToday?: boolean;
  rawItem: Doctor | Pharmacy | MedicalCenter | EmergencyContact;
}

export interface FirstAidTopic {
  id: string;
  title: string;
  icon: string;
  summary: string;
  steps: string[];
  warning?: string;
}

export interface UserSubmission {
  id: string;
  type: 'doctor' | 'pharmacy' | 'center';
  name: string;
  categoryOrSpecialty: string;
  phone: string;
  whatsapp?: string;
  address: string;
  workingHours: string;
  submittedAt: string;
}

// 48. Health Alerts & Vaccine Campaigns Model
export interface HealthAlert {
  id: string;
  title: string;
  content: string;
  type: 'warning' | 'info' | 'vaccine'; // تحذير صحي / إرشاد طبي / حملة لقاح
  date: string;
  isRead?: boolean;
}

// 49. Humanitarian Medical Cases Model
export interface HumanitarianCase {
  id: string;
  title: string;
  patientName: string;
  age: string;
  condition: string;
  requiredAmount: string;
  collectedAmount: string;
  hospital: string;
  phone: string;
  whatsapp?: string;
  isCompleted?: boolean;
}

export interface Region {
  id: string;
  name: string;
}

export interface SubRegion {
  id: string;
  regionId: string;
  name: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: string;
  hospital: string;
  unitsNeeded: number;
  phone: string;
  urgency: 'critical' | 'high' | 'normal';
  createdAt: string;
  isFulfilled: boolean;
  notes?: string;
}

export interface MedicineInquiry {
  id: string;
  medicineName: string;
  patientPhone: string;
  notes?: string;
  createdAt: string;
  isFound: boolean;
}

