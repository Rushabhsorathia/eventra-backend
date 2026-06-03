<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Entitlement;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PassType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * List orders, filterable by user, tenant, or seller.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['items', 'user', 'seller']);

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }

        if ($request->filled('seller_id')) {
            $query->where('seller_id', $request->seller_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $orders,
            'message' => 'Orders retrieved',
        ]);
    }

    /**
     * Create an order with items, calculate totals, validate availability,
     * decrement inventory, and create entitlements for paid orders.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tenant_id'        => 'required|exists:tenants,id',
            'seller_id'        => 'nullable|exists:sellers,id',
            'currency'         => 'nullable|string|max:3',
            'payment_gateway'  => 'nullable|string|max:50',
            'payment_ref'      => 'nullable|string|max:255',
            'metadata'         => 'nullable|array',
            'coupon_code'      => 'nullable|string|max:50',
            'items'            => 'required|array|min:1',
            'items.*.pass_type_id'  => 'required|exists:pass_types,id',
            'items.*.occurrence_id' => 'nullable|exists:occurrences,id',
            'items.*.quantity'      => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $subtotal = 0;
            $orderItems = [];

            // Validate each item and calculate subtotal
            foreach ($validated['items'] as $item) {
                $passType = PassType::lockForUpdate()->findOrFail($item['pass_type_id']);

                $available = $passType->inventory_total
                    - $passType->inventory_reserved
                    - $passType->inventory_sold;

                if ($available < $item['quantity']) {
                    return response()->json([
                        'success' => false,
                        'data'    => ['pass_type_id' => $passType->id, 'available' => $available],
                        'message' => "Insufficient inventory for pass type: {$passType->name}",
                    ], 422);
                }

                // Validate min/max per order
                if ($passType->min_per_order && $item['quantity'] < $passType->min_per_order) {
                    return response()->json([
                        'success' => false,
                        'data'    => null,
                        'message' => "Minimum {$passType->min_per_order} tickets required for {$passType->name}",
                    ], 422);
                }

                if ($passType->max_per_order && $item['quantity'] > $passType->max_per_order) {
                    return response()->json([
                        'success' => false,
                        'data'    => null,
                        'message' => "Maximum {$passType->max_per_order} tickets allowed for {$passType->name}",
                    ], 422);
                }

                $unitPrice = $passType->price;
                $total = $unitPrice * $item['quantity'];
                $subtotal += $total;

                $orderItems[] = [
                    'pass_type_id'  => $passType->id,
                    'occurrence_id' => $item['occurrence_id'] ?? null,
                    'quantity'      => $item['quantity'],
                    'unit_price'    => $unitPrice,
                    'total'         => $total,
                ];

                // Decrement inventory
                $passType->increment('inventory_sold', $item['quantity']);
            }

            // Calculate discount from coupon
            $discount = 0;
            if (!empty($validated['coupon_code'])) {
                $coupon = \App\Models\Coupon::where('code', $validated['coupon_code'])
                    ->where('status', 'active')
                    ->first();

                if ($coupon && now()->between($coupon->valid_from, $coupon->valid_to)) {
                    if ($coupon->max_uses === null || $coupon->used_count < $coupon->max_uses) {
                        if ($coupon->min_order_amount === null || $subtotal >= $coupon->min_order_amount) {
                            if ($coupon->type === 'percentage') {
                                $discount = (int) round($subtotal * ($coupon->value / 100));
                            } else {
                                $discount = min($coupon->value, $subtotal);
                            }
                            $coupon->increment('used_count');
                        }
                    }
                }
            }

            $tax = 0; // Tax calculation placeholder
            $total = $subtotal - $discount + $tax;

            // Create order
            $order = Order::create([
                'tenant_id'       => $validated['tenant_id'],
                'seller_id'       => $validated['seller_id'] ?? null,
                'user_id'         => $request->user()->id,
                'order_number'    => 'ORD-' . strtoupper(Str::random(10)),
                'status'          => 'paid',
                'subtotal'        => $subtotal,
                'discount'        => $discount,
                'tax'             => $tax,
                'total'           => $total,
                'currency'        => $validated['currency'] ?? 'USD',
                'payment_gateway' => $validated['payment_gateway'] ?? null,
                'payment_ref'     => $validated['payment_ref'] ?? null,
                'paid_at'         => now(),
                'metadata'        => $validated['metadata'] ?? null,
            ]);

            // Create order items and entitlements
            foreach ($orderItems as $itemData) {
                $orderItem = $order->items()->create($itemData);

                // Create entitlements for paid orders (one per quantity)
                for ($i = 0; $i < $itemData['quantity']; $i++) {
                    $passType = PassType::find($itemData['pass_type_id']);

                    Entitlement::create([
                        'order_item_id'  => $orderItem->id,
                        'pass_type_id'   => $itemData['pass_type_id'],
                        'occurrence_id'  => $itemData['occurrence_id'],
                        'valid_from'     => $passType->sales_window_start ?? now(),
                        'valid_to'       => $passType->sales_window_end ?? now()->addYear(),
                        'max_uses'       => 1,
                        'uses_remaining' => 1,
                        'reentry_allowed' => false,
                        'access_level'   => $passType->access_level ?? 'general',
                        'allowed_zone_ids' => $passType->allowed_zone_ids,
                        'state'          => 'valid',
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'data'    => $order->load(['items.passType', 'items.entitlements']),
                'message' => 'Order created',
            ], 201);
        });
    }

    /**
     * Show an order.
     */
    public function show(Order $order): JsonResponse
    {
        $order->load(['items.passType', 'items.entitlements', 'user', 'seller', 'tenant']);

        return response()->json([
            'success' => true,
            'data'    => $order,
            'message' => 'Order retrieved',
        ]);
    }

    /**
     * Refund an order — restore inventory and revoke entitlements.
     */
    public function refund(Order $order): JsonResponse
    {
        if ($order->status === 'refunded') {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Order is already refunded',
            ], 422);
        }

        return DB::transaction(function () use ($order) {
            // Restore inventory for each item
            foreach ($order->items as $item) {
                $passType = PassType::lockForUpdate()->find($item->pass_type_id);
                if ($passType) {
                    $passType->decrement('inventory_sold', $item->quantity);
                }

                // Revoke entitlements
                foreach ($item->entitlements as $entitlement) {
                    $entitlement->update(['state' => 'revoked']);
                }
            }

            $order->update(['status' => 'refunded']);

            return response()->json([
                'success' => true,
                'data'    => $order->fresh()->load(['items.passType', 'items.entitlements']),
                'message' => 'Order refunded',
            ]);
        });
    }
}
