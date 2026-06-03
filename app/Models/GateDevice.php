<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GateDevice extends Model
{
    protected $fillable = [
        'tenant_id',
        'seller_id',
        'event_id',
        'label',
        'device_token',
        'paired_at',
        'last_activity_at',
        'status',
    ];

    protected $casts = [
        'paired_at' => 'datetime',
        'last_activity_at' => 'datetime',
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
}
