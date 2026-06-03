<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $fillable = [
        'tenant_id',
        'seller_id',
        'brand_profile_id',
        'venue_id',
        'name',
        'slug',
        'description',
        'event_kind',
        'cover_image_url',
        'accent_color',
        'starts_at',
        'ends_at',
        'status',
        'settings',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'settings' => 'array',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function brandProfile(): BelongsTo
    {
        return $this->belongsTo(BrandProfile::class);
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function occurrences(): HasMany
    {
        return $this->hasMany(Occurrence::class);
    }

    public function passTypes(): HasMany
    {
        return $this->hasMany(PassType::class);
    }

    public function accessZones(): HasMany
    {
        return $this->hasMany(AccessZone::class);
    }

    public function gateDevices(): HasMany
    {
        return $this->hasMany(GateDevice::class);
    }

    public function commissionRules(): HasMany
    {
        return $this->hasMany(CommissionRule::class);
    }

    public function coupons(): HasMany
    {
        return $this->hasMany(Coupon::class);
    }
}
