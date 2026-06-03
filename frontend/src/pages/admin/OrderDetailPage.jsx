import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../api/axios'
import {
  ArrowLeft,
  ShoppingCart,
  User,
  CalendarDays,
  DollarSign,
  CreditCard,
  QrCode,
  RotateCcw,
  CheckCircle2,
  Package,
  Mail,
} from 'lucide-react'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refunding, setRefunding] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/orders/${id}`)
        setOrder(res.data.data ?? null)
      } catch {
        // empty
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleRefund = async () => {
    if (!confirm('Are you sure you want to refund this order?')) return
    setRefunding(true)
    try {
      await api.post(`/orders/${id}/refund`)
      const res = await api.get(`/orders/${id}`)
      setOrder(res.data.data ?? null)
    } catch {
      // error
    } finally {
      setRefunding(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-900">Order not found</h2>
        <Link to="/admin/orders" className="mt-4 inline-block text-primary-600 hover:underline">Back to Orders</Link>
      </div>
    )
  }

  const StatusBadge = ({ status }) => {
    const s = (status ?? 'pending').toLowerCase()
    const map = {
      pending: 'bg-amber-50 text-amber-700',
      paid: 'bg-emerald-50 text-emerald-700',
      completed: 'bg-blue-50 text-blue-700',
      cancelled: 'bg-red-50 text-red-700',
      refunded: 'bg-gray-100 text-gray-600',
    }
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${map[s] ?? map.pending}`}>
        {s}
      </span>
    )
  }

  const items = order.items ?? order.order_items ?? []
  const entitlements = order.entitlements ?? order.tickets ?? []
  const payment = order.payment ?? order.payment_info ?? {}

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link to="/admin/orders" className="mb-3 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number ?? order.id}</h1>
            <p className="mt-1 text-sm text-gray-500">Placed on {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="space-y-6">
        {/* Customer & Order Info */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="card p-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <User className="h-4 w-4 text-gray-400" /> Customer
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{order.customer?.name ?? order.customer_name ?? '—'}</span></p>
              <p><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-900">{order.customer?.email ?? order.customer_email ?? '—'}</span></p>
              <p><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{order.customer?.phone ?? '—'}</span></p>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <CreditCard className="h-4 w-4 text-gray-400" /> Payment
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Method:</span> <span className="font-medium text-gray-900">{payment.method ?? order.payment_method ?? '—'}</span></p>
              <p><span className="text-gray-500">Reference:</span> <span className="font-medium text-gray-900">{payment.reference ?? payment.transaction_id ?? '—'}</span></p>
              <p>
                <span className="text-gray-500">Total:</span>{' '}
                <span className="text-lg font-bold text-primary-600">
                  ${Number(order.total ?? order.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="card overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Package className="h-4 w-4 text-gray-400" /> Order Items
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-600">Item</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Qty</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Price</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No items</td></tr>
                ) : items.map((item, i) => (
                  <tr key={i}>
                    <td className="px-6 py-3 font-medium text-gray-900">{item.name ?? item.pass_type?.name ?? `Item ${i + 1}`}</td>
                    <td className="px-6 py-3 text-gray-600">{item.quantity ?? 1}</td>
                    <td className="px-6 py-3 text-gray-600">${Number(item.price ?? item.unit_price ?? 0).toFixed(2)}</td>
                    <td className="px-6 py-3 font-semibold text-gray-900">${Number(item.subtotal ?? (item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Entitlements / Tickets */}
        <div className="card overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <QrCode className="h-4 w-4 text-gray-400" /> Tickets / Entitlements
            </h3>
          </div>
          {entitlements.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-400">No tickets issued yet</div>
          ) : (
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {entitlements.map((ent, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{ent.name ?? ent.ticket_type ?? `Ticket ${i + 1}`}</p>
                    <p className="text-xs text-gray-400">Code: {ent.code ?? ent.qr_code ?? ent.id ?? '—'}</p>
                  </div>
                  <StatusBadge status={ent.status ?? 'valid'} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refund Button */}
        {(order.status ?? '').toLowerCase() !== 'refunded' && (order.status ?? '').toLowerCase() !== 'cancelled' && (
          <div className="flex justify-end">
            <button
              onClick={handleRefund}
              disabled={refunding}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" /> {refunding ? 'Processing...' : 'Issue Refund'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
