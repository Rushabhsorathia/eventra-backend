import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'
import {
  Search,
  Filter,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  CalendarDays,
} from 'lucide-react'

export default function SettlementsPage() {
  const { user } = useAuth()
  const tenantId = user?.tenant_id ?? user?.id
  const [settlements, setSettlements] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/settlements')
        const raw = res.data.data; setSettlements(Array.isArray(raw) ? raw : (raw?.data ?? []))
      } catch {
        // empty
      } finally {
        setLoading(false)
      }
    }
    if (tenantId) fetch()
    else setLoading(false)
  }, [tenantId])

  const handleApprove = async (id) => {
    try {
      await api.post(`/settlements/${id}/approve`)
      setSettlements((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s))
      )
    } catch {
      // error
    }
  }

  const filtered = settlements.filter((s) => {
    const q = search.toLowerCase()
    const matchSearch = (s.seller?.name ?? s.seller_name ?? '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || (s.status ?? 'pending') === statusFilter
    return matchSearch && matchStatus
  })

  const StatusBadge = ({ status }) => {
    const s = (status ?? 'pending').toLowerCase()
    const map = {
      pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
      approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
      paid: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
      rejected: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
    }
    const icons = { pending: Clock, approved: CheckCircle2, paid: CheckCircle2, rejected: AlertCircle }
    const Icon = icons[s] ?? Clock
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${map[s] ?? map.pending}`}>
        <Icon className="h-3 w-3" /> {s}
      </span>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settlements</h1>
        <p className="mt-1 text-sm text-gray-500">Track and approve seller settlements</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {['all', 'pending', 'approved', 'paid', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Seller</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Period</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Gross</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Net</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No settlements found</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900">{s.seller?.name ?? s.seller_name ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-gray-600">
                        <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                        {s.period ?? s.period_start ? `${s.period_start ?? ''} — ${s.period_end ?? ''}` : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 font-medium text-gray-900">
                        <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                        {Number(s.gross_amount ?? s.gross ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <DollarSign className="h-3.5 w-3.5" />
                        {Number(s.net_amount ?? s.net ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                    <td className="px-6 py-4">
                      {(s.status ?? '').toLowerCase() === 'pending' ? (
                        <button
                          onClick={() => handleApprove(s.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Approve
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
