function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`glass-card p-5 flex flex-col gap-1 border-l-4 ${accent}`}>
      <span className="text-xs text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-3xl font-bold text-white">{value}</span>
      {sub && <span className="text-xs text-gray-500">{sub}</span>}
    </div>
  )
}

function fmt(paise) {
  return '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })
}

export default function BalanceCard({ balance, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map(i => <div key={i} className="glass-card h-24" />)}
      </div>
    )
  }
  if (!balance) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
      <StatCard
        label="Available Balance"
        value={fmt(balance.available_paise)}
        sub="Ready to withdraw"
        accent="border-emerald-500"
      />
      <StatCard
        label="Held (In-Flight)"
        value={fmt(balance.held_paise)}
        sub="Pending & processing payouts"
        accent="border-yellow-500"
      />
      <StatCard
        label="Total Credited"
        value={fmt(balance.total_credited_paise)}
        sub="All-time international payments"
        accent="border-brand-500"
      />
    </div>
  )
}
