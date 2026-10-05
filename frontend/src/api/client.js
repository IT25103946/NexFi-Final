import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

function messageFrom(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback
}

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(messageFrom(error, 'Something went wrong. Please try again.'))),
)

export const api = {
  get: (url, params) => http.get(url, { params }).then((response) => response.data),
  post: (url, body) => http.post(url, body).then((response) => response.data),
  put: (url, body) => http.put(url, body).then((response) => response.data),
  remove: (url) => http.delete(url).then((response) => response.data),
}

export const fetchDashboard = () => api.get('/dashboard')
export const fetchForecast = (days) => api.get('/forecast', { days })

/**
 * The saved shop profile. Rejects with a 404-derived error until onboarding has been
 * completed, which is what the router uses to decide between the wizard and the dashboard.
 */
export const fetchShopProfile = () => api.get('/shop-profile')

/**
 * Server-side what-if projection. The simulator currently recomputes locally in
 * `src/lib/scenario.js` so it works offline and stays instant; wire this in once the
 * backend exposes the endpoint and it will take over without any component changes.
 *
 * Expected: POST /api/forecast/simulate
 *   { days, scenarios: [{ kind, amount, day, shift }] }
 *   -> CashFlowSnapshot-shaped response including a `forecast` array
 */
export const simulateForecast = (days, scenarios) => api.post('/forecast/simulate', { days, scenarios })

export const fetchTransactions = (params) => api.get('/transactions', params)
export const createTransaction = (body) => api.post('/transactions', body)
export const updateTransaction = (id, body) => api.put(`/transactions/${id}`, body)
export const deleteTransaction = (id) => api.remove(`/transactions/${id}`)

export const fetchReceivables = () => api.get('/receivables')
export const createReceivable = (body) => api.post('/receivables', body)
export const updateReceivable = (id, body) => api.put(`/receivables/${id}`, body)
export const deleteReceivable = (id) => api.remove(`/receivables/${id}`)

export const fetchPayables = () => api.get('/payables')
export const createPayable = (body) => api.post('/payables', body)
export const updatePayable = (id, body) => api.put(`/payables/${id}`, body)
export const deletePayable = (id) => api.remove(`/payables/${id}`)

export const fetchRecurringExpenses = () => api.get('/recurring-expenses')
export const createRecurringExpense = (body) => api.post('/recurring-expenses', body)
export const updateRecurringExpense = (id, body) => api.put(`/recurring-expenses/${id}`, body)
export const deleteRecurringExpense = (id) => api.remove(`/recurring-expenses/${id}`)

/**
 * Saves the business profile captured by the onboarding wizard.
 *
 * Expected: POST /api/onboarding -> 201 with the created BusinessProfile. The wizard only
 * depends on this resolving; the payload shape matches BusinessProfileRequest on the backend.
 */
export const submitOnboarding = (body) => api.post('/onboarding', body)
