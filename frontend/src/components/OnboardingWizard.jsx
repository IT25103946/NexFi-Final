import { useEffect, useMemo } from 'react'
import { AlertCircle, ArrowRight, Check, ChevronLeft, ShieldCheck, Sparkles } from 'lucide-react'

import { LanguageSwitcher, StepFinancial, StepOwner, StepShop } from './OnboardingSteps'
import { formatTemplate, labelsFor, localiseErrors } from '../lib/onboardingLabels'
import { useOnboardingForm } from '../hooks/useOnboardingForm'

/**
 * Progress indicator. Shows the three steps as a track on mobile and as labelled pills on
 * wider screens, where there is room for the step names. Completed steps are clickable so an
 * owner can go back and correct a field without losing their place.
 */
function ProgressIndicator({ steps, current, onStepClick, stepOfTemplate }) {
  return (
    <nav aria-label={formatTemplate(stepOfTemplate, { current: current + 1, total: steps.length })}>
      <ol className="flex items-center gap-2 sm:gap-3">
        {steps.map((step, index) => {
          const isDone = index < current
          const isCurrent = index === current

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => index <= current && onStepClick(index)}
                disabled={index > current}
                aria-current={isCurrent ? 'step' : undefined}
                className={`group flex min-w-0 items-center gap-2 text-left transition-opacity ${
                  index > current ? 'cursor-not-allowed opacity-45' : 'cursor-pointer'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-600/25 ring-4 ring-emerald-100'
                        : 'border-2 border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span
                    className={`block truncate text-xs font-semibold ${
                      isCurrent ? 'text-emerald-800' : isDone ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </span>
              </button>

              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={`h-0.5 flex-1 rounded transition-colors duration-300 ${
                    isDone ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** Renders the step for the current index. The form props are passed individually so each step
 *  receives exactly the `values`, `errors`, and `setField` its fields need. */
function StepBody({ step, values, errors, setField, labels }) {
  const formProps = { values, errors: localiseErrors(errors, labels), setField, labels }
  switch (step) {
    case 0:
      return <StepShop {...formProps} />
    case 1:
      return <StepFinancial {...formProps} />
    default:
      return <StepOwner {...formProps} />
  }
}

/**
 * Multi-step onboarding wizard.
 *
 * Owns nothing but layout: all form state lives in `useOnboardingForm`, and every label comes
 * from `labelsFor(language)` so the language switcher re-renders the whole wizard. The caller
 * receives a normalised payload through `onComplete` and decides what happens next (save to the
 * API, then navigate to the dashboard).
 */
export default function OnboardingWizard({ onComplete, initialValues }) {
  const form = useOnboardingForm({ onComplete, initialValues })
  const labels = useMemo(() => labelsFor(form.values.language), [form.values.language])

  const { values, errors, step, stepCount, submitting } = form
  const stepMeta = labels.steps[step]
  const isLastStep = step === stepCount - 1
  const errorCount = Object.keys(errors).length

  // Mirror the wizard's language onto <html lang> so the CSS font stack swaps to the Sinhala or
  // Tamil face. Space Grotesk has no glyphs for those scripts, so without this they render as
  // boxes.
  useEffect(() => {
    localStorage.setItem('nexfi.language', values.language)
    document.documentElement.lang = values.language
  }, [values.language])

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold tracking-[0.18em] text-slate-900">
                {labels.brand}
              </h1>
              <p className="text-xs text-slate-500">
                {formatTemplate(labels.stepOf, { current: step + 1, total: stepCount })}
              </p>
            </div>
          </div>

          <LanguageSwitcher
            language={values.language}
            onChange={(next) => form.setField('language', next)}
            labels={labels}
          />
        </div>

        <div className="mt-5">
          <ProgressIndicator
            steps={labels.steps}
            current={step}
            onStepClick={form.goToStep}
            stepOfTemplate={labels.stepOf}
          />
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-4 sm:px-6">
          <h2 className="font-display text-base font-semibold text-slate-900">{stepMeta.title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{stepMeta.blurb}</p>
        </div>

        <div className="px-4 py-5 sm:px-6">
          {errorCount > 0 ? (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                {labels.validation.summary} <span className="font-medium">({errorCount})</span>
              </p>
            </div>
          ) : null}

          {/* Keyed so each step remounts clean instead of inheriting the previous step's DOM. */}
          <StepBody
            key={step}
            step={step}
            values={values}
            errors={errors}
            setField={form.setField}
            labels={labels}
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={form.previous}
            disabled={step === 0 || submitting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            {labels.actions.previous}
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={form.submit}
              disabled={submitting}
              className="font-display inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? labels.saving : labels.actions.complete}
              {submitting ? null : <ArrowRight className="h-4 w-4" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={form.next}
              className="font-display inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-emerald-800"
            >
              {labels.actions.next}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        {labels.trustNote}
      </p>
    </div>
  )
}
