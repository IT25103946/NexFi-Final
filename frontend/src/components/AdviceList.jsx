const toneStyles = {
  critical: { dot: 'bg-rose-500', label: 'Do this first', labelClass: 'text-rose-700' },
  warning: { dot: 'bg-amber-500', label: 'Plan ahead', labelClass: 'text-amber-700' },
  success: { dot: 'bg-emerald-500', label: 'Good news', labelClass: 'text-emerald-700' },
  info: { dot: 'bg-slate-400', label: 'Keep in mind', labelClass: 'text-slate-500' },
}

export default function AdviceList({ advice, title = 'What to do next' }) {
  if (!advice || advice.length === 0) return null

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <p className="mt-0.5 text-xs text-slate-500">
        Simple steps based on your own numbers. No guesswork from outside your books.
      </p>
      <ul className="mt-3 space-y-3">
        {advice.map((item) => {
          const tone = toneStyles[item.tone] ?? toneStyles.info
          return (
            <li key={item.id} className="flex gap-3">
              <span aria-hidden="true" className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${tone.dot}`} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  <span className={`text-xs font-medium ${tone.labelClass}`}>{tone.label}</span>
                </div>
                <p className="mt-0.5 text-sm text-slate-600">{item.detail}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
