import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'
import {
  Search,
  Filter,
  UserPlus,
  X,
  Shield,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  CalendarDays,
} from 'lucide-react'

export default function SellersPage() {
  const { user } = useAuth()
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const tenantId = user?.tenant_id ?? user?.id

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/tenants/${tenantId}/sellers`)
        const raw = res.data.data; setSellers(Array.isArray(raw) ? raw : (raw?.data ?? []))
      } catch {
        // empty
      } finally {
        setLoading(false)
      }
    }
    if (tenantId) fetch()
    else setLoading(false)
  }, [tenantId])

  const filtered = sellers.filter((s) => {
    const matchSearch = (s.name ?? s.user?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (s.email ?? s.user?.email ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || (s.status ?? 'active') === statusFilter
    return matchSearch && matchStatus
  })

  const handleInvite = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post(`/tenants/${tenantId}/sellers`, { email: inviteEmail })
      setShowInvite(false)
      setInviteEmail('')
      const res = await api.get(`/tenants/${tenantId}/sellers`)
      const raw = res.data.data; setSellers(Array.isArray(raw) ? raw : (raw?.data ?? []))
    } catch {
      // handle error
    } finally {
      setSubmitting(false)
    }
  }

  const StatusBadge = ({ status }) => {
    const s = (status ?? 'active').toLowerCase()
    const map = {
      active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
      inactive: 'bg-gray-50 text-gray-600 ring-gray-500/20',
      suspended: 'bg-red-50 text-red-700 ring-red-600/20',
      pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${map[s] ?? map.active}`}>
        {s}
      </span>
    )
  }

  const KycBadge = ({ status }) => {
    const s = (status ?? '').toLowerCase()
    if (s === 'verified' || s === 'approved')
      return <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</span>
    if (s === 'rejected')
      return <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600"><XCircle className="h-3.5 w-3.5" /> Rejected</span>
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600"><Clock className="h-3.5 w-3.5" /> Pending</span>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sellers</h1>
          <p className="mt-1 text-sm text-gray-500">Manage sellers and their permissions</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-primary !py-2.5">
          <UserPlus className="mr-1.5 h-4 w-4" /> Invite Seller
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {['all', 'active', 'inactive', 'pending', 'suspended'].map((s) => (
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
                <th className="px-6 py-3.5 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">KYC</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Events</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No sellers found</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
                          {(s.name ?? s.user?.name ?? 'S').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{s.name ?? s.user?.name}</p>
                          <p className="text-xs text-gray-400">{s.email ?? s.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                    <td className="px-6 py-4"><KycBadge status={s.kyc_status} /></td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-gray-700">
                        <CalendarDays className="h-3.5 w-3.5 text-gray-400" /> {s.events_count ?? s.event_count ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 font-medium text-gray-900">
                        <DollarSign className="h-3.5 w-3.5 text-gray-400" /> {(s.revenue ?? 0).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Invite Seller</h3>
              <button onClick={() => setShowInvite(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleInvite}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="seller@example.com"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowInvite(false)} className="btn-secondary !py-2.5">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary !py-2.5">
                  <Shield className="mr-1.5 h-4 w-4" /> {submitting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
