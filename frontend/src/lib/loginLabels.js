/**
 * Welcome screen copy in Sinhala, Tamil and English.
 *
 * Greetings are keyed by day part rather than written inline, so the time-of-day logic in
 * `useGreeting` never has to know which language is active.
 */

export const LANGUAGES = [
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'en', label: 'English' },
]

export const DEFAULT_LANGUAGE = 'si'

/** Icon name per day part, resolved in the component against the icon module. */
export const DAY_PART_ICONS = {
  MORNING: 'Sun',
  AFTERNOON: 'SunMedium',
  EVENING: 'Moon',
}

const si = {
  brand: 'Pravaha Pulse',
  brandSub: 'ඔබගේ මුදල් ගමනේ කලින්ම ඇඟවීම',
  greetings: {
    MORNING: 'සුබ උදෑසනක්',
    AFTERNOON: 'සුබ පස්වරුවක්',
    EVENING: 'සුබ සැන්දෑවක්',
  },
  subtitles: {
    MORNING: 'අද ඔබගේ ව්‍යාපෘතියේ මුදල් ගමන බලමු.',
    AFTERNOON: 'අද ඔබගේ ව්‍යාපෘතියේ මුදල් ගමන බලමු.',
    EVENING: 'අද ඔබගේ ව්‍යාපෘතියේ මුදල් ගමන බලමු.',
  },
  welcome: 'නැවත සාදරයෙන් පිළිගනිමු!',
  body: 'ඔබගේ මුදල් ගමන එක තැනක බලා, අනාගතයට පෙර ඔබට දැනුම්දීම් ලබා දෙනු ඇත.',
  highlights: [
    { title: 'මුදල් ගමන පුරෝකථනය', detail: 'ඉදිරි දින 30-90ක ඔබගේ ඉතිරි මුදල' },
    { title: 'කලින්ම අනතුරු ඇඟවීම', detail: 'මුදල් අඩුවීමට පෙර දැනුම්දීම' },
    { title: 'මුදල් ගමන පරීක්ෂණය', detail: 'මොකද සිදුවන්නේ යනවා දැයි බලන්න' },
  ],
  login: {
    title: 'ඔබගේ ගිණුමට පිවිසෙන්න',
    subtitle: 'ඔබගේ WhatsApp අංකය සහ මුරපදය භාවිත කරන්න.',
    phone: 'දුරකථන / WhatsApp අංකය',
    phonePlaceholder: '77 123 4567',
    password: 'මුරපදය',
    passwordPlaceholder: '••••••',
    showPassword: 'මුරපදය පෙන්වන්න',
    hidePassword: 'මුරපදය සැඟවන්න',
    rememberMe: 'මාව මතක තබාගන්න',
    forgotPassword: 'මුරපදය අමතක වේද?',
    submit: 'පිවිසෙන්න',
    submitting: 'පිවිසෙමින්...',
    noAccount: 'ගිණුමක් නොමැත?',
    register: 'කඩ ලියාපදිංචි කරන්න',
    demoHint: 'පරීක්ෂණය සඳහා ඕනෑම අංකයක් සහ මුරපදයක් භාවිත කරන්න.',
  },
  languageLabel: 'භාෂාව',
  validation: {
    phoneRequired: 'දුරකථන අංකය ඇතුළත් කරන්න',
    phoneInvalid: 'නිවැරදි දුරකථන අංකයක් ඇතුළත් කරන්න',
    passwordRequired: 'මුරපදය ඇතුළත් කරන්න',
    passwordShort: 'මුරපදය අවම වශයෙන් අකුරු 4ක් විය යුතුය',
    credentialsRejected: 'දුරකථන අංකය හෝ මුරපදය වැරදියි',
  },
  errors: {
    title: 'පිවිසීමේ දෝෂයක්',
  },
  footer: 'නිරමාණයකර නොගන්න · Pravaha Pulse',
}

const ta = {
  brand: 'Pravaha Pulse',
  brandSub: 'உங்கள் பணத்தின் ஓட்டத்திற்கு முன்னே எச்சரிக்கை',
  greetings: {
    MORNING: 'காலை வணக்கம்',
    AFTERNOON: 'மதிய வணக்கம்',
    EVENING: 'மாலை வணக்கம்',
  },
  subtitles: {
    MORNING: 'இன்று உங்கள் வணிகத்தின் பண ஓட்டத்தைப் பார்ப்போம்.',
    AFTERNOON: 'இன்று உங்கள் வணிகத்தின் பண ஓட்டத்தைப் பார்ப்போம்.',
    EVENING: 'இன்று உங்கள் வணிகத்தின் பண ஓட்டத்தைப் பார்ப்போம்.',
  },
  welcome: 'மீண்டும் வருக!',
  body: 'உங்கள் பண ஓட்டத்தை ஒரே இடத்தில் பார்த்து, நிகழ்வுகளுக்கு முன்பே எச்சரிக்கை பெறுங்கள்.',
  highlights: [
    { title: 'பண ஓட்ட முன்னறிவிப்பு', detail: 'உங்கள் இருப்பு நாளை 30-90 நாட்கள்' },
    { title: 'முன்கூட்டிய எச்சரிக்கை', detail: 'பணம் குறைவதற்கு முன் அறியப்படும்' },
    { title: 'எளிய சோதனை', detail: 'என்ன நடக்கிறது என்பதைப் பாருங்கள்' },
  ],
  login: {
    title: 'உங்கள் கணக்கில் நுழையவும்',
    subtitle: 'உங்கள் WhatsApp எண்ணையும் கடவுச்சொல்லையும் பயன்படுத்தவும்.',
    phone: 'தொலைபேசி / WhatsApp எண்',
    phonePlaceholder: '77 123 4567',
    password: 'கடவுச்சொல்',
    passwordPlaceholder: '••••••',
    showPassword: 'கடவுச்சொல்லைக் காட்டு',
    hidePassword: 'கடவுச்சொல்லை மறை',
    rememberMe: 'என்னை நினைவில் வைத்திரு',
    forgotPassword: 'கடவுச்சொல் மறக்குந்தீர்களா?',
    submit: 'நுழையவும்',
    submitting: 'நுழைகிறது...',
    noAccount: 'கணக்கு இல்லையா?',
    register: 'கடையைப் பதிவு செய்',
    demoHint: 'சோதனைக்கு எந்த எண்ணையும் மற்றும் கடவுச்சொல்லையும் பயன்படுத்தவும்.',
  },
  languageLabel: 'மொழி',
  validation: {
    phoneRequired: 'தொலைபேசி எண்ணை நிரப்பவும்',
    phoneInvalid: 'சரியான தொலைபேசி எண்ணை நிரப்பவும்',
    passwordRequired: 'கடவுச்சொல்லை நிரப்பவும்',
    passwordShort: 'கடவுச்சொல் குறைந்தது 4 எழுத்துகள் இருக்க வேண்டும்',
    credentialsRejected: 'தொலைபேசி எண் அல்லது கடவுச்சொல் தவறு',
  },
  errors: {
    title: 'உள்வருவல் பிழை',
  },
  footer: 'தனிப்பட்டன்மை · Pravaha Pulse',
}

const en = {
  brand: 'Pravaha Pulse',
  brandSub: 'Know where your money is going, before it goes',
  greetings: {
    MORNING: 'Good Morning',
    AFTERNOON: 'Good Afternoon',
    EVENING: 'Good Evening',
  },
  subtitles: {
    MORNING: "Let's take a look at your business cash flow today.",
    AFTERNOON: "Let's take a look at your business cash flow today.",
    EVENING: "Let's take a look at your business cash flow today.",
  },
  welcome: 'Welcome back!',
  body: "See your cash flow in one place, and get warned before it becomes a problem.",
  highlights: [
    { title: 'Cash-flow forecast', detail: 'Your balance for the next 30-90 days' },
    { title: 'Early shortage alerts', detail: 'Know about a dip before it happens' },
    { title: 'What-if testing', detail: "Try a decision before you make it" },
  ],
  login: {
    title: 'Sign in to your account',
    subtitle: 'Use your WhatsApp number and password.',
    phone: 'Phone / WhatsApp number',
    phonePlaceholder: '77 123 4567',
    password: 'Password',
    passwordPlaceholder: '••••••',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    submit: 'Log in',
    submitting: 'Signing in…',
    noAccount: "Don't have an account?",
    register: 'Register / onboard your shop',
    demoHint: 'For this demo, use any number and any password.',
  },
  languageLabel: 'Language',
  validation: {
    phoneRequired: 'Enter your phone number',
    phoneInvalid: 'Enter a valid phone number',
    passwordRequired: 'Enter your password',
    passwordShort: 'Password must be at least 4 characters',
    credentialsRejected: 'That phone number or password is not right',
  },
  errors: {
    title: 'Could not sign you in',
  },
  footer: 'Privacy first · Pravaha Pulse',
}

export const loginLabels = { si, ta, en }

export function labelsFor(language) {
  return loginLabels[language] ?? loginLabels[DEFAULT_LANGUAGE] ?? loginLabels.en
}