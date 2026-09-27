<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecipesController;

use Illuminate\Support\Facades\Route;

//get for display 
//patch for modify
//delete for delete
//resource for full crud 

Route::get('/', function () {
    return view('index');
});

Route::get('/dashboard', function () {
    return view('Dashboard.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
route::resource('/Dashboard', RecipesController::class);
Route::get('/dashboard', [RecipesController::class, 'displaybyuserid'])->name('dashboard');
Route::get('/', [RecipesController::class, 'index'])->name('recipes.index');
Route::get('/search',[RecipesController::class,'search']);


require __DIR__.'/auth.php';


