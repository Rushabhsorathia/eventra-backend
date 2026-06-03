<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brand_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('domain')->nullable();
            $table->timestamp('custom_domain_verified_at')->nullable();
            $table->string('logo_light_url')->nullable();
            $table->string('logo_dark_url')->nullable();
            $table->string('favicon_url')->nullable();
            $table->json('color_tokens')->nullable();
            $table->json('typography')->nullable();
            $table->string('email_from_name')->nullable();
            $table->string('email_header_url')->nullable();
            $table->text('email_footer_html')->nullable();
            $table->unsignedBigInteger('ticket_template_id')->nullable();
            $table->unsignedBigInteger('credential_template_id')->nullable();
            $table->string('legal_entity_name')->nullable();
            $table->string('merchant_label')->nullable();
            $table->string('support_email')->nullable();
            $table->string('status')->default('active'); // active/inactive
            $table->timestamps();

            $table->unique(['tenant_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brand_profiles');
    }
};
