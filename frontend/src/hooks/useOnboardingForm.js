import { useCallback, useMemo, useState } from 'react'

import { LANGUAGES } from '../lib/onboardingLabels'

/**
 * Form state for the onboarding wizard.
 */
export const INITIAL_VALUES = {
  language: 'en',
  // Step 1 — Shop & business
  shopName: '',
  businessType: '',
  location: '',
  contactPhone: '',
  currency: 'LKR',
  // Step 2 — Financial & cash flow
  startingBalance: '',
  balancePeriod: 'MONTHLY',
  offersCreditSales: '',
  buysOnCredit: '',
  recurringFrequency: 'MONTHLY',
  // Step 3 — Owner
  ownerName: '',
  ownerRole: '',
}

const DEFAULT_LANGUAGE = 'en'

const NATIONAL_MOBILE = /^0?([1-9]\d{8})$/

export function normalisePhone(value) {
  const trimmed = String(value ?? '').replace(/[\s()-]/g, '')
  if (trimmed.startsWith('+94')) return `+94${trimmed.slice(3)}`
  const national = trimmed.match(NATIONAL_MOBILE)
  return national ? `+94${national[1]}` : trimmed
}

export function isValidPhone(value) {
  return /^\+94[1-9]\d{8}$/.test(normalisePhone(value))
}

export function formatNationalPhone(value) {
  const national = stripCountryCode(value).replace(/\D/g, '').slice(0, 9)
  return [national.slice(0, 2), national.slice(2, 5), national.slice(5, 9)].filter(Boolean).join(' ')
}

export function stripCountryCode(value) {
  return normalisePhone(value).replace(/^\+94/, '')
}

export function isValidAmount(value) {
  if (value === '' || value === null || value === undefined) return false
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0
}

/**
 * Per-step validators.
 */
export const STEP_VALIDATION = [
  {
    shopName: (value) => (String(value ?? '').trim().length >= 2 ? null : 'required'),
    businessType: (value) => (value ? null : 'selectOne'),
    location: (value) => (String(value ?? '').trim().length >= 2 ? null : 'required'),
    contactPhone: (value) => (isValidPhone(value) ? null : 'invalidPhone'),
    currency: (value) => (value ? null : 'selectOne'),
  },
  {
    startingBalance: (value) => (isValidAmount(value) ? null : 'invalidAmount'),
    balancePeriod: (value) => (value ? null : 'selectOne'),
    offersCreditSales: (value) => (value === true || value === false ? null : 'required'),
    buysOnCredit: (value) => (value === true || value === false ? null : 'required'),
    recurringFrequency: (value) => (value ? null : 'selectOne'),
  },
  {
    ownerName: (value) => (String(value ?? '').trim().length >= 2 ? null : 'required'),
    ownerRole: (value) => (value ? null : 'selectOne'),
  },
]

export function validateStep(stepIndex, values) {
  const rules = STEP_VALIDATION[stepIndex] ?? {}
  return Object.entries(rules).reduce((errors, [field, rule]) => {
    const error = rule(values[field], values)
    if (error) errors[field] = error
    return errors
  }, {})
}

export function toPayload(values) {
  return {
    shopName: values.shopName.trim(),
    businessType: values.businessType,
    location: values.location.trim(),
    contactPhone: normalisePhone(values.contactPhone),
    currency: values.currency,
    startingBalance: Number(values.startingBalance),
    balancePeriod: values.balancePeriod,
    offersCreditSales: values.offersCreditSales === true,
    buysOnCredit: values.buysOnCredit === true,
    recurringFrequency: values.recurringFrequency,
    ownerName: values.ownerName.trim(),
    ownerRole: values.ownerRole,
    language: values.language,
  }
}

export function readPreferredLanguage() {
  try {
    const stored = localStorage.getItem('nexfi.language')
    return LANGUAGES.some((language) => language.code === stored) ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

export function useOnboardingForm({ onComplete, initialValues } = {}) {
  const [values, setValues] = useState(() => {
    const seeded = { ...INITIAL_VALUES, language: readPreferredLanguage() }
    if (initialValues) {
      Object.assign(seeded, initialValues)
      if (initialValues.contactPhone) {
        seeded.contactPhone = stripCountryCode(initialValues.contactPhone)
      }
      if (initialValues.startingBalance !== undefined && initialValues.startingBalance !== null) {
        seeded.startingBalance = String(initialValues.startingBalance)
      }
    }
    return seeded
  })

  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const setField = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }, [])

  const currentErrors = useMemo(() => validateStep(step, values), [step, values])

  const allErrors = useMemo(
    () => STEP_VALIDATION.reduce((all, rules, index) => ({ ...all, ...validateStep(index, values) }), {}),
    [values],
  )

  const isStepComplete = useMemo(() => Object.keys(currentErrors).length === 0, [currentErrors])

  const validateCurrentStep = useCallback(() => {
    const found = validateStep(step, values)
    setErrors(found)
    return Object.keys(found).length === 0
  }, [step, values])

  const next = useCallback(() => {
    if (!validateCurrentStep()) return false
    setStep((current) => Math.min(current + 1, STEP_VALIDATION.length - 1))
    return true
  }, [validateCurrentStep])

  const previous = useCallback(() => {
    setErrors({})
    setStep((current) => Math.max(current - 1, 0))
  }, [])

  const submit = useCallback(async () => {
    const found = STEP_VALIDATION.reduce(
      (all, rules, index) => ({ ...all, ...validateStep(index, values) }),
      {},
    )

    if (Object.keys(found).length > 0) {
      setErrors(found)
      const firstBrokenStep = STEP_VALIDATION.findIndex(
        (rules, index) => Object.keys(validateStep(index, values)).length > 0,
      )
      setStep(Math.max(0, firstBrokenStep))
      return false
    }

    setErrors({})
    if (!onComplete) return true

    setSubmitting(true)
    try {
      await onComplete(toPayload(values))
      return true
    } finally {
      setSubmitting(false)
    }
  }, [values, onComplete])

  return {
    values,
    errors,
    step,
    stepCount: STEP_VALIDATION.length,
    submitting,
    isStepComplete,
    allErrors,
    setField,
    next,
    previous,
    submit,
    goToStep: setStep,
  }
}
