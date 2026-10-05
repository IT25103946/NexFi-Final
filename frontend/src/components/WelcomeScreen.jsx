import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  Lock,
  LogIn,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  SunMedium,
  TrendingUp,
  UserPlus,
} from 'lucide-react'

import { DAY_PART_ICONS, LANGUAGES, labelsFor } from '../lib/loginLabels'
import { useGreeting } from '../hooks/useGreeting'

const ICONS = { Sun, SunMedium, Moon }

const inputClass =
  'w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2'

/** Language switcher. Three options fit inline at every breakpoint, so no dropdown is needed. */
function LanguageSwitcher({ language, onChange, labels }) {
  return (
    <div
      role="group"
      aria-label={labels.languageLabel}
      className="inline-flex items-center gap-0.5 rounded-full border border-white/60 bg-white/80 p-0.5 shadow-sm backdrop-blur"
    >
      <Globe className="ml-2 h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden="true" />
      {LANGUAGES.map((option) => {
        const active = option.code === language
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => onChange(option.code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              active ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:bg-white/70'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Time-based greeting block. Picks its icon and copy from the day part rather than nesting
 * conditionals in the markup.
 */
function Greeting({ dayPart, clock, labels }) {
  const Icon = ICONS[DAY_PART_ICONS[dayPart]] ?? Sun

  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="tabular text-sm font-medium text-emerald-100">{clock}</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {labels.greetings[dayPart]}
        </h1>
        <p className="mt-1 max-w-md text-sm leading-relaxed text-emerald-50/90">
          {labels.subtitles[dayPart]}
        </p>
      </div>
    </div>
  )
}

/** Static value props shown beside the form on large screens. */
function Highlights({ labels }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-3">
      {labels.highlights.map((item, index) => (
        <li key={item.title} className="rounded-xl bg-white/10 p-3 backdrop-blur">
          <TrendingUp className="h-4 w-4 text-emerald-200" aria-hidden="true" />
          <p className="mt-1.5 text-sm font-semibold text-white">{item.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-emerald-50/80">{item.detail}</p>
          <span className="sr-only">{index + 1}</span>
        </li>
      ))}
    </ul>
  )
}

function LoginForm({ login, labels, errorTitle }) {
  const { values, errors, remember, submitting, formError, setField, setRemember, submit } = login
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {formError ? (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">{errorTitle}</p>
            <p className="mt-0.5">{formError}</p>
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor="login-phone" className="text-sm font-medium text-slate-700">
          {labels.login.phone}
        </label>
        <div className="mt-1.5">
          {/* Country code is fixed rather than a dropdown: every Pravaha Pulse user is local,
              so an editable prefix would only create a way to enter an invalid one. */}
          <div className="flex">
            <span className="inline-flex items-center gap-1 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm font-semibold text-slate-600">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              +94
            </span>
            <input
              id="login-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              placeholder={labels.login.phonePlaceholder}
              aria-invalid={errors.phone ? 'true' : undefined}
              aria-describedby={errors.phone ? 'login-phone-error' : undefined}
              onChange={(event) => setField('phone', event.target.value)}
              className={`${inputClass} rounded-l-none ${
                errors.phone
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
                  : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
          </div>
          {errors.phone ? (
            <p id="login-phone-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
              {labels.validation[errors.phone]}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="login-password" className="text-sm font-medium text-slate-700">
          {labels.login.password}
        </label>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={values.password}
            placeholder={labels.login.passwordPlaceholder}
            aria-invalid={errors.password ? 'true' : undefined}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            onChange={(event) => setField('password', event.target.value)}
            className={`${inputClass} pl-9 pr-11 ${
              errors.password
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
                : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? labels.login.hidePassword : labels.login.showPassword}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password ? (
          <p id="login-password-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
            {labels.validation[errors.password]}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
          />
          {labels.login.rememberMe}
        </label>

        <button
          type="button"
          className="text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-800"
        >
          {labels.login.forgotPassword}
        </button>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {submitting ? labels.login.submitting : labels.login.submit}
      </button>

      <p className="text-center text-xs text-slate-400">{labels.login.demoHint}</p>

      <div className="flex items-center gap-2 pt-1 text-center text-sm text-slate-600">
        <span>{labels.login.noAccount}</span>
        <a
          href="/onboarding"
          className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          {labels.login.register}
        </a>
      </div>
    </form>
  )
}

/**
 * Welcome + login screen.
 *
 * Two-column on desktop (brand panel with the greeting, form card), single column on mobile
 * where the greeting collapses to a compact header. The greeting recomputes on a minute timer,
 * so a tab left open overnight updates itself.
 */
export default function WelcomeScreen({ language, onLanguageChange, login }) {
  const labels = useMemo(() => labelsFor(language), [language])
  const { dayPart, clock } = useGreeting()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-2">
        {/* Brand + greeting */}
        <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 px-6 py-8 sm:px-10 lg:py-12">
          {/* Decorative wash, hidden from assistive tech. */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-bold tracking-tight text-white">{labels.brand}</p>
                  <p className="text-xs text-emerald-100/80">{labels.brandSub}</p>
                </div>
              </div>

              <LanguageSwitcher language={language} onChange={onLanguageChange} labels={labels} />
            </div>

            <div className="mt-10 lg:mt-16">
              <Greeting dayPart={dayPart} clock={clock} labels={labels} />

              <div className="mt-6 max-w-md">
                <p className="text-lg font-semibold text-white">{labels.welcome}</p>
                <p className="mt-1 text-sm leading-relaxed text-emerald-50/90">{labels.body}</p>
              </div>

              <div className="mt-6 hidden lg:block">
                <Highlights labels={labels} />
              </div>
            </div>
          </div>

          <p className="relative mt-10 flex items-center gap-1.5 text-xs text-emerald-100/70">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {labels.footer}
          </p>
        </section>

        {/* Form */}
        <section className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Compact greeting for mobile, where the brand panel sits above the fold. */}
            <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
              {(() => {
                const Icon = ICONS[DAY_PART_ICONS[dayPart]] ?? Sun
                return (
                  <>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="tabular text-xs text-slate-500">{clock}</p>
                      <p className="text-base font-bold text-slate-900">{labels.greetings[dayPart]}</p>
                    </div>
                  </>
                )
              })()}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">{labels.login.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{labels.login.subtitle}</p>

              <div className="mt-5">
                <LoginForm login={login} labels={labels} errorTitle={labels.errors.title} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}