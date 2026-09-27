<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use app\Models\Categories;

class InsertCategory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:insert-categories {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');

        $category = new Categories;
        $category->name = $name;
        $category->save();

        $this->info("Category '$name' inserted successfully.");
    }
}
