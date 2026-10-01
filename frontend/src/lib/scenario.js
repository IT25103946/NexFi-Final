/**
 * What-if scenario engine.
 *
 * The backend (CashFlowService) projects a running balance day by day. This module applies
 * hypothetical events to that same projection so the simulator stays consistent with the
 * numbers the API already returns, and so it can be swapped for a server-side
 * `POST /api/forecast/simulate` call later without changing any component contract.
 *
 * A scenario is a single cash event:
 *   - `kind`   which flow it touches (CUSTOMER_PAYMENT, SUPPLIER_PAYMENT, EXPENSE, INCOME)
 *   - `amount` rupees, always positive
 *   - `day`    day offset from today, 0-based, matching ForecastPoint.dayOffset
 *   - `shift`  days to move the event later (0 = on the scheduled day)
 *   - `source` optional id of the record the scenario was built from
 *
 * `projectScenario` rebuilds the whole series from the deltas rather than patching a single
 * point, so cumulative effects (an early collection lifting every later day) fall out
 * naturally instead of needing special cases.
 */

import { addDaysIso } from './format'

/** Scenario kinds. Each one moves money in or out on a single day. */
export const SCENARIO_KIND = {
  CUSTOMER_PAYMENT: 'CUSTOMER_PAYMENT',
  SUPPLIER_PAYMENT: 'SUPPLIER_PAYMENT',
  EXPENSE: 'EXPENSE',
  INCOME: 'INCOME',
}

export const SCENARIO_KIND_LABELS = {
  CUSTOMER_PAYMENT: 'Customer pays',
  SUPPLIER_PAYMENT: 'Pay supplier',
  EXPENSE: 'Extra expense',
  INCOME: 'Extra income',
}

const round = (value) => Math.round(Number(value ?? 0) * 100) / 100

/** Customer payments and income add to the balance; expenses and supplier bills subtract. */
export function isInflowKind(kind) {
  return kind === SCENARIO_KIND.INCOME || kind === SCENARIO_KIND.CUSTOMER_PAYMENT
}

/**
 * The day's balance impact of a single scenario, taking its shift into account.
 *
 * Moving an event is a removal plus an addition: a payment that arrives 10 days late must
 * first disappear from its originally scheduled day, otherwise the baseline inflow would
 * still be counted and the delay would have no visible effect. Returns 0 for every other
 * day so the deltas sum cleanly.
 */
function dayDelta(scenario, index) {
  const amount = round(scenario.amount)
  if (!amount) return 0

  const sign = isInflowKind(scenario.kind) ? 1 : -1
  const shift = Number(scenario.shift ?? 0)
  const target = scenario.day + shift

  if (!shift) return index === scenario.day ? amount * sign : 0
  if (index === scenario.day) return amount * -sign
  if (index === target) return amount * sign
  return 0
}

/**
 * Recomputes the forecast with a set of scenarios applied.
 *
 * @param {Array} forecast baseline ForecastPoint[] from the API
 * @param {Array} scenarios active scenarios
 * @returns {Array} points with `scenarioBalance` and `delta` added to each baseline point
 */
export function projectScenario(forecast = [], scenarios = []) {
  const active = scenarios.filter((scenario) => round(scenario.amount) !== 0)

  let running = 0
  return forecast.map((point, index) => {
    const delta = active.reduce((total, scenario) => total + dayDelta(scenario, index), 0)
    running += delta
    return {
      ...point,
      balance: Number(point.balance),
      scenarioBalance: round(Number(point.balance) + running),
      delta: round(running),
      scenarioInflow: round(
        Number(point.inflow) +
          active.reduce(
            (total, scenario) => (isInflowKind(scenario.kind) ? total + dayDelta(scenario, index) : total),
            0,
          ),
      ),
      scenarioOutflow: round(
        Number(point.outflow) +
          active.reduce(
            (total, scenario) => (isInflowKind(scenario.kind) ? total : total - dayDelta(scenario, index)),
            0,
          ),
      ),
    }
  })
}

/** Lowest point of a series, used for the "worst day" readout. */
function lowestPoint(points, key) {
  let lowest = null
  for (const point of points) {
    if (!lowest || Number(point[key]) < Number(lowest[key])) lowest = point
  }
  return lowest
}

function firstBelow(points, key, threshold) {
  return points.find((point) => Number(point[key]) < threshold) ?? null
}

/** Mirrors CashStatus in the backend so badges stay consistent. */
export function statusFor(lowestBalance, safetyBuffer) {
  if (Number(lowestBalance) < 0) return 'SHORTAGE'
  if (Number(lowestBalance) < Number(safetyBuffer)) return 'WARNING'
  return 'SAFE'
}

/**
 * Compares the baseline and the scenario projection.
 * Every field is derived from the two series, so the summary can never drift from the graph.
 */
export function compareProjections(forecast = [], scenarios = [], safetyBuffer = 0) {
  const projected = projectScenario(forecast, scenarios)
  const baseLowest = lowestPoint(forecast, 'balance')
  const afterLowest = lowestPoint(projected, 'scenarioBalance')
  const afterEnd = projected[projected.length - 1]

  const baseNegative = firstBelow(forecast, 'balance', 0)
  const afterNegative = firstBelow(projected, 'scenarioBalance', 0)
  const baseBreach = firstBelow(forecast, 'balance', safetyBuffer)
  const afterBreach = firstBelow(projected, 'scenarioBalance', safetyBuffer)

  return {
    projected,
    hasScenarios: scenarios.length > 0,
    baseLowest,
    afterLowest,
    baseLowestBalance: baseLowest ? Number(baseLowest.balance) : 0,
    afterLowestBalance: afterLowest ? Number(afterLowest.scenarioBalance) : 0,
    lowestDelta: round((afterLowest ? Number(afterLowest.scenarioBalance) : 0) - (baseLowest ? Number(baseLowest.balance) : 0)),
    baseStatus: baseLowest ? statusFor(baseLowest.balance, safetyBuffer) : 'SAFE',
    afterStatus: afterLowest ? statusFor(afterLowest.scenarioBalance, safetyBuffer) : 'SAFE',
    baseNegativeDate: baseNegative?.date ?? null,
    afterNegativeDate: afterNegative?.date ?? null,
    baseBreachDate: baseBreach?.date ?? null,
    afterBreachDate: afterBreach?.date ?? null,
    baseEndBalance: forecast.length ? Number(forecast[forecast.length - 1].balance) : 0,
    afterEndBalance: afterEnd ? Number(afterEnd.scenarioBalance) : 0,
    endDelta: round((afterEnd ? Number(afterEnd.scenarioBalance) : 0) - (forecast.length ? Number(forecast[forecast.length - 1].balance) : 0)),
  }
}

/**
 * Ready-made scenarios for the demo book, described against the live API data so the
 * presets stay sensible as the owner edits their books.
 */
export function buildPresets({ receivables = [], payables = [] } = {}) {
  const unpaidReceivables = receivables.filter((item) => item.status !== 'PAID')
  const unpaidPayables = payables.filter((item) => item.status !== 'PAID')
  const largestReceivable = [...unpaidReceivables].sort((a, b) => Number(b.amount) - Number(a.amount))[0]
  const overdueReceivables = unpaidReceivables.filter((item) => Number(item.daysUntilDue) < 0)
  const largestPayable = [...unpaidPayables].sort((a, b) => Number(b.amount) - Number(a.amount))[0]

  const dayOf = (item) => Math.max(0, Number(item?.daysUntilDue ?? 0))

  return [
    {
      id: 'stock-buy',
      title: 'Buy Rs. 200,000 of stock now',
      detail: 'A one-off stock purchase paid today, on top of everything already planned.',
      kind: SCENARIO_KIND.EXPENSE,
      amount: 200000,
      day: 0,
      shift: 0,
    },
    {
      id: 'defer-salaries',
      title: 'Delay the salary run by 7 days',
      detail: 'Negotiate a short deferral on staff salaries. Nothing is lost, only the timing moves.',
      kind: SCENARIO_KIND.EXPENSE,
      amount: 145000,
      day: 5,
      shift: 7,
    },
    {
      id: 'defer-largest-payable',
      title: largestPayable
        ? `Ask ${largestPayable.supplierName} for 14 more days`
        : 'Ask a supplier for 14 more days',
      detail: 'A supplier payment due soon, moved 14 days later.',
      kind: SCENARIO_KIND.SUPPLIER_PAYMENT,
      amount: Number(largestPayable?.amount ?? 100000),
      day: dayOf(largestPayable),
      shift: 14,
      source: largestPayable?.id ?? null,
    },
    {
      id: 'collect-overdue',
      title: overdueReceivables.length
        ? `Chase ${overdueReceivables.length} overdue customer${overdueReceivables.length === 1 ? '' : 's'}`
        : 'Chase overdue customers',
      detail: 'Every overdue receivable is pulled in to today, lifting the balance from day one.',
      kind: SCENARIO_KIND.CUSTOMER_PAYMENT,
      amount: overdueReceivables.reduce((total, item) => total + Number(item.amount), 0),
      day: 0,
      shift: 0,
      source: overdueReceivables[0]?.id ?? null,
    },
    {
      id: 'collect-largest',
      title: largestReceivable ? `Collect from ${largestReceivable.customerName} early` : 'Collect a big customer early',
      detail: 'The largest pending customer payment arrives 7 days earlier than scheduled.',
      kind: SCENARIO_KIND.CUSTOMER_PAYMENT,
      amount: Number(largestReceivable?.amount ?? 150000),
      day: Math.max(0, dayOf(largestReceivable)),
      shift: -7,
      source: largestReceivable?.id ?? null,
    },
    {
      id: 'extra-sales',
      title: 'Extra Rs. 75,000 of counter sales',
      detail: 'A better-than-usual week, spread as one payment 10 days from now.',
      kind: SCENARIO_KIND.INCOME,
      amount: 75000,
      day: 10,
      shift: 0,
    },
  ].filter((preset) => preset.amount > 0)
}

/** Maps a backend advice record to a scenario the owner can apply in one click. */
export function adviceToScenario(advice, { receivables = [], payables = [] } = {}) {
  if (!advice) return null
  const unpaidReceivables = receivables.filter((item) => item.status !== 'PAID')
  const overdue = unpaidReceivables.filter((item) => Number(item.daysUntilDue) < 0)
  const largestReceivable = [...unpaidReceivables].sort((a, b) => Number(b.amount) - Number(a.amount))[0]
  const largestPayable = [...payables].filter((item) => item.status !== 'PAID').sort((a, b) => Number(b.amount) - Number(a.amount))[0]

  switch (advice.id) {
    case 'collect-overdue':
      return {
        id: 'advice-collect-overdue',
        title: advice.title,
        detail: advice.detail,
        kind: SCENARIO_KIND.CUSTOMER_PAYMENT,
        amount: overdue.reduce((total, item) => total + Number(item.amount), 0),
        day: 0,
        shift: 0,
        source: overdue[0]?.id ?? null,
      }
    case 'delay-expense':
      return {
        id: 'advice-delay-expense',
        title: advice.title,
        detail: advice.detail,
        kind: SCENARIO_KIND.EXPENSE,
        amount: 20000,
        day: 11,
        shift: 14,
      }
    case 'plan-shortage':
      return largestPayable
        ? {
            id: 'advice-plan-shortage',
            title: advice.title,
            detail: advice.detail,
            kind: SCENARIO_KIND.SUPPLIER_PAYMENT,
            amount: Number(largestPayable.amount),
            day: Math.max(0, Number(largestPayable.daysUntilDue ?? 0)),
            shift: 14,
            source: largestPayable.id,
          }
        : null
    case 'review-payables':
      return largestPayable
        ? {
            id: 'advice-review-payables',
            title: advice.title,
            detail: advice.detail,
            kind: SCENARIO_KIND.SUPPLIER_PAYMENT,
            amount: Number(largestPayable.amount),
            day: Math.max(0, Number(largestPayable.daysUntilDue ?? 0)),
            shift: 10,
            source: largestPayable.id,
          }
        : null
    case 'collect-largest':
      return largestReceivable
        ? {
            id: 'advice-collect-largest',
            title: advice.title,
            detail: advice.detail,
            kind: SCENARIO_KIND.CUSTOMER_PAYMENT,
            amount: Number(largestReceivable.amount),
            day: Math.max(0, Number(largestReceivable.daysUntilDue ?? 0)),
            shift: -7,
            source: largestReceivable.id,
          }
        : null
    default:
      return null
  }
}

/** Human summary of a scenario, e.g. "Pay supplier on 18 Oct" or "7 days later". */
export function describeScenario(scenario, asOf) {
  if (!scenario) return ''
  const parts = [SCENARIO_KIND_LABELS[scenario.kind] ?? 'Scenario']
  if (scenario.shift > 0) parts.push(`${scenario.shift} days later`)
  else if (scenario.shift < 0) parts.push(`${Math.abs(scenario.shift)} days earlier`)
  if (asOf) {
    const date = addDaysIso(asOf, scenario.day + scenario.shift)
    parts.push(`on ${date.slice(8, 10)}/${date.slice(5, 7)}`)
  }
  return parts.join(' · ')
}
