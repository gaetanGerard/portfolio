<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\EducationsController;
use App\Http\Controllers\ExperiencesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\TechnologiesController;
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
        Route::delete('/delete/{id}', [ProjectsController::class, 'destroy'])->middleware(['auth', 'verified'])->name('projects.destroy');
        Route::post('/{action}/upload-image', [ProjectsController::class, 'uploadImage'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('projects.uploadImage');
        Route::delete('/{action}/delete-image', [ProjectsController::class, 'deleteImage'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('projects.deleteImage');
    });
    Route::prefix('technologies')->group(function () {
        Route::get('/{action}', [TechnologiesController::class, 'showForm'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('technologies.showForm');
        Route::post('/{action}', [TechnologiesController::class, 'handleForm'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('technologies.store');
        Route::delete('/delete/{id}', [TechnologiesController::class, 'destroy'])->middleware(['auth', 'verified'])->name('technologies.destroy');
        Route::post('/{action}/upload-icon', [TechnologiesController::class, 'uploadIcon'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('technologies.uploadImage');
        Route::delete('/{action}/delete-icon', [TechnologiesController::class, 'deleteIcon'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('technologies.deleteImage');
    });
    Route::prefix('categories')->group(function () {
        Route::get('/{action}', [CategoriesController::class, 'showForm'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('categories.showForm');
        Route::post('/{action}', [CategoriesController::class, 'handleForm'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('categories.store');
        Route::delete('/delete/{id}', [CategoriesController::class, 'destroy'])->middleware(['auth', 'verified'])->name('categories.destroy');
    });
    Route::prefix('experiences')->group(function () {
        Route::get('/', [ExperiencesController::class, 'index'])->middleware(['auth', 'verified'])->name('experiences.index');
        // Route::get('/{action}', [ExperiencesController::class, 'showForm'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('experiences.showForm');
        // Route::post('/{action}', [ExperiencesController::class, 'handleForm'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('experiences.store');
        // Route::delete('/delete/{id}', [ExperiencesController::class, 'destroy'])->middleware(['auth', 'verified'])->name('experiences.destroy');
    });
    Route::prefix('educations')->group(function () {
        Route::get('/', [EducationsController::class, 'index'])->middleware(['auth', 'verified'])->name('education.index');
        Route::get('/{action}', [EducationsController::class, 'showForm'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('eductation.showForm');
        Route::post('/{action}', [EducationsController::class, 'handleForm'])->where('action', 'add|edit')->middleware(['auth', 'verified'])->name('eductation.store');
        Route::delete('/delete/{id}', [EducationsController::class, 'destroy'])->middleware(['auth', 'verified'])->name('eductation.destroy');
    });
});

// Authentication for administrators
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
