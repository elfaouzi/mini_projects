<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-dark  overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-white  text-center">
                    {{ __("Your Recipes") }}
                </div>
            </div> 
            @if(session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                {{ session('success') }}
            </div>
        @endif

            <a href="{{ route('Dashboard.create') }}" class="float-right  mt-3 mb-4 p-2  text-white rounded " style="background: #c8a97e">New Recipe</a>

            <div class=" container mt-20 flex flex-wrap gap-4">
                @foreach ($recipes as $recipe)
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                        @if ($recipe->image)
                            <img class="w-full h-48 object-cover" src="{{ asset($recipe->image) }}" alt="Recipe Image">
                        @else
                            <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <p class="text-gray-500">No image available</p>
                            </div>
                        @endif
                        <div class="p-4">
                            <h3 class="text-xl font-semibold mb-2">{{ $recipe->title }}</h3>
                        </div>
                        <div class="text-white text-center m-3">
                            <div class="inline-block mr-2">
                                <a href="{{ route('Dashboard.edit', $recipe->id) }}" class="bg-yellow-200 px-4 py-2 text-gray-800 rounded">Edit</a>
                            </div>
                            <div class="inline-block">
                                <form action="{{ route('Dashboard.destroy', $recipe->id) }}" method="post" onsubmit="return confirm('Are you sure you want to delete this recipe?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                                </form>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
            
        </div>
    </div>
</x-app-layout>
