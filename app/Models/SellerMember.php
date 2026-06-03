<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerMember extends Model
{
    protected $fillable = [
        'seller_id',
        'user_id',
        'role',
        'scoped_event_ids',
    ];

    protected $casts = [
        'scoped_event_ids' => 'array',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
