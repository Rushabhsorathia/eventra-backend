<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BrandProfileController;
use App\Http\Controllers\API\CouponController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\EntitlementController;
use App\Http\Controllers\API\EventController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\PassTypeController;
use App\Http\Controllers\API\SeasonController;
use App\Http\Controllers\API\SellerController;
use App\Http\Controllers\API\SettlementController;
use App\Http\Controllers\API\TenantController;
use App\Http\Controllers\API\VenueController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Eventra
|--------------------------------------------------------------------------
|
| All routes here are automatically prefixed with /api and use the
| ForceJsonResponse middleware (registered as 'json.force' in
| bootstrap/app.php) via the api middleware group.
|
*/

// ── Public endpoints ─────────────────────────────────────────────────
Route::get('/health', [AuthController::class, 'health']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ── Public browsing (no auth needed to browse published events) ──────
Route::get('/events', [EventController::class, 'publicIndex']);
Route::get('/events/{event}', [EventController::class, 'publicShow']);

// ── Protected endpoints (Sanctum token auth) ────────────────────────
Route::middleware('auth:sanctum')->group(function (): void {

    // Auth
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'stats']);

    // ── Tenants (public index, auth for rest) ────────────────────────
    Route::apiResource('tenants', TenantController::class);

    // ── Tenant-scoped nested resources ───────────────────────────────
    Route::prefix('tenants/{tenant}')->group(function (): void {
        Route::apiResource('brand-profiles', BrandProfileController::class);
        Route::apiResource('sellers', SellerController::class);
        Route::apiResource('venues', VenueController::class);
        Route::apiResource('events', EventController::class);
        // Event publish action
        Route::post('events/{event}/publish', [EventController::class, 'publish']);
    });

    // ── Pass Types (filter by event or season) ───────────────────────
    Route::apiResource('pass-types', PassTypeController::class);

    // ── Seasons ──────────────────────────────────────────────────────
    Route::apiResource('seasons', SeasonController::class);

    // ── Orders ───────────────────────────────────────────────────────
    Route::apiResource('orders', OrderController::class)->except(['update', 'destroy']);
    Route::post('orders/{order}/refund', [OrderController::class, 'refund']);

    // ── Entitlements ─────────────────────────────────────────────────
    Route::apiResource('entitlements', EntitlementController::class)->only(['index', 'show']);
    Route::get('entitlements/{entitlement}/verify', [EntitlementController::class, 'verify']);

    // ── Settlements ──────────────────────────────────────────────────
    Route::apiResource('settlements', SettlementController::class)->only(['index', 'show']);
    Route::post('settlements/{settlement}/approve', [SettlementController::class, 'approve']);

    // ── Coupons ──────────────────────────────────────────────────────
    Route::apiResource('coupons', CouponController::class);
    Route::post('coupons/validate', [CouponController::class, 'validateCoupon']);
});
