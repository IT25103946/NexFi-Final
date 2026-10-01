/**
 * Onboarding wizard labels with complete translations for English, Sinhala (සිංහල), and Tamil (தமிழ்).
 * Covers all questionnaire steps, questions, options, placeholders, hints, and validation errors.
 */

export const LANGUAGES = [
  { code: 'en', label: 'English', english: 'English' },
  { code: 'si', label: 'සිංහල', english: 'Sinhala' },
  { code: 'ta', label: 'தமிழ்', english: 'Tamil' },
]

/** Stable API keys matching backend enums and requests */
export const BUSINESS_TYPES = ['RETAIL', 'WHOLESALE', 'SERVICE', 'ECOMMERCE', 'OTHER']
export const CURRENCIES = ['LKR', 'USD', 'INR']
export const BALANCE_PERIODS = ['DAILY', 'MONTHLY']
export const RECURRING_FREQUENCIES = ['WEEKLY', 'MONTHLY']
export const OWNER_ROLES = ['OWNER', 'MANAGER', 'ACCOUNTANT']

const en = {
  brand: 'NEXFI',
  stepOf: 'Step {current} of {total}',
  steps: [
    { id: 'shop', title: 'Shop & Business Details', blurb: 'Tell us the essential details about your shop.' },
    { id: 'financial', title: 'Financial & Cash Flow Setup', blurb: 'Set up how money and credit flow in and out.' },
    { id: 'owner', title: 'Owner / User Details', blurb: 'Final step — who is running this business account.' },
  ],
  language: {
    label: 'Language',
    hint: 'Switch the questionnaire to your preferred language.',
  },
  shop: {
    shopName: 'What is your Shop / Business Name?',
    shopNamePlaceholder: 'e.g. Nimal Grocery Store',
    businessType: 'What type of business do you run?',
    location: 'Where is your shop located? (City / District)',
    locationPlaceholder: 'e.g. Pettah, Colombo',
    contact: 'What is your business primary contact number?',
    contactHint: '+94 format preset (Enter 9 digits after +94, e.g. 77 123 4567)',
    currency: 'What currency do you operate in? (Default: LKR)',
  },
  financial: {
    startingBalance: 'What is your estimated starting daily/monthly cash balance?',
    startingBalanceHint: 'Estimated cash balance currently available in your account or drawer.',
    startingBalancePlaceholder: '500000',
    balancePeriod: 'Is this starting balance daily or monthly?',
    creditSales: 'Do you offer credit sales to customers (Receivables)?',
    creditSalesHint: 'You allow customers to pay later, recorded as expected receivables.',
    creditPurchases: 'Do you buy stock on credit from suppliers (Payables)?',
    creditPurchasesHint: 'You receive stock upfront and pay suppliers later, recorded as payables.',
    recurringFrequency: 'How often do you incur recurring expenses (Rent, Utilities, Wages)?',
    recurringFrequencyHint: 'Fixed overheads like shop rent, water/electricity, and employee salaries.',
  },
  owner: {
    fullName: 'What is your full name?',
    fullNamePlaceholder: 'e.g. Nimal Silva',
    role: 'What is your role in this shop?',
  },
  values: {
    RETAIL: 'Retail',
    WHOLESALE: 'Wholesale',
    SERVICE: 'Service',
    ECOMMERCE: 'E-commerce',
    OTHER: 'Other',
    LKR: 'Sri Lankan Rupee (LKR)',
    USD: 'US Dollar (USD)',
    INR: 'Indian Rupee (INR)',
    DAILY: 'Daily',
    MONTHLY: 'Monthly',
    WEEKLY: 'Weekly',
    OWNER: 'Owner',
    MANAGER: 'Manager',
    ACCOUNTANT: 'Accountant',
  },
  valuesDescriptions: {
    RETAIL: 'Selling goods directly to retail consumers',
    WHOLESALE: 'Supplying bulk products to other shops',
    SERVICE: 'Providing professional, repair, or hospitality services',
    ECOMMERCE: 'Online store, deliveries, and digital sales',
    OTHER: 'Hybrid or specialized local business',
    WEEKLY: 'Settled every week or fortnightly',
    MONTHLY: 'Monthly rent, utilities, and wages',
    DAILY: 'Daily cash balance baseline',
    OWNER: 'Shop owner or proprietor',
    MANAGER: 'Operations or store manager',
    ACCOUNTANT: 'Bookkeeper or financial officer',
  },
  yesNo: { yes: 'Yes', no: 'No' },
  actions: {
    previous: 'Previous',
    next: 'Next',
    complete: 'Complete Setup & Go to Dashboard',
    backToDashboard: 'Back to Dashboard',
  },
  validation: {
    required: 'This field is required',
    invalidPhone: 'Enter a valid 9-digit phone number after +94',
    invalidAmount: 'Enter a starting balance of 0 or greater',
    selectOne: 'Please select an option',
    summary: 'Please correct the highlighted fields before proceeding.',
  },
  trustNote: 'Your business information is strictly private and stored securely.',
  saving: 'Saving your shop setup…',
}

const si = {
  brand: 'NEXFI',
  stepOf: 'පියවර {current} / {total}',
  steps: [
    { id: 'shop', title: 'කඩය සහ ව්‍යාපාර විස්තර', blurb: 'ඔබගේ කඩය හෝ ව්‍යාපාරය පිළිබඳ මූලික තොරතුරු ඇතුළත් කරන්න.' },
    { id: 'financial', title: 'මූල්‍ය සහ මුදල් ගලායාමේ සැකසුම', blurb: 'මුදල් ශේෂය, ණය ලැබීම් සහ ගෙවීම් පද්ධතිය සකස් කරන්න.' },
    { id: 'owner', title: 'හිමිකරු / පරිශීලක විස්තර', blurb: 'අවසන් පියවර — මෙම ගිණුම පාලනය කරන පුද්ගලයාගේ විස්තර.' },
  ],
  language: {
    label: 'භාෂාව (Language)',
    hint: 'ප්‍රශ්නාවලිය ඔබ කැමති භාෂාවට ක්ෂණිකව මාරු කරන්න.',
  },
  shop: {
    shopName: 'ඔබගේ කඩය / ව්‍යාපාරයේ නම කුමක්ද?',
    shopNamePlaceholder: 'උදා: නිමල් ග්‍රොසරී ස්ටෝර්ස්',
    businessType: 'ඔබ පවත්වාගෙන යන ව්‍යාපාර වර්ගය කුමක්ද?',
    location: 'ඔබගේ කඩය පිහිටා ඇත්තේ කොහේද? (නගරය / දිස්ත්‍රික්කය)',
    locationPlaceholder: 'උදා: පිටකොටුව, කොළඹ',
    contact: 'ව්‍යාපාරයේ ප්‍රධාන සම්බන්ධතා දුරකථන අංකය කුමක්ද?',
    contactHint: '+94 ආකෘතියෙන් දුරකථන අංකය ඇතුළත් කරන්න (උදා: 77 123 4567)',
    currency: 'ඔබ ගනුදෙනු කරන මුදල් වර්ගය කුමක්ද? (පෙරනිමිය: LKR)',
  },
  financial: {
    startingBalance: 'ඔබේ ඇස්තමේන්තුගත ආරම්භක දෛනික/මාසික මුදල් ශේෂය කොපමණද?',
    startingBalanceHint: 'දැනට ඔබේ අතැති හෝ බැංකු ගිණුමේ ඇති මුදල් ප්‍රමාණය.',
    startingBalancePlaceholder: '500000',
    balancePeriod: 'මෙම ආරම්භක ශේෂය දෛනිකවද නැතහොත් මාසිකවද?',
    creditSales: 'ඔබ පාරිභෝගිකයින්ට ණයට භාණ්ඩ අලෙවි කරනවාද (ලැබිය යුතු මුදල්)?',
    creditSalesHint: 'පාරිභෝගිකයන්ගෙන් ඉදිරියේදී ලැබීමට ඇති මුදල් පද්ධතියට එක් වේ.',
    creditPurchases: 'ඔබ සැපයුම්කරුවන්ගෙන් ණයට තොග මිලදී ගන්නවාද (ගෙවිය යුතු මුදල්)?',
    creditPurchasesHint: 'සැපයුම්කරුවන්ට ඉදිරියේදී පියවීමට ඇති බිල්පත් පද්ධතියට එක් වේ.',
    recurringFrequency: 'නැවත නැවත සිදුවන වියදම් (කුලී, බිල්පත්, වැටුප්) සිදුවන්නේ කෙතරම් කාලයකට වරක්ද?',
    recurringFrequencyHint: 'කඩ කාමර කුලී, විදුලි/ජල බිල්පත් සහ සේවක වැටුප් වැනි ස්ථාවර වියදම්.',
  },
  owner: {
    fullName: 'ඔබගේ සම්පූර්ණ නම කුමක්ද?',
    fullNamePlaceholder: 'උදා: නිමල් සිල්වා',
    role: 'මෙම කඩයේ ඔබගේ කාර්යභාරය කුමක්ද?',
  },
  values: {
    RETAIL: 'සිල්ලර වෙළඳාම (Retail)',
    WHOLESALE: 'තොග වෙළඳාම (Wholesale)',
    SERVICE: 'සේවා සැපයීම (Service)',
    ECOMMERCE: 'අන්තර්ජාල වෙළඳාම (E-commerce)',
    OTHER: 'වෙනත් (Other)',
    LKR: 'ශ්‍රී ලංකා රුපියල් (LKR)',
    USD: 'ඇමරිකානු ඩොලර් (USD)',
    INR: 'ඉන්දියානු රුපියල් (INR)',
    DAILY: 'දෛනිකව (Daily)',
    MONTHLY: 'මාසිකව (Monthly)',
    WEEKLY: 'සතිපතා (Weekly)',
    OWNER: 'හිමිකරු (Owner)',
    MANAGER: 'කළමනාකරු (Manager)',
    ACCOUNTANT: 'ගණකාධිකාරී (Accountant)',
  },
  valuesDescriptions: {
    RETAIL: 'පාරිභෝගිකයන්ට සෘජුවම සිල්ලරට භාණ්ඩ අලෙවිය',
    WHOLESALE: 'වෙනත් කඩ සාප්පුවලට තොග වශයෙන් සැපයීම',
    SERVICE: 'වෘත්තීය, අලුත්වැඩියා හෝ සේවා සැපයීම',
    ECOMMERCE: 'ඔන්ලයින් වෙබ් අඩවි හෝ ඩිලිවරි හරහා අලෙවිය',
    OTHER: 'විශේෂිත හෝ ඒකාබද්ධ ව්‍යාපාර කටයුතු',
    WEEKLY: 'සෑම සතියකට වරක් ගෙවීම් සිදුවේ',
    MONTHLY: 'මාසික කුලී, බිල්පත් සහ වැටුප්',
    DAILY: 'දෛනික පදනමෙන් මුදල් ශේෂය',
    OWNER: 'කඩයේ අයිතිකරු හෝ ව්‍යවසායකයා',
    MANAGER: 'ව්‍යාපාර මෙහෙයුම් කළමනාකරු',
    ACCOUNTANT: 'ගිණුම් භාර නිලධාරී',
  },
  yesNo: { yes: 'ඔව්', no: 'නැත' },
  actions: {
    previous: 'පෙර පියවර',
    next: 'මීළඟ පියවර',
    complete: 'සැකසුම අවසන් කර පාලක පුවරුවට යන්න',
    backToDashboard: 'නැවත පාලක පුවරුවට',
  },
  validation: {
    required: 'මෙම ක්ෂේත්‍රය අනිවාර්යයෙන් පිරවිය යුතුය',
    invalidPhone: '+94 පසුව නිවැරදි ඉලක්කම් 9ක දුරකථන අංකයක් ඇතුළත් කරන්න',
    invalidAmount: 'රු. 0 හෝ ඊට වැඩි ආරම්භක ශේෂයක් ඇතුළත් කරන්න',
    selectOne: 'කරුණාකර විකල්පයක් තෝරන්න',
    summary: 'ඉදිරියට යාමට පෙර සලකුණු කළ ක්ෂේත්‍ර නිවැරදි කරන්න.',
  },
  trustNote: 'ඔබගේ මූල්‍ය තොරතුරු ඉතා රහසිගතව සහ ආරක්ෂිතව සුරැකේ.',
  saving: 'කඩයේ තොරතුරු සුරකිමින් පවතී…',
}

const ta = {
  brand: 'NEXFI',
  stepOf: 'படி {current} / {total}',
  steps: [
    { id: 'shop', title: 'கடை & வணிக விவரங்கள்', blurb: 'உங்கள் கடை பற்றிய அடிப்படை விவரங்களை உள்ளிடவும்.' },
    { id: 'financial', title: 'நிதி & பணப்புழக்க அமைப்பு', blurb: 'பண இருப்பு, கடன் வரவுகள் மற்றும் கொடுப்பனவு அமைப்பு.' },
    { id: 'owner', title: 'உரிமையாளர் / பயனர் விவரங்கள்', blurb: 'கடைசிப் படி — இந்தக் கணக்கை நிர்வகிப்பவர் பற்றிய விபரம்.' },
  ],
  language: {
    label: 'மொழி (Language)',
    hint: 'கேள்விகளை நீங்கள் விரும்பும் மொழிக்கு மாற்றவும்.',
  },
  shop: {
    shopName: 'உங்கள் கடை / வணிகத்தின் பெயர் என்ன?',
    shopNamePlaceholder: 'எ.கா: நிமால் மளிகைக் கடை',
    businessType: 'நீங்கள் நடத்தும் வணிகத்தின் வகை என்ன?',
    location: 'உங்கள் கடை எங்கு அமைந்துள்ளது? (நகரம் / மாவட்டம்)',
    locationPlaceholder: 'எ.கா: புறக்கோட்டை, கொழும்பு',
    contact: 'வணிகத்தின் முதன்மை தொடர்பு எண் என்ன?',
    contactHint: '+94 முன்னொட்டுடன் உள்ளிடவும் (எ.கா: 77 123 4567)',
    currency: 'நீங்கள் பயன்படுத்தும் நாணயம் எது? (விருப்பிருப்பு: LKR)',
  },
  financial: {
    startingBalance: 'உங்கள் மதிப்பிடப்பட்ட தொடக்க தினசரி/மாதாந்திர இருப்பு எவ்வளவு?',
    startingBalanceHint: 'தற்போது உங்கள் கையில் அல்லது வங்கிக் கணக்கில் உள்ள பண இருப்பு.',
    startingBalancePlaceholder: '500000',
    balancePeriod: 'இந்த தொடக்க இருப்பு தினசரியா அல்லது மாதாந்திரமா?',
    creditSales: 'வாடிக்கையாளர்களுக்குக் கடன் விற்பனை செய்கிறீர்களா (பெறவேண்டியவை)?',
    creditSalesHint: 'வாடிக்கையாளர்கள் பின்னர் செலுத்தும் பணம் பெறவேண்டியவையாகப் பதியப்படும்.',
    creditPurchases: 'வழங்குநர்களிடமிருந்து கடனாகப் பொருட்கள் வாங்குகிறீர்களா (செலுத்தவேண்டியவை)?',
    creditPurchasesHint: 'வழங்குநர்களுக்கு நீங்கள் பின்னர் செலுத்தவேண்டிய கட்டணங்கள்.',
    recurringFrequency: 'தொடர் செலவுகள் (வாடகை, கட்டணங்கள், சம்பளம்) எவ்வளவு அடிக்கடி ஏற்படுகின்றன?',
    recurringFrequencyHint: 'கடை வாடகை, மின்கட்டணம், தொழிலாளர் சம்பளம் போன்ற நிலையான செலவுகள்.',
  },
  owner: {
    fullName: 'உங்கள் முழுப் பெயர் என்ன?',
    fullNamePlaceholder: 'எ.கா: நிமால் சில்வா',
    role: 'இந்தக் கடையில் உங்கள் பங்கு என்ன?',
  },
  values: {
    RETAIL: 'சில்லறை விற்பனை (Retail)',
    WHOLESALE: 'மொத்த விற்பனை (Wholesale)',
    SERVICE: 'சேவை வழங்குதல் (Service)',
    ECOMMERCE: 'இணைய வணிகம் (E-commerce)',
    OTHER: 'மற்றவை (Other)',
    LKR: 'இலங்கை ரூபாய் (LKR)',
    USD: 'அமெரிக்க டாலர் (USD)',
    INR: 'இந்திய ரூபாய் (INR)',
    DAILY: 'தினசரி (Daily)',
    MONTHLY: 'மாதாந்திரம் (Monthly)',
    WEEKLY: 'வாராந்திரம் (Weekly)',
    OWNER: 'உரிமையாளர் (Owner)',
    MANAGER: 'மேலாளர் (Manager)',
    ACCOUNTANT: 'கணக்காளர் (Accountant)',
  },
  valuesDescriptions: {
    RETAIL: 'வாடிக்கையாளர்களுக்கு நேரடியாக பொருட்களை விற்றல்',
    WHOLESALE: 'பிற கடைகளுக்கு மொத்தமாக பொருட்களை விநியோகித்தல்',
    SERVICE: 'தொழில்முறை, பழுதுபார்த்தல் அல்லது விருந்தோம்பல் சேவை',
    ECOMMERCE: 'இணைய கடை மற்றும் விநியோக விற்பனை',
    OTHER: 'கலப்பு அல்லது பிற உள்ளூர் வணிகம்',
    WEEKLY: 'ஒவ்வொரு வாரமும் அல்லது இரு வாரத்திற்கு ஒருமுறை',
    MONTHLY: 'மாதாந்திர வாடகை, மின்கட்டணம் மற்றும் சம்பளம்',
    DAILY: 'தினசரி கணக்கிடப்படும் இருப்பு',
    OWNER: 'கடையின் உரிமையாளர்',
    MANAGER: 'கடை அல்லது செயல்பாட்டு மேலாளர்',
    ACCOUNTANT: 'கணக்காளர் அல்லது நிதி பொறுப்பாளர்',
  },
  yesNo: { yes: 'ஆம்', no: 'இல்லை' },
  actions: {
    previous: 'முந்தையது',
    next: 'அடுத்தது',
    complete: 'அமைப்பை முடித்து முகப்பு பலகைக்குச் செல்',
    backToDashboard: 'மீண்டும் முகப்பு பலகைக்கு',
  },
  validation: {
    required: 'இந்தப் புலம் கட்டாயமாக நிரப்பப்பட வேண்டும்',
    invalidPhone: '+94 உடன் சரியான 9 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்',
    invalidAmount: 'ரூ. 0 அல்லது அதற்கு மேற்பட்ட தொடக்க இருப்பை உள்ளிடவும்',
    selectOne: 'ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்',
    summary: 'தொடர்வதற்கு முன் முன்னிலைப்படுத்தப்பட்ட புலங்களை சரிசெய்யவும்.',
  },
  trustNote: 'உங்கள் நிதித் தரவு தனிப்பட்டதாகவும் பாதுகாப்பாகவும் சேமிக்கப்படுகிறது.',
  saving: 'கடை அமைப்புகள் சேமிக்கப்படுகிறது…',
}

export const onboardingLabels = { en, si, ta }

/**
 * Substitutes `{placeholders}` in a label template string.
 */
export function formatTemplate(template, replacements = {}) {
  if (typeof template !== 'string') return ''
  return Object.entries(replacements).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  )
}

/**
 * Turns form's error keys into localized error messages.
 */
export function localiseErrors(errors, labels) {
  return Object.fromEntries(
    Object.entries(errors ?? {}).map(([field, key]) => [field, labels?.validation?.[key] ?? key]),
  )
}

/**
 * Retrieves the labels object for the given language code, falling back to English.
 */
export function labelsFor(language) {
  return onboardingLabels[language] ?? onboardingLabels.en ?? onboardingLabels.si
}
