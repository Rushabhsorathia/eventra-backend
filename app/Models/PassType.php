<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PassType extends Model
{
    protected $fillable = [
        'event_id',
        'season_id',
        'kind',
        'name',
        'description',
        'price',
        'currency',
        'inventory_total',
        'inventory_reserved',
        'inventory_sold',
        'sales_window_start',
        'sales_window_end',
        'validity_rules',
        'scan_policy',
        'access_level',
        'allowed_zone_ids',
        'min_per_order',
        'max_per_order',
        'status',
    ];

    protected $casts = [
        'sales_window_start' => 'datetime',
        'sales_window_end' => 'datetime',
        'validity_rules' => 'array',
        'scan_policy' => 'array',
        'allowed_zone_ids' => 'array',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function entitlements(): HasMany
    {
        return $this->hasMany(Entitlement::class);
    }

    public function commissionRules(): HasMany
    {
        return $this->hasMany(CommissionRule::class);
    }
}
