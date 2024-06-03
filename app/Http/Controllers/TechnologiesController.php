<?php

namespace App\Http\Controllers;

use App\Models\TechnoCategory;
use App\Models\Technologies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TechnologiesController extends Controller
{

    public function index()
    {
        $technologies = Technologies::all();
        return Inertia::render('Technologies/Index', ['technologies' => $technologies]);
    }

    public function showForm($action, Request $request)
    {

        $technology = null;
        $technoCategories = TechnoCategory::all();

        if ($action == 'edit') {
            $technologyId = $request->query('id');
            $technology = Technologies::find($technologyId);
            if (!$technology) {
                return Inertia::render('Technologies/Add', ['status' => '404']);
            }
        }
        return Inertia::render('Technologies/Add', ['action' => $action, 'technology' => $technology, 'technoCategories' => $technoCategories]);
    }

    public function handleForm(Request $request, $action)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'category_id' => 'required',
            'icon_path' => 'required',
            'technology_url' => 'required',
            'skill_level' => 'required',
        ]);

        Log::debug($validatedData);

        if ($action === 'add') {
            $technology = Technologies::create($validatedData);
        } else {
            $validatedData = array_merge($validatedData, $request->validate([
                'id' => 'required|integer|exists:technologies,id',
            ]));

            $technology = Technologies::findOrFail($validatedData['id']);

            $technology->update($validatedData);
        }

        return response()->json(['success' => true, "message" => "Technologie ajouté avec succès"]);
    }

    public function destroy(Request $request, $id)
    {
        $technology = Technologies::find($id);
        $iconPath = public_path() . $technology->icon_path;

        if (file_exists($iconPath)) {
            unlink($iconPath);
        }

        if (!$technology) {
            return response()->json(['message' => 'Technologie non trouvé'], 404);
        }

        $technology->delete();
        return response()->json(['message' => 'Technologie supprimé avec succès'], 200);
    }

    public function uploadIcon(Request $request)
    {
        if ($request->hasFile('icon')) {
            $icon = $request->file('icon');
            $originalName = $icon->getClientOriginalName();
            $iconName = $originalName;

            $icon->move(public_path('images/icons'), $iconName);

            return response()->json(['icon_path' => '/images/icons/' . $iconName]);
        }

        return response()->json(['message' => 'Aucun icone n\'a été envoyée'], 400);
    }

    public function deleteIcon(Request $request)
    {
        $iconPath = $request->input('icon_path');
        $iconPath = public_path() . $iconPath;

        if (file_exists($iconPath)) {
            unlink($iconPath);
            return response()->json(['message' => 'Icone supprimé avec succès'], 200);
        }

        return response()->json(['message' => 'Icone non trouvé'], 404);
    }
}
