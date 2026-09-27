<x-app-layout>
    <div class="container">
        @if ($errors->any())
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Errors!</strong>
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    </div>
    <div class="container mx-auto flex justify-center text-center p-5">
        <div class="p-10 rounded shadow-md" style="background:#847c75">
            <h2 class="text-3xl font-bold mb-6 text-dark">Modify Recipe</h2>
            <form action="{{ route('Dashboard.update', $Recipes )}}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('patch')
    
                <div class="grid grid-cols-2 gap-6">
                    <!-- Left column -->
                    <div class="mb-8">
                        <label for="title" class="block text-dark text-lg font-bold">Title</label>
                        <input type="text" id="title" name="title" class="mt-1 p-2 w-full border rounded-md" value="{{ old('title', $Recipes->title) }}">
                    </div>
                    <div class="mb-8 ">
                        <label for="category_id" class="block text-dark text-lg font-bold">Category</label>
                        <select id="category_id" name="category_id" class="mt-1 p-2 w-full border rounded-md">
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}" {{ $category->id == $Recipes->category_id ? 'selected' : '' }}>
                                    {{ $category->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <img class="w-full h-48 object-cover" src="{{ asset($Recipes->image) }}" alt="Recipe Image">
                    <div class="mb-8  ">
                        <label for="image" class="block text-dark text-lg font-bold">Image</label>
                        <input type="file" id="image" name="image" class="mt-1 p-2 w-full border rounded-md">
                    </div>
                    
                </div>
                <div >
                    <div class="mb-8">
                        <label for="ingredients" class="block text-dark text-lg font-bold">Ingredients</label>
                        <textarea id="ingredients" name="ingredients" rows="4" class="mt-2 p-4 w-full border rounded-md">{{ old('ingredients', $Recipes->ingredients) }}</textarea>
                    </div>
                    <div class="mb-8">
                        <label for="instruction" class="block text-dark text-lg font-bold">Instructions</label>
                        <textarea id="instruction" name="instruction" rows="4" class="mt-2 p-4 w-full border rounded-md">{{ old('instruction', $Recipes->instruction) }}</textarea>
                    </div>
                </div>
    
                <div class="mt-6">
                    <button type="submit" class="text-white py-2 px-4 rounded-md" style="background: #c8a97e">Modify Recipe</button>
                </div>
            </form>
        </div>
    </div>
    
       
   </x-app-layout>
   
   