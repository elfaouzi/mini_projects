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
    <div class="container mx-auto  flex justify-center text-center p-5">
        <div class="p-10 rounded shadow-md " style="background:#847c75">
            <h2 class="text-3xl font-bold mb-6 text-dark">Add Recipe</h2>
            <form action="{{ route('Dashboard.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
    
                <div class="grid grid-cols-2 gap-6">
                 
                    <div class="mt-20">
                        <div class="mb-8">
                            <label for="title" class="block text-dark text-lg font-bold">Title</label>
                            <input type="text" id="title" name="title" class="mt-2  w-full border rounded-md text-lg">
                        </div>
                        <div class="mb-8">
                            <label for="image" class="block text-dark text-md font-medium">Image</label>
                            <input type="file" id="image" name="image" class="mt-2  w-full border rounded-md text-md">
                        </div>
                        <div class="mb-8">
                            <label for="category_id" class="block text-dark text-md font-medium">Category</label>
                            <select id="category_id" name="category_id" class="mt-2  w-full border rounded-md text-md">
                                @foreach($categories as $category)
                                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <div class="mb-8">
                            <label for="ingredients" class="block text-dark text-md font-medium">Ingredients</label>
                            <textarea id="ingredients" name="ingredients" rows="4" class="mt-2 p-10 w-full border rounded-md text-md"></textarea>
                        </div>
                        <div class="mb-8">
                            <label for="instruction" class="block text-dark text-md font-medium">Instructions</label>
                            <textarea id="instruction" name="instruction" rows="4" class="mt-2 p-10 w-full border rounded-md text-md"></textarea>
                        </div>
                    </div>
                </div>
            
            <div class="mt-6">
                <button type="submit" class=" text-white py-2 px-4 rounded-md" style="background: #c8a97e">Add Recipe</button>
            </div>
        </form>
    </div>
</div>

    
</x-app-layout>

