import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Share2,
  Heart,
  ArrowLeft,
  Ticket,
  Tag,
  ChevronRight,
  Shield,
} from 'lucide-react'

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((res) => {
        setEvent(res.data?.data || res.data || null)
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    )
  }

  // Fallback placeholder event for demo
  const e = event || {
    id,
    title: 'Summer Music Festival 2026',
    description: `Join us for the most anticipated music festival of the year! Experience incredible performances from world-renowned artists across multiple stages in the heart of Central Park.\n\nThis year's festival features an eclectic mix of genres including rock, pop, indie, electronic, and jazz. With over 20 artists performing across 3 stages, there's something for everyone.\n\nWhat's included:\n• Full-day access to all stages\n• Food and beverage vendors\n• VIP lounge access (VIP tickets only)\n• Official festival merchandise\n• After-party access`,
    date: 'June 21, 2026',
    start_time: '2:00 PM',
    end_time: '11:00 PM',
    location: 'Central Park, New York City',
    category: 'Concert',
    price: '$49',
    ticket_price: 49,
    total_tickets: 5000,
    available_tickets: 3420,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop',
    organizer: 'Eventra Productions',
    tags: ['Music', 'Outdoor', 'Festival', 'Summer'],
  }

  const title = e.title || e.name || 'Event Details'
  const date = e.date || e.start_date || 'TBD'
  const location = e.location || e.venue || 'TBD'
  const price = e.price || (e.ticket_price ? `$${e.ticket_price}` : 'Free')
  const image = e.image || e.image_url || e.cover_image || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop'
  const category = e.category || e.type || 'Event'
  const description = e.description || 'No description available.'
  const totalTickets = e.total_tickets || e.capacity || 0
  const availableTickets = e.available_tickets || e.remaining_tickets || 0
  const soldPercentage = totalTickets > 0 ? Math.round(((totalTickets - availableTickets) / totalTickets) * 100) : 0

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setPurchasing(true)
    try {
      // Create an order for this event via the orders endpoint
      await api.post('/orders', { event_id: id })
      alert('Ticket purchased successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to purchase ticket. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/events" className="hover:text-primary-600">Events</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium truncate">{title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/events" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={image}
                alt={title}
                className="h-64 w-full object-cover sm:h-80 lg:h-96"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-flex rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                  {category}
                </span>
                <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{title}</h1>
              </div>
            </div>

            {/* Details */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900">About This Event</h2>
              <div className="mt-4 whitespace-pre-line text-gray-600 leading-relaxed">
                {description}
              </div>
            </div>

            {/* Event Info Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="card p-4 text-center">
                <CalendarDays className="mx-auto h-6 w-6 text-primary-500" />
                <p className="mt-2 text-xs font-medium text-gray-500">Date</p>
                <p className="text-sm font-semibold text-gray-900">{date}</p>
              </div>
              <div className="card p-4 text-center">
                <Clock className="mx-auto h-6 w-6 text-primary-500" />
                <p className="mt-2 text-xs font-medium text-gray-500">Time</p>
                <p className="text-sm font-semibold text-gray-900">{e.start_time || 'TBD'} - {e.end_time || ''}</p>
              </div>
              <div className="card p-4 text-center">
                <MapPin className="mx-auto h-6 w-6 text-primary-500" />
                <p className="mt-2 text-xs font-medium text-gray-500">Location</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{location}</p>
              </div>
              <div className="card p-4 text-center">
                <Users className="mx-auto h-6 w-6 text-primary-500" />
                <p className="mt-2 text-xs font-medium text-gray-500">Capacity</p>
                <p className="text-sm font-semibold text-gray-900">{totalTickets > 0 ? `${totalTickets} spots` : 'Unlimited'}</p>
              </div>
            </div>

            {/* Tags */}
            {e.tags && e.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                {e.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Ticket Purchase */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price Card */}
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Ticket Price</h3>
                  <div className="flex gap-2">
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-primary-600">{price}</span>
                  {e.ticket_price && <span className="text-sm text-gray-500 ml-1">per person</span>}
                </div>

                {/* Ticket availability bar */}
                {totalTickets > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{soldPercentage}% sold</span>
                      <span className="font-medium text-gray-700">{availableTickets} left</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-primary-500 transition-all"
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="btn-primary mt-6 w-full !py-3.5 text-base disabled:opacity-60"
                >
                  <Ticket className="mr-2 h-5 w-5" />
                  {purchasing ? 'Processing...' : isAuthenticated ? 'Buy Ticket Now' : 'Sign In to Buy'}
                </button>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="h-4 w-4 text-green-500" />
                  Secure checkout · Instant confirmation
                </div>
              </div>

              {/* Organizer */}
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-gray-900">Organized by</h3>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-bold">
                    {(e.organizer || 'E')[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{e.organizer || 'Eventra Team'}</p>
                    <p className="text-sm text-gray-500">Event Organizer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
