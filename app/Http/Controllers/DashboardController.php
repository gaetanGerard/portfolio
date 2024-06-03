<?php

namespace App\Http\Controllers;

use App\Models\Projects;
use App\Models\TechnoCategory;
use App\Models\Technologies;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $projects = Projects::all();
        $technoCategory = TechnoCategory::all();
        $technologies = Technologies::all();

        return Inertia::render('Dashboard', [
            'projects' => $projects,
            'technoCategory' => $technoCategory,
            'technologies' => $technologies,
        ]);
    }
}
