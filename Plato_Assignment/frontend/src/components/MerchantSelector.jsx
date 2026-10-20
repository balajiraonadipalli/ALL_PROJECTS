export default function MerchantSelector({ merchants, selected, onSelect }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-400 font-medium whitespace-nowrap">Active Merchant</label>
      <select
        id="merchant-selector"
        value={selected?.id || ''}
        onChange={e => onSelect(merchants.find(m => m.id === e.target.value))}
        className="bg-gray-800/80 border border-white/10 text-gray-100 text-sm rounded-xl px-4 py-2
                   focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                   cursor-pointer hover:border-brand-500/50 transition-all"
      >
        {merchants.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
    </div>
  )
}
