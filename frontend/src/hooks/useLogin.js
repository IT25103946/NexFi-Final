import { useCallback, useState } from 'react'

import { isValidPhone } from './useOnboardingForm'

/**
 * Login form state.
 *
 * Validates locally before hitting the network so an obvious typo costs no round trip, and
 * treats "remember me" as a real persistence decision rather than a decorative checkbox: when
 * off, the phone number is deliberately not written to storage.
 */

const STORAGE_KEY = 'nexfi.rememberedPhone'

/** Reads the remembered number, tolerating private-mode storage failures. */
function readRememberedPhone() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function persistPhone(phone, remember) {
  try {
    if (remember) localStorage.setItem(STORAGE_KEY, phone)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // A blocked storage API must not break sign-in.
  }
}

export const LOGIN_VALIDATION = {
  phone: (value) => {
    if (!String(value ?? '').trim()) return 'phoneRequired'
    if (!isValidPhone(value)) return 'phoneInvalid'
    return null
  },
  password: (value) => {
    if (!String(value ?? '')) return 'passwordRequired'
    if (String(value).length < 4) return 'passwordShort'
    return null
  },
}

export function validateLogin(values) {
  return Object.entries(LOGIN_VALIDATION).reduce((errors, [field, rule]) => {
    const error = rule(values[field])
    if (error) errors[field] = error
    return errors
  }, {})
}

export function useLogin({ onLogin }) {
  const [values, setValues] = useState(() => ({
    phone: readRememberedPhone(),
    password: '',
  }))
  const [remember, setRemember] = useState(() => Boolean(readRememberedPhone()))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const setField = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }, [])

  async function submit(event) {
    event?.preventDefault()
    setFormError('')

    const found = validateLogin(values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return false
    }

    setErrors({})
    setSubmitting(true)
    try {
      persistPhone(values.phone, remember)
      // The payload is normalised so the backend never has to guess whether "0771234567",
      // "+94771234567" or "077 123 4567" were meant to be the same number.
      await onLogin?.({ phone: normalisePhone(values.phone), password: values.password, remember })
      return true
    } catch (loginError) {
      setFormError(loginError.message)
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { values, errors, remember, submitting, formError, setField, setRemember, submit }
}

/** Strips formatting and the local 0, leaving the 9-digit national number (+94 prefixed). */
export function normalisePhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  if (digits.startsWith('94') && digits.length === 11) return `+${digits}`
  if (digits.startsWith('0') && digits.length === 10) return `+94${digits.slice(1)}`
  if (digits.length === 9) return `+94${digits}`
  return `+94${digits}`
}

/** Pretty-prints a national number as "77 123 4567" for the input placeholder. */
export function formatPhoneInput(value) {
  const digits = String(value ?? '').replace(/\D/g, '').replace(/^0+/, '').slice(0, 9)
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 9)].filter(Boolean)
  return parts.join(' ')
}