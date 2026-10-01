import { useState } from 'react'

import ForecastChart from './ForecastChart'
import StatCard from './StatCard'
import CashStatusBadge from './CashStatusBadge'
import { Button } from './Modal'
import { SCENARIO_KIND, SCENARIO_KIND_LABELS, describeScenario } from '../lib/scenario'
import { formatDate, formatMoney, formatMoneyShort } from '../lib/format'

const MAX_AMOUNT = 2000000
const AMOUNT_STEP = 5000
const MAX_SHIFT_DAYS = 30

const sliderClass = 'w-full accent-emerald-700'
const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'

function impactTone(comparison) {
  if (comparison.afterStatus === 'SHORTAGE') return 'danger'
  if (comparison.afterStatus === 'WARNING') return 'warning'
  return 'accent'
}

function ImpactSummary({ comparison, safetyBuffer, currentCash, asOf, horizonDays }) {
  const {
    afterLowest,
    lowestDelta,
    afterStatus,
    afterNegativeDate,
    baseNegativeDate,
    afterBreachDate,
    endDelta,
  } = comparison

  const headline = (() => {
    if (!comparison.hasScenarios) return 'Add a scenario to see its impact on your cash.'
    if (baseNegativeDate && !afterNegativeDate) return 'This scenario avoids the cash shortage.'
    if (!baseNegativeDate && afterNegativeDate) return `Careful — cash now runs out on ${formatDate(afterNegativeDate)}.`
    if (Number(afterLowest?.scenarioBalance ?? 0) < 0) return `Cash still runs out, on ${formatDate(afterNegativeDate)}.`
    if (afterBreachDate) return `Balance dips below the buffer on ${formatDate(afterBreachDate)}.`
    return 'Your cash stays above the safety buffer the whole time.'
  })()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900">Impact of your scenarios</h2>
          <p className={`mt-0.5 text-xs ${comparison.hasScenarios ? 'text-slate-600' : 'text-slate-500'}`}>{headline}</p>
        </div>
        {comparison.hasScenarios ? <CashStatusBadge status={afterStatus} /> : null}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Worst day (before)"
          value={formatMoney(comparison.baseLowestBalance)}
          hint={comparison.baseLowest ? `On ${formatDate(comparison.baseLowest.date)}` : undefined}
          tone={
            comparison.baseStatus === 'SHORTAGE'
              ? 'danger'
              : comparison.baseStatus === 'WARNING'
                ? 'warning'
                : 'default'
          }
        />
        <StatCard
          label="Worst day (after)"
          value={formatMoney(comparison.afterLowestBalance)}
          hint={
            comparison.hasScenarios && comparison.afterLowest
              ? `On ${formatDate(comparison.afterLowest.date)}`
              : 'Add a scenario to compare'
          }
          tone={impactTone(comparison)}
        />
        <StatCard
          label="Change on tightest day"
          value={`${lowestDelta >= 0 ? '+' : ''}${formatMoneyShort(lowestDelta)}`}
          hint={comparison.hasScenarios ? 'Better or worse than today’s plan' : 'No scenarios applied'}
          tone={lowestDelta > 0 ? 'accent' : lowestDelta < 0 ? 'danger' : 'default'}
        />
        <StatCard
          label={`Change by day ${horizonDays}`}
          value={`${endDelta >= 0 ? '+' : ''}${formatMoneyShort(endDelta)}`}
          hint="Difference in the closing balance"
          tone={endDelta > 0 ? 'accent' : endDelta < 0 ? 'danger' : 'default'}
        />
      </div>

      <dl className="mt-3 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs tracking-wide text-slate-500 uppercase">Cash today</dt>
          <dd className="tabular mt-0.5 text-sm font-semibold text-slate-900">{formatMoney(currentCash)}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-slate-500 uppercase">Safety buffer</dt>
          <dd className="tabular mt-0.5 text-sm font-semibold text-slate-900">{formatMoney(safetyBuffer)}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-slate-500 uppercase">Projected low on</dt>
          <dd className="tabular mt-0.5 text-sm font-semibold text-slate-900">
            {afterLowest ? formatDate(afterLowest.date) : '-'}
            {asOf ? <span className="text-xs font-normal text-slate-500"> (from {formatDate(asOf)})</span> : null}
          </dd>
        </div>
      </dl>
    </section>
  )
}

function ScenarioList({ scenarios, onRemove, onToggle, onClear, asOf }) {
  if (scenarios.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
        No scenarios applied yet. Add a quick scenario or build your own.
      </div>
    )
  }

  return (
    <div>
      <ul className="space-y-2">
        {scenarios.map((scenario) => (
          <li
            key={scenario.id}
            className={`rounded-lg border p-3 transition-colors ${
              scenario.disabled ? 'border-slate-200 bg-slate-50 opacity-70' : 'border-emerald-200 bg-emerald-50/60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{scenario.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{describeScenario(scenario, asOf)}</p>
                {scenario.detail ? <p className="mt-1 text-xs text-slate-600">{scenario.detail}</p> : null}
                <p className="tabular mt-1 text-xs font-semibold text-slate-700">
                  {formatMoney(scenario.amount)}
                  {scenario.disabled ? ' · muted' : ''}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => onToggle(scenario.id)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-white"
                >
                  {scenario.disabled ? 'Show' : 'Mute'}
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(scenario.id)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-white"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {scenarios.length > 1 ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-2 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          Clear all
        </button>
      ) : null}
    </div>
  )
}

function PresetList({ presets, onApply, appliedIds }) {
  if (presets.length === 0) {
    return <p className="text-sm text-slate-500">No matching records to build scenarios from yet.</p>
  }

  return (
    <ul className="space-y-2">
      {presets.map((preset) => {
        const alreadyApplied = appliedIds.has(preset.id)
        return (
          <li key={preset.id}>
            <button
              type="button"
              onClick={() => onApply(preset)}
              disabled={alreadyApplied}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{preset.title}</p>
                  {preset.detail ? <p className="mt-0.5 text-xs text-slate-500">{preset.detail}</p> : null}
                </div>
                <span className="tabular shrink-0 text-xs font-semibold text-slate-700">
                  {formatMoneyShort(preset.amount)}
                </span>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function CustomScenarioForm({ onAdd, onCancel, horizonDays, presets }) {
  const defaultKind = presets[0]?.kind ?? SCENARIO_KIND.EXPENSE
  const [kind, setKind] = useState(defaultKind)
  const [amount, setAmount] = useState(100000)
  const [day, setDay] = useState(0)
  const [shift, setShift] = useState(0)

  const maxDay = Math.max(1, horizonDays)

  function submit(event) {
    event.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) return
    onAdd({
      title: SCENARIO_KIND_LABELS[kind],
      detail: null,
      kind,
      amount: Math.min(value, MAX_AMOUNT),
      day: Math.min(Math.max(0, Number(day) || 0), maxDay),
      shift: Math.min(Math.max(-MAX_SHIFT_DAYS, Number(shift) || 0), MAX_SHIFT_DAYS),
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <fieldset>
        <legend className="text-sm font-medium text-slate-700">What happens?</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {Object.values(SCENARIO_KIND).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setKind(option)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                kind === option
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {SCENARIO_KIND_LABELS[option]}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor="scenario-amount" className="text-sm font-medium text-slate-700">
            Amount
          </label>
          <span className="tabular text-sm font-semibold text-slate-900">{formatMoney(amount || 0)}</span>
        </div>
        <input
          id="scenario-amount"
          type="range"
          min={0}
          max={MAX_AMOUNT}
          step={AMOUNT_STEP}
          value={Number(amount) || 0}
          onChange={(event) => setAmount(Number(event.target.value))}
          className={`mt-2 ${sliderClass}`}
        />
        <div className="mt-1 flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className={inputClass}
            aria-label="Amount in rupees"
          />
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor="scenario-day" className="text-sm font-medium text-slate-700">
            Day from today
          </label>
          <span className="tabular text-sm font-semibold text-slate-900">
            {Number(day) === 0 ? 'Today' : `Day ${day}`}
          </span>
        </div>
        <input
          id="scenario-day"
          type="range"
          min={0}
          max={maxDay}
          step={1}
          value={Number(day) || 0}
          onChange={(event) => setDay(Number(event.target.value))}
          className={`mt-2 ${sliderClass}`}
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor="scenario-shift" className="text-sm font-medium text-slate-700">
            Move the timing
          </label>
          <span className="tabular text-sm font-semibold text-slate-900">
            {Number(shift) === 0
              ? 'No change'
              : Number(shift) > 0
                ? `${shift} days later`
                : `${Math.abs(shift)} days earlier`}
          </span>
        </div>
        <input
          id="scenario-shift"
          type="range"
          min={-MAX_SHIFT_DAYS}
          max={MAX_SHIFT_DAYS}
          step={1}
          value={Number(shift) || 0}
          onChange={(event) => setShift(Number(event.target.value))}
          className={`mt-2 ${sliderClass}`}
        />
        <p className="mt-1 text-xs text-slate-500">
          Negative moves money in earlier, positive pushes it back. This is how “Customer X pays 10 days late”
          is modelled.
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add scenario</Button>
      </div>
    </form>
  )
}

/**
 * What-if simulator: scenario controls on the left, a live before/after projection and an
 * impact summary on the right. Everything is derived from the same forecast the API returns,
 * so the numbers always agree with the dashboard.
 */
export default function WhatIfPanel({
  forecast = [],
  safetyBuffer = 0,
  currentCash = 0,
  asOf = null,
  horizonDays = 30,
  presets = [],
  scenarios,
  activeScenarios,
  comparison,
  onAdd,
  onRemove,
  onToggle,
  onClear,
}) {
  const [showForm, setShowForm] = useState(false)
  const appliedIds = new Set(scenarios.filter((scenario) => scenario.presetId).map((scenario) => scenario.presetId))

  function applyPreset(preset) {
    onAdd({ ...preset, id: `${preset.id}-${Date.now()}`, presetId: preset.id })
  }

  return (
    <div className="space-y-5">
      <ImpactSummary
        comparison={comparison}
        safetyBuffer={safetyBuffer}
        currentCash={currentCash}
        asOf={asOf}
        horizonDays={horizonDays}
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Quick scenarios</h2>
            <p className="mt-0.5 text-xs text-slate-500">Common choices for a business like yours.</p>
            <div className="mt-3">
              <PresetList presets={presets} onApply={applyPreset} appliedIds={appliedIds} />
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Your scenarios</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Combine as many as you like. Each one is added up in the projection.
            </p>
            <div className="mt-3">
              <ScenarioList
                scenarios={scenarios}
                onRemove={onRemove}
                onToggle={onToggle}
                onClear={onClear}
                asOf={asOf}
              />
            </div>
            {!showForm ? (
              <Button className="mt-3 w-full" onClick={() => setShowForm(true)}>
                Add a custom scenario
              </Button>
            ) : (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <CustomScenarioForm
                  presets={presets}
                  horizonDays={horizonDays}
                  onCancel={() => setShowForm(false)}
                  onAdd={(scenario) => {
                    onAdd(scenario)
                    setShowForm(false)
                  }}
                />
              </div>
            )}
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {activeScenarios.length > 0 ? 'Before vs. after' : 'Your projected balance'}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {activeScenarios.length > 0
                  ? 'The dashed line is today’s plan. The solid line is your plan with the scenarios applied.'
                  : 'The line turns amber below your safety buffer and red when cash runs out.'}
              </p>
            </div>
            {activeScenarios.length > 0 ? (
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Reset to baseline
              </button>
            ) : null}
          </div>

          <div className="mt-3">
            <ForecastChart
              forecast={forecast}
              safetyBuffer={safetyBuffer}
              projected={comparison.hasScenarios ? comparison.projected : null}
              height="h-80 sm:h-96"
            />
          </div>

          {activeScenarios.length > 0 ? (
            <p className="mt-2 text-xs text-slate-500">
              {activeScenarios.length} scenario{activeScenarios.length === 1 ? '' : 's'} applied.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  )
}
