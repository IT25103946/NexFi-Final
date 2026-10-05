import { formatDate, formatMoney } from '../lib/format'

export default function ShortageAlert({ shortage, safetyBuffer, projectedBalance, currentCash }) {
  if (!shortage) return null

  const isShortage = Boolean(shortage.negativeDate)
  const shell = isShortage
    ? 'border-rose-300 bg-rose-50'
    : 'border-amber-300 bg-amber-50'
  const titleClass = isShortage ? 'text-rose-800' : 'text-amber-900'
  const labelClass = isShortage ? 'text-rose-700' : 'text-amber-800'

  const figures = []
  if (isShortage) {
    figures.push({
      label: 'Expected shortage date',
      value: formatDate(shortage.negativeDate),
      hint: 'On this day your balance runs out',
    })
    figures.push({
      label: 'Estimated shortage amount',
      value: formatMoney(shortage.negativeAmount),
      hint: 'How much money you are short on that day',
    })
  } else {
    figures.push({
      label: 'Expected low-balance date',
      value: formatDate(shortage.bufferBreachDate),
      hint: 'Balance drops below the safety buffer',
    })
    figures.push({
      label: 'Gap to safety buffer',
      value: formatMoney(shortage.bufferBreachAmount),
      hint: 'How far below Rs. 50,000 the balance goes',
    })
  }
  figures.push({
    label: 'Current projected balance',
    value: formatMoney(projectedBalance),
    hint: `Lowest point: ${formatMoney(shortage.lowestBalance)} on ${formatDate(shortage.lowestBalanceDate)}`,
  })

  return (
    <section className={`rounded-xl border p-4 shadow-sm ${shell}`}>
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="text-xl leading-none">
          ⚠️
        </span>
        <div className="min-w-0">
          <h2 className={`text-base font-semibold ${titleClass}`}>Cash shortage expected</h2>
          <p className={`mt-1 text-sm ${labelClass}`}>
            {isShortage
              ? `Your cash balance is projected to go negative on ${formatDate(shortage.negativeDate)}. You start today with ${formatMoney(currentCash)} and keep a safety buffer of ${formatMoney(safetyBuffer)}.`
              : `Your cash balance is projected to drop below the ${formatMoney(safetyBuffer)} safety buffer on ${formatDate(shortage.bufferBreachDate)}.`}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        {figures.map((figure) => (
          <div key={figure.label} className="rounded-lg bg-white/70 p-3">
            <dt className="text-xs font-medium tracking-wide text-slate-600 uppercase">{figure.label}</dt>
            <dd className={`tabular mt-1 text-sm font-semibold ${isShortage ? 'text-rose-700' : 'text-amber-900'}`}>
              {figure.value}
            </dd>
            <dd className="mt-1 text-xs text-slate-500">{figure.hint}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
