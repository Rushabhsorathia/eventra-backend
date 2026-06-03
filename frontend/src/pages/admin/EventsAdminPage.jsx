import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'
import {
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  CalendarDays,
  MapPin,
  Tag,
} from 'lucide-react'

export default function EventsAdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [kindFilter, setKindFilter] = useState('all')

  const tenantId = user?.tenant_id ?? user?.id

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/tenants/${tenantId}/events`)
        const raw = res.data.data
        const list = Array.isArray(raw) ? raw : (raw?.data ?? [])
        setEvents(list)
      } catch {
        // empty
      } finally {
        setLoading(false)
      }
    }
    if (tenantId) fetch()
    else setLoading(false)
  }, [tenantId])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      await api.delete(`/tenants/${tenantId}/events/${id}`)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch {
      // error
    }
  }

  const handlePublish = async (id) => {
    try {
      await api.post(`/tenants/${tenantId}/events/${id}/publish`)
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'published' } : e)))
    } catch {
      // error
    }
  }

  const filtered = events.filter((e) => {
    const name = e.name ?? e.title ?? ''
    const matchSearch = name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || (e.status ?? 'draft') === statusFilter
    const matchKind = kindFilter === 'all' || (e.event_kind ?? e.kind ?? '') === kindFilter
    return matchSearch && matchStatus && matchKind
  })

  const StatusBadge = ({ status }) => {
    const s = (status ?? 'draft').toLowerCase()
    const map = {
      draft: 'bg-gray-100 text-gray-700',
      published: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
      cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
      completed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
      upcoming: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[s] ?? map.draft}`}>
        {s}
      </span>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all your events</p>
        </div>
        <Link to="/admin/events/new" className="btn-primary !py-2.5">
          <Plus className="mr-1.5 h-4 w-4" /> Create Event
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          >
            <option value="all">All Kinds</option>
            <option value="conference">Conference</option>
            <option value="concert">Concert</option>
            <option value="workshop">Workshop</option>
            <option value="sports">Sports</option>
            <option value="exhibition">Exhibition</option>
            <option value="festival">Festival</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Event</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Kind</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Date</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Seller</th>
                <th className="px-6 py-3.5 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No events found</td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {e.cover_image ? (
                          <img src={e.cover_image} alt="" className="h-10 w-14 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-primary-50">
                            <CalendarDays className="h-5 w-5 text-primary-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{e.name ?? e.title}</p>
                          {e.venue && (
                            <p className="flex items-center gap-1 text-xs text-gray-400">
                              <MapPin className="h-3 w-3" /> {e.venue.name ?? e.venue}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                        <Tag className="h-3 w-3" /> {e.event_kind ?? e.kind ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
                    <td className="px-6 py-4 text-gray-600">
                      {e.start_date ? new Date(e.start_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{e.seller?.name ?? e.seller_name ?? '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/events/${e.id}`}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/events/${e.id}/edit`}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        {(e.status ?? '').toLowerCase() === 'draft' && (
                          <button
                            onClick={() => handlePublish(e.id)}
                            className="rounded-lg p-2 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600"
                            title="Publish"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
