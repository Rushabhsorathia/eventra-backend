import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'
import {
  Save,
  ArrowLeft,
  ImageIcon,
  CalendarDays,
  MapPin,
  Tag,
  FileText,
  CheckCircle2,
} from 'lucide-react'

export default function EventFormPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const tenantId = user?.tenant_id ?? user?.id

  const [form, setForm] = useState({
    name: '',
    description: '',
    event_kind: 'conference',
    cover_image: '',
    venue_id: '',
    start_date: '',
    end_date: '',
    status: 'draft',
  })
  const [venues, setVenues] = useState([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await api.get(`/tenants/${tenantId}/venues`)
        const raw = res.data.data; setVenues(Array.isArray(raw) ? raw : (raw?.data ?? []))
      } catch {
        // empty
      }
    }
    fetchVenues()

    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const res = await api.get(`/tenants/${tenantId}/events/${id}`)
          const e = res.data.data
          setForm({
            name: e.name ?? e.title ?? '',
            description: e.description ?? '',
            event_kind: e.event_kind ?? e.kind ?? 'conference',
            cover_image: e.cover_image ?? '',
            venue_id: e.venue_id ?? (e.venue?.id ?? ''),
            start_date: e.start_date ? e.start_date.slice(0, 16) : '',
            end_date: e.end_date ? e.end_date.slice(0, 16) : '',
            status: e.status ?? 'draft',
          })
        } catch {
          setMessage({ type: 'error', text: 'Failed to load event' })
        } finally {
          setLoading(false)
        }
      }
      fetchEvent()
    }
  }, [id, tenantId])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      if (isEdit) {
        await api.put(`/tenants/${tenantId}/events/${id}`, form)
        setMessage({ type: 'success', text: 'Event updated successfully!' })
      } else {
        const res = await api.post(`/tenants/${tenantId}/events`, form)
        const newId = res.data.data?.id ?? res.data.data?.event?.id
        if (newId) {
          navigate(`/admin/events/${newId}/edit`)
        } else {
          navigate('/admin/events')
        }
        return
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save event' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <button onClick={() => navigate('/admin/events')} className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Event' : 'Create Event'}</h1>
        <p className="mt-1 text-sm text-gray-500">{isEdit ? 'Update event details' : 'Set up a new event'}</p>
      </div>

      {message && (
        <div className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4 text-gray-400" /> Event Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter event name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your event..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none resize-none"
            />
          </div>

          {/* Event Kind */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Tag className="h-4 w-4 text-gray-400" /> Event Kind
            </label>
            <select
              name="event_kind"
              value={form.event_kind}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
            >
              <option value="conference">Conference</option>
              <option value="concert">Concert</option>
              <option value="workshop">Workshop</option>
              <option value="sports">Sports</option>
              <option value="exhibition">Exhibition</option>
              <option value="festival">Festival</option>
              <option value="meetup">Meetup</option>
              <option value="seminar">Seminar</option>
            </select>
          </div>

          {/* Cover Image */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <ImageIcon className="h-4 w-4 text-gray-400" /> Cover Image URL
            </label>
            <input
              name="cover_image"
              value={form.cover_image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
            />
            {form.cover_image && (
              <img src={form.cover_image} alt="Preview" className="mt-2 h-40 w-full rounded-lg object-cover" />
            )}
          </div>

          {/* Venue */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4 text-gray-400" /> Venue
            </label>
            <select
              name="venue_id"
              value={form.venue_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
            >
              <option value="">Select a venue</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>{v.name} — {v.city ?? ''}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <CalendarDays className="h-4 w-4 text-gray-400" /> Start Date
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <CalendarDays className="h-4 w-4 text-gray-400" /> End Date
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Status */}
          {isEdit && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/admin/events')} className="btn-secondary !py-2.5">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary !py-2.5">
            <Save className="mr-1.5 h-4 w-4" /> {saving ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  )
}
