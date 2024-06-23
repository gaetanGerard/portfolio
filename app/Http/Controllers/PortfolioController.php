<?php

namespace App\Http\Controllers;

use App\Models\CV;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Projects;
use App\Models\TechnoCategory;
use App\Models\Technologies;
use Illuminate\Foundation\Auth\User;
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
        $categoryTechnologies = TechnoCategory::with('technologies')->get();
        $educations = Education::all();
        $experiences = Experience::all();
        $user = User::all();
        $cvs = CV::all();

        return Inertia::render('Portfolio', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'projects' => $projects,
            'categories' => $categories,
            'technologies' => $technologies,
            'educations' => $educations,
            'experiences' => $experiences,
            'categoryTechnologies' => $categoryTechnologies,
            'user' => $user[0],
            'cvs' => $cvs,
        ]);
    }
}
