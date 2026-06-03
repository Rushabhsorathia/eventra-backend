<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccessZone extends Model
{
    protected $fillable = [
        'event_id',
        'season_id',
        'name',
        'slug',
        'level',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    public function entitlementUsages(): HasMany
    {
        return $this->hasMany(EntitlementUsage::class, 'zone_id');
    }
}
