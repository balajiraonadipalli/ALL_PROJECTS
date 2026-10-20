import { useState } from 'react'
import { createPayout } from '../api/client'

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

export default function PayoutForm({ merchant, onSuccess }) {
  const [amountRupees, setAmountRupees] = useState('')
  const [bankAccount, setBankAccount] = useState(merchant?.bank_account_id || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    const amount = parseFloat(amountRupees)
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount.')
      return
    }

    const amountPaise = Math.round(amount * 100)
    const idempotencyKey = generateUUID()

    setLoading(true)
    try {
      await createPayout(
        {
          merchant_id: merchant.id,
          amount_paise: amountPaise,
          bank_account_id: bankAccount || merchant.bank_account_id,
        },
        idempotencyKey
      )
      setSuccessMsg(`Payout of ₹${amount.toLocaleString('en-IN')} submitted successfully!`)
      setAmountRupees('')
      onSuccess?.()
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-6 animate-fade-in-up">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-base">💸</span>
        Request Payout
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
            <input
              id="payout-amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              value={amountRupees}
              onChange={e => setAmountRupees(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-gray-800/60 border border-white/10 rounded-xl text-white
                         placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500
                         focus:border-transparent transition-all"
              required
            />
          </div>
          {amountRupees && (
            <p className="text-xs text-gray-500 mt-1">
              = {Math.round(parseFloat(amountRupees || 0) * 100).toLocaleString()} paise
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Bank Account</label>
          <input
            id="payout-bank-account"
            type="text"
            value={bankAccount}
            onChange={e => setBankAccount(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/60 border border-white/10 rounded-xl text-white
                       placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500
                       focus:border-transparent transition-all font-mono text-sm"
            required
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300">
            <span>⚠️</span> {error}
          </div>
        )}
        {successMsg && (
          <div className="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-300">
            <span>✅</span> {successMsg}
          </div>
        )}

        <button
          id="payout-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 disabled:cursor-not-allowed
                     text-white font-semibold rounded-xl transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-gray-900
                     flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Processing...
            </>
          ) : 'Request Payout'}
        </button>
      </form>
    </div>
  )
}
