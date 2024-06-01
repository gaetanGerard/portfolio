<?php

namespace App\Http\Controllers;

use App\Models\TechnoCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CategoriesController extends Controller
{
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
            'description' => ['required', 'max:255']
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

        return Redirect::to('/admin/dashboard');
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
