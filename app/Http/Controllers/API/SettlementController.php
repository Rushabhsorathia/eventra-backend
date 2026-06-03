<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Settlement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettlementController extends Controller
{
    /**
     * List settlements, filterable by tenant or seller.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Settlement::with(['tenant', 'seller', 'approver']);

        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }

        if ($request->filled('seller_id')) {
            $query->where('seller_id', $request->seller_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $settlements = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $settlements,
            'message' => 'Settlements retrieved',
        ]);
    }

    /**
     * Show a settlement.
     */
    public function show(Settlement $settlement): JsonResponse
    {
        $settlement->load(['tenant', 'seller', 'approver']);

        return response()->json([
            'success' => true,
            'data'    => $settlement,
            'message' => 'Settlement retrieved',
        ]);
    }

    /**
     * Approve a settlement.
     */
    public function approve(Request $request, Settlement $settlement): JsonResponse
    {
        if ($settlement->status === 'approved') {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Settlement is already approved',
            ], 422);
        }

        if ($settlement->status === 'paid') {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Settlement is already paid',
            ], 422);
        }

        $settlement->update([
            'status'      => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data'    => $settlement->fresh()->load(['tenant', 'seller', 'approver']),
            'message' => 'Settlement approved',
        ]);
    }
}
