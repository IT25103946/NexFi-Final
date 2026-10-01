import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import OnboardingWizard from '../components/OnboardingWizard'
import { ErrorBanner } from '../components/Feedback'
import { useSession } from '../auth/sessionContext'
import { stripCountryCode } from '../hooks/useOnboardingForm'
import { submitOnboarding } from '../api/client'

/**
 * Onboarding route for both first-time users and returning owners editing shop setup.
 *
 * Saves the onboarded shop details to the backend API (`POST /api/onboarding`) with an offline
 * fallback to local state / storage. Completing onboarding automatically signs the user in and
 * directs them to the personalized dynamic dashboard.
 */
export default function Onboarding() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { user, profile, completeOnboarding } = useSession()

  const handleComplete = useCallback(
    async (payload) => {
      setError('')
      try {
        await submitOnboarding(payload)
      } catch (saveError) {
        // Save to local storage so offline demo still functions
        localStorage.setItem('nexfi.shopProfile', JSON.stringify(payload))
        localStorage.setItem('nexfi.onboarding', JSON.stringify(payload))
        setError(saveError.message)
      }
      // Marks the profile & user session as onboarded and routes to the dashboard
      completeOnboarding(payload)
      navigate('/')
    },
    [completeOnboarding, navigate],
  )

  const initialValues = profile
    ? {
        ...profile,
        contactPhone: profile.contactPhone ? stripCountryCode(profile.contactPhone) : '',
      }
    : user
      ? {
          language: user.language || 'en',
          contactPhone: user.mobile ? stripCountryCode(user.mobile) : '',
        }
      : undefined

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-slate-50 to-slate-100 px-4 py-8 sm:px-6 sm:py-12">
      {profile ? (
        <div className="mx-auto mb-4 max-w-2xl flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
            Edit Shop Setup
          </span>
        </div>
      ) : null}

      {error ? (
        <div className="mx-auto mb-4 max-w-2xl">
          <ErrorBanner message={error} />
        </div>
      ) : null}

      <OnboardingWizard
        onComplete={handleComplete}
        initialValues={initialValues}
      />
    </div>
  )
}
