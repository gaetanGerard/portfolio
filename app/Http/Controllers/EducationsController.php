<?php

namespace App\Http\Controllers;

use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class EducationsController extends Controller
{
    public function index()
    {

        $educations = Education::all();


        return Inertia::render('Educations/Index', [
            'educations' => $educations,
        ]);
    }

    public function showForm($action, Request $request)
    {

        $education = null;

        if ($action == 'edit') {
            $educationId = $request->query('id');
            $education = Education::find($educationId);
            if (!$education) {
                return Inertia::render('Educations/Add', ['status' => '404']);
            }
        }
        return Inertia::render('Educations/Add', ['action' => $action, 'education' => $education]);
    }

    public function handleForm(Request $request, $action)
    {

        $request->merge([
            'is_current' => filter_var($request->input('is_current'), FILTER_VALIDATE_BOOLEAN),
        ]);

        $validatedData = $request->validate([
            'school_name' => 'required',
            'degree' => 'required',
            'place_of_study' => 'required',
            'start_date' => 'required',
            'end_date' => 'nullable',
            'is_current' => 'required|boolean',
            'description' => 'nullable',
        ]);

        if ($action === 'add') {
            $education = Education::create($validatedData);
        } else {
            $validatedData = array_merge($validatedData, $request->validate([
                'id' => 'required|integer|exists:education,id',
            ]));
            $education = Education::findOrFail($validatedData['id']);

            Log::debug($validatedData);

            $education->update($validatedData);
        }

        return Redirect::to('/admin/dashboard/educations');
    }

    public function destroy($id)
    {
        $education = Education::find($id);

        if (!$education) {
            return response()->json(['message' => 'Education non trouvé'], 404);
        }

        $education->delete();
        return response()->json(['message' => 'Education supprimé'], 200);
    }
}
