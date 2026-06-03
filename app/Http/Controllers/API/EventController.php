<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * List events with filters.
     */
    public function index(Request $request, Tenant $tenant): JsonResponse
    {
        $query = $tenant->events()
            ->with(['occurrences', 'passTypes', 'seller']);

        if ($request->filled('seller_id')) {
            $query->where('seller_id', $request->seller_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('event_kind')) {
            $query->where('event_kind', $request->event_kind);
        }

        if ($request->filled('venue_id')) {
            $query->where('venue_id', $request->venue_id);
        }

        $events = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $events,
            'message' => 'Events retrieved',
        ]);
    }

    /**
     * Create an event.
     */
    public function store(Request $request, Tenant $tenant): JsonResponse
    {
        $validated = $request->validate([
            'seller_id'       => 'nullable|exists:sellers,id',
            'brand_profile_id' => 'nullable|exists:brand_profiles,id',
            'venue_id'        => 'nullable|exists:venues,id',
            'name'            => 'required|string|max:255',
            'slug'            => 'required|string|max:255|unique:events,slug',
            'description'     => 'nullable|string',
            'event_kind'      => 'nullable|string|max:50',
            'cover_image_url' => 'nullable|string|max:500',
            'accent_color'    => 'nullable|string|max:20',
            'starts_at'       => 'nullable|date',
            'ends_at'         => 'nullable|date|after_or_equal:starts_at',
            'settings'        => 'nullable|array',
        ]);

        $validated['tenant_id'] = $tenant->id;

        $event = Event::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $event->load(['occurrences', 'passTypes', 'seller']),
            'message' => 'Event created',
        ], 201);
    }

    /**
     * Show an event.
     */
    public function show(Tenant $tenant, Event $event): JsonResponse
    {
        $event->load(['occurrences', 'passTypes', 'seller', 'venue', 'brandProfile']);

        return response()->json([
            'success' => true,
            'data'    => $event,
            'message' => 'Event retrieved',
        ]);
    }

    /**
     * Update an event.
     */
    public function update(Request $request, Tenant $tenant, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'seller_id'       => 'nullable|exists:sellers,id',
            'brand_profile_id' => 'nullable|exists:brand_profiles,id',
            'venue_id'        => 'nullable|exists:venues,id',
            'name'            => 'sometimes|string|max:255',
            'slug'            => 'sometimes|string|max:255|unique:events,slug,' . $event->id,
            'description'     => 'nullable|string',
            'event_kind'      => 'nullable|string|max:50',
            'cover_image_url' => 'nullable|string|max:500',
            'accent_color'    => 'nullable|string|max:20',
            'starts_at'       => 'nullable|date',
            'ends_at'         => 'nullable|date|after_or_equal:starts_at',
            'settings'        => 'nullable|array',
        ]);

        $event->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $event->fresh()->load(['occurrences', 'passTypes', 'seller']),
            'message' => 'Event updated',
        ]);
    }

    /**
     * Delete an event.
     */
    public function destroy(Tenant $tenant, Event $event): JsonResponse
    {
        $event->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Event deleted',
        ]);
    }

    /**
     * Publish an event (change status to published).
     */
    public function publish(Tenant $tenant, Event $event): JsonResponse
    {
        if ($event->status === 'published') {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Event is already published',
            ], 422);
        }

        $event->update(['status' => 'published']);

        return response()->json([
            'success' => true,
            'data'    => $event->fresh()->load(['occurrences', 'passTypes', 'seller']),
            'message' => 'Event published',
        ]);
    }

    /**
     * Public index — browse all published events (no auth).
     */
    public function publicIndex(Request $request): JsonResponse
    {
        $query = Event::with(['occurrences', 'passTypes', 'seller', 'tenant'])
            ->where('status', 'published');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('event_kind')) {
            $query->where('event_kind', $request->event_kind);
        }

        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }

        $events = $query->orderBy('starts_at', 'asc')->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $events,
            'message' => 'Events retrieved',
        ]);
    }

    /**
     * Public show — view a single published event (no auth).
     */
    public function publicShow(Event $event): JsonResponse
    {
        $event->load(['occurrences', 'passTypes', 'seller', 'tenant']);

        return response()->json([
            'success' => true,
            'data'    => $event,
            'message' => 'Event retrieved',
        ]);
    }
}
