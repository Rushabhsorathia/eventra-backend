<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BrandProfile extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'slug',
        'domain',
        'custom_domain_verified_at',
        'logo_light_url',
        'logo_dark_url',
        'favicon_url',
        'color_tokens',
        'typography',
        'email_from_name',
        'email_header_url',
        'email_footer_html',
        'ticket_template_id',
        'credential_template_id',
        'legal_entity_name',
        'merchant_label',
        'support_email',
        'status',
    ];

    protected $casts = [
        'custom_domain_verified_at' => 'datetime',
        'color_tokens' => 'array',
        'typography' => 'array',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
