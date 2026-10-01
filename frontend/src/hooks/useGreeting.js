import { useEffect, useState } from 'react'

/**
 * Time-of-day detection for the welcome screen.
 *
 * The clock is re-read on a timer rather than only on mount, so a user who leaves the tab open
 * across a boundary (say, at 11:59:40) sees the greeting change without reloading. The timer
 * fires at the start of each minute, which is the finest granularity a greeting needs.
 */

export const DAY_PARTS = ['MORNING', 'AFTERNOON', 'EVENING']

/**
 * Maps an hour (0-23) to a day part.
 *
 * Morning 05:00-11:59, afternoon 12:00-16:59, evening 17:00 through 04:59. The evening band
 * wraps past midnight, which is why this takes the raw hour rather than comparing a start and
 * end time — a `>= 17 && < 5` style check can never be true as written.
 */
export function dayPartForHour(hour) {
  const normalised = Number(hour)
  if (normalised >= 5 && normalised < 12) return 'MORNING'
  if (normalised >= 12 && normalised < 17) return 'AFTERNOON'
  return 'EVENING'
}

export function currentDayPart(date = new Date()) {
  return dayPartForHour(date.getHours())
}

/** "07:42" in 24-hour form, matching how Sri Lankan shop owners read their own day. */
export function formatClock(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let interval = null

    function schedule() {
      const now = new Date()
      // Align each tick to the next minute boundary so the greeting flips on the minute
      // rather than drifting up to a minute late, and re-align after every wake-up so a
      // suspended laptop tab does not stay stuck on a stale minute.
      const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
      const timeout = setTimeout(() => {
        setNow(new Date())
        interval = setInterval(() => setNow(new Date()), 60_000)
      }, msToNextMinute)
      return timeout
    }

    let timeout = schedule()
    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return
      // Catch up immediately rather than waiting out the remainder of the stale interval.
      setNow(new Date())
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
      timeout = schedule()
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return now
}

/**
 * Convenience wrapper returning the greeting band plus its icon name, so components do not
 * re-derive the band from the hour.
 */
export function useGreeting() {
  const now = useClock()
  const dayPart = currentDayPart(now)
  return { dayPart, clock: formatClock(now), now }
}