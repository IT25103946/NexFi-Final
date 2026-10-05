const styles = {
  SAFE: 'bg-gradient-to-r from-emerald-900/80 to-teal-900/80 text-emerald-200 border border-emerald-400/30 ring-emerald-400/30 backdrop-blur-sm shadow-lg shadow-emerald-500/20',
  WARNING: 'bg-gradient-to-r from-amber-900/80 to-yellow-900/80 text-amber-200 border border-amber-400/30 ring-amber-400/30 backdrop-blur-sm shadow-lg shadow-amber-500/20',
  SHORTAGE: 'bg-gradient-to-r from-rose-900/80 to-pink-900/80 text-rose-200 border border-rose-400/30 ring-rose-400/30 backdrop-blur-sm shadow-lg shadow-rose-500/20',
  PENDING: 'bg-slate-800/80 text-slate-200 border border-white/10 ring-white/10 backdrop-blur-sm',
  PAID: 'bg-gradient-to-r from-emerald-900/60 to-teal-900/60 text-emerald-200 border border-emerald-400/30 ring-emerald-400/30 backdrop-blur-sm',
  OVERDUE: 'bg-gradient-to-r from-rose-900/60 to-pink-900/60 text-rose-200 border border-rose-400/30 ring-rose-400/30 backdrop-blur-sm',
  UPCOMING: 'bg-gradient-to-r from-amber-900/60 to-yellow-900/60 text-amber-200 border border-amber-400/30 ring-amber-400/30 backdrop-blur-sm',
}

export default function Badge({ value, label, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
        styles[value] ?? styles.PENDING
      } ${className}`}
    >
      {label ?? value}
    </span>
  )
}
