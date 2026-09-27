<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Recipe;
use App\Models\Comment;
use App\Models\Category;
use App\Models\Favorite;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
{
    \App\Models\User::factory(1)->create();
    \App\Models\Category::factory(5)->create();
    \App\Models\Recipe::factory(50)->create();
    \App\Models\Comment::factory(100)->create();
    \App\Models\Favorite::factory(100)->create();
}
}
