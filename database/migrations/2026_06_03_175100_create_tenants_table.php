<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type')->default('standard'); // standard/enterprise/whitelabel/sandbox
            $table->string('domain')->nullable();
            $table->string('subdomain')->nullable();
            $table->timestamp('custom_domain_verified_at')->nullable();
            $table->json('feature_flags')->nullable();
            $table->json('settings')->nullable();
            $table->string('status')->default('active'); // active/suspended/archived
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
