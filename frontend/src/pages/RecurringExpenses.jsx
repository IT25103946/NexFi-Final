import { useMemo, useState } from 'react'

import StatCard from '../components/StatCard'
import { Button, Field, Modal, inputClass } from '../components/Modal'
import { EmptyState, ErrorBanner, LoadingBlock } from '../components/Feedback'
import {
  createRecurringExpense,
  deleteRecurringExpense,
  fetchRecurringExpenses,
  updateRecurringExpense,
} from '../api/client'
import { useCollection } from '../hooks/useNexFiData'
import { TRANSACTION_CATEGORIES, dueDayLabel, formatMoney } from '../lib/format'

const emptyForm = () => ({
  id: null,
  values: { name: '', amount: '', dueDay: '1', category: 'Rent' },
})

function RecurringForm({ form, setForm, onClose, onSubmit, saving, formError }) {
  const values = form.values
  const update = (patch) => setForm({ ...form, values: { ...values, ...patch } })

  return (
    <Modal
      title={form.id ? 'Edit recurring expense' : 'Add recurring expense'}
      description="Monthly bills such as rent, salary, electricity or internet. Charged on the same day every month."
      onClose={onClose}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <Field label="Expense name">
          <input
            className={inputClass}
            value={values.name}
            onChange={(event) => update({ name: event.target.value })}
            placeholder="e.g. Shop rent"
            maxLength={80}
            required
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Amount (Rs.)">
            <input
              className={inputClass}
              type="number"
              min="0.01"
              step="0.01"
              value={values.amount}
              onChange={(event) => update({ amount: event.target.value })}
              placeholder="0.00"
              required
            />
          </Field>
          <Field label="Due day of month" hint="Use a day between 1 and 28.">
            <input
              className={inputClass}
              type="number"
              min="1"
              max="28"
              value={values.dueDay}
              onChange={(event) => update({ dueDay: event.target.value })}
              required
            />
          </Field>
        </div>

        <Field label="Category">
          <select
            className={inputClass}
            value={values.category}
            onChange={(event) => update({ category: event.target.value })}
          >
            {TRANSACTION_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : form.id ? 'Save changes' : 'Add expense'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default function RecurringExpenses() {
  const { items, loading, saving, error, add, edit, discard, refresh } = useCollection({
    load: fetchRecurringExpenses,
    create: createRecurringExpense,
    update: updateRecurringExpense,
    remove: deleteRecurringExpense,
  })

  const [form, setForm] = useState(null)
  const [formError, setFormError] = useState('')

  const monthlyTotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.amount), 0),
    [items],
  )

  async function submit() {
    const values = form.values
    if (!values.name.trim()) {
      setFormError('Expense name is required.')
      return
    }
    const amount = Number(values.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError('Enter an amount greater than Rs. 0.')
      return
    }
    const dueDay = Number(values.dueDay)
    if (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 28) {
      setFormError('Due day must be a whole number between 1 and 28.')
      return
    }

    const payload = {
      name: values.name.trim(),
      amount,
      dueDay,
      category: values.category,
    }

    try {
      if (form.id) await edit(form.id, payload)
      else await add(payload)
      setForm(null)
      setFormError('')
    } catch (saveError) {
      setFormError(saveError.message)
    }
  }

  function removeItem(item) {
    if (window.confirm(`Delete "${item.name}"? This cannot be undone.`)) {
      discard(item.id).catch(() => {})
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Recurring expenses</h1>
          <p className="mt-1 text-sm text-slate-500">
            Fixed monthly bills that leave your account on the same day every month.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm(emptyForm())
            setFormError('')
          }}
        >
          Add recurring expense
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total monthly cost" value={formatMoney(monthlyTotal)} hint="All recurring expenses" tone="warning" />
        <StatCard label="Number of bills" value={String(items.length)} hint="Charged every month" />
        <StatCard
          label="Next payment"
          value={items.length > 0 ? dueDayLabel(Math.min(...items.map((item) => Number(item.dueDay)))) : '-'}
          hint="Earliest day of the month a bill is due"
        />
      </section>

      <ErrorBanner message={error} onRetry={refresh} />
      {loading ? <LoadingBlock label="Loading recurring expenses" /> : null}

      {!loading && items.length === 0 ? (
        <EmptyState
          title="No recurring expenses"
          message="Add rent, salary, electricity and internet so the forecast knows what leaves every month."
        />
      ) : null}

      {!loading && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Expense</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Due day</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                    {dueDayLabel(item.dueDay)} of every month
                  </td>
                  <td className="tabular px-4 py-3 font-semibold whitespace-nowrap text-slate-900">
                    {formatMoney(item.amount)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setForm({
                          id: item.id,
                          values: {
                            name: item.name,
                            amount: String(item.amount),
                            dueDay: String(item.dueDay),
                            category: item.category,
                          },
                        })
                        setFormError('')
                      }}
                      className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">How NexFi uses these</h2>
        <p className="mt-1">
          Each recurring expense is subtracted from your projected balance on its due day, every month, until you
          remove it. Because these bills repeat, they are usually the reason a healthy cash balance still turns
          negative in the middle of the month.
        </p>
      </section>

      {form ? (
        <RecurringForm
          form={form}
          setForm={setForm}
          onClose={() => setForm(null)}
          onSubmit={submit}
          saving={saving}
          formError={formError}
        />
      ) : null}
    </div>
  )
}
