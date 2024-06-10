<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TechnoCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'lang'
    ];

    public function technologies()
    {
        return $this->hasMany(Technologies::class, 'category_id');
    }
}
