import { NavLink, Outlet } from 'react-router-dom'
import Icon from './Icon'
import NexfiLogo from './NexfiLogo'
import { useSession } from '../auth/sessionContext'
import { getTranslator } from '../lib/i18n'

function linkClasses(isActive) {
  const base =
    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-300 no-underline group hover:-translate-y-0.5'
  return isActive
    ? `${base} bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 border border-white/10 backdrop-blur-sm`
    : `${base} text-slate-300 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20 border border-transparent hover:border-white/10 backdrop-blur-sm`
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20 lg:pb-0">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl gap-8 px-4 sm:px-6 lg:px-8">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-slate-900/80 backdrop-blur-xl py-6 lg:flex shadow-2xl shadow-emerald-500/10">
          <div className="px-4">
            <NexfiLogo size="md" />
            <p className="mt-2 text-xs font-medium text-slate-400">{t('nav.tagline')}</p>
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
            <p className="rounded-xl border border-white/10 bg-slate-800/60 backdrop-blur-md p-3 text-[11px] leading-relaxed text-slate-400 shadow-lg">
              {t('nav.demoNotice')}
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-6">{children ?? <Outlet />}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch gap-1 overflow-x-auto border-t border-white/10 bg-slate-900/90 backdrop-blur-xl px-2 py-1.5 shadow-2xl shadow-emerald-500/10 lg:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex min-w-16 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[11px] font-medium no-underline transition-all duration-300 hover:-translate-y-0.5 ${
                isActive
                  ? 'bg-gradient-to-t from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
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
