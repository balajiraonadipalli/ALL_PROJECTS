export default function StatusBadge({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span className={`badge-${status} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'pending'    ? 'bg-yellow-400' :
        status === 'processing' ? 'bg-blue-400 animate-pulse' :
        status === 'completed'  ? 'bg-emerald-400' : 'bg-red-400'
      }`} />
      {label}
    </span>
  )
}
