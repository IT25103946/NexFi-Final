import { NavLink, Outlet } from 'react-router-dom'
import Icon from './Icon'
import { useSession } from '../auth/sessionContext'
import { getTranslator } from '../lib/i18n'

function linkClasses(isActive) {
  const base =
    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150 no-underline'
  return isActive
    ? `${base} bg-emerald-700 text-white shadow-sm shadow-emerald-700/20`
    : `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900`
}

export default function AppLayout({ children }) {
  const { language } = useSession()
  const t = getTranslator(language)

  const links = [
    { to: '/', label: t('nav.dashboard'), icon: 'dashboard', end: true },
    { to: '/transactions', label: t('nav.transactions'), icon: 'transactions' },
    { to: '/receivables', label: t('nav.receivables'), icon: 'receivables' },
    { to: '/payables', label: t('nav.payables'), icon: 'payables' },
    { to: '/recurring-expenses', label: t('nav.recurring'), icon: 'recurring' },
    { to: '/forecast', label: t('nav.forecast'), icon: 'forecast' },
    { to: '/simulator', label: t('nav.simulator'), icon: 'simulator' },
  ]

  return (
    <div className="min-h-screen bg-slate-100 pb-20 lg:pb-0">
      <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 sm:px-6 lg:px-8">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white py-6 lg:flex">
          <div className="px-4">
            <p className="font-display text-2xl font-bold tracking-tight text-slate-900">NexFi</p>
            <p className="text-xs font-medium text-slate-500">{t('nav.tagline')}</p>
          </div>
          <nav className="mt-6 flex flex-col gap-1.5 px-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => linkClasses(isActive)}
              >
                <Icon name={link.icon} className="h-5 w-5" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto px-4">
            <p className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-[11px] leading-relaxed text-slate-500">
              {t('nav.demoNotice')}
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-6">{children ?? <Outlet />}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch gap-1 overflow-x-auto border-t border-slate-200 bg-white px-2 py-1.5 shadow-lg lg:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex min-w-16 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[11px] font-medium no-underline ${
                isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500'
              }`
            }
          >
            <Icon name={link.icon} className="h-5 w-5" />
            <span className="truncate">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
