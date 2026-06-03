import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import {
  CalendarDays,
  Users,
  ShoppingCart,
  DollarSign,
  Plus,
  UserPlus,
  TrendingUp,
  Clock,
} from 'lucide-react'

export default function TenantDashboard() {
  const [stats, setStats] = useState({ events: 0, sellers: 0, orders: 0, revenue: 0 })
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/dashboard')
        const d = res.data.data
        setStats({
          events: d?.events ?? d?.stats?.events ?? 0,
          sellers: d?.sellers ?? d?.stats?.sellers ?? 0,
          orders: d?.orders ?? d?.stats?.orders ?? 0,
          revenue: d?.revenue ?? d?.stats?.revenue ?? 0,
        })
        setActivity(d?.recent_activity ?? d?.activity ?? [])
      } catch {
        // use empty defaults
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const statCards = [
    { label: 'Total Events', value: stats.events, icon: CalendarDays, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700' },
    { label: 'Sellers', value: stats.sellers, icon: Users, color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-amber-500', light: 'bg-amber-50 text-amber-700' },
    { label: 'Revenue', value: `$${Number(stats.revenue).toLocaleString()}`, icon: DollarSign, color: 'bg-primary-600', light: 'bg-primary-50 text-primary-700' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/events/new" className="btn-primary !py-2.5">
            <Plus className="mr-1.5 h-4 w-4" /> Create Event
          </Link>
          <Link to="/admin/sellers" className="btn-secondary !py-2.5">
            <UserPlus className="mr-1.5 h-4 w-4" /> Add Seller
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="card p-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color} text-white`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? <span className="inline-block h-7 w-16 animate-pulse rounded bg-gray-200" /> : s.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="card lg:col-span-2">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Clock className="h-5 w-5 text-gray-400" /> Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {activity.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-gray-400">No recent activity</div>
            ) : (
              activity.map((a, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{a.description || a.message || a.title}</p>
                    <p className="text-xs text-gray-400">{a.created_at || a.time || ''}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {[
              { to: '/admin/events/new', icon: Plus, label: 'Create Event', desc: 'Add a new event' },
              { to: '/admin/sellers', icon: UserPlus, label: 'Manage Sellers', desc: 'View & invite sellers' },
              { to: '/admin/orders', icon: ShoppingCart, label: 'View Orders', desc: 'Track all orders' },
              { to: '/admin/venues', icon: CalendarDays, label: 'Manage Venues', desc: 'Add or edit venues' },
              { to: '/admin/branding', icon: TrendingUp, label: 'Branding', desc: 'Customize your page' },
            ].map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
              >
                <q.icon className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{q.label}</p>
                  <p className="text-xs text-gray-400">{q.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
