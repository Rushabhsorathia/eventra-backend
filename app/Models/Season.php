<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Season extends Model
{
    protected $fillable = [
        'tenant_id',
        'seller_id',
        'name',
        'slug',
        'description',
        'window_start',
        'window_end',
        'blackout_dates',
        'status',
    ];

    protected $casts = [
        'window_start' => 'datetime',
        'window_end' => 'datetime',
        'blackout_dates' => 'array',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
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
}
