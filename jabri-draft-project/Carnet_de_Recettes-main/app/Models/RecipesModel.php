<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecipesModel extends Model
{
    use HasFactory;

    protected $table = 'recipes';
    protected $fillable = [
        'title',
        'image',
        'ingredients',
        'instruction',
        'user_id',
        'category_id',
    ];
    public function category()
    {
        return $this->belongsTo(Categories::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
}
