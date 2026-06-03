<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * List coupons.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Coupon::with(['tenant', 'seller', 'event']);

        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }

        if ($request->filled('seller_id')) {
            $query->where('seller_id', $request->seller_id);
        }

        if ($request->filled('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $coupons = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $coupons,
            'message' => 'Coupons retrieved',
        ]);
    }

    /**
     * Create a coupon.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tenant_id'        => 'required|exists:tenants,id',
            'seller_id'        => 'nullable|exists:sellers,id',
            'event_id'         => 'nullable|exists:events,id',
            'code'             => 'required|string|max:50|unique:coupons,code',
            'type'             => 'required|in:percentage,fixed',
            'value'            => 'required|integer|min:0',
            'max_uses'         => 'nullable|integer|min:0',
            'min_order_amount' => 'nullable|integer|min:0',
            'valid_from'       => 'nullable|date',
            'valid_to'         => 'nullable|date|after_or_equal:valid_from',
            'status'           => 'nullable|string|max:50',
        ]);

        $coupon = Coupon::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $coupon->load(['tenant', 'seller', 'event']),
            'message' => 'Coupon created',
        ], 201);
    }

    /**
     * Show a coupon.
     */
    public function show(Coupon $coupon): JsonResponse
    {
        $coupon->load(['tenant', 'seller', 'event']);

        return response()->json([
            'success' => true,
            'data'    => $coupon,
            'message' => 'Coupon retrieved',
        ]);
    }

    /**
     * Update a coupon.
     */
    public function update(Request $request, Coupon $coupon): JsonResponse
    {
        $validated = $request->validate([
            'tenant_id'        => 'sometimes|exists:tenants,id',
            'seller_id'        => 'nullable|exists:sellers,id',
            'event_id'         => 'nullable|exists:events,id',
            'code'             => 'sometimes|string|max:50|unique:coupons,code,' . $coupon->id,
            'type'             => 'sometimes|in:percentage,fixed',
            'value'            => 'sometimes|integer|min:0',
            'max_uses'         => 'nullable|integer|min:0',
            'min_order_amount' => 'nullable|integer|min:0',
            'valid_from'       => 'nullable|date',
            'valid_to'         => 'nullable|date|after_or_equal:valid_from',
            'status'           => 'nullable|string|max:50',
        ]);

        $coupon->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $coupon->fresh()->load(['tenant', 'seller', 'event']),
            'message' => 'Coupon updated',
        ]);
    }

    /**
     * Delete a coupon.
     */
    public function destroy(Coupon $coupon): JsonResponse
    {
        $coupon->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Coupon deleted',
        ]);
    }

    /**
     * Validate a coupon code and return the discount details.
     */
    public function validateCoupon(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code'       => 'required|string|max:50',
            'order_total' => 'required|integer|min:0',
        ]);

        $coupon = Coupon::where('code', $validated['code'])
            ->where('status', 'active')
            ->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Invalid or inactive coupon code',
            ], 404);
        }

        $now = now();

        // Check validity window
        if ($coupon->valid_from && $now->lt($coupon->valid_from)) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Coupon is not yet active',
            ], 422);
        }

        if ($coupon->valid_to && $now->gt($coupon->valid_to)) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Coupon has expired',
            ], 422);
        }

        // Check usage limit
        if ($coupon->max_uses !== null && $coupon->used_count >= $coupon->max_uses) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Coupon usage limit reached',
            ], 422);
        }

        // Check minimum order amount
        if ($coupon->min_order_amount && $validated['order_total'] < $coupon->min_order_amount) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Order does not meet minimum amount of ' . $coupon->min_order_amount,
            ], 422);
        }

        // Calculate discount
        if ($coupon->type === 'percentage') {
            $discount = (int) round($validated['order_total'] * ($coupon->value / 100));
        } else {
            $discount = min($coupon->value, $validated['order_total']);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'coupon_id'    => $coupon->id,
                'code'         => $coupon->code,
                'type'         => $coupon->type,
                'value'        => $coupon->value,
                'discount'     => $discount,
                'new_total'    => $validated['order_total'] - $discount,
            ],
            'message' => 'Coupon is valid',
        ]);
    }
}
