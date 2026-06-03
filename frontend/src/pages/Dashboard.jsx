import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'
import {
  CalendarDays,
  Ticket,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react'

const statCards = [
  { label: 'Total Events', value: '24', icon: CalendarDays, color: 'bg-blue-50 text-blue-600', change: '+3 this month' },
  { label: 'Tickets Sold', value: '1,247', icon: Ticket, color: 'bg-green-50 text-green-600', change: '+12% vs last month' },
  { label: 'Attendees', value: '892', icon: Users, color: 'bg-purple-50 text-purple-600', change: '+8% vs last month' },
  { label: 'Revenue', value: '$12,490', icon: DollarSign, color: 'bg-amber-50 text-amber-600', change: '+15% vs last month' },
]

const recentEvents = [
  { id: 1, title: 'Summer Music Festival', date: 'Jun 21, 2026', status: 'Active', tickets: 342, revenue: '$8,550' },
  { id: 2, title: 'Tech Innovation Summit', date: 'Jul 10, 2026', status: 'Upcoming', tickets: 128, revenue: '$12,800' },
  { id: 3, title: 'Creative Arts Workshop', date: 'Jul 15, 2026', status: 'Draft', tickets: 0, revenue: '$0' },
  { id: 4, title: 'Startup Networking Night', date: 'Aug 2, 2026', status: 'Active', tickets: 87, revenue: '$2,175' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/events')
      .then((res) => {
        const data = res.data?.data || res.data || []
        setEvents(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        // Use placeholder data on error
      })
      .finally(() => setLoading(false))
  }, [])

  const displayEvents = events.length > 0 ? events.slice(0, 5) : recentEvents

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-500">
            Welcome back, <span className="font-medium text-gray-700">{user?.name || 'User'}</span>
          </p>
        </div>
        <Link to="/events" className="btn-primary">
          <CalendarDays className="mr-2 h-4 w-4" />
          Browse Events
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-medium">{change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events Table */}
      <div className="mt-8 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
          <Link to="/events" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Event</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tickets</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayEvents.map((event) => {
                const title = event.title || event.name || 'Untitled Event'
                const date = event.date || event.start_date || 'TBD'
                const status = event.status || 'Active'
                const statusColor = {
                  Active: 'bg-green-100 text-green-700',
                  Upcoming: 'bg-blue-100 text-blue-700',
                  Draft: 'bg-gray-100 text-gray-600',
                }[status] || 'bg-gray-100 text-gray-600'

                return (
                  <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/events/${event.id}`} className="font-medium text-gray-900 hover:text-primary-600">
                        {title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{event.tickets || event.ticket_count || '—'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.revenue || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Link to="/events" className="card flex items-center gap-4 p-6 hover:border-primary-200">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Browse Events</h3>
            <p className="text-sm text-gray-500">Discover upcoming events near you</p>
          </div>
        </Link>
        <Link to="/events" className="card flex items-center gap-4 p-6 hover:border-primary-200">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">My Tickets</h3>
            <p className="text-sm text-gray-500">View your purchased tickets</p>
          </div>
        </Link>
        <Link to="/events" className="card flex items-center gap-4 p-6 hover:border-primary-200">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Local Events</h3>
            <p className="text-sm text-gray-500">Events happening in your area</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
