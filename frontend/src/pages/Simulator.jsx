import { useCallback, useMemo, useState } from 'react'

import ActionCards from '../components/ActionCards'
import WhatIfPanel from '../components/WhatIfPanel'
import { ErrorBanner, LoadingBlock } from '../components/Feedback'
import { fetchForecast, fetchPayables, fetchReceivables } from '../api/client'
import { useSnapshot } from '../hooks/useNexFiData'
import { useWhatIf } from '../hooks/useWhatIf'
import { buildPresets } from '../lib/scenario'

const HORIZONS = [30, 60, 90]

export default function Simulator() {
  const [days, setDays] = useState(30)
  const [adviceOpen, setAdviceOpen] = useState(false)

  const load = useCallback(() => fetchForecast(days), [days])
  const { data, loading, error, refresh } = useSnapshot(load)
  const { data: receivables } = useSnapshot(fetchReceivables)
  const { data: payables } = useSnapshot(fetchPayables)

  const whatIf = useWhatIf(data?.forecast ?? [], data?.safetyBuffer ?? 0)

  const presets = useMemo(
    () => buildPresets({ receivables: receivables ?? [], payables: payables ?? [] }),
    [receivables, payables],
  )

  const adviceScenarios = useMemo(
    () => (data?.advice ?? []).map((item) => item.id),
    [data],
  )

  if (loading && !data) return <LoadingBlock label="Loading your forecast" />
  if (error && !data) return <ErrorBanner message={error} onRetry={refresh} />
  if (!data) return null

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">What-if simulator</h1>
          <p className="mt-1 text-sm text-slate-500">
            Test a decision before you make it. The graph updates as you change the numbers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAdviceOpen((open) => !open)}
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
          >
            {adviceOpen ? 'Hide advice' : 'How can I avoid this?'}
          </button>
          <div className="flex rounded-lg border border-slate-300 bg-white p-0.5">
            {HORIZONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDays(option)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                  days === option ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {option} days
              </button>
            ))}
          </div>
        </div>
      </header>

      <ErrorBanner message={error} onRetry={refresh} />

      {adviceOpen ? (
        <ActionCards
          advice={data.advice}
          receivables={receivables ?? []}
          payables={payables ?? []}
          appliedIds={new Set(whatIf.scenarios.map((scenario) => scenario.id))}
          onApply={whatIf.addScenario}
        />
      ) : null}

      <WhatIfPanel
        forecast={data.forecast}
        safetyBuffer={data.safetyBuffer}
        currentCash={data.currentCash}
        asOf={data.asOf}
        horizonDays={data.horizonDays}
        presets={presets}
        scenarios={whatIf.scenarios}
        activeScenarios={whatIf.activeScenarios}
        comparison={whatIf.comparison}
        onAdd={whatIf.addScenario}
        onRemove={whatIf.removeScenario}
        onToggle={whatIf.toggleScenario}
        onClear={whatIf.clearScenarios}
      />

      {adviceOpen && adviceScenarios.length === 0 ? (
        <p className="text-sm text-slate-500">No recommendations for this period.</p>
      ) : null}
    </div>
  )
}
