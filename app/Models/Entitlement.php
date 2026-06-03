<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entitlement extends Model
{
    protected $fillable = [
        'order_item_id',
        'pass_type_id',
        'occurrence_id',
        'valid_from',
        'valid_to',
        'max_uses',
        'uses_remaining',
        'max_per_day',
        'reentry_allowed',
        'min_reentry_gap_seconds',
        'access_level',
        'allowed_zone_ids',
        'blackout_dates',
        'state',
    ];

    protected $casts = [
        'valid_from' => 'datetime',
        'valid_to' => 'datetime',
        'reentry_allowed' => 'boolean',
        'allowed_zone_ids' => 'array',
        'blackout_dates' => 'array',
    ];

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function passType(): BelongsTo
    {
        return $this->belongsTo(PassType::class);
    }

    public function occurrence(): BelongsTo
    {
        return $this->belongsTo(Occurrence::class);
    }

    public function credentials(): HasMany
    {
        return $this->hasMany(Credential::class);
    }

    public function usages(): HasMany
    {
        return $this->hasMany(EntitlementUsage::class);
    }

    public function entitlementUsages(): HasMany
    {
        return $this->hasMany(EntitlementUsage::class);
    }
}
