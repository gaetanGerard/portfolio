<?php

namespace App\Http\Controllers;

use App\Models\Education;
use App\Models\Experience;
use App\Models\Projects;
use App\Models\TechnoCategory;
use App\Models\Technologies;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $projects = Projects::all();
        $technoCategory = TechnoCategory::all();
        $technologies = Technologies::all();
        $experiences = Experience::all();
        $educations = Education::all();

        return Inertia::render('Dashboard', [
            'projects' => $projects,
            'technoCategory' => $technoCategory,
            'technologies' => $technologies,
            'experiences' => $experiences,
            'educations' => $educations,
        ]);
    }
}
