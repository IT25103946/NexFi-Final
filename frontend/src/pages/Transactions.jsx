import { useMemo, useState } from 'react'

import { Button, Field, Modal, inputClass } from '../components/Modal'
import { EmptyState, ErrorBanner, LoadingBlock } from '../components/Feedback'
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from '../api/client'
import { useCollection } from '../hooks/useNexFiData'
import { TRANSACTION_CATEGORIES, formatDate, formatMoney, todayIso } from '../lib/format'

const emptyForm = (type = 'INCOME') => ({
  id: null,
  values: {
    type,
    description: '',
    amount: '',
    date: todayIso(),
    category: type === 'INCOME' ? 'Sales' : 'Suppliers',
  },
})

function TransactionForm({ form, setForm, onClose, onSubmit, saving, formError }) {
  const values = form.values
  const update = (patch) => setForm({ ...form, values: { ...values, ...patch } })

  return (
    <Modal
      title={form.id ? 'Edit transaction' : values.type === 'INCOME' ? 'Add income' : 'Add expense'}
      description="Amounts in Sri Lankan Rupees. Future dates are included in the forecast."
      onClose={onClose}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <div className="grid grid-cols-2 gap-2">
          {['INCOME', 'EXPENSE'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                update({
                  type: option,
                  category:
                    values.category === 'Sales' || values.category === 'Suppliers'
                      ? option === 'INCOME'
                        ? 'Sales'
                        : 'Suppliers'
                      : values.category,
                })
              }
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                values.type === option
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {option === 'INCOME' ? 'Money in' : 'Money out'}
            </button>
          ))}
        </div>

        <Field label="Description">
          <input
            className={inputClass}
            value={values.description}
            onChange={(event) => update({ description: event.target.value })}
            placeholder="e.g. Keells Supermarket order"
            maxLength={120}
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
          <Field label="Date">
            <input
              className={inputClass}
              type="date"
              value={values.date}
              onChange={(event) => update({ date: event.target.value })}
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
            {saving ? 'Saving…' : form.id ? 'Save changes' : 'Add transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Transactions() {
  const { items, loading, saving, error, add, edit, discard, refresh } = useCollection({
    load: fetchTransactions,
    create: createTransaction,
    update: updateTransaction,
    remove: deleteTransaction,
  })

  const [typeFilter, setTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(null)
  const [formError, setFormError] = useState('')

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category))].sort(),
    [items],
  )

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (typeFilter && item.type !== typeFilter) return false
        if (categoryFilter && item.category !== categoryFilter) return false
        if (search && !item.description.toLowerCase().includes(search.trim().toLowerCase())) return false
        return true
      }),
    [items, typeFilter, categoryFilter, search],
  )

  const totals = useMemo(
    () =>
      visible.reduce(
        (accumulator, item) => {
          const amount = Number(item.amount)
          if (item.type === 'INCOME') accumulator.income += amount
          else accumulator.expense += amount
          return accumulator
        },
        { income: 0, expense: 0 },
      ),
    [visible],
  )

  async function submit() {
    const values = form.values
    if (!values.description.trim() || !values.date || !values.category) {
      setFormError('Please fill in the description, date and category.')
      return
    }
    const amount = Number(values.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError('Enter an amount greater than Rs. 0.')
      return
    }

    const payload = {
      type: values.type,
      description: values.description.trim(),
      amount,
      date: values.date,
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
    if (window.confirm(`Delete "${item.description}"? This cannot be undone.`)) {
      discard(item.id).catch(() => {})
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Transactions</h1>
          <p className="mt-1 text-sm text-slate-500">
            Every rupee that came in or went out. {items.length} records.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setForm(emptyForm('EXPENSE'))}>
            Add expense
          </Button>
          <Button onClick={() => setForm(emptyForm('INCOME'))}>Add income</Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs tracking-wide text-slate-500 uppercase">Money in</p>
          <p className="tabular mt-1 text-lg font-semibold text-emerald-700">{formatMoney(totals.income)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs tracking-wide text-slate-500 uppercase">Money out</p>
          <p className="tabular mt-1 text-lg font-semibold text-slate-900">{formatMoney(totals.expense)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs tracking-wide text-slate-500 uppercase">Net movement</p>
          <p
            className={`tabular mt-1 text-lg font-semibold ${
              totals.income - totals.expense >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {formatMoney(totals.income - totals.expense)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          className={`${inputClass} w-auto`}
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          aria-label="Filter by type"
        >
          <option value="">All types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <select
          className={`${inputClass} w-auto`}
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          className={`${inputClass} sm:max-w-xs`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search description"
          aria-label="Search description"
        />
      </div>

      <ErrorBanner message={error} onRetry={refresh} />
      {loading ? <LoadingBlock label="Loading transactions" /> : null}

      {!loading && visible.length === 0 ? (
        <EmptyState
          title="No transactions to show"
          message={items.length === 0 ? 'Add your first income or expense to get started.' : 'Try clearing the filters above.'}
        />
      ) : null}

      {!loading && visible.length > 0 ? (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{formatDate(item.date)}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.description}</td>
                    <td className="px-4 py-3 text-slate-600">{item.category}</td>
                    <td
                      className={`tabular px-4 py-3 font-semibold whitespace-nowrap ${
                        item.type === 'INCOME' ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {item.type === 'INCOME' ? '+' : '-'} {formatMoney(item.amount)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setForm({
                            id: item.id,
                            values: {
                              type: item.type,
                              description: item.description,
                              amount: String(item.amount),
                              date: item.date,
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

          <ul className="space-y-3 md:hidden">
            {visible.map((item) => (
              <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{item.description}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatDate(item.date)} · {item.category}
                    </p>
                  </div>
                  <p
                    className={`tabular shrink-0 text-sm font-semibold ${
                      item.type === 'INCOME' ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {item.type === 'INCOME' ? '+' : '-'} {formatMoney(item.amount)}
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setForm({
                        id: item.id,
                        values: {
                          type: item.type,
                          description: item.description,
                          amount: String(item.amount),
                          date: item.date,
                          category: item.category,
                        },
                      })
                      setFormError('')
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" className="flex-1" onClick={() => removeItem(item)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {form ? (
        <TransactionForm
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
