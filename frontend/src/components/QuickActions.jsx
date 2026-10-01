import { Link } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  Compass,
  CreditCard,
  Edit3,
  HelpCircle,
  MapPin,
  Phone,
  Plus,
  Repeat,
  Sparkles,
  Store,
  TrendingUp,
  User,
  Wallet,
  XCircle,
  Zap,
} from 'lucide-react'

import { formatMoney } from '../lib/format'
import { getTranslator } from '../lib/i18n'
import { useSession } from '../auth/sessionContext'

const actionCardClass =
  'group flex items-center gap-3.5 rounded-xl border border-slate-200/90 bg-white p-3.5 text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'

const navCardClass =
  'group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left transition-all duration-150 hover:bg-emerald-50/40 hover:border-emerald-200'

/**
 * Quick Actions component.
 * Renders the top 6 operational tasks for small shop owners.
 */
export default function QuickActions({ profile }) {
  const { language } = useSession()
  const t = getTranslator(language)

  const actions = [
    {
      to: '/transactions',
      icon: Plus,
      title: t('dashboard.actionAddTransaction'),
      detail: t('dashboard.actionAddTransactionDesc'),
      tint: 'bg-emerald-100 text-emerald-800 ring-4 ring-emerald-50',
    },
    {
      to: '/receivables',
      icon: ArrowUpRight,
      title: t('dashboard.actionReceivables'),
      detail: t('dashboard.actionReceivablesDesc'),
      tint: 'bg-sky-100 text-sky-800 ring-4 ring-sky-50',
    },
    {
      to: '/payables',
      icon: ArrowDownRight,
      title: t('dashboard.actionPayables'),
      detail: t('dashboard.actionPayablesDesc'),
      tint: 'bg-amber-100 text-amber-800 ring-4 ring-amber-50',
    },
    {
      to: '/recurring-expenses',
      icon: Repeat,
      title: t('dashboard.actionRecurring'),
      detail: t('dashboard.actionRecurringDesc'),
      tint: 'bg-violet-100 text-violet-800 ring-4 ring-violet-50',
    },
    {
      to: '/forecast',
      icon: TrendingUp,
      title: t('dashboard.actionForecast'),
      detail: t('dashboard.actionForecastDesc'),
      tint: 'bg-teal-100 text-teal-800 ring-4 ring-teal-50',
    },
    {
      to: '/simulator',
      icon: Sparkles,
      title: t('dashboard.actionSimulator'),
      detail: t('dashboard.actionSimulatorDesc'),
      tint: 'bg-indigo-100 text-indigo-800 ring-4 ring-indigo-50',
    },
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Zap className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">{t('dashboard.quickActionsTitle')}</h2>
            <p className="text-xs text-slate-500">{t('dashboard.quickActionsSubtitle')}</p>
          </div>
        </div>
        {profile?.currency && profile.currency !== 'LKR' ? (
          <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            Currency: {profile.currency}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.to} to={action.to} className={actionCardClass}>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.tint}`}>
              <action.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors">
                {action.title}
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">{action.detail}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

/**
 * Quick Navigation and Modules Hub
 */
export function NavigationHub() {
  const { language } = useSession()
  const t = getTranslator(language)

  const modules = [
    { to: '/transactions', name: t('nav.transactions'), desc: 'Cash in & out history', icon: Plus },
    { to: '/receivables', name: t('nav.receivables'), desc: 'Customer credits & aging', icon: ArrowUpRight },
    { to: '/payables', name: t('nav.payables'), desc: 'Supplier invoices & dues', icon: ArrowDownRight },
    { to: '/recurring-expenses', name: t('nav.recurring'), desc: 'Rent, salaries, utilities', icon: Repeat },
    { to: '/forecast', name: t('nav.forecast'), desc: 'Day-by-day cash projection', icon: TrendingUp },
    { to: '/simulator', name: t('nav.simulator'), desc: 'What-if test scenarios', icon: Sparkles },
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Compass className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-900">{t('dashboard.navigationTitle')}</h2>
          <p className="text-xs text-slate-500">{t('dashboard.navigationSubtitle')}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((item) => (
          <Link key={item.to} to={item.to} className={navCardClass}>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs group-hover:border-emerald-300 group-hover:text-emerald-700">
                <item.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <span className="block truncate text-xs font-semibold text-slate-900 group-hover:text-emerald-800">
                  {item.name}
                </span>
                <span className="block truncate text-[11px] text-slate-500">{item.desc}</span>
              </div>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  )
}

/**
 * Shop Setup & Profile Summary
 * Displays all 10 fields collected during onboarding with edit link.
 */
export function ShopSummary({ profile }) {
  const { language } = useSession()
  const t = getTranslator(language)

  if (!profile) return null

  const balance = Number(profile.startingBalance ?? 0)
  const isDaily = profile.balancePeriod === 'DAILY'

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
            <Store className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">{profile.shopName || t('dashboard.yourShop')}</h2>
            <p className="text-xs text-slate-500">{t('dashboard.yourShopSubtitle')}</p>
          </div>
        </div>

        <Link
          to="/onboarding"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:border-slate-400"
        >
          <Edit3 className="h-3.5 w-3.5 text-slate-500" />
          {t('dashboard.editDetails')}
        </Link>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SummaryTile
          icon={Building2}
          label={t('dashboard.type')}
          value={titleCase(profile.businessType)}
          badge="Type"
        />
        <SummaryTile
          icon={MapPin}
          label={t('dashboard.location')}
          value={profile.location || '—'}
        />
        <SummaryTile
          icon={Phone}
          label={t('dashboard.contact')}
          value={profile.contactPhone || '—'}
        />
        <SummaryTile
          icon={Banknote}
          label={t('dashboard.currency')}
          value={profile.currency || 'LKR'}
        />
        <SummaryTile
          icon={Wallet}
          label={t('dashboard.startingBalance')}
          value={`${formatMoney(balance)} (${isDaily ? t('dashboard.perDay') : t('dashboard.perMonth')})`}
        />
        <SummaryTile
          icon={profile.offersCreditSales ? CheckCircle2 : XCircle}
          iconColor={profile.offersCreditSales ? 'text-emerald-600' : 'text-slate-400'}
          label={t('dashboard.creditSales')}
          value={profile.offersCreditSales ? t('dashboard.creditSalesYes') : t('dashboard.creditSalesNo')}
        />
        <SummaryTile
          icon={profile.buysOnCredit ? CheckCircle2 : XCircle}
          iconColor={profile.buysOnCredit ? 'text-emerald-600' : 'text-slate-400'}
          label={t('dashboard.creditPurchases')}
          value={profile.buysOnCredit ? t('dashboard.creditPurchasesYes') : t('dashboard.creditPurchasesNo')}
        />
        <SummaryTile
          icon={Repeat}
          label={t('dashboard.recurringFrequency')}
          value={titleCase(profile.recurringFrequency)}
        />
        <SummaryTile
          icon={User}
          label={t('dashboard.owner')}
          value={`${profile.ownerName || '—'} (${titleCase(profile.ownerRole)})`}
        />
      </dl>
    </section>
  )
}

function SummaryTile({ icon: Icon, iconColor = 'text-slate-500', label, value }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200">
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{label}</dt>
        <dd className="mt-0.5 truncate text-xs font-semibold text-slate-800">{value}</dd>
      </div>
    </div>
  )
}

function titleCase(value) {
  if (!value) return '—'
  return String(value)
    .toLowerCase()
    .replace(/(^|[\s_])(\w)/g, (match) => match.toUpperCase())
    .replace(/_/g, ' ')
}
