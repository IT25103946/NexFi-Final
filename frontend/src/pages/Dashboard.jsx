import { Link } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Calendar,
  CreditCard,
  History,
  Layers,
  RefreshCw,
  Repeat,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react'

import CashStatusBadge from '../components/CashStatusBadge'
import ForecastChart from '../components/ForecastChart'
import QuickActions, { NavigationHub, ShopSummary } from '../components/QuickActions'
import StatCard from '../components/StatCard'
import AdviceList from '../components/AdviceList'
import ShortageAlert from '../components/ShortageAlert'
import ErrorBoundary from '../components/ErrorBoundary'
import { EmptyState, ErrorBanner, LoadingBlock } from '../components/Feedback'
import { useSession } from '../auth/sessionContext'
import { fetchDashboard, fetchTransactions } from '../api/client'
import { useSnapshot } from '../hooks/useNexFiData'
import { formatDate, formatMoney, formatMoneyShort } from '../lib/format'
import { getTranslator } from '../lib/i18n'

/**
 * Time-of-day greeting adapted to selected language.
 */
function getGreeting(t) {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return t('dashboard.greetingMorning')
  if (hour >= 12 && hour < 17) return t('dashboard.greetingAfternoon')
  return t('dashboard.greetingEvening')
}

function RecentTransactions({ transactions, loading, t }) {
  const txList = Array.isArray(transactions) ? transactions : (transactions?.content || [])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <History className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold text-slate-900">{t('dashboard.recent')}</h2>
        </div>
        <Link
          to="/transactions"
          className="text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
        >
          {t('dashboard.viewAll')}
        </Link>
      </div>

      {loading ? (
        <p className="mt-4 text-xs text-slate-400">{t('dashboard.loading')}</p>
      ) : txList.length === 0 ? (
        <p className="mt-4 text-xs text-slate-500">{t('dashboard.noTransactions')}</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {txList.slice(0, 5).map((transaction) => (
            <li key={transaction.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">{transaction.description}</p>
                <p className="text-[11px] text-slate-500">
                  {formatDate(transaction.date)} · <span className="font-medium text-slate-600">{transaction.category}</span>
                </p>
              </div>
              <span
                className={`tabular shrink-0 text-xs font-bold px-2 py-0.5 rounded-md ${
                  transaction.type === 'INCOME'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {transaction.type === 'INCOME' ? '+' : '−'} {formatMoney(transaction.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function DashboardContent() {
  const { data, loading, error, refresh } = useSnapshot(fetchDashboard)
  const { data: transactions, loading: transactionsLoading } = useSnapshot(fetchTransactions)
  const { profile, user, language } = useSession()
  const t = getTranslator(language)

  if (loading && !data) return <LoadingBlock label={t('dashboard.loading')} />
  if (error && !data) return <ErrorBanner message={error} onRetry={refresh} />
  if (!data) return <EmptyState title="No cash data yet" message="Add transactions to see your cash position." />

  const statusTone = data.status === 'SAFE' ? 'accent' : data.status === 'WARNING' ? 'warning' : 'danger'
  const currencyCode = profile?.currency || 'LKR'
  const netFlow = Number(data.expectedIn ?? 0) - Number(data.expectedOut ?? 0)
  const horizonDays = data.horizonDays ?? 30

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <header className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {profile?.shopName || t('dashboard.title')}
            </h1>
            {profile?.businessType ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                {profile.businessType}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-medium text-slate-900">
              {getGreeting(t)}, {profile?.ownerName || user?.name || (user?.mobile ? `+94 ${user.mobile}` : '')}
            </span>{' '}
            ·{' '}
            {t('dashboard.subtitle', {
              asOf: formatDate(data.asOf),
              days: horizonDays,
              currency: currencyCode,
            })}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <CashStatusBadge status={data.status} />
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            {t('dashboard.refresh')}
          </button>
        </div>
      </header>

      <ErrorBanner message={error} onRetry={refresh} />

      {/* Shortage Alert */}
      <ShortageAlert
        shortage={data.shortage}
        safetyBuffer={data.safetyBuffer}
        projectedBalance={data.projectedBalance}
        currentCash={data.currentCash}
      />

      {/* 4 Key Financial Summaries */}
      <section aria-label="Key Financial Summaries">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Key Financial Position & 30-Day Forecast
          </h2>
          <span className="text-[11px] text-slate-400">Live book figures</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* 1. Cash Balance */}
          <StatCard
            label={t('dashboard.cashBalance')}
            value={formatMoney(data.currentCash)}
            hint={t('dashboard.openingHint', { opening: formatMoneyShort(data.openingBalance) })}
            tone="accent"
            icon={<Wallet className="h-5 w-5 text-emerald-600" />}
          />

          {/* 2. Expected Receivables */}
          <StatCard
            label={t('dashboard.expectedReceivables')}
            value={formatMoney(data.moneyCustomersOwe)}
            hint={
              data.overdueReceivable > 0
                ? t('dashboard.overdueHint', { amount: formatMoneyShort(data.overdueReceivable) })
                : t('dashboard.nothingOverdue')
            }
            tone={data.overdueReceivable > 0 ? 'warning' : 'default'}
            icon={<ArrowUpRight className="h-5 w-5 text-sky-600" />}
          />

          {/* 3. Pending Payables */}
          <StatCard
            label={t('dashboard.pendingPayables')}
            value={formatMoney(data.upcomingPayable)}
            hint={
              data.overduePayable > 0
                ? t('dashboard.overduePayablesHint', { amount: formatMoneyShort(data.overduePayable) })
                : t('dashboard.dueNextDays', { days: horizonDays })
            }
            tone={data.overduePayable > 0 ? 'danger' : 'default'}
            icon={<ArrowDownRight className="h-5 w-5 text-amber-600" />}
          />

          {/* 4. 30-Day Cash Flow Forecast */}
          <StatCard
            label={t('dashboard.forecast30')}
            value={formatMoney(data.projectedBalance)}
            hint={t('dashboard.lowestHint', {
              amount: formatMoneyShort(data.lowestProjectedBalance),
              date: formatDate(data.lowestProjectedDate),
              buffer: formatMoneyShort(data.safetyBuffer),
            })}
            tone={statusTone}
            icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          />
        </div>

        {/* Secondary Supporting Metrics */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <Repeat className="h-3.5 w-3.5" />
              </span>
              <div>
                <span className="block text-[11px] font-medium text-slate-500 uppercase">Fixed Monthly Overhead</span>
                <span className="block text-xs font-semibold text-slate-900">
                  {formatMoney(data.monthlyRecurringTotal)} / month
                </span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Rent, bills, wages</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <TrendingUp className="h-3.5 w-3.5" />
              </span>
              <div>
                <span className="block text-[11px] font-medium text-slate-500 uppercase">{t('dashboard.moneyIn')}</span>
                <span className="block text-xs font-semibold text-emerald-700">
                  +{formatMoney(data.expectedIn)}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Next 30 days</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
                <TrendingDown className="h-3.5 w-3.5" />
              </span>
              <div>
                <span className="block text-[11px] font-medium text-slate-500 uppercase">{t('dashboard.moneyOut')}</span>
                <span className="block text-xs font-semibold text-rose-700">
                  −{formatMoney(data.expectedOut)}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Bills + suppliers</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <QuickActions profile={profile} />

      {/* Shop Profile & Setup Details */}
      <ShopSummary profile={profile} />

      {/* 30-Day Forecast Chart & In/Out Details */}
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {t('dashboard.forecastSectionTitle', { days: horizonDays })}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">{t('dashboard.forecastSectionSubtitle')}</p>
            </div>
            <Link
              to="/forecast"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
            >
              {t('dashboard.openForecast')} →
            </Link>
          </div>

          <div className="mt-4">
            <ForecastChart forecast={data.forecast || []} safetyBuffer={data.safetyBuffer || 0} />
          </div>

          <dl className="mt-4 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-3">
            <div className="rounded-lg bg-emerald-50/50 p-2.5 border border-emerald-100">
              <dt className="text-[11px] font-semibold tracking-wide text-emerald-800 uppercase">
                {t('dashboard.moneyIn')}
              </dt>
              <dd className="tabular mt-0.5 text-sm font-bold text-emerald-700">
                +{formatMoney(data.expectedIn)}
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
              <dt className="text-[11px] font-semibold tracking-wide text-slate-600 uppercase">
                {t('dashboard.moneyOut')}
              </dt>
              <dd className="tabular mt-0.5 text-sm font-bold text-slate-800">
                −{formatMoney(data.expectedOut)}
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
              <dt className="text-[11px] font-semibold tracking-wide text-slate-600 uppercase">
                {t('dashboard.netCashFlow')}
              </dt>
              <dd
                className={`tabular mt-0.5 text-sm font-bold ${
                  netFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {netFlow >= 0 ? '+' : ''}
                {formatMoney(netFlow)}
              </dd>
            </div>
          </dl>
        </section>

        {/* Action Insights & Recent Transactions */}
        <div className="space-y-6">
          <AdviceList advice={data.advice || []} />
          <RecentTransactions transactions={transactions ?? []} loading={transactionsLoading} t={t} />
        </div>
      </div>

      {/* Navigation Hub */}
      <NavigationHub />
    </div>
  )
}

export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  )
}
