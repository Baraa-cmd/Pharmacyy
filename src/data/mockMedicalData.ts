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

// Zeroed Data - Clean slate for live production
export const INITIAL_DOCTORS: Doctor[] = [];

export const INITIAL_PHARMACIES: Pharmacy[] = [];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [];

export const MEDICAL_CENTERS: MedicalCenter[] = [];

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
      'إذا لم يستجب، اطلب من شخص الاتصال بالرقم الإسعافي فوراً وجهّز المصاب بالاستلقاء على ظهره.',
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

// Clean Zeroed Alerts & Cases
export const INITIAL_HEALTH_ALERTS: HealthAlert[] = [];

export const INITIAL_HUMANITARIAN_CASES: HumanitarianCase[] = [];
