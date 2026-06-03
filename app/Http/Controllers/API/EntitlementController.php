<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Entitlement;
use App\Models\EntitlementUsage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EntitlementController extends Controller
{
    /**
     * List entitlements.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Entitlement::with(['passType', 'occurrence', 'orderItem.order']);

        if ($request->filled('order_item_id')) {
            $query->where('order_item_id', $request->order_item_id);
        }

        if ($request->filled('pass_type_id')) {
            $query->where('pass_type_id', $request->pass_type_id);
        }

        if ($request->filled('occurrence_id')) {
            $query->where('occurrence_id', $request->occurrence_id);
        }

        if ($request->filled('state')) {
            $query->where('state', $request->state);
        }

        $entitlements = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $entitlements,
            'message' => 'Entitlements retrieved',
        ]);
    }

    /**
     * Show an entitlement.
     */
    public function show(Entitlement $entitlement): JsonResponse
    {
        $entitlement->load(['passType', 'occurrence', 'orderItem.order', 'credentials', 'usages']);

        return response()->json([
            'success' => true,
            'data'    => $entitlement,
            'message' => 'Entitlement retrieved',
        ]);
    }

    /**
     * Verify an entitlement for gate scanning.
     */
    public function verify(Request $request, Entitlement $entitlement): JsonResponse
    {
        $entitlement->load(['passType', 'occurrence', 'credentials']);

        $now = now();

        // Check state
        if ($entitlement->state !== 'valid') {
            return response()->json([
                'success' => false,
                'data'    => ['entitlement_id' => $entitlement->id, 'state' => $entitlement->state],
                'message' => 'Entitlement is not valid (state: ' . $entitlement->state . ')',
            ], 422);
        }

        // Check validity window
        if ($entitlement->valid_from && $now->lt($entitlement->valid_from)) {
            return response()->json([
                'success' => false,
                'data'    => ['entitlement_id' => $entitlement->id, 'valid_from' => $entitlement->valid_from],
                'message' => 'Entitlement is not yet valid',
            ], 422);
        }

        if ($entitlement->valid_to && $now->gt($entitlement->valid_to)) {
            return response()->json([
                'success' => false,
                'data'    => ['entitlement_id' => $entitlement->id, 'valid_to' => $entitlement->valid_to],
                'message' => 'Entitlement has expired',
            ], 422);
        }

        // Check remaining uses
        if ($entitlement->uses_remaining <= 0) {
            return response()->json([
                'success' => false,
                'data'    => ['entitlement_id' => $entitlement->id, 'uses_remaining' => 0],
                'message' => 'No uses remaining',
            ], 422);
        }

        // Check blackout dates
        if ($entitlement->blackout_dates) {
            $today = $now->toDateString();
            if (in_array($today, $entitlement->blackout_dates)) {
                return response()->json([
                    'success' => false,
                    'data'    => ['entitlement_id' => $entitlement->id, 'blackout_date' => $today],
                    'message' => 'Entitlement cannot be used today (blackout date)',
                ], 422);
            }
        }

        // Record usage
        EntitlementUsage::create([
            'entitlement_id' => $entitlement->id,
            'scanned_at'      => $now,
            'gate_device_id' => $request->input('gate_device_id'),
            'result'         => 'granted',
        ]);

        // Decrement remaining uses
        $entitlement->decrement('uses_remaining');

        return response()->json([
            'success' => true,
            'data'    => [
                'entitlement_id' => $entitlement->id,
                'state'          => 'valid',
                'access_level'   => $entitlement->access_level,
                'allowed_zone_ids' => $entitlement->allowed_zone_ids,
                'uses_remaining' => $entitlement->fresh()->uses_remaining,
                'pass_type'      => $entitlement->passType?->name,
                'occurrence'     => $entitlement->occurrence?->id,
            ],
            'message' => 'Entitlement verified — access granted',
        ]);
    }
}
