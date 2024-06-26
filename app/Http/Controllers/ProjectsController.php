<?php

namespace App\Http\Controllers;

use App\Models\Projects;
use App\Models\TechnoCategory;
use App\Models\Technologies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProjectsController extends Controller
{

    public function index()
    {
        $projects = Projects::all();

        return Inertia::render('Projects/Index', [
            'projects' => $projects
        ]);
    }

    public function show($id)
    {
        $project = Projects::find($id);
        $categories = TechnoCategory::all();
        $technologies = Technologies::all();
        if (!$project) {
            return Inertia::render('Projects/Index', ['status' => '404']);
        }
        return Inertia::render('Projects/Show', ['project' => $project, 'categories' => $categories, 'technologies' => $technologies]);
    }

    public function showForm($action, Request $request)
    {

        $project = null;
        $technologies = Technologies::all();

        if ($action == 'edit') {
            $projectId = $request->query('id');
            $project = Projects::find($projectId);
            if (!$project) {
                return Inertia::render('Projects/add', ['status' => '404']);
            }
        }
        return Inertia::render('Projects/Add', ['action' => $action, 'project' => $project, 'technologies' => $technologies]);
    }

    public function handleForm(Request $request, $action)
    {
        $message = '';

        $validatedData = $request->validate([
            'title' => 'required',
            'short_description' => 'required',
            'images' => 'required|array|max:20',
            'main_img' => 'required|string',
            'used_technologies' => 'required|array',
            'demo_link' => 'nullable|string',
            'github_repo' => 'nullable|string',
            'description' => 'nullable|json',
            'lang' => 'nullable|string',
            'show' => 'required|boolean',
        ]);

        if ($action === 'add') {
            $project = Projects::create($validatedData);
            $message = 'Projet ajouté avec succès';
        } elseif ($action === 'edit') {
            $validatedData = array_merge($validatedData, $request->validate([
                'id' => 'required|integer|exists:projects,id',
            ]));

            $project = Projects::findOrFail($validatedData['id']);

            // Log::debug($validatedData);

            $project->update($validatedData);

            $message = 'Projet modifié avec succès';
        }

        return response()->json(['success' => true, "message" => $message]);
    }

    public function destroy(Request $request, $id)
    {
        $project = Projects::find($id);

        if (!$project) {
            return response()->json(['message' => 'Projet non trouvé'], 404);
        }

        $project->delete();
        return response()->json(['message' => 'Projet supprimé avec succès'], 200);
    }

    public function uploadImage(Request $request)
    {
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $originalName = $file->getClientOriginalName();
            $file->move(public_path('/images/uploads'), $originalName);
            return response()->json(['path' => '/images/uploads/' . $originalName], 200);
        }

        return response()->json(['error' => 'No image uploaded'], 400);
    }

    public function deleteImage(Request $request)
    {

        $request->validate([
            'id' => 'required|integer|exists:projects,id',
            'path' => 'required|string',
            'images' => 'required|array|max:75',
            'main_img' => 'nullable|string',
        ]);

        $project = Projects::find($request->input('id'));

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $images = $project->images;

        $index = array_search($request->input('path'), $images);
        if ($index !== false) {
            array_splice($images, $index, 1);
            $project->images = $images;
            $project->save();
        }

        $project->main_img = $request->input('main_img');
        $project->save();


        $path = str_replace('/storage/', 'public/', $request->input('path'));
        Storage::delete($path);
        return response()->json(['message' => 'Image deleted'], 200);
    }
}
