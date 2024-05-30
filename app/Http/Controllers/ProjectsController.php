<?php

namespace App\Http\Controllers;

use App\Models\Projects;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProjectsController extends Controller
{

    public function index()
    {
        $projects = Projects::all();

        return Inertia::render('Dashboard', ['projects' => $projects]);
    }

    public function add()
    {
        return Inertia::render('Projects/Add');
    }

    public function store(Request $request)
    {

        $validatedData = $request->validate([
            'title' => 'required',
            'short_description' => 'required',
            'images' => 'required|array|max:75',
            'main_img' => 'required|string',
            'used_technologies' => 'required|array',
            'demo_link' => 'nullable|url',
            'github_repo' => 'nullable|url',
            'description' => 'required',
        ]);

        $project = Projects::create([
            'title' => $request->title,
            'short_description' => $request->short_description,
            'used_technologies' => $request->used_technologies,
            'main_img' => $request->main_img,
            'images' => $request->images,
            'demo_link' => $request->demo_link,
            'github_repo' => $request->github_repo,
            'description' => $request->description,
        ]);

        return Redirect::to('/admin/dashboard');
    }

    public function uploadImage(Request $request)
    {
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $originalName = $file->getClientOriginalName();
            $path = $file->storeAs('uploads', Str::random(10) . '_' . $originalName, 'public');
            $relativePath = str_replace('public/', '', $path);
            return response()->json(['path' => '/storage/' . $relativePath], 200);
        }

        return response()->json(['error' => 'No image uploaded'], 400);
    }
}
