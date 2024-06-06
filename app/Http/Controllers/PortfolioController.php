<?php

namespace App\Http\Controllers;

use App\Models\Education;
use App\Models\Experience;
use App\Models\Projects;
use App\Models\TechnoCategory;
use App\Models\Technologies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {

        $projects = Projects::all();
        $categories = TechnoCategory::all();
        $technologies = Technologies::all();
        $educations = Education::all();
        $experiences = Experience::all();

        return Inertia::render('Portfolio', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'projects' => $projects,
            'categories' => $categories,
            'technologies' => $technologies,
            'educations' => $educations,
            'experiences' => $experiences
        ]);
    }
}
