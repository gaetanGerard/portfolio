<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Projects extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'short_description',
        'used_technologies',
        'main_img',
        'images',
        'demo_link',
        'github_repo',
        'description',
        'slug'
    ];

    protected $casts = [
        'used_technologies' => 'array',
        'images' => 'array',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($project) {
            $project->slug = Str::slug($project->title . '-' . $project->id);
        });

        static::updating(function ($project) {
            $project->slug = Str::slug($project->title . '-' . $project->id);
        });
    }
}
