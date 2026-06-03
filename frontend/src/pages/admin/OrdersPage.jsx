import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import {
  Search,
  Filter,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CalendarDays,
  User,
} from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/orders', { params: { page } })
        const raw = res.data.data; setOrders(Array.isArray(raw) ? raw : (raw?.data ?? []))
      } catch {
        // empty
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [page])

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase()
    const matchSearch =
      (o.order_number ?? o.id ?? '').toString().toLowerCase().includes(q) ||
      (o.customer?.name ?? o.customer_name ?? '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || (o.status ?? '') === statusFilter
    return matchSearch && matchStatus
  })

  const StatusBadge = ({ status }) => {
    const s = (status ?? 'pending').toLowerCase()
    const map = {
      pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
      confirmed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
      completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
      cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
      refunded: 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/20',
      paid: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
      failed: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[s] ?? map.pending}`}>
        {s}
      </span>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">Track and manage all orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order # or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {['all', 'pending', 'paid', 'completed', 'cancelled', 'refunded'].map((s) => (
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
                <th className="px-6 py-3.5 font-semibold text-gray-600">Order #</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Customer</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Total</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Date</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
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
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <ShoppingCart className="mx-auto mb-2 h-10 w-10 text-gray-300" />
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{o.order_number ?? o.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="text-gray-700">{o.customer?.name ?? o.customer_name ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 font-semibold text-gray-900">
                        <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                        {Number(o.total ?? o.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">Page {page}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
