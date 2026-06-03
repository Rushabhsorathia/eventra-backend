<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gate_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('seller_id')->nullable()->constrained('sellers')->nullOnDelete();
            $table->foreignId('event_id')->nullable()->constrained('events')->nullOnDelete();
            $table->string('label');
            $table->string('device_token')->unique();
            $table->dateTime('paired_at')->nullable();
            $table->dateTime('last_activity_at')->nullable();
            $table->string('status')->default('active'); // active/disabled
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gate_devices');
    }
};
