<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExperiencesController extends Controller
{
    public function index()
    {

        $experiences = Experience::all();

        return Inertia::render('Experiences/Index', ['experiences' => $experiences]);
    }

    public function show($id)
    {
        $experience = Experience::find($id);

        if (!$experience) {
            return Inertia::render('Experiences/Show', ['status' => '404']);
        }

        return Inertia::render('Experiences/Show', ['experience' => $experience]);
    }

    public function showForm($action, Request $request)
    {
        $experience = null;

        if ($action == 'edit') {
            $experienceId = $request->query('id');
            $experience = Experience::find($experienceId);
            if (!$experience) {
                return Inertia::render('Experiences/Add', ['status' => '404']);
            }
        }
        return Inertia::render('Experiences/Add', ['action' => $action, 'experience' => $experience]);
    }

    public function handleForm(Request $request, $action)
    {

        $request->merge([
            'is_current' => filter_var($request->input('is_current'), FILTER_VALIDATE_BOOLEAN),
        ]);

        $validatedData = $request->validate([
            'company_name' => 'required',
            'company_location' => 'required',
            'job_title' => 'required',
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
            $experience = Experience::create($validatedData);
        } else {
            $validatedData = array_merge($validatedData, $request->validate([
                'id' => 'required|integer|exists:experiences,id',
            ]));
            $experience = Experience::find($validatedData['id']);
            $experience->update($validatedData);
        }

        return response()->json(['success' => true, 'experience' => $experience]);
    }

    public function destroy($id)
    {
        $experience = Experience::find($id);

        if (!$experience) {
            return response()->json(['message' => 'Expérience non trouvé'], 404);
        }

        $experience->delete();

        return response()->json(['message' => 'Expériences supprimé'], 200);
    }
}
