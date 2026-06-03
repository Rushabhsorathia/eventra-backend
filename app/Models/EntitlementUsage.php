<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EntitlementUsage extends Model
{
    protected $fillable = [
        'entitlement_id',
        'occurrence_id',
        'gate_device_id',
        'staff_user_id',
        'zone_id',
        'result',
        'scanned_at',
        'metadata',
    ];

    protected $casts = [
        'scanned_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function entitlement(): BelongsTo
    {
        return $this->belongsTo(Entitlement::class);
    }

    public function occurrence(): BelongsTo
    {
        return $this->belongsTo(Occurrence::class);
    }

    public function gateDevice(): BelongsTo
    {
        return $this->belongsTo(GateDevice::class);
    }

    public function staffUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_user_id');
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(AccessZone::class, 'zone_id');
    }
}
