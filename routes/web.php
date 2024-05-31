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
    Route::prefix('projects')->group(function () {
        Route::get('/{action}', [ProjectsController::class, 'showForm'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('projects.showForm');
        Route::post('/{action}', [ProjectsController::class, 'handleForm'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('projects.store');
        Route::delete('/{id}', [ProjectsController::class, 'destroy'])->middleware(['auth', 'verified'])->name('projects.destroy');
        Route::post('/{action}/upload-image', [ProjectsController::class, 'uploadImage'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('projects.uploadImage');
        Route::delete('/{action}/delete-image', [ProjectsController::class, 'deleteImage'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('projects.deleteImage');
    });
});

// Authentication for administrators
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
