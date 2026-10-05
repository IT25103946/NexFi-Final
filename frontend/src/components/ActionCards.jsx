import { useMemo } from 'react'

import { adviceToScenario } from '../lib/scenario'
import { formatMoney } from '../lib/format'

const tones = {
  critical: { chip: 'bg-rose-100 text-rose-700', border: 'border-rose-200' },
  warning: { chip: 'bg-amber-100 text-amber-900', border: 'border-amber-200' },
  success: { chip: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-200' },
  info: { chip: 'bg-slate-100 text-slate-600', border: 'border-slate-200' },
}

const toneLabels = {
  critical: 'Do this first',
  warning: 'Plan ahead',
  success: 'Good news',
  info: 'Keep in mind',
}

/**
 * Action recommendations. Each card whose advice can be expressed as a scenario gets a
 * one-click “apply” button, which pushes it onto the simulator stack and immediately
 * re-renders the projection.
 */
export default function ActionCards({
  advice = [],
  receivables = [],
  payables = [],
  onApply,
  appliedIds = new Set(),
  title = 'How can I avoid this?',
}) {
  const cards = useMemo(
    () =>
      advice.map((item) => ({
        item,
        scenario: adviceToScenario(item, { receivables, payables }),
      })),
    [advice, receivables, payables],
  )

  if (advice.length === 0) return null

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <p className="mt-0.5 text-xs text-slate-500">
        Tap a recommendation to add it to the simulator and see the effect on your cash line.
      </p>

      <ul className="mt-3 space-y-2">
        {cards.map(({ item, scenario }) => {
          const tone = tones[item.tone] ?? tones.info
          const label = toneLabels[item.tone] ?? toneLabels.info
          const applied = scenario ? appliedIds.has(scenario.id) : false

          return (
            <li key={item.id} className={`rounded-lg border p-3 ${tone.border}`}>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <p className="min-w-0 flex-1 text-sm font-medium text-slate-900">{item.title}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${tone.chip}`}>{label}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.detail}</p>

              {scenario && scenario.amount > 0 ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onApply(scenario)}
                    disabled={applied}
                    className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                  >
                    {applied ? 'Added to simulator' : 'Apply to simulator'}
                  </button>
                  <span className="tabular text-xs text-slate-500">
                    Simulates {formatMoney(scenario.amount)}
                  </span>
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-400">
                  This one is a reminder, not a cash movement.
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
