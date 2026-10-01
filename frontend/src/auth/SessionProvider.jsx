import { useCallback, useEffect, useMemo, useState } from 'react'

import { SessionContext } from './sessionContext'
import { fetchShopProfile } from '../api/client'
import { stripCountryCode } from '../hooks/useOnboardingForm'

const SESSION_KEY = 'nexfi.session'
const PROFILE_KEY = 'nexfi.shopProfile'
const LANGUAGE_KEY = 'nexfi.language'

function readStoredUser() {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function readStoredProfile() {
  try {
    const stored = sessionStorage.getItem(PROFILE_KEY) || localStorage.getItem(PROFILE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function readStoredLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY)
    return stored && ['en', 'si', 'ta'].includes(stored) ? stored : 'en'
  } catch {
    return 'en'
  }
}

export default function SessionProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [profile, setProfile] = useState(readStoredProfile)
  const [language, setLanguageState] = useState(() => {
    const storedUser = readStoredUser()
    const storedProfile = readStoredProfile()
    return storedProfile?.language || storedUser?.language || readStoredLanguage()
  })

  // Synchronize language state across storage and DOM element
  const setLanguage = useCallback((lang) => {
    if (!['en', 'si', 'ta'].includes(lang)) return
    setLanguageState(lang)
    try {
      localStorage.setItem(LANGUAGE_KEY, lang)
      document.documentElement.lang = lang
    } catch {
      // Ignore storage errors
    }
    setUser((prev) => (prev ? { ...prev, language: lang } : prev))
    setProfile((prev) => (prev ? { ...prev, language: lang } : prev))
  }, [])

  // On initial mount or when user exists without profile, check backend
  useEffect(() => {
    if (user && !profile) {
      fetchShopProfile()
        .then((serverProfile) => {
          if (serverProfile) {
            setProfile(serverProfile)
            sessionStorage.setItem(PROFILE_KEY, JSON.stringify(serverProfile))
            localStorage.setItem(PROFILE_KEY, JSON.stringify(serverProfile))
            if (serverProfile.language) {
              setLanguage(serverProfile.language)
            }
          }
        })
        .catch(() => {
          // Expected 404 if profile hasn't been set up yet
        })
    }
  }, [user, profile, setLanguage])

  // Mirror language onto documentElement
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const signIn = useCallback((credentials) => {
    const lang = credentials.language || 'en'
    const next = {
      mobile: credentials.mobile,
      language: lang,
      rememberMe: credentials.rememberMe,
    }
    setUser(next)
    setLanguage(lang)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next))
    if (credentials.rememberMe) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(next))
    }
  }, [setLanguage])

  const signOut = useCallback(() => {
    setUser(null)
    setProfile(null)
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(PROFILE_KEY)
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(PROFILE_KEY)
  }, [])

  /** Called once onboarding succeeds, saving profile and logging user in if needed. */
  const completeOnboarding = useCallback((shopProfile) => {
    setProfile(shopProfile)
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(shopProfile))
    localStorage.setItem(PROFILE_KEY, JSON.stringify(shopProfile))
    if (shopProfile.language) {
      setLanguage(shopProfile.language)
    }

    setUser((prev) => {
      const nextUser = prev || {
        mobile: stripCountryCode(shopProfile.contactPhone),
        language: shopProfile.language || 'en',
        name: shopProfile.ownerName,
        role: shopProfile.ownerRole,
        rememberMe: true,
      }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
      return nextUser
    })
  }, [setLanguage])

  const needsOnboarding = Boolean(user) && !profile

  const value = useMemo(
    () => ({
      user,
      profile,
      language,
      setLanguage,
      signIn,
      signOut,
      completeOnboarding,
      needsOnboarding,
    }),
    [user, profile, language, setLanguage, signIn, signOut, completeOnboarding, needsOnboarding],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
