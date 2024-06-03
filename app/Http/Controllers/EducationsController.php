<?php

namespace App\Http\Controllers;

use App\Models\Education;
use Carbon\Carbon;
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

    public function show($id)
    {
        $education = Education::find($id);

        if (!$education) {
            return Inertia::render('Educations/Show', ['status' => '404']);
        }

        return Inertia::render('Educations/Show', ['education' => $education]);
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
            'start_date' => 'required|date_format:d/m/Y',
            'end_date' => 'nullable|date_format:d/m/Y',
            'is_current' => 'required|boolean',
            'description' => 'nullable',
        ]);

        $validatedData['start_date'] = Carbon::createFromFormat('d/m/Y', $validatedData['start_date'])->format('Y-m-d');
        if (!empty($validatedData['end_date'])) {
            $validatedData['end_date'] = Carbon::createFromFormat('d/m/Y', $validatedData['end_date'])->format('Y-m-d');
        }

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

        return response()->json(['success' => true, 'education' => $education]);
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
