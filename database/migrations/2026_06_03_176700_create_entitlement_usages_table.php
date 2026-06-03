<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entitlement_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entitlement_id')->constrained('entitlements')->cascadeOnDelete();
            $table->foreignId('occurrence_id')->nullable()->constrained('occurrences')->nullOnDelete();
            $table->foreignId('gate_device_id')->nullable()->constrained('gate_devices')->nullOnDelete();
            $table->foreignId('staff_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('zone_id')->nullable()->constrained('access_zones')->nullOnDelete();
            $table->string('result'); // success/already_used_today/blackout_date/exhausted/wrong_zone/wrong_event/reentry_too_soon/revoked/device_not_authorized/outside_window
            $table->dateTime('scanned_at');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['entitlement_id', 'scanned_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entitlement_usages');
    }
};
