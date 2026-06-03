<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommissionRule extends Model
{
    protected $fillable = [
        'tenant_id',
        'seller_id',
        'event_id',
        'pass_type_id',
        'party_type',
        'basis',
        'rate',
        'fixed_amount',
        'priority',
        'status',
    ];

    protected $casts = [
        'rate' => 'decimal:4',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function passType(): BelongsTo
    {
        return $this->belongsTo(PassType::class);
    }
}
