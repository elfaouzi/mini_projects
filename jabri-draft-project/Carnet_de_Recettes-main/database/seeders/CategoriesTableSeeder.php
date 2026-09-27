<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Categories;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $categories = ['Fruits', 'Vegetables', 'Grains', 'Protein', 'Dairy Products', 'Sweets', 'Beverages', 'Condiments',  'Gluten-Free', 'Low-Carb', 'Dietary Preferences','Healthy','Vegan','Sour','Salty' ];


        foreach ($categories as $category){
            Categories::create([
                'name' => $category,
            ]);
        }
}
    }
    
