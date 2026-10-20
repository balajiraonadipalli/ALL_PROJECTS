import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

export const getMerchants = () => api.get('/merchants/')

export const getBalance = (merchantId) =>
  api.get(`/merchants/${merchantId}/balance/`)

export const getLedger = (merchantId, page = 1, pageSize = 10) =>
  api.get(`/merchants/${merchantId}/ledger/`, { params: { page, page_size: pageSize } })

export const getPayouts = (merchantId) =>
  api.get('/payouts/', { params: { merchant_id: merchantId } })

export const createPayout = (payload, idempotencyKey) =>
  api.post('/payouts/', payload, {
    headers: { 'Idempotency-Key': idempotencyKey },
  })

export default api
