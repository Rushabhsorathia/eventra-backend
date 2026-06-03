<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BrandProfile;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandProfileController extends Controller
{
    /**
     * List brand profiles for a tenant.
     */
    public function index(Request $request, Tenant $tenant): JsonResponse
    {
        $profiles = $tenant->brandProfiles()
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $profiles,
            'message' => 'Brand profiles retrieved',
        ]);
    }

    /**
     * Create a brand profile.
     */
    public function store(Request $request, Tenant $tenant): JsonResponse
    {
        $validated = $request->validate([
            'name'                     => 'required|string|max:255',
            'slug'                     => 'required|string|max:255|unique:brand_profiles,slug',
            'domain'                   => 'nullable|string|max:255',
            'logo_light_url'           => 'nullable|string|max:500',
            'logo_dark_url'            => 'nullable|string|max:500',
            'favicon_url'              => 'nullable|string|max:500',
            'color_tokens'             => 'nullable|array',
            'typography'               => 'nullable|array',
            'email_from_name'          => 'nullable|string|max:255',
            'email_header_url'         => 'nullable|string|max:500',
            'email_footer_html'        => 'nullable|string',
            'ticket_template_id'       => 'nullable|string|max:255',
            'credential_template_id'   => 'nullable|string|max:255',
            'legal_entity_name'        => 'nullable|string|max:255',
            'merchant_label'           => 'nullable|string|max:255',
            'support_email'            => 'nullable|email|max:255',
        ]);

        $validated['tenant_id'] = $tenant->id;

        $profile = BrandProfile::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $profile,
            'message' => 'Brand profile created',
        ], 201);
    }

    /**
     * Show a brand profile.
     */
    public function show(Tenant $tenant, BrandProfile $brandProfile): JsonResponse
    {
        $brandProfile->load('tenant');

        return response()->json([
            'success' => true,
            'data'    => $brandProfile,
            'message' => 'Brand profile retrieved',
        ]);
    }

    /**
     * Update a brand profile.
     */
    public function update(Request $request, Tenant $tenant, BrandProfile $brandProfile): JsonResponse
    {
        $validated = $request->validate([
            'name'                     => 'sometimes|string|max:255',
            'slug'                     => 'sometimes|string|max:255|unique:brand_profiles,slug,' . $brandProfile->id,
            'domain'                   => 'nullable|string|max:255',
            'logo_light_url'           => 'nullable|string|max:500',
            'logo_dark_url'            => 'nullable|string|max:500',
            'favicon_url'              => 'nullable|string|max:500',
            'color_tokens'             => 'nullable|array',
            'typography'               => 'nullable|array',
            'email_from_name'          => 'nullable|string|max:255',
            'email_header_url'         => 'nullable|string|max:500',
            'email_footer_html'        => 'nullable|string',
            'ticket_template_id'       => 'nullable|string|max:255',
            'credential_template_id'   => 'nullable|string|max:255',
            'legal_entity_name'        => 'nullable|string|max:255',
            'merchant_label'           => 'nullable|string|max:255',
            'support_email'            => 'nullable|email|max:255',
        ]);

        $brandProfile->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $brandProfile->fresh(),
            'message' => 'Brand profile updated',
        ]);
    }

    /**
     * Delete a brand profile.
     */
    public function destroy(Tenant $tenant, BrandProfile $brandProfile): JsonResponse
    {
        $brandProfile->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Brand profile deleted',
        ]);
    }
}
