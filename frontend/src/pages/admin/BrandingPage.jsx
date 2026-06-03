import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'
import {
  Save,
  Palette,
  Type,
  ImageIcon,
  Mail,
  Eye,
  CheckCircle2,
  Monitor,
  Smartphone,
} from 'lucide-react'

export default function BrandingPage() {
  const { user } = useAuth()
  const tenantId = user?.tenant_id ?? user?.id
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    logo_url: '',
    logo_dark_url: '',
    favicon_url: '',
    primary_color: '#4f46e5',
    secondary_color: '#3b82f6',
    accent_color: '#818cf8',
    font_heading: 'Inter',
    font_body: 'Inter',
    email_from_name: '',
    email_from_address: '',
    email_header_color: '#4f46e5',
  })

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/tenants/${tenantId}/brand-profiles`)
        const d = res.data.data
        if (d) {
          setForm((prev) => ({
            ...prev,
            logo_url: d.logo_url ?? '',
            logo_dark_url: d.logo_dark_url ?? '',
            favicon_url: d.favicon_url ?? '',
            primary_color: d.primary_color ?? '#4f46e5',
            secondary_color: d.secondary_color ?? '#3b82f6',
            accent_color: d.accent_color ?? '#818cf8',
            font_heading: d.font_heading ?? 'Inter',
            font_body: d.font_body ?? 'Inter',
            email_from_name: d.email_from_name ?? '',
            email_from_address: d.email_from_address ?? '',
            email_header_color: d.email_header_color ?? '#4f46e5',
          }))
        }
      } catch {
        // empty
      } finally {
        setLoading(false)
      }
    }
    if (tenantId) fetch()
    else setLoading(false)
  }, [tenantId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await api.put(`/tenants/${tenantId}/brand-profiles`, form)
      setMessage({ type: 'success', text: 'Branding saved successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save branding' })
    } finally {
      setSaving(false)
    }
  }

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
        <p className="mt-1 text-sm text-gray-500">Customize your event platform appearance</p>
      </div>

      {message && (
        <div className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo & Images */}
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ImageIcon className="h-5 w-5 text-gray-400" /> Logo & Images
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { key: 'logo_url', label: 'Logo (Light)' },
              { key: 'logo_dark_url', label: 'Logo (Dark)' },
              { key: 'favicon_url', label: 'Favicon' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type="url"
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                />
                {form[key] && <img src={form[key]} alt={label} className="mt-2 h-12 rounded-lg object-contain" />}
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Palette className="h-5 w-5 text-gray-400" /> Colors
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { key: 'primary_color', label: 'Primary' },
              { key: 'secondary_color', label: 'Secondary' },
              { key: 'accent_color', label: 'Accent' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300 p-1"
                  />
                  <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Type className="h-5 w-5 text-gray-400" /> Typography
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Heading Font</label>
              <select value={form.font_heading} onChange={(e) => update('font_heading', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none">
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Body Font</label>
              <select value={form.font_body} onChange={(e) => update('font_body', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none">
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Nunito">Nunito</option>
              </select>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Mail className="h-5 w-5 text-gray-400" /> Email Settings
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">From Name</label>
              <input type="text" value={form.email_from_name} onChange={(e) => update('email_from_name', e.target.value)}
                placeholder="Eventra" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">From Email</label>
              <input type="email" value={form.email_from_address} onChange={(e) => update('email_from_address', e.target.value)}
                placeholder="noreply@example.com" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Header Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.email_header_color} onChange={(e) => update('email_header_color', e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300 p-1" />
                <input type="text" value={form.email_header_color} onChange={(e) => update('email_header_color', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 font-mono text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Eye className="h-5 w-5 text-gray-400" /> Live Preview
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Desktop preview */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2">
                <Monitor className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">Desktop</span>
              </div>
              <div className="bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  {form.logo_url ? (
                    <img src={form.logo_url} alt="Logo" className="h-8 object-contain" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: form.primary_color }}>
                      E
                    </div>
                  )}
                  <span className="font-bold" style={{ color: form.primary_color }}>Eventra</span>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded" style={{ backgroundColor: form.primary_color, opacity: 0.2 }} />
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-5/6 rounded bg-gray-100" />
                </div>
                <button className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: form.primary_color }}>
                  Get Tickets
                </button>
              </div>
            </div>
            {/* Mobile preview */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2">
                <Smartphone className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">Mobile</span>
              </div>
              <div className="flex justify-center bg-white p-4">
                <div className="w-48 space-y-2">
                  <div className="flex items-center gap-2">
                    {form.logo_url ? (
                      <img src={form.logo_url} alt="Logo" className="h-6 object-contain" />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white" style={{ backgroundColor: form.primary_color }}>
                        E
                      </div>
                    )}
                    <span className="text-sm font-bold" style={{ color: form.primary_color }}>Eventra</span>
                  </div>
                  <div className="h-16 rounded-lg" style={{ backgroundColor: form.primary_color, opacity: 0.1 }} />
                  <div className="h-2.5 w-3/4 rounded bg-gray-100" />
                  <div className="h-2 w-full rounded bg-gray-100" />
                  <button className="w-full rounded px-3 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: form.primary_color }}>
                    Get Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary !py-2.5">
            <Save className="mr-1.5 h-4 w-4" /> {saving ? 'Saving...' : 'Save Branding'}
          </button>
        </div>
      </form>
    </div>
  )
}
