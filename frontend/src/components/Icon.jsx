const paths = {
  dashboard: 'M3.75 3.75h6.5v6.5h-6.5zM13.75 3.75h6.5v4.25h-6.5zM13.75 10.75h6.5v9.5h-6.5zM3.75 13.25h6.5v7h-6.5z',
  transactions: 'M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h10.5',
  receivables: 'M3.75 4.5h16.5v15h-16.5zM3.75 9.75h16.5M8.25 4.5v15',
  payables: 'M3.75 4.5h16.5v15h-16.5zM3.75 9.75h16.5M15.75 4.5v15',
  recurring: 'M17.25 4.75 20.25 7.75 17.25 10.75M20.25 7.75H7.5a3.75 3.75 0 0 0 0 7.5h1.5M6.75 19.25 3.75 16.25 6.75 13.25',
  forecast: 'M3.75 3.75v16.5h16.5M6.75 16.5l3.5-4.5 3 2.5 4.75-7',
  simulator: 'M9.5 3.75v16.5M14.5 3.75v16.5M3.75 9.5h16.5M3.75 14.5h16.5',
}

export default function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  )
}
