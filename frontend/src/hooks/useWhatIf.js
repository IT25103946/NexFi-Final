import { useCallback, useMemo, useReducer } from 'react'

import { compareProjections } from '../lib/scenario'

/**
 * Holds the stack of what-if scenarios and derives the comparison against the baseline
 * forecast. Scenarios are plain data so the whole state is serialisable and can be posted
 * to a future `POST /api/forecast/simulate` endpoint unchanged.
 */
const initialState = { scenarios: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      if (!action.scenario) return state
      return { ...state, scenarios: [...state.scenarios, { ...action.scenario, id: action.scenario.id ?? crypto.randomUUID() }] }
    case 'update':
      return {
        ...state,
        scenarios: state.scenarios.map((scenario) =>
          scenario.id === action.id ? { ...scenario, ...action.patch } : scenario,
        ),
      }
    case 'remove':
      return { ...state, scenarios: state.scenarios.filter((scenario) => scenario.id !== action.id) }
    case 'clear':
      return initialState
    case 'toggle':
      return {
        ...state,
        scenarios: state.scenarios.map((scenario) =>
          scenario.id === action.id ? { ...scenario, disabled: !scenario.disabled } : scenario,
        ),
      }
    default:
      return state
  }
}

export function useWhatIf(forecast = [], safetyBuffer = 0) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const addScenario = useCallback((scenario) => dispatch({ type: 'add', scenario }), [])
  const updateScenario = useCallback((id, patch) => dispatch({ type: 'update', id, patch }), [])
  const removeScenario = useCallback((id) => dispatch({ type: 'remove', id }), [])
  const clearScenarios = useCallback(() => dispatch({ type: 'clear' }), [])
  const toggleScenario = useCallback((id) => dispatch({ type: 'toggle', id }), [])

  /** Disabled scenarios are ignored by the projection, so toggling is instant. */
  const activeScenarios = useMemo(() => state.scenarios.filter((scenario) => !scenario.disabled), [state.scenarios])

  const comparison = useMemo(
    () => compareProjections(forecast, activeScenarios, safetyBuffer),
    [forecast, activeScenarios, safetyBuffer],
  )

  return {
    scenarios: state.scenarios,
    activeScenarios,
    comparison,
    addScenario,
    updateScenario,
    removeScenario,
    clearScenarios,
    toggleScenario,
  }
}
