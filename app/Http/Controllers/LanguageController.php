<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LanguageController extends Controller
{
    public function changeLanguage(Request $request)
    {
        $languageCode = $request->input('language');

        return redirect()->back()->withCookie(cookie('language', $languageCode, 60 * 24 * 30));
    }
}
