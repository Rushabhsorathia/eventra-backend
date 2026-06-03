<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commission_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('seller_id')->nullable()->constrained('sellers')->nullOnDelete();
            $table->foreignId('event_id')->nullable()->constrained('events')->nullOnDelete();
            $table->foreignId('pass_type_id')->nullable()->constrained('pass_types')->nullOnDelete();
            $table->string('party_type'); // platform/tenant/seller/partner
            $table->string('basis'); // percentage/fixed
            $table->decimal('rate', 8, 4)->nullable();
            $table->unsignedBigInteger('fixed_amount')->nullable();
            $table->integer('priority')->default(0);
            $table->string('status')->default('active'); // active/inactive
            $table->timestamps();

            $table->index('priority');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commission_rules');
    }
};
