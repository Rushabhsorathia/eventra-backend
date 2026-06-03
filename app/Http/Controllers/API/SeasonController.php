<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Season;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeasonController extends Controller
{
    /**
     * List seasons.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Season::with('occurrences');

        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }

        if ($request->filled('seller_id')) {
            $query->where('seller_id', $request->seller_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $seasons = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $seasons,
            'message' => 'Seasons retrieved',
        ]);
    }

    /**
     * Create a season.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tenant_id'     => 'required|exists:tenants,id',
            'seller_id'     => 'nullable|exists:sellers,id',
            'name'          => 'required|string|max:255',
            'slug'          => 'required|string|max:255|unique:seasons,slug',
            'description'   => 'nullable|string',
            'window_start'  => 'nullable|date',
            'window_end'    => 'nullable|date|after_or_equal:window_start',
            'blackout_dates' => 'nullable|array',
            'status'        => 'nullable|string|max:50',
        ]);

        $season = Season::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $season->load('occurrences'),
            'message' => 'Season created',
        ], 201);
    }

    /**
     * Show a season.
     */
    public function show(Season $season): JsonResponse
    {
        $season->load('occurrences', 'tenant', 'seller');

        return response()->json([
            'success' => true,
            'data'    => $season,
            'message' => 'Season retrieved',
        ]);
    }

    /**
     * Update a season.
     */
    public function update(Request $request, Season $season): JsonResponse
    {
        $validated = $request->validate([
            'tenant_id'     => 'sometimes|exists:tenants,id',
            'seller_id'     => 'nullable|exists:sellers,id',
            'name'          => 'sometimes|string|max:255',
            'slug'          => 'sometimes|string|max:255|unique:seasons,slug,' . $season->id,
            'description'   => 'nullable|string',
            'window_start'  => 'nullable|date',
            'window_end'    => 'nullable|date|after_or_equal:window_start',
            'blackout_dates' => 'nullable|array',
            'status'        => 'nullable|string|max:50',
        ]);

        $season->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $season->fresh()->load('occurrences'),
            'message' => 'Season updated',
        ]);
    }

    /**
     * Delete a season.
     */
    public function destroy(Season $season): JsonResponse
    {
        $season->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Season deleted',
        ]);
    }
}
