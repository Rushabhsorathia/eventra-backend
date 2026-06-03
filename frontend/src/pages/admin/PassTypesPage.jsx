import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../api/axios'
import {
  Plus,
  ArrowLeft,
  Tag,
  DollarSign,
  Package,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Ticket,
} from 'lucide-react'

export default function PassTypesPage() {
  const { id: eventId } = useParams()
  const [passes, setPasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ kind: 'general', name: '', price: '', total_inventory: '', status: 'active' })
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/pass-types', { params: { event_id: eventId } })
        const raw = res.data.data; setPasses(Array.isArray(raw) ? raw : (raw?.data ?? []))
      } catch {
        // empty
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [eventId])

  const openCreate = () => {
    setEditing(null)
    setForm({ kind: 'general', name: '', price: '', total_inventory: '', status: 'active' })
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEditing(p.id)
    setForm({
      kind: p.kind ?? 'general',
      name: p.name ?? '',
      price: p.price ?? '',
      total_inventory: p.total_inventory ?? p.inventory ?? '',
      status: p.status ?? 'active',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      if (editing) {
        await api.put(`/pass-types/${editing}`, { ...form, event_id: eventId })
        setMessage({ type: 'success', text: 'Pass type updated!' })
      } else {
        await api.post('/pass-types', { ...form, event_id: eventId })
        setMessage({ type: 'success', text: 'Pass type created!' })
      }
      const res = await api.get('/pass-types', { params: { event_id: eventId } })
      const raw = res.data.data; setPasses(Array.isArray(raw) ? raw : (raw?.data ?? []))
      setShowForm(false)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save pass type' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (passId) => {
    if (!confirm('Delete this pass type?')) return
    try {
      await api.delete(`/pass-types/${passId}`)
      setPasses((prev) => prev.filter((p) => p.id !== passId))
    } catch {
      // error
    }
  }

  const InventoryBar = ({ total, sold }) => {
    const t = Number(total) || 0
    const s = Number(sold) || 0
    const avail = t - s
    const pct = t > 0 ? Math.round((s / t) * 100) : 0
    return (
      <div className="min-w-[120px]">
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>{s} sold</span>
          <span>{avail} avail</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-0.5 text-xs text-gray-400">{t} total</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link to="/admin/events" className="mb-3 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pass Types</h1>
            <p className="mt-1 text-sm text-gray-500">Manage ticket types for this event</p>
          </div>
          <button onClick={openCreate} className="btn-primary !py-2.5">
            <Plus className="mr-1.5 h-4 w-4" /> Add Pass Type
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-24 animate-pulse" />
          ))
        ) : passes.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-gray-400">
            <Ticket className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm">No pass types yet. Create one to start selling tickets.</p>
          </div>
        ) : (
          passes.map((p) => (
            <div key={p.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                      <Tag className="h-3 w-3" /> {p.kind}
                    </span>
                    {(p.status ?? 'active') !== 'active' && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        {p.status}
                      </span>
                    )}
                  </div>
                  <p className="flex items-center gap-1 text-xl font-bold text-primary-600">
                    <DollarSign className="h-5 w-5" /> {Number(p.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <InventoryBar total={p.total_inventory ?? p.inventory} sold={p.sold_count ?? p.sold ?? 0} />
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
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
              <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Pass Type' : 'New Pass Type'}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Kind</label>
                <select name="kind" value={form.kind} onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none">
                  <option value="general">General</option>
                  <option value="vip">VIP</option>
                  <option value="premium">Premium</option>
                  <option value="early_bird">Early Bird</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. VIP Pass" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                    <DollarSign className="h-3.5 w-3.5" /> Price
                  </label>
                  <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                    <Package className="h-3.5 w-3.5" /> Inventory
                  </label>
                  <input type="number" required value={form.total_inventory} onChange={(e) => setForm((f) => ({ ...f, total_inventory: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary !py-2.5">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary !py-2.5">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
