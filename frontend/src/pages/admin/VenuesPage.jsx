import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'
import {
  Plus,
  MapPin,
  Edit3,
  Trash2,
  X,
  Users,
  Building2,
  Save,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react'

export default function VenuesPage() {
  const { user } = useAuth()
  const tenantId = user?.tenant_id ?? user?.id
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({ name: '', city: '', address: '', capacity: '', description: '' })

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/tenants/${tenantId}/venues`)
        const raw = res.data.data; setVenues(Array.isArray(raw) ? raw : (raw?.data ?? []))
      } catch {
        // empty
      } finally {
        setLoading(false)
      }
    }
    if (tenantId) fetch()
    else setLoading(false)
  }, [tenantId])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', city: '', address: '', capacity: '', description: '' })
    setShowForm(true)
  }

  const openEdit = (v) => {
    setEditing(v.id)
    setForm({ name: v.name ?? '', city: v.city ?? '', address: v.address ?? '', capacity: v.capacity ?? '', description: v.description ?? '' })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      if (editing) {
        await api.put(`/tenants/${tenantId}/venues/${editing}`, form)
        setMessage({ type: 'success', text: 'Venue updated!' })
      } else {
        await api.post(`/tenants/${tenantId}/venues`, form)
        setMessage({ type: 'success', text: 'Venue created!' })
      }
      const res = await api.get(`/tenants/${tenantId}/venues`)
      const raw = res.data.data; setVenues(Array.isArray(raw) ? raw : (raw?.data ?? []))
      setShowForm(false)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save venue' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (venueId) => {
    if (!confirm('Delete this venue?')) return
    try {
      await api.delete(`/tenants/${tenantId}/venues/${venueId}`)
      setVenues((prev) => prev.filter((v) => v.id !== venueId))
    } catch {
      // error
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Venues</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your event venues</p>
        </div>
        <button onClick={openCreate} className="btn-primary !py-2.5">
          <Plus className="mr-1.5 h-4 w-4" /> Add Venue
        </button>
      </div>

      {message && (
        <div className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-40 animate-pulse" />
          ))
        ) : venues.length === 0 ? (
          <div className="col-span-full card flex flex-col items-center justify-center py-16 text-gray-400">
            <Building2 className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm">No venues yet. Add your first venue.</p>
          </div>
        ) : (
          venues.map((v) => (
            <div key={v.id} className="card p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{v.name}</h3>
                    <p className="text-sm text-gray-500">{v.city ?? '—'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(v)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {v.address && <p className="mb-3 text-sm text-gray-500">{v.address}</p>}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {v.capacity ? `${v.capacity} capacity` : '—'}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" /> {v.events_count ?? v.event_count ?? 0} events
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Venue' : 'New Venue'}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Venue name" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Capacity</label>
                  <input type="number" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
                <input type="text" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary !py-2.5">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary !py-2.5">
                  <Save className="mr-1.5 h-4 w-4" /> {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
