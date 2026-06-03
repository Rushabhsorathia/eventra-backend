import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Music,
  Users,
  Sparkles,
  Ticket,
  Trophy,
  Mic2,
  Palette,
  GraduationCap,
  Star,
} from 'lucide-react'

const featuredEvents = [
  {
    id: 1,
    title: 'Summer Music Festival 2026',
    date: 'Jun 21, 2026',
    location: 'Central Park, NYC',
    price: '$49',
    category: 'Concert',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Tech Innovation Summit',
    date: 'Jul 10, 2026',
    location: 'Moscone Center, SF',
    price: '$199',
    category: 'Conference',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Creative Arts Workshop',
    date: 'Jul 15, 2026',
    location: 'Art District, LA',
    price: '$35',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop',
  },
]

const categories = [
  { name: 'Concerts', icon: Music, count: '120+', color: 'bg-purple-100 text-purple-600' },
  { name: 'Conferences', icon: Mic2, count: '85+', color: 'bg-blue-100 text-blue-600' },
  { name: 'Workshops', icon: Palette, count: '200+', color: 'bg-pink-100 text-pink-600' },
  { name: 'Sports', icon: Trophy, count: '65+', color: 'bg-green-100 text-green-600' },
  { name: 'Networking', icon: Users, count: '90+', color: 'bg-amber-100 text-amber-600' },
  { name: 'Education', icon: GraduationCap, count: '150+', color: 'bg-indigo-100 text-indigo-600' },
]

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-primary-200 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Discover Amazing Events Near You
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Next{' '}
              <span className="bg-gradient-to-r from-primary-200 to-accent-300 bg-clip-text text-transparent">
                Unforgettable
              </span>{' '}
              Experience Awaits
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-100">
              Browse, book, and manage tickets for the hottest concerts, conferences, workshops, and more — all in one place.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/events" className="btn-primary !bg-white !text-primary-700 hover:!bg-primary-50 !px-8 !py-4 !text-base">
                Explore Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors">
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 md:grid-cols-4 lg:px-8">
            {[
              ['10K+', 'Events Hosted'],
              ['500K+', 'Tickets Sold'],
              ['50K+', 'Happy Users'],
              ['100+', 'Cities'],
            ].map(([val, label], i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white">{val}</div>
                <div className="text-sm text-primary-200">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
          <p className="mt-3 text-gray-500">Don't miss out on these trending experiences</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`} className="card group overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                  {event.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {event.title}
                </h3>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" /> {event.date}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" /> {event.location}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-lg font-bold text-primary-600">{event.price}</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:underline">
                    View Details <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/events" className="btn-primary">
            View All Events <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="mt-3 text-gray-500">Find exactly what you're looking for</p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map(({ name, icon: Icon, count, color }) => (
              <Link
                key={name}
                to="/events"
                className="card flex flex-col items-center gap-3 p-6 text-center hover:border-primary-200"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-500">{count} events</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Ticket className="mx-auto h-12 w-12 text-primary-200" />
          <h2 className="mt-6 text-3xl font-bold text-white">Ready to Host Your Own Event?</h2>
          <p className="mt-4 text-lg text-primary-100">
            Create and manage events with powerful tools. Reach thousands of attendees.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/register" className="btn-primary !bg-white !text-primary-700 hover:!bg-primary-50">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">What People Say</h2>
            <p className="mt-3 text-gray-500">Trusted by thousands of event-goers</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { name: 'Sarah M.', text: 'Best platform for discovering local events. The booking process is seamless!', rating: 5 },
              { name: 'James K.', text: 'I use Eventra for all my conference bookings. The dashboard makes tracking everything easy.', rating: 5 },
              { name: 'Priya R.', text: 'Found amazing workshops near me. Love the clean interface and fast checkout.', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-gray-600 leading-relaxed">"{t.text}"</p>
                <p className="mt-4 font-semibold text-gray-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
