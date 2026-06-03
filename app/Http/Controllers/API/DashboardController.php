<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics, filterable by tenant or seller.
     */
    public function stats(Request $request): JsonResponse
    {
        $tenantId = $request->input('tenant_id');
        $sellerId = $request->input('seller_id');

        // Total events
        $eventQuery = Event::query();
        if ($tenantId) {
            $eventQuery->where('tenant_id', $tenantId);
        }
        if ($sellerId) {
            $eventQuery->where('seller_id', $sellerId);
        }
        $totalEvents = $eventQuery->count();

        // Total orders
        $orderQuery = Order::query();
        if ($tenantId) {
            $orderQuery->where('tenant_id', $tenantId);
        }
        if ($sellerId) {
            $orderQuery->where('seller_id', $sellerId);
        }
        $totalOrders = (clone $orderQuery)->count();

        // Total revenue (from paid orders only)
        $totalRevenue = (clone $orderQuery)
            ->where('status', '!=', 'refunded')
            ->sum('total');

        // Tickets sold
        $ticketsSold = OrderItem::whereHas('order', function ($q) use ($tenantId, $sellerId) {
            $q->where('status', '!=', 'refunded');
            if ($tenantId) {
                $q->where('tenant_id', $tenantId);
            }
            if ($sellerId) {
                $q->where('seller_id', $sellerId);
            }
        })->sum('quantity');

        // Recent orders (last 10)
        $recentOrders = (clone $orderQuery)
            ->with(['user', 'seller'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Upcoming events (next 10)
        $upcomingEventQuery = Event::query();
        if ($tenantId) {
            $upcomingEventQuery->where('tenant_id', $tenantId);
        }
        if ($sellerId) {
            $upcomingEventQuery->where('seller_id', $sellerId);
        }
        $upcomingEvents = $upcomingEventQuery
            ->where('starts_at', '>=', now())
            ->where('status', 'published')
            ->orderBy('starts_at', 'asc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'total_events'   => $totalEvents,
                'total_orders'   => $totalOrders,
                'total_revenue'  => $totalRevenue,
                'tickets_sold'   => $ticketsSold,
                'recent_orders'  => $recentOrders,
                'upcoming_events' => $upcomingEvents,
            ],
            'message' => 'Dashboard stats retrieved',
        ]);
    }
}
