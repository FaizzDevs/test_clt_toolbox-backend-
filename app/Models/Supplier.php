<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $fillable = ['name', 'contact_person', 'email', 'phone', 'address'];
    
    public function layups(): HasMany
    {
        return $this->hasMany(Layup::class);
    }
}