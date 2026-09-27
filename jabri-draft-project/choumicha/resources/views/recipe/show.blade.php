@extends('layouts.app')

@section('content')
    <div class="container mt-4">
        <div class="card">
            <img src="{{ $recipe->image_url }}" class="card-img-top" alt="{{ $recipe->name }}">
            <div class="card-body">
                <h5 class="card-title">{{ $recipe->name }}</h5>
                <p class="card-text">{{ $recipe->description }}</p>
                <p class="card-text"><strong>Ingredients:</strong> {{ $recipe->ingredients }}</p>
                <p class="card-text"><strong>Instructions:</strong> {{ $recipe->instructions }}</p>
            </div>
        </div>
    </div>
@endsection
