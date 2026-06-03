<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Seller extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'slug',
        'description',
        'payout_account_id',
        'commission_terms',
        'kyc_status',
        'status',
    ];

    protected $casts = [
        'commission_terms' => 'array',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function payoutAccount(): BelongsTo
    {
        return $this->belongsTo(PayoutAccount::class);
    }

    public function payoutAccountAsOwner(): MorphOne
    {
        return $this->morphOne(PayoutAccount::class, 'owner');
    }

    public function members(): HasMany
    {
        return $this->hasMany(SellerMember::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function settlements(): HasMany
    {
        return $this->hasMany(Settlement::class);
    }

    public function seasons(): HasMany
    {
        return $this->hasMany(Season::class);
    }

    public function gateDevices(): HasMany
    {
        return $this->hasMany(GateDevice::class);
    }
}
