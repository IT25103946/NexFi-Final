import { useMemo, useState } from 'react'

import Badge from '../components/Badge'
import StatCard from '../components/StatCard'
import { Button, Field, Modal, inputClass } from '../components/Modal'
import { EmptyState, ErrorBanner, LoadingBlock } from '../components/Feedback'
import {
  createReceivable,
  deleteReceivable,
  fetchReceivables,
  updateReceivable,
} from '../api/client'
import { useCollection } from '../hooks/useNexFiData'
import { describeDueDate, formatDate, formatMoney, formatMoneyShort, todayIso } from '../lib/format'

const emptyForm = () => ({
  id: null,
  values: { customerName: '', amount: '', dueDate: todayIso(), status: 'PENDING' },
})

function ReceivableForm({ form, setForm, onClose, onSubmit, saving, formError }) {
  const values = form.values
  const update = (patch) => setForm({ ...form, values: { ...values, ...patch } })

  return (
    <Modal
      title={form.id ? 'Edit customer payment' : 'Add customer payment'}
      description="Money a customer owes you. Unpaid amounts are added to the forecast on the due date."
      onClose={onClose}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <Field label="Customer name">
          <input
            className={inputClass}
            value={values.customerName}
            onChange={(event) => update({ customerName: event.target.value })}
            placeholder="e.g. Cargills (Ceylon) PLC"
            maxLength={80}
            required
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Amount owed (Rs.)">
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
          <Field label="Due date">
            <input
              className={inputClass}
              type="date"
              value={values.dueDate}
              onChange={(event) => update({ dueDate: event.target.value })}
              required
            />
          </Field>
        </div>

        <Field label="Payment status">
          <select
            className={inputClass}
            value={values.status}
            onChange={(event) => update({ status: event.target.value })}
          >
            <option value="PENDING">Pending — not paid yet</option>
            <option value="PAID">Paid — already received</option>
          </select>
        </Field>

        {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : form.id ? 'Save changes' : 'Add receivable'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Receivables() {
  const { items, loading, saving, error, add, edit, discard, refresh } = useCollection({
    load: fetchReceivables,
    create: createReceivable,
    update: updateReceivable,
    remove: deleteReceivable,
  })

  const [filter, setFilter] = useState('UNPAID')
  const [form, setForm] = useState(null)
  const [formError, setFormError] = useState('')

  const totals = useMemo(() => {
    const unpaid = items.filter((item) => item.status !== 'PAID')
    return {
      total: unpaid.reduce((sum, item) => sum + Number(item.amount), 0),
      overdue: unpaid
        .filter((item) => item.daysUntilDue < 0)
        .reduce((sum, item) => sum + Number(item.amount), 0),
      upcoming: unpaid
        .filter((item) => item.daysUntilDue >= 0)
        .reduce((sum, item) => sum + Number(item.amount), 0),
      overdueCount: unpaid.filter((item) => item.daysUntilDue < 0).length,
    }
  }, [items])

  const visible = useMemo(() => {
    if (filter === 'UNPAID') return items.filter((item) => item.status !== 'PAID')
    if (filter === 'OVERDUE') return items.filter((item) => item.status !== 'PAID' && item.daysUntilDue < 0)
    if (filter === 'PAID') return items.filter((item) => item.status === 'PAID')
    return items
  }, [items, filter])

  async function submit() {
    const values = form.values
    if (!values.customerName.trim() || !values.dueDate) {
      setFormError('Customer name and due date are required.')
      return
    }
    const amount = Number(values.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError('Enter an amount greater than Rs. 0.')
      return
    }

    const payload = {
      customerName: values.customerName.trim(),
      amount,
      dueDate: values.dueDate,
      status: values.status,
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
    if (window.confirm(`Delete the payment from "${item.customerName}"? This cannot be undone.`)) {
      discard(item.id).catch(() => {})
    }
  }

  function editItem(item) {
    setForm({
      id: item.id,
      values: {
        customerName: item.customerName,
        amount: String(item.amount),
        dueDate: item.dueDate,
        status: item.status,
      },
    })
    setFormError('')
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Customer receivables</h1>
          <p className="mt-1 text-sm text-slate-500">Money your customers still owe you.</p>
        </div>
        <Button
          onClick={() => {
            setForm(emptyForm())
            setFormError('')
          }}
        >
          Add receivable
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total owed by customers" value={formatMoney(totals.total)} hint="Unpaid amounts only" />
        <StatCard
          label="Overdue amount"
          value={formatMoney(totals.overdue)}
          hint={
            totals.overdueCount > 0
              ? `${totals.overdueCount} payment${totals.overdueCount === 1 ? '' : 's'} past the due date`
              : 'Nothing overdue'
          }
          tone={totals.overdue > 0 ? 'danger' : 'default'}
        />
        <StatCard
          label="Upcoming receivables"
          value={formatMoney(totals.upcoming)}
          hint={`${formatMoneyShort(totals.total - totals.overdue)} still inside due dates`}
          tone="accent"
        />
      </section>

      <div className="flex flex-wrap gap-2">
        {[
          { value: 'UNPAID', label: 'Unpaid' },
          { value: 'OVERDUE', label: 'Overdue' },
          { value: 'PAID', label: 'Paid' },
          { value: 'ALL', label: 'All' },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
              filter === option.value
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ErrorBanner message={error} onRetry={refresh} />
      {loading ? <LoadingBlock label="Loading receivables" /> : null}

      {!loading && visible.length === 0 ? (
        <EmptyState title="Nothing here" message="No customer payments match this filter." />
      ) : null}

      {!loading && visible.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Due date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((item) => {
                const overdue = item.status !== 'PAID' && item.daysUntilDue < 0
                const badge = item.status === 'PAID' ? 'PAID' : overdue ? 'OVERDUE' : 'PENDING'
                return (
                  <tr key={item.id} className={overdue ? 'bg-rose-50' : undefined}>
                    <td
                      className={`px-4 py-3 font-medium text-slate-800 ${
                        overdue ? 'border-l-4 border-rose-500' : ''
                      }`}
                    >
                      {item.customerName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {formatDate(item.dueDate)}
                      <span className={`block text-xs ${overdue ? 'font-medium text-rose-700' : 'text-slate-400'}`}>
                        {item.status === 'PAID' ? 'settled' : describeDueDate(item.daysUntilDue)}
                      </span>
                    </td>
                    <td className="tabular px-4 py-3 font-semibold whitespace-nowrap text-slate-900">
                      {formatMoney(item.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        value={badge}
                        label={item.status === 'PAID' ? 'Paid' : overdue ? 'Overdue' : 'Pending'}
                      />
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => editItem(item)}
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
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {form ? (
        <ReceivableForm
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
