<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    /**
     * List all tenants (public).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tenant::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $tenants = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $tenants,
            'message' => 'Tenants retrieved',
        ]);
    }

    /**
     * Create a new tenant.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'slug'      => 'required|string|max:255|unique:tenants,slug',
            'type'      => 'nullable|string|max:50',
            'domain'    => 'nullable|string|max:255',
            'subdomain' => 'nullable|string|max:255',
            'settings'  => 'nullable|array',
        ]);

        $tenant = Tenant::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $tenant,
            'message' => 'Tenant created',
        ], 201);
    }

    /**
     * Show a single tenant.
     */
    public function show(Tenant $tenant): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $tenant,
            'message' => 'Tenant retrieved',
        ]);
    }

    /**
     * Update a tenant.
     */
    public function update(Request $request, Tenant $tenant): JsonResponse
    {
        $validated = $request->validate([
            'name'      => 'sometimes|string|max:255',
            'slug'      => 'sometimes|string|max:255|unique:tenants,slug,' . $tenant->id,
            'type'      => 'nullable|string|max:50',
            'domain'    => 'nullable|string|max:255',
            'subdomain' => 'nullable|string|max:255',
            'settings'  => 'nullable|array',
        ]);

        $tenant->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $tenant->fresh(),
            'message' => 'Tenant updated',
        ]);
    }

    /**
     * Delete a tenant.
     */
    public function destroy(Tenant $tenant): JsonResponse
    {
        $tenant->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Tenant deleted',
        ]);
    }
}
