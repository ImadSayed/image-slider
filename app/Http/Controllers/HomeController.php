<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $imageMimeTypes = ['jpg', 'jpeg', 'png', 'gif'];

        // get all files in the storage/app/public/images directory
        $files = Storage::disk('public')->files('images');

        // filter for image files eg. jpg, png, gif
        $images = array_filter($files, function($file) use ($imageMimeTypes) {
            return in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), $imageMimeTypes);
        });

        // generate URLs for the images
        $imageUrls = array_map(function ($file) {
            // use asset() to generate the URL for the public disk
            return asset('storage/' . $file);
        }, $images);

        // pass URLs to view
        return Inertia::render(
            'home', [
                'imageUrls' => $imageUrls
            ]
        );
    }
}
