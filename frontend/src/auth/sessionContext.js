import { createContext, useContext } from 'react'

/**
 * Session state.
 *
 * There is no auth endpoint yet, so the session lives in memory and mirrors to sessionStorage to
 * survive a page refresh. Swap `signIn` for the real `POST /api/auth/login` call when it lands;
 * nothing else needs to change.
 */
export const SessionContext = createContext(null)

export function useSession() {
  const session = useContext(SessionContext)
  if (!session) throw new Error('useSession must be used inside the session provider')
  return session
}
