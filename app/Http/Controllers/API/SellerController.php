<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    /**
     * List sellers for a tenant.
     */
    public function index(Request $request, Tenant $tenant): JsonResponse
    {
        $sellers = $tenant->sellers()
            ->with('members')
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->when($request->filled('kyc_status'), fn($q) => $q->where('kyc_status', $request->kyc_status))
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $sellers,
            'message' => 'Sellers retrieved',
        ]);
    }

    /**
     * Create a seller.
     */
    public function store(Request $request, Tenant $tenant): JsonResponse
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'slug'             => 'required|string|max:255|unique:sellers,slug',
            'description'      => 'nullable|string',
            'commission_terms' => 'nullable|array',
        ]);

        $validated['tenant_id'] = $tenant->id;

        $seller = Seller::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $seller->load('members'),
            'message' => 'Seller created',
        ], 201);
    }

    /**
     * Show a seller.
     */
    public function show(Tenant $tenant, Seller $seller): JsonResponse
    {
        $seller->load('members', 'tenant');

        return response()->json([
            'success' => true,
            'data'    => $seller,
            'message' => 'Seller retrieved',
        ]);
    }

    /**
     * Update a seller.
     */
    public function update(Request $request, Tenant $tenant, Seller $seller): JsonResponse
    {
        $validated = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'slug'             => 'sometimes|string|max:255|unique:sellers,slug,' . $seller->id,
            'description'      => 'nullable|string',
            'commission_terms' => 'nullable|array',
        ]);

        $seller->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $seller->fresh()->load('members'),
            'message' => 'Seller updated',
        ]);
    }

    /**
     * Delete a seller.
     */
    public function destroy(Tenant $tenant, Seller $seller): JsonResponse
    {
        $seller->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Seller deleted',
        ]);
    }
}
