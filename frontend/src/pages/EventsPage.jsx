import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import {
  Search,
  CalendarDays,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  Tag,
} from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/events')
      .then((res) => {
        const data = res.data?.data || res.data || []
        setEvents(Array.isArray(data) ? data : [])
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = events.filter((e) => {
    const title = (e.title || e.name || '').toLowerCase()
    const loc = (e.location || e.venue || '').toLowerCase()
    const q = search.toLowerCase()
    return title.includes(q) || loc.includes(q)
  })

  const placeholderEvents = [
    {
      id: 1, title: 'Summer Music Festival 2026', date: 'Jun 21, 2026',
      location: 'Central Park, NYC', price: '$49', category: 'Concert',
      description: 'An incredible lineup of artists performing live under the summer sky.',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
    },
    {
      id: 2, title: 'Tech Innovation Summit', date: 'Jul 10, 2026',
      location: 'Moscone Center, SF', price: '$199', category: 'Conference',
      description: 'Connect with industry leaders and explore the future of technology.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    },
    {
      id: 3, title: 'Creative Arts Workshop', date: 'Jul 15, 2026',
      location: 'Art District, LA', price: '$35', category: 'Workshop',
      description: 'Hands-on creative sessions with professional artists and designers.',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop',
    },
    {
      id: 4, title: 'Marathon City Run', date: 'Aug 5, 2026',
      location: 'Downtown, Chicago', price: '$25', category: 'Sports',
      description: 'Challenge yourself in our annual city marathon through scenic routes.',
      image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600&h=400&fit=crop',
    },
    {
      id: 5, title: 'Startup Networking Night', date: 'Aug 12, 2026',
      location: 'WeWork, Austin', price: 'Free', category: 'Networking',
      description: 'Meet fellow entrepreneurs, investors, and mentors in a casual setting.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
    },
    {
      id: 6, title: 'Data Science Bootcamp', date: 'Sep 1, 2026',
      location: 'Online', price: '$149', category: 'Education',
      description: 'Intensive 2-day bootcamp covering machine learning and data analytics.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
    },
  ]

  const displayEvents = filtered.length > 0 ? filtered : (events.length === 0 ? placeholderEvents : [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="mt-2 text-gray-500">Discover amazing events happening near you</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="block w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 text-sm shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none sm:w-72"
            />
          </div>
        </div>
      </div>

      {/* Filter tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {['All', 'Concert', 'Conference', 'Workshop', 'Sports', 'Networking', 'Education'].map((cat) => (
          <button
            key={cat}
            className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      )}

      {/* Events Grid */}
      {!loading && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayEvents.map((event) => {
            const title = event.title || event.name || 'Untitled'
            const date = event.date || event.start_date || 'TBD'
            const location = event.location || event.venue || 'TBD'
            const price = event.price || (event.ticket_price ? `$${event.ticket_price}` : 'Free')
            const category = event.category || event.type || 'Event'
            const image = event.image || event.image_url || event.cover_image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop`
            const description = event.description || ''

            return (
              <Link key={event.id} to={`/events/${event.id}`} className="card group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop'
                    }}
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                    {category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {title}
                  </h3>
                  {description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
                  )}
                  <div className="mt-3 space-y-1.5">
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays className="h-4 w-4 shrink-0" /> {date}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 shrink-0" /> {location}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-lg font-bold text-primary-600">{price}</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:underline">
                      View Details <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {!loading && displayEvents.length === 0 && (
        <div className="mt-16 text-center">
          <Tag className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No events found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}
