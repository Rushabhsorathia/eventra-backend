<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'domain',
        'subdomain',
        'custom_domain_verified_at',
        'feature_flags',
        'settings',
        'status',
    ];

    protected $casts = [
        'custom_domain_verified_at' => 'datetime',
        'feature_flags' => 'array',
        'settings' => 'array',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'tenant_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function sellers(): HasMany
    {
        return $this->hasMany(Seller::class);
    }

    public function brandProfiles(): HasMany
    {
        return $this->hasMany(BrandProfile::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function venues(): HasMany
    {
        return $this->hasMany(Venue::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function settlements(): HasMany
    {
        return $this->hasMany(Settlement::class);
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

    public function ledgerEntries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class);
    }

    public function payoutAccount()
    {
        return $this->morphOne(PayoutAccount::class, 'owner');
    }

    public function seasons(): HasMany
    {
        return $this->hasMany(Season::class);
    }
}
