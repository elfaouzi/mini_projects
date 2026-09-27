<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="{{ asset('assets/css/open-iconic-bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/animate.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/owl.carousel.min.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/owl.theme.default.min.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/magnific-popup.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/aos.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/ionicons.min.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/bootstrap-datepicker.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/jquery.timepicker.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/flaticon.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/icomoon.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">

        <!-- Styles -->
        
    </head>
    <body class="antialiased">
         
                  <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                    <div class="container">
                      <a class="navbar-brand" href="/">RecipeBook</a>
                      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="oi oi-menu"></span> Menu
                      </button>
            
                      <div class="collapse navbar-collapse" id="ftco-nav">
                        <ul class="navbar-nav ml-auto">
                         
                            @if (Route::has('login'))
                                @auth
                                   <li> <a href="{{ url('/dashboard') }}" class="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">Dashboard</a></li>
                                @else
                                  <li> <a href="{{ route('login') }}" class="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">Log in</a></li> 
            
                                    @if (Route::has('register'))
                                        <li><a href="{{ route('register') }}" class="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">Register</a></li>
                                    @endif
                                @endauth
                        </ul>
                      </div>
                      @endif
                    </div>
                  </nav>
                <!-- END nav -->
                
                <section class="home-slider owl-carousel js-fullheight">
                  <div class="slider-item js-fullheight" style="background-image: url({{ asset('assets/images/bg_1.jpg') }});"
                  >
                      <div class="overlay"></div>
                    <div class="container">
                      <div class="row slider-text js-fullheight justify-content-center align-items-center" data-scrollax-parent="true">
            
                        <div class="col-md-12 col-sm-12 text-center ftco-animate">
                            <span class="subheading">Recipe Book</span>
                          <h1 class="mb-4">Best Recipes</h1>
                        </div>
            
                      </div>
                    </div>
                  </div>
            
                  <div class="slider-item js-fullheight" style="background-image: url({{asset('assets/images/bg_2.jpg')  }});">
                      <div class="overlay"></div>
                    <div class="container">
                      <div class="row slider-text js-fullheight justify-content-center align-items-center" data-scrollax-parent="true">
            
                        <div class="col-md-12 col-sm-12 text-center ftco-animate">
                            <span class="subheading">Recipe Book</span>
                          <h1 class="mb-4">Nutritious &amp; Tasty</h1>
                        </div>
            
                      </div>
                    </div>
                  </div>
            
                  <div class="slider-item js-fullheight" style="background-image: url({{asset('assets/images/bg_3.jpg')  }});">
                      <div class="overlay"></div>
                    <div class="container">
                      <div class="row slider-text justify-content-center align-items-center" data-scrollax-parent="true">
            
                        <div class="col-md-12 col-sm-12 text-center ftco-animate">
                            <span class="subheading">Recipe Book</span>
                          <h1 class="mb-4">Delicious Specialties</h1>
                        </div>
            
                      </div>
                    </div>
                  </div>
                </section>
            
             
            
                
                   
            
                   
                <section class="ftco-section">
                    <div class="container">
                        <div class="row no-gutters justify-content-center mb-5 pb-2">
                      <div class="col-md-12 text-center heading-section ftco-animate">
                          <span class="subheading">Recipe</span>
                        <h2 class="mb-4">Book</h2>
                      </div>
                    </div>
                      <div class="row justify-content-center mb-5 pb-2">
            <div class="col-md-6">
                <form action="/search" method="GET" class="search-form">
                  <div class="input-group">
                    <input type="text" class="form-control rounded" placeholder="Search recipe..." name="search" value="{{ isset($search) ? $search : '' }}">
                    <div class="input-group-append">
                        <button type="submit" class="btn btn-primary rounded-right">Search</button>
                    </div>
                    </div>
                </form>
            </div>
        </div>
                    <div class="row  d-flex align-items-stretch ">
                        @foreach($recipes as $recipe)
                            <div class="col-md-12 col-lg-6 d-flex align-self-stretch my-3 " style="border-radius: 10px">
                                <div class="menus d-sm-flex ftco-animate align-items-stretch">
                                    <div class="menu-img img rounded-left" style="background-image: url({{asset($recipe->image) }});"></div>
                                    <div class="text d-flex align-items-center rounded-right">
                                        <div>
                                            <div class="d-flex">
                                                <div class="one-half">
                                                    <h3>{{ $recipe->title }}</h3>
                                                </div>
                                                <div class="one-forth">
                                                    <span class="price">{{ $recipe->category->name }}</span>
                                                </div>
                                                
                                            </div>
                                           <p>By: -<strong>{{ $recipe->user->name }}</strong> </p>
                                            <button type="button" class="btn btn-primary more-details-button" 
                                            data-bs-toggle="modal" data-bs-target="#recipeModal"
                                            data-title="{{ $recipe->title }}" 
                                            data-image="{{ asset($recipe->image) }}"
                                            data-ingredients="{{ $recipe->ingredients }}"
                                            data-instruction="{{ $recipe->instruction }}"
                                            data-category="{{ $recipe->category->name }}"
                                            data-user="{{ $recipe->user->name }}">More Details</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
    
                    <div class="mt-4">
                      <nav aria-label="Page navigation">
                          <ul class="pagination justify-content-center">
                              {{ $recipes->links() }}
                          </ul>
                      </nav>
                  </div>
                </div>
            </section>
            <div class="modal fade" id="recipeModal" tabindex="-1" aria-labelledby="recipeModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="recipeModalLabel"></h5>
                            <button type="button" class="btn-close btn btn-primary more-details-button" data-dismiss="modal" aria-label="Close">X</button>
                        </div>
                        <div class="modal-body">
                            <img src="" id="recipeImage" class="img-fluid mb-2" alt="Recipe Image">
                            <p><strong>Ingredients:</strong> <br> <span id="recipeIngredients"></span></p>
                            <p><strong>Instruction:</strong>  <br> <span id="recipeInstruction"></span></p> 
                            <p><strong>Category:</strong> <span id="recipeCategory"></span></p>
                            <p><strong>Added by:</strong> <span id="recipeUser"></span></p>
                        </div>
                    </div>
                </div>
            </div>
            
                
                    
                    
                <footer class="ftco-footer ftco-bg-dark ftco-section">
                  <div class="container">
                    <div class="row mb-5">
                      <div class="col-md-6 col-lg-3">
                        <div class="ftco-footer-widget mb-4">
                          <h2 class="ftco-heading-2">Recipe Book</h2>
                          <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                          <ul class="ftco-footer-social list-unstyled float-md-left float-lft mt-3">
                            <li class="ftco-animate"><a href="#"><span class="icon-twitter"></span></a></li>
                            <li class="ftco-animate"><a href="#"><span class="icon-facebook"></span></a></li>
                            <li class="ftco-animate"><a href="#"><span class="icon-instagram"></span></a></li>
                          </ul>
                        </div>
                    </div>
                    
                    </div>
                
                  </div>
                </footer>
              
            
              <!-- loader -->
              {{-- <div id="ftco-loader" class="show fullscreen"><svg class="circular" width="48px" height="48px"><circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee"/><circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10" stroke="#F96D00"/></svg></div> --}}
            
            
              <script>
                document.addEventListener('DOMContentLoaded', function () {
                    var recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
        
                    var moreDetailsButtons = document.querySelectorAll('.more-details-button');
        
                    moreDetailsButtons.forEach(function (button) {
                        button.addEventListener('click', function () {
                            var recipeTitle = this.dataset.title;
                            var recipeImage = this.dataset.image;
                            var recipeIngredients = this.dataset.ingredients;
                            var recipeInstruction = this.dataset.instruction; 
                            var recipeCategory = this.dataset.category;
                            var recipeUserName = this.dataset.user;
                            
        
                            document.getElementById('recipeModalLabel').innerText = recipeTitle;
                            document.getElementById('recipeImage').src = recipeImage;
                            document.getElementById('recipeIngredients').innerText = recipeIngredients;
                            document.getElementById('recipeInstruction').innerText= recipeInstruction;
                            document.getElementById('recipeCategory').innerText = recipeCategory;
                            document.getElementById('recipeUser').innerText = recipeUserName;
        
                            recipeModal.show();
                        });
                    });
                });
            </script>
          
              <script src="{{ asset('assets/js/jquery.min.js') }}"></script>
              <script src="{{ asset('assets/js/jquery-migrate-3.0.1.min.js') }}"></script>
              <script src="{{ asset('assets/js/popper.min.js') }}"></script>
              <script src="{{ asset('assets/js/bootstrap.min.js') }}"></script>
              <script src="{{ asset('assets/js/jquery.easing.1.3.js') }}"></script>
              <script src="{{ asset('assets/js/jquery.waypoints.min.js') }}"></script>
              <script src="{{ asset('assets/js/jquery.stellar.min.js') }}"></script>
              <script src="{{ asset('assets/js/owl.carousel.min.js') }}"></script>
              <script src="{{ asset('assets/js/jquery.magnific-popup.min.js') }}"></script>
              <script src="{{ asset('assets/js/aos.js') }}"></script>
              <script src="{{ asset('assets/js/jquery.animateNumber.min.js') }}"></script>
              <script src="{{ asset('assets/js/bootstrap-datepicker.js') }}"></script>
              <script src="{{ asset('assets/js/jquery.timepicker.min.js') }}"></script>
              <script src="{{ asset('assets/js/scrollax.min.js') }}"></script>
              <script src="{{ asset('assets/js/google-map.js') }}"></script>
              <script src="{{ asset('assets/js/main.js') }}"></script>
              
          

                  
              
        </div>
    </body>
</html>
