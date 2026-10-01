export default function StatCard({ label, value, hint, tone = 'default', icon }) {
  const tones = {
    default: 'border-slate-200 bg-white',
    accent: 'border-emerald-200 bg-emerald-50',
    warning: 'border-amber-200 bg-amber-50',
    danger: 'border-rose-200 bg-rose-50',
  }
  const valueTones = {
    default: 'text-slate-900',
    accent: 'text-emerald-800',
    warning: 'text-amber-900',
    danger: 'text-rose-700',
  }

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</p>
        {icon ? <span className="text-slate-400">{icon}</span> : null}
      </div>
      <p className={`tabular mt-2 text-xl font-semibold ${valueTones[tone]}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}
