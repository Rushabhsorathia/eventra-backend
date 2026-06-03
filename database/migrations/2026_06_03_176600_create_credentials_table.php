<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('credentials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entitlement_id')->constrained('entitlements')->cascadeOnDelete();
            $table->string('type'); // qr/nfc/rfid
            $table->string('uid_or_token')->unique();
            $table->string('signature_key_id')->nullable();
            $table->string('status')->default('active'); // active/revoked/expired
            $table->dateTime('issued_at');
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credentials');
    }
};
