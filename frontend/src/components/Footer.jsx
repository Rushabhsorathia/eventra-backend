import { Link } from 'react-router-dom'
import { Ticket, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Event<span className="text-primary-400">ra</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Discover, create, and manage events effortlessly. Your gateway to unforgettable experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/events" className="text-sm hover:text-primary-400 transition-colors">Browse Events</Link></li>
              <li><Link to="/dashboard" className="text-sm hover:text-primary-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/login" className="text-sm hover:text-primary-400 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="text-sm hover:text-primary-400 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Categories</h3>
            <ul className="mt-4 space-y-2">
              <li><span className="text-sm text-gray-400">Concerts</span></li>
              <li><span className="text-sm text-gray-400">Conferences</span></li>
              <li><span className="text-sm text-gray-400">Workshops</span></li>
              <li><span className="text-sm text-gray-400">Sports</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" /> support@eventra.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" /> San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Eventra. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
