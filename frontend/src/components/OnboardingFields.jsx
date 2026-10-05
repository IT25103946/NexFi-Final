import { ChevronDown } from 'lucide-react'

import { inputClass } from './Modal'

/**
 * Shared field primitives for the onboarding wizard.
 *
 * Every control is label-associated and error-aware so the wizard stays usable with a screen
 * reader: errors are wired through `aria-describedby` and `aria-invalid` rather than only
 * being shown in red.
 */

export function Field({ label, htmlFor, error, errorId, hint, hintId, optionalLabel, children, className = '' }) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {optionalLabel ? <span className="text-xs text-slate-400">{optionalLabel}</span> : null}
      </div>

      <div className="mt-1.5">{children}</div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const errorRing = 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
const okRing = 'focus:border-emerald-600 focus:ring-emerald-100'

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  hint,
  error,
  optionalLabel,
  inputMode,
  autoComplete,
  className,
  ...rest
}) {
  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      errorId={`${id}-error`}
      hint={hint}
      hintId={`${id}-hint`}
      optionalLabel={optionalLabel}
      className={className}
    >
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} ${error ? errorRing : okRing}`}
        {...rest}
      />
    </Field>
  )
}

export function SelectField({ id, label, value, onChange, options, placeholder, error, hint, optionalLabel, className }) {
  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      errorId={`${id}-error`}
      hint={hint}
      hintId={`${id}-hint`}
      optionalLabel={optionalLabel}
      className={className}
    >
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} appearance-none pr-10 ${error ? errorRing : okRing}`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </Field>
  )
}

/** Compact numeric field with the Rs. prefix baked in, so the unit is never misread. */
export function MoneyField({ id, label, value, onChange, placeholder, hint, error, className, ...rest }) {
  return (
    <Field label={label} htmlFor={id} error={error} errorId={`${id}-error`} hint={hint} hintId={`${id}-hint`} className={className}>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
          Rs.
        </span>
        <input
          id={id}
          name={id}
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          value={value}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} pl-11 tabular ${error ? errorRing : okRing}`}
          {...rest}
        />
      </div>
    </Field>
  )
}

function cardClasses(selected) {
  const base =
    'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1'
  if (selected) {
    return `${base} border-emerald-600 bg-emerald-50 shadow-sm ring-1 ring-emerald-600`
  }
  return `${base} border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40`
}

/**
 * Radio-style selection cards. `multiple` switches the hidden input to checkboxes, which is
 * the only visual difference — the semantics matter more than the look.
 */
export function OptionCards({ name, legend, options, value, onChange, multiple = false, error, hint, columns = 'sm:grid-cols-2' }) {
  // Booleans are legitimate option values (the yes/no credit questions), and `[undefined]` would
  // report false as selected, so a nullish value collapses to an empty selection instead.
  const selected = multiple ? (value ?? []) : value === undefined || value === null ? [] : [value]

  function toggle(option) {
    if (!multiple) {
      onChange(option)
      return
    }
    onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-700">{legend}</legend>
      {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : null}

      <div className={`mt-2 grid grid-cols-1 gap-2 ${columns}`}>
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <label key={String(option.value)} className="cursor-pointer">
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={name}
                value={String(option.value)}
                checked={isSelected}
                onChange={() => toggle(option.value)}
                className="sr-only"
              />
              <span className={cardClasses(isSelected)}>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                    multiple ? 'rounded-md' : 'rounded-full'
                  } ${isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'}`}
                >
                  {isSelected ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="h-3 w-3">
                      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-medium ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>
                  ) : null}
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}