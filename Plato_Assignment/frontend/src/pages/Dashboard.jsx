import { useState, useEffect, useCallback } from 'react'
import { getMerchants, getBalance, getLedger, getPayouts } from '../api/client'
import MerchantSelector from '../components/MerchantSelector'
import BalanceCard from '../components/BalanceCard'
import PayoutForm from '../components/PayoutForm'
import LedgerTable from '../components/LedgerTable'
import PayoutHistory from '../components/PayoutHistory'

export default function Dashboard() {
  const [merchants, setMerchants] = useState([])
  const [selectedMerchant, setSelectedMerchant] = useState(null)
  const [balance, setBalance] = useState(null)
  const [ledger, setLedger] = useState([])
  const [payouts, setPayouts] = useState([])
  const [loadingBalance, setLoadingBalance] = useState(false)
  const [loadingLedger, setLoadingLedger] = useState(false)
  const [loadingPayouts, setLoadingPayouts] = useState(false)

  // Load merchant list once
  useEffect(() => {
    getMerchants().then(res => {
      setMerchants(res.data)
      if (res.data.length > 0) setSelectedMerchant(res.data[0])
    })
  }, [])

  const fetchBalance = useCallback(async () => {
    if (!selectedMerchant) return
    setLoadingBalance(true)
    try {
      const res = await getBalance(selectedMerchant.id)
      setBalance(res.data)
    } finally {
      setLoadingBalance(false)
    }
  }, [selectedMerchant])

  const fetchLedger = useCallback(async () => {
    if (!selectedMerchant) return
    setLoadingLedger(true)
    try {
      const res = await getLedger(selectedMerchant.id)
      setLedger(res.data.results || [])
    } finally {
      setLoadingLedger(false)
    }
  }, [selectedMerchant])

  const fetchPayouts = useCallback(async () => {
    if (!selectedMerchant) return
    setLoadingPayouts(true)
    try {
      const res = await getPayouts(selectedMerchant.id)
      setPayouts(res.data)
    } finally {
      setLoadingPayouts(false)
    }
  }, [selectedMerchant])

  // Reload all data when merchant changes
  useEffect(() => {
    fetchBalance()
    fetchLedger()
    fetchPayouts()
  }, [fetchBalance, fetchLedger, fetchPayouts])

  // Live polling every 3 seconds for payouts + balance
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPayouts()
      fetchBalance()
    }, 3000)
    return () => clearInterval(interval)
  }, [fetchPayouts, fetchBalance])

  const handlePayoutSuccess = () => {
    fetchBalance()
    fetchLedger()
    fetchPayouts()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-white text-lg pulse-ring">P</div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Playto Pay</h1>
              <p className="text-xs text-gray-500">Payout Engine</p>
            </div>
          </div>
          {merchants.length > 0 && (
            <MerchantSelector
              merchants={merchants}
              selected={selectedMerchant}
              onSelect={setSelectedMerchant}
            />
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Merchant info */}
        {selectedMerchant && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white">{selectedMerchant.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{selectedMerchant.email} · {selectedMerchant.bank_account_id}</p>
          </div>
        )}

        {/* Balance cards */}
        <BalanceCard balance={balance} loading={loadingBalance} />

        {/* Form + Payout history */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {selectedMerchant && (
              <PayoutForm merchant={selectedMerchant} onSuccess={handlePayoutSuccess} />
            )}
          </div>
          <div className="lg:col-span-2">
            <PayoutHistory payouts={payouts} loading={loadingPayouts} />
          </div>
        </div>

        {/* Ledger */}
        <LedgerTable entries={ledger} loading={loadingLedger} />
      </main>
    </div>
  )
}
