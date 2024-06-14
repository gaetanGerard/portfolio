<?php

namespace App\Models;

use App\Models\Technologies;
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
        return $this->belongsToMany(Technologies::class, 'category_technology', 'category_ids', 'technology_id');
    }
}
