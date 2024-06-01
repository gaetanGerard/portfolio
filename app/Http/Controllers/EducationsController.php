<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EducationsController extends Controller
{
    public function index()
    {
        return Inertia::render('Educations/Index');
    }
}
