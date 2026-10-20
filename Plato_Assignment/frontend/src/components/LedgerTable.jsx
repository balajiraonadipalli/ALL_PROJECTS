import { format } from 'date-fns'

function fmt(paise) {
  return '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })
}

export default function LedgerTable({ entries, loading }) {
  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse space-y-3">
        {[1,2,3,4].map(i => <div key={i} className="h-10 bg-white/5 rounded-lg" />)}
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden animate-fade-in-up">
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">📋</span>
        <h2 className="text-lg font-semibold text-white">Ledger</h2>
      </div>
      {(!entries || entries.length === 0) ? (
        <div className="px-6 py-10 text-center text-gray-500">No ledger entries yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.map(e => (
                <tr key={e.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      e.entry_type === 'credit'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                        : 'bg-red-500/15 text-red-300 border border-red-500/25'
                    }`}>
                      {e.entry_type === 'credit' ? '↑ Credit' : '↓ Debit'}
                    </span>
                  </td>
                  <td className={`px-6 py-3 font-mono font-medium ${e.entry_type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {e.entry_type === 'credit' ? '+' : '-'}{fmt(e.amount_paise)}
                  </td>
                  <td className="px-6 py-3 text-gray-300 max-w-xs truncate">{e.description || '—'}</td>
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                    {format(new Date(e.created_at), 'dd MMM yyyy, HH:mm')}
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
