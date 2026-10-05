import { useMemo } from 'react'
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatAxisMoney, formatDate, formatDayMonth, formatMoney } from '../lib/format'

const TONE_COLORS = {
  safe: '#047857',
  warning: '#d97706',
  deficit: '#e11d48',
}

const COMPARE_COLOR = '#6366f1'

/** One drawn line per status zone, so each segment can carry its own colour. */
const ZONE_KEYS = ['Safe', 'Warning', 'Deficit']

/** Mirrors CashStatus so chart colours agree with the status badges. */
function toneFor(balance, safetyBuffer) {
  if (Number(balance) < 0) return 'deficit'
  if (Number(balance) < Number(safetyBuffer)) return 'warning'
  return 'safe'
}

/**
 * Splits a balance column into one key per status zone so each can be drawn in its own
 * colour. A point that changes zone is written to both the outgoing and incoming keys,
 * which keeps the line continuous while the colour switches exactly on the day the
 * balance crosses the threshold.
 */
function segmentSeries(rows, valueKey, prefix) {
  return rows.map((row, index) => {
    const tone = row[`${prefix}Tone`]
    const previousTone = index > 0 ? rows[index - 1][`${prefix}Tone`] : tone
    const value = row[valueKey]
    const segment = { [`${prefix}Safe`]: null, [`${prefix}Warning`]: null, [`${prefix}Deficit`]: null }

    const own = ZONE_KEYS.find((zone) => zone.toLowerCase() === tone)
    if (own) segment[`${prefix}${own}`] = value
    if (previousTone !== tone) {
      const previous = ZONE_KEYS.find((zone) => zone.toLowerCase() === previousTone)
      if (previous) segment[`${prefix}${previous}`] = value
    }
    return segment
  })
}

function buildRows(forecast, safetyBuffer, projected) {
  const safeList = Array.isArray(forecast) ? forecast : []
  return safeList.map((point, index) => {
    const scenarioPoint = projected?.[index]
    const row = {
      date: point.date,
      label: formatDayMonth(point.date),
      dayOffset: Number(point.dayOffset ?? index),
      balance: Number(point.balance ?? 0),
      inflow: Number(point.inflow ?? 0),
      outflow: Number(point.outflow ?? 0),
    }
    if (scenarioPoint) {
      row.scenarioBalance = Number(scenarioPoint.scenarioBalance ?? 0)
      row.scenarioInflow = Number(scenarioPoint.scenarioInflow ?? 0)
      row.scenarioOutflow = Number(scenarioPoint.scenarioOutflow ?? 0)
    }
    row.baseTone = toneFor(row.balance, safetyBuffer)
    row.afterTone = row.scenarioBalance === undefined ? row.baseTone : toneFor(row.scenarioBalance, safetyBuffer)
    return row
  })
}

function ChartTooltip({ active, payload, safetyBuffer, showComparison }) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0].payload
  const after = Number(point.scenarioBalance)
  const hasAfter = showComparison && point.scenarioBalance !== undefined

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-md">
      <p className="font-medium text-slate-900">{formatDate(point.date)}</p>

      {hasAfter ? (
        <div className="mt-1.5 space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Before</span>
            <span className="tabular font-semibold text-slate-900">{formatMoney(point.balance)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">After</span>
            <span
              className={`tabular font-semibold ${
                after < Number(safetyBuffer) ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {formatMoney(after)}
            </span>
          </div>
          {Number(after) !== Number(point.balance) ? (
            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-1">
              <span className="text-slate-500">Change</span>
              <span className={`tabular font-semibold ${after > point.balance ? 'text-emerald-600' : 'text-rose-600'}`}>
                {after > point.balance ? '+' : ''}
                {formatMoney(after - Number(point.balance))}
              </span>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="tabular mt-1.5 text-sm font-semibold text-slate-900">{formatMoney(point.balance)}</p>
      )}

      <div className="mt-2 space-y-0.5 border-t border-slate-100 pt-2">
        {point.inflow > 0 ? <p className="text-emerald-700">+ {formatMoney(point.inflow)} in</p> : null}
        {point.outflow > 0 ? <p className="text-rose-700">- {formatMoney(point.outflow)} out</p> : null}
        {hasAfter && point.scenarioInflow !== point.inflow && point.scenarioInflow > 0 ? (
          <p className="text-indigo-600">After: + {formatMoney(point.scenarioInflow)} in</p>
        ) : null}
        {hasAfter && point.scenarioOutflow !== point.outflow && point.scenarioOutflow > 0 ? (
          <p className="text-indigo-600">After: - {formatMoney(point.scenarioOutflow)} out</p>
        ) : null}
      </div>

      <p className="mt-1.5 text-slate-500">Safety buffer {formatMoney(safetyBuffer)}</p>
    </div>
  )
}

function ChartLegend({ showComparison }) {
  const item = (color, label, dashed = false) => (
    <span className="flex items-center gap-1.5 text-xs text-slate-600">
      <span
        aria-hidden="true"
        className="inline-block h-0.5 w-4 rounded"
        style={{ backgroundColor: dashed ? 'transparent' : color, borderTop: dashed ? `2px dashed ${color}` : undefined }}
      />
      {label}
    </span>
  )

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {showComparison ? item(COMPARE_COLOR, 'Before', true) : null}
      {item(TONE_COLORS.safe, showComparison ? 'After — safe' : 'Safe')}
      {item(TONE_COLORS.warning, showComparison ? 'After — below buffer' : 'Below buffer')}
      {item(TONE_COLORS.deficit, showComparison ? 'After — deficit' : 'Deficit')}
      <span className="flex items-center gap-1.5 text-xs text-slate-600">
        <span aria-hidden="true" className="inline-block h-2 w-4 rounded-sm bg-amber-100" />
        Safety buffer zone
      </span>
    </div>
  )
}

/**
 * Daily cash projection.
 *
 * @param forecast      baseline ForecastPoint[] from the API
 * @param safetyBuffer  minimum balance the business wants to keep
 * @param projected     optional ForecastPoint[] with `scenarioBalance`, drawn as the "after" line
 */
export default function ForecastChart({ forecast = [], safetyBuffer = 0, projected = null, height = 'h-72' }) {
  const safeForecast = Array.isArray(forecast) ? forecast : []
  const showComparison = Boolean(projected && projected.length)

  const rows = useMemo(
    () => buildRows(safeForecast, safetyBuffer, projected),
    [safeForecast, safetyBuffer, projected],
  )

  const data = useMemo(() => {
    const baseSegments = segmentSeries(rows, 'balance', 'base')
    const afterSegments = showComparison ? segmentSeries(rows, 'scenarioBalance', 'after') : []
    return rows.map((row, index) => ({
      ...row,
      ...baseSegments[index],
      ...(showComparison ? afterSegments[index] : {}),
    }))
  }, [rows, showComparison])

  const yDomain = useMemo(() => {
    const values = data.flatMap((row) =>
      showComparison ? [row.balance, row.scenarioBalance] : [row.balance],
    )
    const min = Math.min(0, ...values.filter((value) => Number.isFinite(value)))
    const max = Math.max(Number(safetyBuffer || 0) * 1.2, ...values.filter((value) => Number.isFinite(value)))
    return [Math.floor(min * 1.1), Math.ceil(max * 1.08)]
  }, [data, safetyBuffer, showComparison])

  if (data.length === 0) {
    return (
      <div className={`flex ${height} w-full items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500`}>
        No forecast data yet.
      </div>
    )
  }

  return (
    <div className={`${height} w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="nexfi-buffer-zone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde68a" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity={0.15} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            domain={yDomain}
            tickFormatter={formatAxisMoney}
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={58}
          />
          <Tooltip
            content={<ChartTooltip safetyBuffer={safetyBuffer} showComparison={showComparison} />}
            cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }}
          />
          <Legend content={<ChartLegend showComparison={showComparison} />} verticalAlign="top" align="left" height={28} />

          {/* Danger zone: everything below the safety buffer. */}
          <ReferenceArea y1={yDomain[0]} y2={0} fill="#fee2e2" fillOpacity={0.5} ifOverflow="extendDomain" />
          <ReferenceArea y1={0} y2={Number(safetyBuffer || 0)} fill="url(#nexfi-buffer-zone)" ifOverflow="extendDomain" />

          <ReferenceLine
            y={0}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: 'Rs. 0', position: 'right', fill: '#64748b', fontSize: 10 }}
          />
          <ReferenceLine
            y={Number(safetyBuffer || 0)}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: 'Safety buffer', position: 'insideTopLeft', fill: '#b45309', fontSize: 10 }}
          />

          {/* Baseline is only drawn when it is being compared against an "after" line. */}
          {showComparison ? (
            <Line
              type="monotone"
              dataKey="balance"
              stroke={COMPARE_COLOR}
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={false}
            />
          ) : null}

          {ZONE_KEYS.map((zone) => (
            <Line
              key={zone}
              type="monotone"
              dataKey={`${showComparison ? 'after' : 'base'}${zone}`}
              stroke={TONE_COLORS[zone.toLowerCase()]}
              strokeWidth={2.5}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
