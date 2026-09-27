<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recipe>
 */
class RecipeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(),
            'ingredients' => json_encode($this->faker->words(5)),
            'steps' => $this->faker->paragraph(),
            'cooking_time' => $this->faker->numberBetween(10, 120),
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'is_public' => $this->faker->boolean(),
        ];
    }
}
