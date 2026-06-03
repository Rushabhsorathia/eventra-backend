<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PayoutAccount extends Model
{
    protected $fillable = [
        'owner_type',
        'owner_id',
        'provider',
        'account_ref',
        'kyc_status',
        'status',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function owner(): MorphTo
    {
        return $this->morphTo();
    }
}
