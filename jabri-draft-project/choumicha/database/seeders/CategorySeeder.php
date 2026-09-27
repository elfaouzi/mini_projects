<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // List of unique categories
        $categories = ['Appetizer', 'Main Course', 'Dessert', 'Snack', 'Beverage'];

        // Loop through the array and create each category
        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
            ]);
        }
    }
}
