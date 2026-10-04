export default function StatCard({ label, value, hint, tone = 'default', icon }) {
  const tones = {
    default: 'border-white/10 bg-slate-900/80 backdrop-blur-md shadow-2xl shadow-slate-900/30',
    accent: 'border-emerald-400/30 bg-gradient-to-br from-emerald-900/80 to-teal-900/80 backdrop-blur-md shadow-2xl shadow-emerald-500/20',
    warning: 'border-amber-400/30 bg-gradient-to-br from-amber-900/80 to-yellow-900/80 backdrop-blur-md shadow-2xl shadow-amber-500/20',
    danger: 'border-rose-400/30 bg-gradient-to-br from-rose-900/80 to-pink-900/80 backdrop-blur-md shadow-2xl shadow-rose-500/20',
  }
  const valueTones = {
    default: 'text-white',
    accent: 'text-emerald-100',
    warning: 'text-amber-100',
    danger: 'text-rose-100',
  }
  const labelTones = {
    default: 'text-slate-400',
    accent: 'text-emerald-200',
    warning: 'text-amber-200',
    danger: 'text-rose-200',
  }
  const hintTones = {
    default: 'text-slate-400',
    accent: 'text-emerald-300',
    warning: 'text-amber-300',
    danger: 'text-rose-300',
  }

  return (
    <div className={`rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/20 ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-2">
        <p className={`text-xs font-medium tracking-wide uppercase ${labelTones[tone]}`}>{label}</p>
        {icon ? <span className="text-slate-400">{icon}</span> : null}
      </div>
      <p className={`tabular mt-2 text-xl font-semibold ${valueTones[tone]}`}>{value}</p>
      {hint ? <p className={`mt-1 text-xs ${hintTones[tone]}`}>{hint}</p> : null}
    </div>
  )
}
