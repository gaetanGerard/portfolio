<?php

namespace App\Http\Controllers;

use App\Models\TechnoCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CategoriesController extends Controller
{

    public function index()
    {
        $technoCategories = TechnoCategory::all();
        return Inertia::render('Categories/Index', ['categories' => $technoCategories]);
    }

    public function show($id)
    {
        $technoCategories = TechnoCategory::find($id);
        if (!$technoCategories) {
            return Inertia::render('Categories/Index', ['status' => '404']);
        }
        return Inertia::render('Categories/Show', ['category' => $technoCategories]);
    }

    public function showForm($action, Request $request)
    {

        $technoCategory = null;

        if ($action == 'edit') {
            $technoCategoryId = $request->query('id');
            $technoCategory = TechnoCategory::find($technoCategoryId);
            if (!$technoCategory) {
                return Inertia::render('Categories/Add', ['status' => '404']);
            }
        }
        return Inertia::render('Categories/Add', ['action' => $action, 'categories' => $technoCategory]);
    }

    public function handleForm(Request $request, $action)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'max:50'],
            'description' => ['required', 'max:255'],
            'lang' => 'nullable|string',
        ]);

        if ($action === 'add') {
            $technoCategories = TechnoCategory::create($request->all());
        } else if ($action === 'edit') {
            $validatedData = array_merge($validatedData, $request->validate([
                'id' => 'required|integer|exists:techno_categories,id',
            ]));

            $technoCategories = TechnoCategory::findOrFail($validatedData['id']);

            $technoCategories->update($validatedData);
        }

        return response()->json(['success' => true, "message" => "Catégorie ajouté avec succès"]);
    }

    public function destroy($id)
    {
        $technoCategories = TechnoCategory::find($id);

        if (!$technoCategories) {
            return response()->json(['message' => 'Catégorie introuvable !'], 404);
        }

        $technoCategories->delete();
        return response()->json(['message' => 'Catégorie supprimé avec succès'], 200);
    }
}
