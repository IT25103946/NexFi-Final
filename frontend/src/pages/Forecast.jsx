import { useCallback, useState } from 'react'

import CashStatusBadge from '../components/CashStatusBadge'
import ForecastChart from '../components/ForecastChart'
import StatCard from '../components/StatCard'
import AdviceList from '../components/AdviceList'
import ShortageAlert from '../components/ShortageAlert'
import { ErrorBanner, LoadingBlock } from '../components/Feedback'
import { fetchForecast } from '../api/client'
import { useSnapshot } from '../hooks/useNexFiData'
import { formatDate, formatDayMonth, formatMoney } from '../lib/format'

const HORIZONS = [30, 60, 90]

export default function Forecast() {
  const [days, setDays] = useState(30)
  const load = useCallback(() => fetchForecast(days), [days])
  const { data, loading, error, refresh } = useSnapshot(load)

  const statusTone = !data ? 'default' : data.status === 'SAFE' ? 'accent' : data.status === 'WARNING' ? 'warning' : 'danger'

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Cash-flow forecast</h1>
          <p className="mt-1 text-sm text-slate-500">
            Simple rule-based projection: current cash + customer payments − supplier payments − recurring and other
            expenses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {data ? <CashStatusBadge status={data.status} /> : null}
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
      {loading && !data ? <LoadingBlock label="Calculating the forecast" /> : null}

      {data ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Cash today"
              value={formatMoney(data.currentCash)}
              hint={`As of ${formatDate(data.asOf)}`}
              tone="accent"
            />
            <StatCard
              label="Lowest projected balance"
              value={formatMoney(data.lowestProjectedBalance)}
              hint={`On ${formatDate(data.lowestProjectedDate)}`}
              tone={statusTone}
            />
            <StatCard
              label="Projected balance"
              value={formatMoney(data.projectedBalance)}
              hint={`On ${formatDate(data.forecastEnd)}`}
              tone={statusTone}
            />
            <StatCard
              label="Safety buffer"
              value={formatMoney(data.safetyBuffer)}
              hint="Minimum balance you want to keep"
            />
          </section>

          <ShortageAlert
            shortage={data.shortage}
            safetyBuffer={data.safetyBuffer}
            projectedBalance={data.projectedBalance}
            currentCash={data.currentCash}
          />

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Projected balance over the next {data.horizonDays} days</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              The line turns red when the balance drops below the safety buffer or reaches zero.
            </p>
            <div className="mt-3">
              <ForecastChart forecast={data.forecast} safetyBuffer={data.safetyBuffer} />
            </div>
            <dl className="grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs tracking-wide text-slate-500 uppercase">Customer payments expected</dt>
                <dd className="tabular mt-0.5 text-sm font-semibold text-emerald-700">
                  {formatMoney(data.upcomingReceivable)}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-slate-500 uppercase">Supplier payments due</dt>
                <dd className="tabular mt-0.5 text-sm font-semibold text-slate-800">
                  {formatMoney(data.upcomingPayable)}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-slate-500 uppercase">Recurring expenses</dt>
                <dd className="tabular mt-0.5 text-sm font-semibold text-slate-800">
                  {formatMoney(data.recurringInHorizon)}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-slate-500 uppercase">Other planned expenses</dt>
                <dd className="tabular mt-0.5 text-sm font-semibold text-slate-800">
                  {formatMoney(data.otherExpensesInHorizon)}
                </dd>
              </div>
            </dl>
          </section>

          <div className="grid gap-5 xl:grid-cols-3">
            <AdviceList advice={data.advice} />

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
              <div className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-900">Day-by-day projection</h2>
                <p className="mt-0.5 text-xs text-slate-500">Money expected in and out for each day.</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Date</th>
                      <th className="px-4 py-2.5 font-medium">Money in</th>
                      <th className="px-4 py-2.5 font-medium">Money out</th>
                      <th className="px-4 py-2.5 font-medium">Projected balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.forecast.map((point) => (
                      <tr key={point.date} className={Number(point.balance) < 0 ? 'bg-rose-50' : undefined}>
                        <td className="px-4 py-2.5 whitespace-nowrap text-slate-700">
                          {formatDayMonth(point.date)}
                          {point.dayOffset === 0 ? <span className="text-xs text-slate-400"> · today</span> : null}
                        </td>
                        <td className="tabular px-4 py-2.5 whitespace-nowrap text-emerald-700">
                          {Number(point.inflow) > 0 ? formatMoney(point.inflow) : '—'}
                        </td>
                        <td className="tabular px-4 py-2.5 whitespace-nowrap text-slate-700">
                          {Number(point.outflow) > 0 ? formatMoney(point.outflow) : '—'}
                        </td>
                        <td
                          className={`tabular px-4 py-2.5 font-semibold whitespace-nowrap ${
                            Number(point.balance) < 0 ? 'text-rose-700' : 'text-slate-900'
                          }`}
                        >
                          {formatMoney(point.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  )
}
