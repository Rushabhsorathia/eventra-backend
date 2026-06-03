<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('sellers')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('role'); // owner/manager/finance/gate_staff/gate_supervisor/marketing
            $table->json('scoped_event_ids')->nullable();
            $table->timestamps();

            $table->unique(['seller_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_members');
    }
};
