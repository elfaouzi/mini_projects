<?php

namespace App\Http\Controllers;

use App\Models\RecipesModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Categories;
use Illuminate\Support\Facades\File;



class RecipesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function dashboard()
    {
        $role = auth()->user()->role;
        
        if ($role === 'admin') {
            $recipes = RecipesModel::where('is_active', false)->get();
            return view('dashboard.admin', compact('recipes'));
        } elseif ($role === 'editor') {
            return view('dashboard.dashboard');
        } else {
            return view('unauthorized');
        }
    }

    public function index()
    {
        $recipes = RecipesModel::with('category', 'user')->latest()->paginate(6);
        return view('index',compact('recipes'))->with(request()->input('page'));

    }
    public function displaybyuserid()
{
    // Fetch recipes associated with the  user's ID
    $recipes = RecipesModel::where('user_id', auth()->id())->latest()->get();
    return view('Dashboard.dashboard', compact('recipes'));
}

public function search(Request $request){
    $search = $request->search;
    $recipes = RecipesModel::where(function($query) use ($search){
        $query->where('title','like',"%$search%");
       
    })
    ->orWhereHas('category',function($query) use($search){
        $query->where('name','like',"%$search%");
    })
    ->paginate(6);
    return view('index',compact('recipes','search'));
}



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Categories::all();

        return view('Dashboard.create', compact('categories'));
    
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif',
            'ingredients' => 'required',
            'instruction' => 'required',
            'category_id' => 'required',
        ]);
    
        $data['user_id'] = Auth::id();
        if ($request->hasFile('image')) {
            $uploadedImage = $request->file('image');
        
            $imageName = time() . '_' . $uploadedImage->getClientOriginalName();
        
            $imagePath = $uploadedImage->storeAs('public/images', $imageName);
            File::move(storage_path('app/' . $imagePath), public_path('images/' . $imageName));
            $data['image'] = 'images/' . $imageName;
        }
       
    
        $newrecipes = RecipesModel::create($data);
    
        return redirect(route('dashboard'))->with('success', 'Recipe Added successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(RecipesModel $RecipesModel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($RecipesModel)
    {
        $Recipes = RecipesModel::find($RecipesModel);
        $categories = Categories::all();
        return view('Dashboard.edit' ,compact('categories', 'Recipes'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,  $recipe)
    {
        $recipe =  RecipesModel::find($recipe);
        $data = $request->validate([
            'title' => 'required',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif',
            'ingredients' => 'required',
            'instruction' => 'required',
            'category_id' => 'required',
        ]);
    
        $data['user_id'] = Auth::id();
        if ($request->hasFile('image')) {
            $uploadedImage = $request->file('image');
            
            
            $imageName = time() . '_' . $uploadedImage->getClientOriginalName();
        
          
            $imagePath = $uploadedImage->storeAs('public/images', $imageName);
        
           
            File::move(storage_path('app/' . $imagePath), public_path('images/' . $imageName));
        
          
            $data['image'] = 'images/' . $imageName;
    
       
            if ($recipe->image) {
                File::delete(public_path($recipe->image));
            }
        } else {
           
            $data['image'] = $recipe->image;
        }
    
        $recipe->update($data);
    
        return redirect(route('dashboard'))->with('success', 'Recipe modified successfully');
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($RecipesModel)
    {
        $Recipes = RecipesModel::find($RecipesModel);
        $Recipes->delete();
        return redirect()->route('dashboard')->with('success', 'Product Deleted Successfully');

    }
}
