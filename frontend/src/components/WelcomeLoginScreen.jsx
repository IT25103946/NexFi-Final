import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, SunMedium, Lock, Phone, Globe, Eye, EyeOff, TrendingUp, Sparkles, Check } from 'lucide-react'
import NexfiLogo from './NexfiLogo'

const translations = {
  en: {
    brand: 'NEXFI',
    tagline: 'Know where your money is going, before it goes',
    morning: 'Good Morning',
    afternoon: 'Good Afternoon',
    evening: 'Good Evening',
    subtitle: "Let's take a look at your business cash flow today.",
    welcome: 'Welcome back!',
    body: 'See your cash flow in one place, and get warned before it becomes a problem.',
    highlights: [
      { title: 'Cash-flow forecast', detail: 'Your balance for the next 30-90 days' },
      { title: 'Early shortage alerts', detail: 'Know about a dip before it happens' },
      { title: 'What-if testing', detail: 'Try a decision before you make it' },
    ],
    loginTitle: 'Sign in to your account',
    loginSubtitle: 'Use your WhatsApp number and password.',
    mobile: 'Phone / WhatsApp number',
    mobilePlaceholder: '77 123 4567',
    password: 'Password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    submit: 'Log in',
    noAccount: "Don't have an account?",
    register: 'Register / onboard your shop',
    language: 'Language',
    mobileRequired: 'Enter your phone number',
    mobileInvalid: 'Enter a valid phone number',
    passwordRequired: 'Enter your password',
    footer: 'Privacy first · NEXFI',
  },
  ta: {
    brand: 'NEXFI',
    tagline: 'பணம் எங்கே செல்கிறது என்பதை முன்கூட்டியே அறியுங்கள்',
    morning: 'காலை வணக்கம்',
    afternoon: 'மதிய வணக்கம்',
    evening: 'மாலை வணக்கம்',
    subtitle: 'இன்று உங்கள் வணிகத்தின் பண ஓட்டத்தைப் பார்ப்போம்.',
    welcome: 'மீண்டும் வருக!',
    body: 'உங்கள் பண ஓட்டத்தை ஒரே இடத்தில் பார்த்து, பிரச்சனை வருவதற்கு முன்பே அறியுங்கள்.',
    highlights: [
      { title: 'பண ஓட்ட முன்னறிவிப்பு', detail: 'உங்கள் இருப்பு நாளை 30-90 நாட்கள்' },
      { title: 'முன்கூட்டிய எச்சரிக்கை', detail: 'பணம் குறைவதற்கு முன் அறியப்படும்' },
      { title: 'எளிய சோதனை', detail: 'முடிவெடுப்பதற்கு முன் முயற்சி செய்' },
    ],
    loginTitle: 'உங்கள் கணக்கில் நுழையவும்',
    loginSubtitle: 'உங்கள் WhatsApp எண்ணையும் கடவுச்சொல்லையும் பயன்படுத்தவும்.',
    mobile: 'தொலைபேசி / WhatsApp எண்',
    mobilePlaceholder: '77 123 4567',
    password: 'கடவுச்சொல்',
    showPassword: 'கடவுச்சொல்லைக் காட்டு',
    hidePassword: 'கடவுச்சொல்லை மறை',
    rememberMe: 'என்னை நினைவில் வைத்திரு',
    forgotPassword: 'கடவுச்சொல் மறக்குந்தீர்களா?',
    submit: 'நுழையவும்',
    noAccount: 'கணக்கு இல்லையா?',
    register: 'கடையைப் பதிவு செய் / தொடங்குக',
    language: 'மொழி',
    mobileRequired: 'தொலைபேசி எண்ணை நிரப்பவும்',
    mobileInvalid: 'சரியான தொலைபேசி எண்ணை நிரப்பவும்',
    passwordRequired: 'கடவுச்சொல்லை நிரப்பவும்',
    footer: 'தனிப்பட்டன்மை · NEXFI',
  },
  si: {
    brand: 'NEXFI',
    tagline: 'ඔබගේ මුදල් ගමනේ කලින්ම ඇඟවීම',
    morning: 'සුබ උදෑසනක්',
    afternoon: 'සුබ පස්වරුවක්',
    evening: 'සුබ සැන්දෑවක්',
    subtitle: 'අද ඔබගේ ව්‍යාපෘතියේ මුදල් ගමන බලමු.',
    welcome: 'නැවත සාදරයෙන් පිළිගනිමු!',
    body: 'ඔබගේ මුදල් ගමන එක තැනක බලා, අනාගතයට පෙර දැනුම්දීම් ලබා දෙනු ඇත.',
    highlights: [
      { title: 'මුදල් ගමන පුරෝකථනය', detail: 'ඉදිරි දින 30-90ක ඔබගේ ඉතිරි මුදල්' },
      { title: 'කලින්ම අනතුරු ඇඟවීම', detail: 'මුදල් අඩුවීමට පෙර දැනුම්දීම' },
      { title: 'මුදල් ගමන පරීක්ෂණය', detail: 'මොකද සිදුවන්නේ යනවා දැයි බලන්න' },
    ],
    loginTitle: 'ඔබගේ ගිණුමට පිවිසෙන්න',
    loginSubtitle: 'ඔබගේ WhatsApp අංකය සහ මුරපදය භාවිතා කරන්න.',
    mobile: 'දුරකථන / WhatsApp අංකය',
    mobilePlaceholder: '77 123 4567',
    password: 'මුරපදය',
    showPassword: 'මුරපදය පෙන්වන්න',
    hidePassword: 'මුරපදය සඟවන්න',
    rememberMe: 'මාව මතක තබාගන්න',
    forgotPassword: 'මුරපදය අමතක වේද?',
    submit: 'පිවිසෙන්න',
    noAccount: 'ගිණුමක් නොමැත?',
    register: 'කඩය ලියාපදිංචි කර ආරම්භ කරන්න',
    language: 'භාෂාව',
    mobileRequired: 'දුරකථන අංකය ඇතුළත් කරන්න',
    mobileInvalid: 'නිවැරදි දුරකථන අංකයක් ඇතුළත් කරන්න',
    passwordRequired: 'මුරපදය ඇතුළත් කරන්න',
    footer: 'නිරමාණයක් නොගන්න · NEXFI',
  },
}

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
]



export default function WelcomeLoginScreen({ onLogin }) {
  const [hour, setHour] = useState(() => new Date().getHours())
  const [language, setLanguage] = useState(() => {
    try {
      const stored = localStorage.getItem('nexfi.language')
      return stored && stored in translations ? stored : 'en'
    } catch {
      return 'en'
    }
  })
  const [languageOpen, setLanguageOpen] = useState(false)
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})

  // Re-read the clock on a minute timer
  useEffect(() => {
    const tick = () => setHour(new Date().getHours())
    const timer = setInterval(tick, 60 * 1000)
    tick()
    return () => clearInterval(timer)
  }, [])

  // Persist the choice and mirror it onto <html lang>
  useEffect(() => {
    localStorage.setItem('nexfi.language', language)
    document.documentElement.lang = language
  }, [language])

  const getGreeting = (currentHour) => {
    if (currentHour >= 5 && currentHour < 12) return 'morning'
    if (currentHour >= 12 && currentHour < 17) return 'afternoon'
    return 'evening'
  }

  const greetingKey = getGreeting(hour)
  const GreetingIcon = greetingKey === 'morning' ? Sun : greetingKey === 'afternoon' ? SunMedium : Moon
  const t = translations[language] || translations.en
  const clock = `${String(hour).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`

  const validate = () => {
    const found = {}
    const digits = mobile.replace(/\D/g, '')
    if (!mobile.trim()) {
      found.mobile = t.mobileRequired
    } else if (!/^0?[1-9]\d{8}$/.test(digits)) {
      found.mobile = t.mobileInvalid
    }
    if (!password) {
      found.password = t.passwordRequired
    }
    return found
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)

    if (Object.keys(found).length > 0) {
      return
    }

    const payload = { mobile, password, rememberMe, language }
    onLogin?.(payload)
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="relative mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-2">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl animate-pulse delay-1000" />
          <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl animate-pulse delay-500" />

          <section className="relative flex flex-col justify-between px-6 py-8 sm:px-10 lg:py-12">
            <div>
              <div className="flex items-center justify-between gap-3">
                <NexfiLogo size="lg" className="mt-2" />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLanguageOpen((open) => !open)}
                    aria-haspopup="listbox"
                    aria-expanded={languageOpen}
                    aria-label={t.language}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl transition-all duration-300 hover:bg-slate-800/80 hover:text-white hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <Globe className="h-3.5 w-3.5 text-emerald-300" />
                    {LANGUAGE_OPTIONS.find((option) => option.code === language)?.label || 'English'}
                  </button>

                  {languageOpen ? (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setLanguageOpen(false)}
                        aria-hidden="true"
                      />
                      <ul
                        role="listbox"
                        aria-label={t.language}
                        className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 py-1 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl"
                      >
                        {LANGUAGE_OPTIONS.map((option) => (
                          <li key={option.code}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={option.code === language}
                              onClick={() => {
                                setLanguage(option.code)
                                setLanguageOpen(false)
                              }}
                              className={`w-full px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                                option.code === language
                                  ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-200'
                                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {option.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="mt-10 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm shadow-lg shadow-emerald-500/20">
                    <GreetingIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="tabular text-sm font-medium text-emerald-300">{clock}</p>
                    <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {t[greetingKey]}
                    </h1>
                    <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-300">
                      {t.subtitle}
                    </p>
                  </div>
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                  {t.highlights.map((item, index) => (
                    <li key={index} className="rounded-xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md shadow-lg shadow-slate-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/20">
                      <TrendingUp className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                      <p className="mt-1.5 text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-10 hidden text-sm font-medium text-slate-400 lg:block">
              Privacy first A� NEXFI
            </p>
          </section>

          <section className="relative flex items-center justify-center px-4 py-8 sm:px-8 lg:py-12">
            <div className="w-full max-w-md">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/20">
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-900/40 px-2.5 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    Cash-flow early warning
                  </span>
                  <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
                    {t.loginTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">{t.loginSubtitle}</p>
                </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLanguageOpen((open) => !open)}
                  aria-haspopup="listbox"
                  aria-expanded={languageOpen}
                  aria-label={t.language}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {LANGUAGE_OPTIONS.find((option) => option.code === language)?.label || 'English'}
                </button>

                {languageOpen ? (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setLanguageOpen(false)}
                      aria-hidden="true"
                    />
                    <ul
                      role="listbox"
                      aria-label={t.language}
                      className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                    >
                      {LANGUAGE_OPTIONS.map((option) => (
                        <li key={option.code}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={option.code === language}
                            onClick={() => {
                              setLanguage(option.code)
                              setLanguageOpen(false)
                              setErrors({})
                            }}
                            className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-sm transition-colors ${
                              option.code === language
                                ? 'bg-emerald-50 font-semibold text-emerald-800'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{option.label}</span>
                            {option.code === language ? <Check className="h-3.5 w-3.5" /> : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-10 lg:mt-16">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur">
                  <GreetingIcon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-sm font-medium tracking-wider text-emerald-100">
                    {clock}
                  </p>
                  <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {t[greetingKey]}
                  </h1>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-emerald-50/90">
                    {t.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-6 max-w-md">
                <p className="font-display text-lg font-semibold text-white">{t.welcome}</p>
                <p className="mt-1 text-sm leading-relaxed text-emerald-50/90">{t.body}</p>
              </div>

              <ul className="mt-6 hidden gap-3 sm:grid sm:grid-cols-3 lg:grid">
                {t.highlights.map((item) => (
                  <li key={item.title} className="rounded-xl bg-white/10 p-3 backdrop-blur">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-emerald-50/80">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="font-display mt-10 text-xs text-emerald-100/70">{t.footer}</p>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <GreetingIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-xs tracking-wider text-slate-500">{clock}</p>
                <p className="font-display text-base font-bold text-slate-900">{t[greetingKey]}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-0 sm:p-7">
              <h2 className="font-display text-lg font-bold tracking-tight text-slate-900">
                {t.loginTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{t.loginSubtitle}</p>

              <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
                <div>
                    <label htmlFor="mobile" className="text-sm font-medium text-slate-300">
                    {t.mobile}
                  </label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center gap-1 rounded-l-xl border border-r-0 border-white/10 bg-slate-800/60 px-3 text-sm font-semibold text-slate-300 backdrop-blur-sm">
                      <Phone className="h-3.5 w-3.5" />
                      +94
                    </span>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={mobile}
                      onChange={(event) => {
                        setMobile(event.target.value)
                        if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }))
                      }}
                      placeholder={t.mobilePlaceholder}
                      aria-invalid={errors.mobile ? 'true' : undefined}
                      aria-describedby={errors.mobile ? 'mobile-error' : undefined}
                      className={`w-full rounded-r-xl border bg-slate-800/60 px-3.5 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:ring-2 backdrop-blur-sm ${errors.mobile ? 'border-rose-400/50 focus:border-rose-400 focus:ring-rose-500/20' : 'border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20'}`}
                    />
                  </div>
                  {errors.mobile ? (
                    <p id="mobile-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                      {errors.mobile}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="password" className="text-sm font-medium text-slate-300">
                    {t.password}
                  </label>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value)
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                      }}
                      aria-invalid={errors.password ? 'true' : undefined}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      className={`w-full rounded-xl border bg-slate-800/60 pl-9 pr-11 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:ring-2 backdrop-blur-sm ${errors.password ? 'border-rose-400/50 focus:border-rose-400 focus:ring-rose-500/20' : 'border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? t.hidePassword : t.showPassword}
                      aria-pressed={showPassword}
                      className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-all duration-300 hover:bg-white/10 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p
                      id="password-error"
                      role="alert"
                      className="mt-1.5 text-xs font-medium text-rose-600"
                    >
                      {errors.password}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-slate-800/60 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                    />
                    {t.rememberMe}
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200"
                  >
                    {t.forgotPassword}
                  </button>
                </div>

                <button
                  type="submit"
                  className="font-display w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:from-emerald-700 hover:to-teal-700 hover:-translate-y-0.5 hover:shadow-emerald-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  {t.submit}
                </button>

                <div className="flex items-center justify-center gap-2 pt-1 text-sm text-slate-400">
                  <span>{t.noAccount}</span>
                  <Link
                    to="/onboarding"
                    className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
                  >
                    {t.register}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
