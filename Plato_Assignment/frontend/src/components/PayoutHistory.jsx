import { format } from 'date-fns'
import StatusBadge from './StatusBadge'

function fmt(paise) {
  return '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })
}

export default function PayoutHistory({ payouts, loading }) {
  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse space-y-3">
        {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 rounded-lg" />)}
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden animate-fade-in-up">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">🏦</span>
          <h2 className="text-lg font-semibold text-white">Payout History</h2>
        </div>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live updates every 3s
        </span>
      </div>
      {(!payouts || payouts.length === 0) ? (
        <div className="px-6 py-10 text-center text-gray-500">No payouts yet. Submit your first payout request!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Payout ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Bank Account</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Attempts</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payouts.map(p => (
                <tr key={p.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-6 py-3 font-mono text-gray-400 text-xs">
                    {p.id.substring(0, 8)}…
                  </td>
                  <td className="px-6 py-3 font-medium text-white">{fmt(p.amount_paise)}</td>
                  <td className="px-6 py-3 font-mono text-gray-400 text-xs">{p.bank_account_id}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={p.status} />
                    {p.failure_reason && (
                      <p className="text-xs text-red-400 mt-1 max-w-xs truncate">{p.failure_reason}</p>
                    )}
                  </td>
                  <td className="px-6 py-3 text-gray-400">{p.attempts}</td>
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                    {format(new Date(p.created_at), 'dd MMM, HH:mm:ss')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
