<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Technologies extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'icon_path',
        'technology_url',
        'skill_level',
    ];

    public function category()
    {
        return $this->belongsTo(TechnoCategory::class, 'category_id');
    }
}
