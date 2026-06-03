import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Menu,
  X,
  Ticket,
  LayoutDashboard,
  LogIn,
  LogOut,
  CalendarDays,
  ChevronDown,
  ShieldCheck,
  Users,
  ShoppingCart,
  MapPin,
  DollarSign,
  Palette,
} from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false)
  const location = useLocation()
  const dropdownRef = useRef(null)

  useEffect(() => {
    setOpen(false)
    setAdminOpen(false)
    setMobileAdminOpen(false)
  }, [location])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAdminOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navLink = (to, label, icon) => {
    const active = location.pathname === to
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          active
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        {icon}
        {label}
      </Link>
    )
  }

  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            Event<span className="text-primary-600">ra</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLink('/events', 'Events', <CalendarDays className="h-4 w-4" />)}
          {isAuthenticated ? (
            <>
              {navLink('/dashboard', 'Dashboard', <LayoutDashboard className="h-4 w-4" />)}

              {/* Admin Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isAdminPage
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
                </button>
                {adminOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Management
                    </div>
                    {[
                      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
                      { to: '/admin/events', icon: CalendarDays, label: 'Events' },
                      { to: '/admin/sellers', icon: Users, label: 'Sellers' },
                      { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
                      { to: '/admin/venues', icon: MapPin, label: 'Venues' },
                      { to: '/admin/settlements', icon: DollarSign, label: 'Settlements' },
                      { to: '/admin/branding', icon: Palette, label: 'Branding' },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                          location.pathname === item.to
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="h-4 w-4 text-gray-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="ml-3 flex items-center gap-3 border-l border-gray-200 pl-3">
                <span className="text-sm text-gray-500">
                  Hi, <span className="font-medium text-gray-700">{user?.name || 'User'}</span>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="ml-3 flex items-center gap-2 border-l border-gray-200 pl-3">
              <Link to="/login" className="btn-secondary !py-2 !px-4">
                <LogIn className="mr-1.5 h-4 w-4" />
                Sign In
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-4">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {navLink('/events', 'Events', <CalendarDays className="h-4 w-4" />)}
            {isAuthenticated ? (
              <>
                {navLink('/dashboard', 'Dashboard', <LayoutDashboard className="h-4 w-4" />)}

                {/* Mobile Admin Section */}
                <button
                  onClick={() => setMobileAdminOpen(!mobileAdminOpen)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isAdminPage
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileAdminOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileAdminOpen && (
                  <div className="ml-4 flex flex-col gap-0.5 border-l-2 border-primary-100 pl-3">
                    {[
                      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
                      { to: '/admin/events', icon: CalendarDays, label: 'Events' },
                      { to: '/admin/sellers', icon: Users, label: 'Sellers' },
                      { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
                      { to: '/admin/venues', icon: MapPin, label: 'Venues' },
                      { to: '/admin/settlements', icon: DollarSign, label: 'Settlements' },
                      { to: '/admin/branding', icon: Palette, label: 'Branding' },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                          location.pathname === item.to
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="h-4 w-4 text-gray-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary mt-2 !py-2">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary mt-1 !py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
