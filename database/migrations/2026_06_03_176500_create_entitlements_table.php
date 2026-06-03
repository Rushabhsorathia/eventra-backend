<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entitlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id')->constrained('order_items')->cascadeOnDelete();
            $table->foreignId('pass_type_id')->constrained('pass_types')->cascadeOnDelete();
            $table->foreignId('occurrence_id')->nullable()->constrained('occurrences')->nullOnDelete();
            $table->dateTime('valid_from');
            $table->dateTime('valid_to');
            $table->unsignedInteger('max_uses')->default(1);
            $table->unsignedInteger('uses_remaining')->default(1);
            $table->unsignedInteger('max_per_day')->default(1);
            $table->boolean('reentry_allowed')->default(false);
            $table->unsignedInteger('min_reentry_gap_seconds')->default(0);
            $table->string('access_level')->default('general'); // general/vip/backstage/staff
            $table->json('allowed_zone_ids')->nullable();
            $table->json('blackout_dates')->nullable();
            $table->string('state')->default('issued'); // issued/active/partially_used/exhausted/expired/revoked
            $table->timestamps();

            $table->index('state');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entitlements');
    }
};
