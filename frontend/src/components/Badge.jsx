const styles = {
  SAFE: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  WARNING: 'bg-amber-100 text-amber-900 ring-amber-200',
  SHORTAGE: 'bg-rose-100 text-rose-700 ring-rose-200',
  PENDING: 'bg-slate-100 text-slate-700 ring-slate-200',
  PAID: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  OVERDUE: 'bg-rose-100 text-rose-700 ring-rose-200',
  UPCOMING: 'bg-amber-50 text-amber-800 ring-amber-200',
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
