import {
  Banknote,
  Building2,
  HandCoins,
  Landmark,
  MapPin,
  Phone,
  Repeat,
  ShoppingCart,
  Store,
  User,
  Users,
} from 'lucide-react'

import {
  BALANCE_PERIODS,
  BUSINESS_TYPES,
  CURRENCIES,
  LANGUAGES,
  OWNER_ROLES,
  RECURRING_FREQUENCIES,
} from '../lib/onboardingLabels'
import { formatNationalPhone } from '../hooks/useOnboardingForm'
import { MoneyField, OptionCards, TextField } from './OnboardingFields'

/**
 * Language switcher displayed prominently in the questionnaire header.
 */
export function LanguageSwitcher({ language, onChange, labels }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="group" aria-label={labels.language.label}>
      {LANGUAGES.map((option) => {
        const active = option.code === language
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => onChange(option.code)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${
              active
                ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-700'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/** Step 1 — Shop & Business Details */
export function StepShop({ values, errors, labels, setField }) {
  return (
    <div className="space-y-6">
      <TextField
        id="onboarding-shop-name"
        label={
          <span className="flex items-center gap-2">
            <Store className="h-4 w-4 text-emerald-600" />
            {labels.shop.shopName}
          </span>
        }
        value={values.shopName}
        onChange={(value) => setField('shopName', value)}
        placeholder={labels.shop.shopNamePlaceholder}
        autoComplete="organization"
        error={errors.shopName}
      />

      <OptionCards
        name="onboarding-business-type"
        legend={
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-600" />
            {labels.shop.businessType}
          </span>
        }
        value={values.businessType}
        onChange={(value) => setField('businessType', value)}
        options={BUSINESS_TYPES.map((value) => ({
          value,
          label: labels.values[value],
          description: labels.valuesDescriptions?.[value],
        }))}
        error={errors.businessType}
        columns="sm:grid-cols-2 lg:grid-cols-3"
      />

      <TextField
        id="onboarding-location"
        label={
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            {labels.shop.location}
          </span>
        }
        value={values.location}
        onChange={(value) => setField('location', value)}
        placeholder={labels.shop.locationPlaceholder}
        autoComplete="address-level2"
        error={errors.location}
      />

      <div>
        <label htmlFor="onboarding-contact-phone" className="text-sm font-medium text-slate-700">
          <span className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-emerald-600" />
            {labels.shop.contact}
          </span>
        </label>
        <div className="mt-1.5 flex">
          <span className="inline-flex items-center gap-1.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 px-3.5 text-sm font-bold text-slate-700">
            <span className="rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-semibold text-emerald-800">LK</span>
            +94
          </span>
          <input
            id="onboarding-contact-phone"
            name="onboarding-contact-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={formatNationalPhone(values.contactPhone)}
            onChange={(event) => setField('contactPhone', formatNationalPhone(event.target.value))}
            placeholder="77 123 4567"
            aria-invalid={errors.contactPhone ? 'true' : undefined}
            aria-describedby={
              errors.contactPhone ? 'onboarding-contact-phone-error' : 'onboarding-contact-phone-hint'
            }
            className={`w-full rounded-r-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 ${
              errors.contactPhone
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
                : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
            }`}
          />
        </div>
        {errors.contactPhone ? (
          <p id="onboarding-contact-phone-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
            {errors.contactPhone}
          </p>
        ) : (
          <p id="onboarding-contact-phone-hint" className="mt-1.5 text-xs text-slate-500">
            {labels.shop.contactHint}
          </p>
        )}
      </div>

      <OptionCards
        name="onboarding-currency"
        legend={
          <span className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-emerald-600" />
            {labels.shop.currency}
          </span>
        }
        value={values.currency}
        onChange={(value) => setField('currency', value)}
        options={CURRENCIES.map((value) => ({
          value,
          label: labels.values[value],
          description: value === 'LKR' ? 'Default' : undefined,
        }))}
        error={errors.currency}
        columns="grid-cols-3"
      />
    </div>
  )
}

/** Yes/No Card Selector */
function YesNoCards({ name, legend, hint, value, onChange, labels, icon: Icon, error }) {
  return (
    <OptionCards
      name={name}
      legend={
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-emerald-600" />
          {legend}
        </span>
      }
      hint={hint}
      value={value}
      onChange={onChange}
      options={[
        { value: true, label: labels.yesNo.yes },
        { value: false, label: labels.yesNo.no },
      ]}
      error={error}
      columns="grid-cols-2"
    />
  )
}

/** Step 2 — Financial & Cash Flow Setup */
export function StepFinancial({ values, errors, labels, setField }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <MoneyField
          id="onboarding-starting-balance"
          label={
            <span className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-emerald-600" />
              {labels.financial.startingBalance}
            </span>
          }
          value={values.startingBalance}
          onChange={(value) => setField('startingBalance', value)}
          placeholder={labels.financial.startingBalancePlaceholder}
          hint={labels.financial.startingBalanceHint}
          error={errors.startingBalance}
        />

        <div className="mt-4">
          <OptionCards
            name="onboarding-balance-period"
            legend={
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <Wallet className="h-3.5 w-3.5 text-slate-500" />
                {labels.financial.balancePeriod}
              </span>
            }
            value={values.balancePeriod}
            onChange={(value) => setField('balancePeriod', value)}
            options={BALANCE_PERIODS.map((value) => ({
              value,
              label: labels.values[value],
            }))}
            error={errors.balancePeriod}
            columns="grid-cols-2"
          />
        </div>
      </div>

      <YesNoCards
        name="onboarding-credit-sales"
        legend={labels.financial.creditSales}
        hint={labels.financial.creditSalesHint}
        value={values.offersCreditSales}
        onChange={(value) => setField('offersCreditSales', value)}
        labels={labels}
        icon={HandCoins}
        error={errors.offersCreditSales}
      />

      <YesNoCards
        name="onboarding-credit-purchases"
        legend={labels.financial.creditPurchases}
        hint={labels.financial.creditPurchasesHint}
        value={values.buysOnCredit}
        onChange={(value) => setField('buysOnCredit', value)}
        labels={labels}
        icon={ShoppingCart}
        error={errors.buysOnCredit}
      />

      <OptionCards
        name="onboarding-recurring-frequency"
        legend={
          <span className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-emerald-600" />
            {labels.financial.recurringFrequency}
          </span>
        }
        hint={labels.financial.recurringFrequencyHint}
        value={values.recurringFrequency}
        onChange={(value) => setField('recurringFrequency', value)}
        options={RECURRING_FREQUENCIES.map((value) => ({
          value,
          label: labels.values[value],
          description: labels.valuesDescriptions?.[value],
        }))}
        error={errors.recurringFrequency}
        columns="grid-cols-2"
      />
    </div>
  )
}

/** Step 3 — Owner / User Details */
export function StepOwner({ values, errors, labels, setField }) {
  return (
    <div className="space-y-6">
      <TextField
        id="onboarding-owner-name"
        label={
          <span className="flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-600" />
            {labels.owner.fullName}
          </span>
        }
        value={values.ownerName}
        onChange={(value) => setField('ownerName', value)}
        placeholder={labels.owner.fullNamePlaceholder}
        autoComplete="name"
        error={errors.ownerName}
      />

      <OptionCards
        name="onboarding-owner-role"
        legend={
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            {labels.owner.role}
          </span>
        }
        value={values.ownerRole}
        onChange={(value) => setField('ownerRole', value)}
        options={OWNER_ROLES.map((value) => ({
          value,
          label: labels.values[value],
          description: labels.valuesDescriptions?.[value],
        }))}
        error={errors.ownerRole}
        columns="sm:grid-cols-3"
      />
    </div>
  )
}
