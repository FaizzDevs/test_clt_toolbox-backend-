<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Layup extends Model
{
    protected $fillable = ['supplier_id', 'name', 'description'];
    
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
    
    public function layers(): HasMany
    {
        return $this->hasMany(Layer::class);
    }
}