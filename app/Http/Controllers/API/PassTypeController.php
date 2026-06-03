<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\PassType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PassTypeController extends Controller
{
    /**
     * List pass types, filterable by event_id or season_id.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PassType::query();

        if ($request->filled('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->filled('season_id')) {
            $query->where('season_id', $request->season_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('kind')) {
            $query->where('kind', $request->kind);
        }

        $passTypes = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        // Append computed inventory_available
        $passTypes->through(fn($pt) => $pt->setAttribute(
            'inventory_available',
            $pt->inventory_total - $pt->inventory_reserved - $pt->inventory_sold
        ));

        return response()->json([
            'success' => true,
            'data'    => $passTypes,
            'message' => 'Pass types retrieved',
        ]);
    }

    /**
     * Create a pass type.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_id'            => 'nullable|exists:events,id',
            'season_id'           => 'nullable|exists:seasons,id',
            'kind'                => 'nullable|string|max:50',
            'name'                => 'required|string|max:255',
            'description'         => 'nullable|string',
            'price'               => 'required|integer|min:0',
            'currency'            => 'nullable|string|max:3',
            'inventory_total'     => 'required|integer|min:0',
            'inventory_reserved'  => 'nullable|integer|min:0',
            'inventory_sold'      => 'nullable|integer|min:0',
            'sales_window_start'  => 'nullable|date',
            'sales_window_end'    => 'nullable|date|after_or_equal:sales_window_start',
            'validity_rules'      => 'nullable|array',
            'scan_policy'         => 'nullable|array',
            'access_level'        => 'nullable|string|max:50',
            'allowed_zone_ids'    => 'nullable|array',
            'min_per_order'       => 'nullable|integer|min:1',
            'max_per_order'       => 'nullable|integer|min:1',
            'status'              => 'nullable|string|max:50',
        ]);

        $validated['inventory_reserved'] = $validated['inventory_reserved'] ?? 0;
        $validated['inventory_sold'] = $validated['inventory_sold'] ?? 0;

        $passType = PassType::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $passType,
            'message' => 'Pass type created',
        ], 201);
    }

    /**
     * Show a pass type with inventory check.
     */
    public function show(PassType $passType): JsonResponse
    {
        $passType->load(['event', 'season']);
        $passType->inventory_available = $passType->inventory_total
            - $passType->inventory_reserved
            - $passType->inventory_sold;

        return response()->json([
            'success' => true,
            'data'    => $passType,
            'message' => 'Pass type retrieved',
        ]);
    }

    /**
     * Update a pass type.
     */
    public function update(Request $request, PassType $passType): JsonResponse
    {
        $validated = $request->validate([
            'event_id'            => 'nullable|exists:events,id',
            'season_id'           => 'nullable|exists:seasons,id',
            'kind'                => 'nullable|string|max:50',
            'name'                => 'sometimes|string|max:255',
            'description'         => 'nullable|string',
            'price'               => 'sometimes|integer|min:0',
            'currency'            => 'nullable|string|max:3',
            'inventory_total'     => 'sometimes|integer|min:0',
            'inventory_reserved'  => 'nullable|integer|min:0',
            'inventory_sold'      => 'nullable|integer|min:0',
            'sales_window_start'  => 'nullable|date',
            'sales_window_end'    => 'nullable|date|after_or_equal:sales_window_start',
            'validity_rules'      => 'nullable|array',
            'scan_policy'         => 'nullable|array',
            'access_level'        => 'nullable|string|max:50',
            'allowed_zone_ids'    => 'nullable|array',
            'min_per_order'       => 'nullable|integer|min:1',
            'max_per_order'       => 'nullable|integer|min:1',
            'status'              => 'nullable|string|max:50',
        ]);

        $passType->update($validated);

        $passType->inventory_available = $passType->inventory_total
            - $passType->inventory_reserved
            - $passType->inventory_sold;

        return response()->json([
            'success' => true,
            'data'    => $passType->fresh(),
            'message' => 'Pass type updated',
        ]);
    }

    /**
     * Delete a pass type.
     */
    public function destroy(PassType $passType): JsonResponse
    {
        $passType->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Pass type deleted',
        ]);
    }
}
