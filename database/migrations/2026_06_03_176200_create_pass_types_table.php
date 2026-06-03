<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pass_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->nullable()->constrained('events')->cascadeOnDelete();
            $table->foreignId('season_id')->nullable()->constrained('seasons')->cascadeOnDelete();
            $table->string('kind'); // single_day/single_day_reentry/multi_day/season/bundle/zone_upgrade
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('price'); // minor units
            $table->string('currency')->default('INR');
            $table->unsignedInteger('inventory_total');
            $table->unsignedInteger('inventory_reserved')->default(0);
            $table->unsignedInteger('inventory_sold')->default(0);
            $table->dateTime('sales_window_start')->nullable();
            $table->dateTime('sales_window_end')->nullable();
            $table->json('validity_rules')->nullable();
            $table->json('scan_policy')->nullable();
            $table->string('access_level')->default('general'); // general/vip/backstage/staff
            $table->json('allowed_zone_ids')->nullable();
            $table->unsignedInteger('min_per_order')->default(1);
            $table->unsignedInteger('max_per_order')->default(10);
            $table->string('status')->default('active'); // active/inactive/sold_out
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pass_types');
    }
};
