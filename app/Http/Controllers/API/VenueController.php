<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Venue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    /**
     * List venues for a tenant.
     */
    public function index(Request $request, Tenant $tenant): JsonResponse
    {
        $venues = $tenant->venues()
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->when($request->filled('city'), fn($q) => $q->where('city', $request->city))
            ->when($request->filled('country'), fn($q) => $q->where('country', $request->country))
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $venues,
            'message' => 'Venues retrieved',
        ]);
    }

    /**
     * Create a venue.
     */
    public function store(Request $request, Tenant $tenant): JsonResponse
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'slug'      => 'required|string|max:255|unique:venues,slug',
            'address'   => 'nullable|string|max:500',
            'city'      => 'nullable|string|max:255',
            'state'     => 'nullable|string|max:255',
            'country'   => 'nullable|string|max:255',
            'latitude'  => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'capacity'  => 'nullable|integer|min:0',
            'settings'  => 'nullable|array',
        ]);

        $validated['tenant_id'] = $tenant->id;

        $venue = Venue::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $venue,
            'message' => 'Venue created',
        ], 201);
    }

    /**
     * Show a venue.
     */
    public function show(Tenant $tenant, Venue $venue): JsonResponse
    {
        $venue->load('tenant');

        return response()->json([
            'success' => true,
            'data'    => $venue,
            'message' => 'Venue retrieved',
        ]);
    }

    /**
     * Update a venue.
     */
    public function update(Request $request, Tenant $tenant, Venue $venue): JsonResponse
    {
        $validated = $request->validate([
            'name'      => 'sometimes|string|max:255',
            'slug'      => 'sometimes|string|max:255|unique:venues,slug,' . $venue->id,
            'address'   => 'nullable|string|max:500',
            'city'      => 'nullable|string|max:255',
            'state'     => 'nullable|string|max:255',
            'country'   => 'nullable|string|max:255',
            'latitude'  => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'capacity'  => 'nullable|integer|min:0',
            'settings'  => 'nullable|array',
        ]);

        $venue->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $venue->fresh(),
            'message' => 'Venue updated',
        ]);
    }

    /**
     * Delete a venue.
     */
    public function destroy(Tenant $tenant, Venue $venue): JsonResponse
    {
        $venue->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Venue deleted',
        ]);
    }
}
