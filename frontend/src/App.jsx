import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import TenantDashboard from './pages/admin/TenantDashboard'
import SellersPage from './pages/admin/SellersPage'
import EventsAdminPage from './pages/admin/EventsAdminPage'
import EventFormPage from './pages/admin/EventFormPage'
import PassTypesPage from './pages/admin/PassTypesPage'
import OrdersPage from './pages/admin/OrdersPage'
import OrderDetailPage from './pages/admin/OrderDetailPage'
import VenuesPage from './pages/admin/VenuesPage'
import SettlementsPage from './pages/admin/SettlementsPage'
import BrandingPage from './pages/admin/BrandingPage'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/admin" element={<TenantDashboard />} />
          <Route path="/admin/sellers" element={<SellersPage />} />
          <Route path="/admin/events" element={<EventsAdminPage />} />
          <Route path="/admin/events/new" element={<EventFormPage />} />
          <Route path="/admin/events/:id/edit" element={<EventFormPage />} />
          <Route path="/admin/events/:id/passes" element={<PassTypesPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/orders/:id" element={<OrderDetailPage />} />
          <Route path="/admin/venues" element={<VenuesPage />} />
          <Route path="/admin/settlements" element={<SettlementsPage />} />
          <Route path="/admin/branding" element={<BrandingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
