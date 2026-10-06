import { Doctor, Pharmacy, EmergencyContact, MedicalCenter, SpecialtyItem, FirstAidTopic, HealthAlert, HumanitarianCase } from '../types';

export const SPECIALTIES: SpecialtyItem[] = [
  { id: 'all', name: 'الكل', iconName: 'Stethoscope', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'pediatrics', name: 'أطفال', iconName: 'Baby', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'internal', name: 'داخلية', iconName: 'HeartPulse', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'gynecology', name: 'نسائية', iconName: 'Users', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'orthopedics', name: 'عظمية', iconName: 'Bone', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'surgery', name: 'جراحة عامة', iconName: 'Activity', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'dental', name: 'أسنان', iconName: 'Smile', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'ophthalmology', name: 'عينية', iconName: 'Eye', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'ent', name: 'أذن أنف حنجرة', iconName: 'Headphones', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  { id: 'dermatology', name: 'جلدية', iconName: 'Sparkles', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
  { id: 'urology', name: 'بولية', iconName: 'ShieldAlert', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'general', name: 'طبيب عام', iconName: 'Cross', color: 'bg-teal-50 text-teal-700 border-teal-200' }
];

export const DEIR_HAFIR_CENTER = {
  lat: 36.1565,
  lng: 37.7055,
  name: 'مركز مدينة دير حافر'
};

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'الدكتور أحمد المحمد',
    title: 'أخصائي أمراض الأطفال والرضع، خبرة طويلة في علاج أمراض الطفولة وحديثي الولادة',
    specialty: 'pediatrics',
    specialtyName: 'أطفال',
    phone: '0933123456',
    whatsapp: '963933123456',
    address: 'دير حافر - الشارع العام',
    landmark: 'بجانب صيدلية السلام',
    workingDays: 'السبت إلى الأربعاء',
    workingHours: '9:00 ص - 2:00 ظ | 5:00 م - 8:30 م',
    isAvailableNow: true,
    coordinates: { lat: 36.1569, lng: 37.7053 },
    experienceYears: 14,
    consultationFee: 'رمزية / جمعية',
    rating: 4.9,
    reviewsCount: 38,
    isVerified: true,
    notes: 'العيادة مجهزة بحاضنة أطفال وجهاز رذاذ متطور.'
  },
  {
    id: 'doc-2',
    name: 'الدكتورة منى العلي',
    title: 'أخصائية التوليد وأمراض النساء وعلاج العقم والتشخيص بالإيكو ثنائي الأبعاد وثلاثي الأبعاد',
    specialty: 'gynecology',
    specialtyName: 'نسائية',
    phone: '0944789012',
    whatsapp: '963944789012',
    address: 'دير حافر - شارع العيادات',
    landmark: 'فوق مختبر الأمل',
    workingDays: 'الأحد إلى الخميس',
    workingHours: '10:00 ص - 3:00 ظ',
    isAvailableNow: true,
    coordinates: { lat: 36.1582, lng: 37.7042 },
    experienceYears: 11,
    rating: 4.8,
    reviewsCount: 42,
    isVerified: true,
    notes: 'تتوفر بالعيادة أجهزة إيكو متطورة 4D.'
  },
  {
    id: 'doc-3',
    name: 'الدكتور محمد المصطفى',
    title: 'أخصائي الأمراض الداخلية والقلبية والمفاصل والسكري وقثطرة الشرايين التاجية',
    specialty: 'internal',
    specialtyName: 'داخلية',
    phone: '0955345678',
    whatsapp: '963955345678',
    address: 'دير حافر - ساحة الساعة',
    landmark: 'بجانب الصيدلية المركزية',
    workingDays: 'السبت إلى الخميس',
    workingHours: '9:30 ص - 1:30 ظ | 4:30 م - 8:00 م',
    isAvailableNow: false,
    coordinates: { lat: 36.1573, lng: 37.7067 },
    experienceYears: 16,
    rating: 4.9,
    reviewsCount: 56,
    isVerified: true,
    notes: 'يتوفر جهاز تخطيط قلب كهربائي ECG ومقياس نسبة أكسجين بالدم.'
  },
  {
    id: 'doc-4',
    name: 'الدكتور خالد اليوسف',
    title: 'أخصائي جراحة العظام والمفاصل والعمود الفقري ومعالجة التشوهات والكسور الحادة',
    specialty: 'orthopedics',
    specialtyName: 'عظمية',
    phone: '0966901234',
    whatsapp: '963966901234',
    address: 'دير حافر - الطريق الشرقي',
    landmark: 'قرب مجمع الشفاء الطبي',
    workingDays: 'السبت، الاثنين، الأربعاء',
    workingHours: '11:00 ص - 4:00 ظ',
    isAvailableNow: true,
    coordinates: { lat: 36.1546, lng: 37.7108 },
    experienceYears: 12,
    rating: 4.7,
    reviewsCount: 29,
    isVerified: true,
    notes: 'العيادة مجهزة بجبائر جبسية حديثة وأدوات تجبير كسور كاملة.'
  },
  {
    id: 'doc-5',
    name: 'الدكتور وسيم الحسين',
    title: 'طبيب أسنان وأخصائي تجميل وزراعة وتقويم الأسنان وجراحة الفكين الصغرى واللثة',
    specialty: 'dental',
    specialtyName: 'أسنان',
    phone: '0988456123',
    whatsapp: '963988456123',
    address: 'دير حافر - وسط التجاري',
    landmark: 'بجانب سوق الخضار القديم',
    workingDays: 'السبت إلى الخميس',
    workingHours: '10:00 ص - 6:00 م',
    isAvailableNow: true,
    coordinates: { lat: 36.1558, lng: 37.7061 },
    experienceYears: 9,
    rating: 4.9,
    reviewsCount: 31,
    isVerified: true,
    notes: 'تبييض أسنان ليزري وجلسات سحب عصب بجلسة واحدة.'
  },
  {
    id: 'doc-6',
    name: 'الدكتور باسل المرعي',
    title: 'أخصائي الجراحة العامة والجراحة التنظيرية واستئصال المرارة والأورام والفتوق',
    specialty: 'surgery',
    specialtyName: 'جراحة عامة',
    phone: '0999123987',
    whatsapp: '963999123987',
    address: 'دير حافر - جانب المشفى الميداني',
    landmark: 'مبنى البريد القديم',
    workingDays: 'الأحد، الثلاثاء، الخميس',
    workingHours: '12:00 ظ - 5:00 م',
    isAvailableNow: false,
    coordinates: { lat: 36.1561, lng: 37.7058 },
    experienceYears: 18,
    rating: 4.8,
    reviewsCount: 45,
    isVerified: true,
    notes: 'معاينة حالات الجراحة والتنسيق مع العمليات الجراحية للمشفى العام.'
  },
  {
    id: 'doc-7',
    name: 'الدكتور عمر الإبراهيم',
    title: 'أخصائي أمراض العين وجراحتها، علاج اعتلال الشبكية السكري والماء الأبيض والزرق',
    specialty: 'ophthalmology',
    specialtyName: 'عينية',
    phone: '0932456789',
    whatsapp: '963932456789',
    address: 'دير حافر - الشارع الرئيسي',
    landmark: 'فوق صيدلية الشفاء',
    workingDays: 'السبت إلى الأربعاء',
    workingHours: '10:00 ص - 2:00 ظ',
    isAvailableNow: true,
    coordinates: { lat: 36.1575, lng: 37.7038 },
    experienceYears: 13,
    rating: 4.6,
    reviewsCount: 22,
    isVerified: true,
    notes: 'قياس فحص النظر بالكمبيوتر وجراحة الساد بالليزر.'
  },
  {
    id: 'doc-8',
    name: 'الدكتور فادي الحسن',
    title: 'أخصائي أمراض الأذن والأنف والحنجرة وجراحتها، استئصال اللوزات وتجميل الأنف',
    specialty: 'ent',
    specialtyName: 'أذن أنف حنجرة',
    phone: '0945671234',
    whatsapp: '963945671234',
    address: 'دير حافر - ساحة البلدية',
    landmark: 'خلف فرع الاتصالات',
    workingDays: 'السبت، الاثنين، الخميس',
    workingHours: '9:00 ص - 1:30 ظ | 5:00 م - 7:30 م',
    isAvailableNow: true,
    coordinates: { lat: 36.1563, lng: 37.7072 },
    experienceYears: 10,
    rating: 4.8,
    reviewsCount: 27,
    isVerified: true,
    notes: 'غسيل أذن وتنظير الحنجرة المباشر بالعيادة.'
  },
  {
    id: 'doc-9',
    name: 'الدكتورة رانيا الموسى',
    title: 'أخصائية الأمراض الجلدية وتجميل الجلد والليزر، علاج البهاق والصدفية وحب الشباب المستعصي',
    specialty: 'dermatology',
    specialtyName: 'جلدية',
    phone: '0956112233',
    whatsapp: '963956112233',
    address: 'دير حافر - الحي الشمالي',
    landmark: 'مقابل المدرسة الثانوية',
    workingDays: 'الأحد، الثلاثاء، الخميس',
    workingHours: '11:00 ص - 3:30 ظ',
    isAvailableNow: false,
    coordinates: { lat: 36.1552, lng: 37.7077 },
    experienceYears: 8,
    rating: 4.7,
    reviewsCount: 19,
    isVerified: true,
    notes: 'أحدث أجهزة ليزر لإزالة الندبات وحب الشباب بالليزر المائي.'
  },
  {
    id: 'doc-10',
    name: 'الدكتور طارق الجاسم',
    title: 'طبيب عام، تشخيص وعلاج الأمراض الحادة، قياس العلامات الحيوية وإرشاد المرضى للجهات الطبية',
    specialty: 'general',
    specialtyName: 'طبيب عام',
    phone: '0991887766',
    whatsapp: '963991887766',
    address: 'دير حافر - مدخل المدينة الرئيسي',
    landmark: 'قرب كازية المدينة',
    workingDays: 'طوال أيام الأسبوع (7 أيام)',
    workingHours: '8:00 ص - 10:00 م',
    isAvailableNow: true,
    coordinates: { lat: 36.1532, lng: 37.7042 },
    experienceYears: 7,
    rating: 4.9,
    reviewsCount: 50,
    isVerified: true,
    notes: 'متاح للزيارات المنزلية الطارئة بالمدينة والقرى المجاورة.'
  }
];

export const INITIAL_PHARMACIES: Pharmacy[] = [
  {
    id: 'ph-1',
    name: 'صيدلية النور',
    pharmacistName: 'الصيدلاني نزار جاسم',
    phone: '0933554433',
    whatsapp: '963933554433',
    address: 'دير حافر - وسط المدينة للخدمات الطبية',
    landmark: 'بجانب مشفى الأطفال والولادة القديم',
    isDutyToday: true,
    dutyType: '24h',
    workingHours: 'مناوبة مستمرة 24 ساعة',
    isOpenNow: true,
    coordinates: { lat: 36.1568, lng: 37.7051 },
    notes: 'تتوفر كافة أدوية الأمراض المزمنة وصيغ الحليب للرضع.',
    services: ['قياس ضغط مجاني', 'حقن إبر', 'قياس نسبة سكر الدم', 'توفير حليب أطفال']
  },
  {
    id: 'ph-2',
    name: 'صيدلية السلام',
    pharmacistName: 'الصيدلاني باسل عبود',
    phone: '0944667788',
    whatsapp: '963944667788',
    address: 'دير حافر - الشارع التجاري العام',
    landmark: 'تحت عيادة الدكتور أحمد المحمد',
    isDutyToday: true,
    dutyType: 'night',
    workingHours: '8:00 م - 12:00 ليلاً',
    isOpenNow: true,
    coordinates: { lat: 36.1587, lng: 37.7031 },
    notes: 'تأمين أدوية الضغط والقلب بأسعار مخفضة للمسنين والمحتاجين.',
    services: ['قياس ضغط', 'حقن إبر', 'ضماد جروح']
  },
  {
    id: 'ph-3',
    name: 'صيدلية ابن سينا',
    pharmacistName: 'الصيدلانية رشا حميد',
    phone: '0955889900',
    whatsapp: '963955889900',
    address: 'دير حافر - ساحة الساعة',
    landmark: 'بجانب فرن البلدية الاحتياطي',
    isDutyToday: false,
    dutyType: 'day',
    workingHours: '8:30 ص - 9:00 م',
    isOpenNow: true,
    coordinates: { lat: 36.1571, lng: 37.7065 },
    notes: 'متوفر مستلزمات رعاية الرضع وكبار السن.',
    services: ['قياس ضغط', 'إبر عضلية وريدية', 'فحص سكري']
  },
  {
    id: 'ph-4',
    name: 'صيدلية الرشيد',
    pharmacistName: 'الصيدلاني رشيد الخلف',
    phone: '0966223344',
    whatsapp: '963966223344',
    address: 'دير حافر - شارع العيادات المجمعية',
    landmark: 'بجانب مختبر الأمل الطبي',
    isDutyToday: false,
    dutyType: 'day',
    workingHours: '9:00 ص - 8:30 م',
    isOpenNow: true,
    coordinates: { lat: 36.1560, lng: 37.7059 },
    notes: 'إمكانية تأمين الأدوية النادرة من حلب والمدينة خلال 24 ساعة.',
    services: ['قياس ضغط', 'سيرومات وحقن', 'تأمين أدوية نادرة']
  },
  {
    id: 'ph-5',
    name: 'صيدلية الأقصى',
    pharmacistName: 'الصيدلانية رنا الحمد',
    phone: '0988114477',
    whatsapp: '963988114477',
    address: 'دير حافر - الحي الغربي',
    landmark: 'بجانب صيدلية الشفاء',
    isDutyToday: false,
    dutyType: 'day',
    workingHours: '9:00 ص - 9:30 م',
    isOpenNow: true,
    coordinates: { lat: 36.1604, lng: 37.7048 },
    notes: 'يتوفر لدينا أغذية أطفال وحبوب مكملات غذائية مستوردة.',
    services: ['حقن إبر', 'قياس ضغط وسكري']
  },
  {
    id: 'ph-6',
    name: 'صيدلية الشفاء',
    pharmacistName: 'الصيدلاني كمال العلي',
    phone: '0999332211',
    whatsapp: '963999332211',
    address: 'دير حافر - مقابل الحديقة العامة',
    landmark: 'قرب مدرسة الشهداء الابتدائية',
    isDutyToday: false,
    dutyType: 'day',
    workingHours: '8:30 ص - 8:30 م',
    isOpenNow: true,
    coordinates: { lat: 36.1536, lng: 37.7045 },
    notes: 'صيدلية تخدم حي الحدائق والمدخل الشمالي بالكامل.',
    services: ['قياس ضغط وسكري', 'إبر وضمادات عاجلة']
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em-1',
    name: 'منظومة الإسعاف السريع دير حافر',
    description: 'إسعاف الحوادث والولادات والحالات الحرجة ليلاً ونهاراً ونقلها للمشافي المتخصصة.',
    phone: '0933000112',
    type: 'ambulance',
    is24Hours: true,
    coordinates: { lat: 36.1589, lng: 37.7027 }
  },
  {
    id: 'em-2',
    name: 'المركز الصحي العام دير حافر',
    description: 'قسم الطوارئ والاستقبال والعلاجات الإسعافية العاجلة على مدار الساعة مجاناً.',
    phone: '0217654321',
    type: 'health_center',
    is24Hours: true,
    coordinates: { lat: 36.1591, lng: 37.7026 }
  },
  {
    id: 'em-3',
    name: 'الهلال الأحمر العربي السوري',
    description: 'فرق الإغاثة والإسعاف والمساعدة في الكوارث والحالات الإنسانية الكبرى بالمحافظة.',
    phone: '0944111223',
    type: 'red_crescent',
    is24Hours: true,
    coordinates: { lat: 36.1548, lng: 37.7102 }
  },
  {
    id: 'em-4',
    name: 'مركز الدفاع المدني دير حافر',
    description: 'إطفاء الحرائق والإنقاذ من الأنقاض والتعامل مع حوادث الطرق العامة الكبرى.',
    phone: '113',
    type: 'civil_defense',
    is24Hours: true,
    coordinates: { lat: 36.1578, lng: 37.7085 }
  },
  {
    id: 'em-5',
    name: 'بنك الدم الإقليمي دير حافر',
    description: 'تأمين زمر الدم والصفائح الدموية للمصابي والعمليات الجراحية العاجلة بالمدينة والريف.',
    phone: '0955998877',
    type: 'blood_bank',
    is24Hours: true,
    coordinates: { lat: 36.1565, lng: 37.7055 }
  }
];

export const MEDICAL_CENTERS: MedicalCenter[] = [
  {
    id: 'mc-1',
    name: 'مختبر الأمل للتحاليل الطبية والتشخيص',
    type: 'lab',
    typeName: 'مختبر تحاليل',
    phone: '0933778899',
    whatsapp: '963933778899',
    address: 'دير حافر - شارع العيادات التخصصية',
    landmark: 'فوق صيدلية الرشيد الطبية',
    workingHours: '8:00 ص - 6:00 م',
    coordinates: { lat: 36.1567, lng: 37.7056 },
    services: [
      'تحليل الدم العام CBC',
      'تحاليل الهرمونات والغدة',
      'تحليل السكري التراكمي HbA1c',
      'تحليل وظائف الكلى والكبد',
      'تحاليل الزواج والبول المتقدمة'
    ]
  },
  {
    id: 'mc-2',
    name: 'مختبر الشفاء للتشخيص النسيجي والدموي',
    type: 'lab',
    typeName: 'مختبر تحاليل',
    phone: '0944225588',
    whatsapp: '963944225588',
    address: 'دير حافر - ساحة الساعة الميدانية',
    landmark: 'بجانب صيدلية ابن سينا الكبرى',
    workingHours: '8:30 ص - 7:00 م',
    coordinates: { lat: 36.1551, lng: 37.7076 },
    services: [
      'فحص السوائل النخاعية',
      'تحاليل التهاب الكبد بأنواعه',
      'الزرع الجرثومي واختبار الصادات',
      'فحص شوارد الدم الصوديوم والبوتاسيوم'
    ]
  },
  {
    id: 'mc-3',
    name: 'مركز الرازق للتصوير الشعاعي والإيكو',
    type: 'imaging',
    typeName: 'مركز أشعة وإيكو',
    phone: '0966441122',
    whatsapp: '963966441122',
    address: 'دير حافر - الشارع الموازي للبلدية',
    landmark: 'بجانب مدرسة الكرامة الثانوية للبنات',
    workingHours: '9:00 ص - 4:00 ظ',
    coordinates: { lat: 36.1570, lng: 37.7064 },
    services: [
      'التصوير الشعاعي البسيط X-Ray',
      'تصوير الثدي الماموغرافي المبكر',
      'تصوير إيكو دوبلر الملون للشرايين',
      'البانوراما السنية لتشخيص الأسنان'
    ]
  },
  {
    id: 'mc-4',
    name: 'المستوصف الصحي الحكومي بدير حافر',
    type: 'health_center',
    typeName: 'مستوصف صحي حكومي',
    phone: '0217654321',
    address: 'دير حافر - الحي الشمالي الغربي',
    landmark: 'بجانب خزان المياه الميداني',
    workingHours: '8:00 ص - 2:30 ب.ظ (الإسعاف 24 ساعة)',
    coordinates: { lat: 36.1591, lng: 37.7026 },
    services: [
      'حملات اللقاح المجانية للأطفال',
      'طب الأسرة والوقاية العامة',
      'توزيع أدوية اللشمانيا والأوبئة مجاناً',
      'رعاية الحوامل وتأمين الأدوية الأساسية'
    ]
  }
];

export const getGoogleMapsUrl = (lat: number, lng: number, label?: string): string => {
  if (label) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}+(${encodeURIComponent(label)})`;
  }
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

export const FIRST_AID_TOPICS: FirstAidTopic[] = [
  {
    id: 'fa-1',
    title: 'علاج الحروق البسيطة والمتوسطة',
    icon: 'Flame',
    summary: 'خطوات الإسعاف السريعة للحد من تفاقم الحرق وتخفيف الألم فوراً.',
    steps: [
      'اسكب الماء الفاتر الجاري على الحرق لمدة 10 إلى 15 دقيقة للتبريد والحد من التورم.',
      'انزع بلطف الخواتم والملابس الضيقة عن الجزء المحترق قبل حدوث الانتفاخ بالجلد.',
      'غط الحرق بشاش معقم غير لاصق أو قطعة قماش نظيفة جداً لحمايته من البكتيريا والجراثيم.',
      'إذا ظهرت فقاعات جلدية مائية، إياك أن تقوم بفتحها أو ثقبها لتجنب التجرثم والالتهاب المباشر.'
    ],
    warning: 'لا تضع الثلج أو معجون الأسنان أو الزبدة إطلاقاً على موضع الحرق لأنها تفاقم الإصابة وتتلف الأنسجة.'
  },
  {
    id: 'fa-2',
    title: 'الكسور والتواء المفاصل',
    icon: 'Bone',
    summary: 'تثبيت الأطراف المصابة وتقليل الضرر ريثما يتم النقل للمستشفى.',
    steps: [
      'ثبت الجزء المصاب بالكامل ولا تحاول إطلاقاً إعادة العظم المكسور أو المفصل المنزاح لمكانه.',
      'استخدم وسادة أو كرتونة سميكة كجبيرة مؤقتة واربطها برفق حول الطرف المكسور دون شد شديد.',
      'ضع كمادة باردة أو ثلجاً ملفوفاً بمنشفة على منطقة الالتواء للتخفيف من التورم (وليس على العظم المكشوف).',
      'أوقف النزيف الخارجي بالضغط اللطيف بشاش معقم إن وجد جرح مفتوح (الكسور المفتوحة).'
    ],
    warning: 'تجنب تحريك المصاب بكسور في العمود الفقري أو الرقبة منعاً لحدوث شلل دائم، وانتظر الإسعاف الطبي المتخصص.'
  },
  {
    id: 'fa-3',
    title: 'الإنعاش القلبي الرئوي (CPR)',
    icon: 'Activity',
    summary: 'خطوات إنقاذ حياة شخص توقف تنفسه وقلبه عن العمل فوراً.',
    steps: [
      'تأكد أولاً من أمان المكان المحيط، وهز كتف المصاب بقوة واسأله بصوت عالٍ: "هل أنت بخير؟".',
      'إذا لم يستجب، اطلب من شخص الاتصال بالرقم الإسعافي 0933000112 فوراً وجهّز المصاب بالاستلقاء على ظهره.',
      'ابدأ بضغطات الصدر: ضع كعب يدك في منتصف صدر المصاب، واضغط بقوة وسرعة (معدل 100 إلى 120 ضغطة في الدقيقة).',
      'اضغط لعمق 5 سم تقريباً، وكرر دورات من 30 ضغطة صدرية متبوعة بنَفَسين إنقاذيين إن كنت مدرباً.'
    ],
    warning: 'لا تتوقف عن الضغط والإنعاش حتى تصل سيارة الإسعاف أو يبدأ المصاب بإظهار علامات التنفس والحياة من جديد.'
  },
  {
    id: 'fa-4',
    title: 'الإغماء وغياب الوعي المفاجئ',
    icon: 'Zap',
    summary: 'أفضل وضعية لتأمين مجرى التنفس للمغمى عليه ومساعدته في استعادة وعيه.',
    steps: [
      'استلق المصاب على ظهره، وارفع قدميه للأعلى بمقدار 30 سم لتسهيل تدفق الدم إلى الدماغ والجهاز العصبي.',
      'فكك أي ملابس ضيقة حول الرقبة أو الصدر لضمان سهولة التنفس ومجرى هواء آمن.',
      'إذا كان يتقيأ أو ينزف من فمه، اقلبه على جانبه في (وضعية الإفاقة) لمنع حدوث اختناق بالسوائل.',
      'افحص النبض والتنفس باستمرار، وامسح وجهه بماء بارد بلطف لإنعاشه وإعطائه الهواء الكافي.'
    ]
  },
  {
    id: 'fa-5',
    title: 'النزيف الخارجي الحاد للدم',
    icon: 'Droplet',
    summary: 'السيطرة الفورية على النزيف لمنع حدوث صدمة دموية وفقدان كميات حرجة من الدم.',
    steps: [
      'اضغط مباشرة على الجرح النازف بقوة باستخدام قطعة قماش نظيفة أو ضمادة معقمة لقطع تدفق الدم.',
      'ارفع الطرف النازف (اليد أو القدم) فوق مستوى القلب إن أمكن للحد من ضغط الدم المتدفق لموضع النزيف.',
      'حافظ على الضغط مستمراً لمدة 10 دقائق على الأقل دون رفع الشاش لرؤية الجرح حتى يتخثر الدم.',
      'إذا تشربت الضمادة بالدم، ضع ضمادة ثانية فوقها واستمر بالضغط دون إزالة الضمادة الأولى.'
    ],
    warning: 'لا تستخدم المرقأة (شريط الربط الضيق جداً) إلا في حالات البتر أو النزيف الشرياني الحاد الذي يهدد الحياة.'
  }
];

// 48. Mock Data for Health Alerts & Public Campaigns
export const INITIAL_HEALTH_ALERTS: HealthAlert[] = [
  {
    id: 'alert-1',
    title: 'إطلاق حملة اللقاح الوطني المجاني للأطفال',
    content: 'يعلن مستوصف دير حافر الصحي عن بدء حملة اللقاح الوطني للأطفال دون سن الخامسة ضد شلل الأطفال والحصبة. يرجى مراجعة المستوصف من الساعة 8:00 صباحاً وحتى 2:00 ظهراً مصطحبين كرت اللقاح الخاص بالطفل.',
    type: 'vaccine',
    date: '11 أيلول 2026'
  },
  {
    id: 'alert-2',
    title: 'تحذير من انتشار الإنفلونزا الموسمية الشديدة',
    content: 'يُرجى أخذ الحيطة والحذر نظراً لتسجيل إصابات مرتفعة بالإنفلونزا الحادة بالمدينة. ننصح بالابتعاد عن الأماكن المزدحمة، تهوية الغرف جيداً، وتناول الأغذية الغنية بفيتامين C. تتوفر اللقاحات في صيدلية النور وصيدلية الرشيد.',
    type: 'warning',
    date: '09 أيلول 2026'
  },
  {
    id: 'alert-3',
    title: 'ندوة صحية وإرشادية للوقاية من مرض السكري',
    content: 'يدعوكم مستوصف المدينة لحضور ندوة حوارية مجانية مع الدكتور محمد المصطفى حول كيفية ضبط سكر الدم والوقاية من مضاعفاته، مع إجراء فحص مجاني فوري لنسبة السكر للحضور يوم السبت القادم الساعة 10 صباحاً.',
    type: 'info',
    date: '05 أيلول 2026'
  }
];

// 49. Mock Data for Humanitarian Medical Cases needing Financial Support
export const INITIAL_HUMANITARIAN_CASES: HumanitarianCase[] = [
  {
    id: 'case-1',
    title: 'عملية قلب مفتوح للطفل يحيى (4 سنوات)',
    patientName: 'يحيى خ.',
    age: '4 سنوات',
    condition: 'يعاني الطفل يحيى من تشوه خلقي في صمامات القلب (فتحة في الحاجز البطيني) ويحتاج إلى عملية جراحية عاجلة لإنقاذ حياته في مشفى حلب الجامعي.',
    requiredAmount: '12,500,000 ل.س',
    collectedAmount: '9,200,000 ل.س',
    hospital: 'مشفى حلب الجامعي',
    phone: '0933554433',
    whatsapp: '963933554433',
    isCompleted: false
  },
  {
    id: 'case-2',
    title: 'تركيب مفاصل صناعية للعم أبو محمد',
    patientName: 'أبو محمد (متقاعد)',
    age: '62 سنة',
    condition: 'يعاني العم أبو محمد من احتكاك وتآكل كامل في مفصل الركبة اليمنى يمنعه من الحركة تماماً. العملية المقررة هي تركيب مفصل ركبة صناعي كامل.',
    requiredAmount: '8,000,000 ل.س',
    collectedAmount: '8,000,000 ل.س',
    hospital: 'مشفى الشفاء التخصصي',
    phone: '0944667788',
    whatsapp: '963944667788',
    isCompleted: true
  },
  {
    id: 'case-3',
    title: 'عملية استئصال ساد (المياه البيضاء) لجدة مسنة',
    patientName: 'الجدة أم أحمد',
    age: '74 سنة',
    condition: 'تعاني الجدة من مياه بيضاء متقدمة في العينين أدت إلى فقدان شبه كامل للنظر. العملية مخصصة لشفط المياه البيضاء وزرع عدسة عينية حديثة بالليزر.',
    requiredAmount: '3,500,000 ل.س',
    collectedAmount: '1,100,000 ل.س',
    hospital: 'عيادة الدكتور عمر الإبراهيم',
    phone: '0955889900',
    whatsapp: '963955889900',
    isCompleted: false
  }
];
