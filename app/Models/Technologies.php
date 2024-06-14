<?php

namespace App\Models;

use App\Models\TechnoCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Technologies extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'icon_path',
        'technology_url',
        'skill_level',
        'lang'
    ];

    public function categories()
    {
        return $this->belongsToMany(TechnoCategory::class, 'category_technology', 'technology_id', 'category_ids');
    }
}
