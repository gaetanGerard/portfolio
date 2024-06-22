<?php

namespace App\Http\Controllers;

use App\Models\CV;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CVController extends Controller
{
    public function index()
    {
        $cvs = CV::where('user_id', auth()->id())->get();

        return Inertia::render('Cvs/Index', ['cvs' => $cvs]);
    }

    public function showForm($action, Request $request)
    {
        $cv = null;

        if ($action == 'edit') {
            $cvId = $request->query('id');
            $cv = CV::find($cvId);
            if (!$cv) {
                return response()->json(['message' => 'CV not found'], 404);
            }
        }
        return Inertia::render('Cvs/Add', ['action' => $action, 'cv' => $cv]);
    }

    public function uploadCV(Request $request)
    {
        if ($request->hasFile('cv')) {
            $file = $request->file('cv');
            $originalName = $file->getClientOriginalName();
            $file->move(public_path('/cv/uploads'), $originalName);

            $cv = new CV();
            $cv->cv_path = '/cv/uploads/' . $originalName;
            $cv->name = $request->input('name');
            $cv->lang = $request->input('lang');
            $cv->user_id = auth()->id();
            $cv->save();

            return response()->json(['path' => $cv->cv_path, 'message' => 'CV ajouté'], 200);
        }

        return response()->json(['error' => 'No CV uploaded'], 400);
    }

    public function deleteCV(Request $request, $id)
    {
        $cv = CV::find($id);

        if (!$cv) {
            return response()->json(['message' => 'CV not found'], 404);
        }

        $cvPath = str_replace('/storage/', 'public/', $cv->cv_path);
        Storage::delete($cvPath);

        $cv->delete();

        return response()->json(['message' => 'CV deleted'], 200);
    }
}
