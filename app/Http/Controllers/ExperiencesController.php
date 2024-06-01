<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ExperiencesController extends Controller
{
    public function index()
    {
        return Inertia::render('Experiences/Index');
    }
}
