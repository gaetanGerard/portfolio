<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register')
    ]);
});
Route::prefix('admin/dashboard')->group(function () {
    Route::get('/', [ProjectsController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
    Route::get('/projects/add', [ProjectsController::class, 'add'])->middleware(['auth', 'verified'])->name('projects.add');
    Route::post('/projects/add', [ProjectsController::class, 'store'])->middleware(['auth', 'verified'])->name('projects.store');
    Route::post('/projects/add/upload-image', [ProjectsController::class, 'uploadImage'])->middleware(['auth', 'verified'])->name('projects.uploadImage');
});

// Authentication for administrators
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
