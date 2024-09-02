<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
  private string $view = 'eksternal::home';

  public function index()
  {
    $partners = [
      [
        "image_url" => "/assets/media/logos/logo-only.png"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png"
      ]
    ];

    $testimonials = [
      [
        "avatar"    => "https://e7.pngegg.com/pngimages/340/946/png-clipart-avatar-user-computer-icons-software-developer-avatar-child-face-thumbnail.png",
        "title"     => "Luqni Maulana",
        "subtitle"  => "Web Developer",
        "content"   => "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse ad eius molestiae, magni quia ratione possimus exercitationem vero blanditiis in doloremque nesciunt enim nostrum voluptates facilis ea eligendi totam quae."
      ],
      [
        "avatar"    => "https://e7.pngegg.com/pngimages/340/946/png-clipart-avatar-user-computer-icons-software-developer-avatar-child-face-thumbnail.png",
        "title"     => "Bondan Dwi Nugroho",
        "subtitle"  => "Web Developer",
        "content"   => "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse ad eius molestiae, magni quia ratione possimus exercitationem vero blanditiis in doloremque nesciunt enim nostrum voluptates facilis ea eligendi totam quae."
      ],
      [
        "avatar"    => "https://e7.pngegg.com/pngimages/340/946/png-clipart-avatar-user-computer-icons-software-developer-avatar-child-face-thumbnail.png",
        "title"     => "Aldino Kemal Adi Gumawang",
        "subtitle"  => "Web Developer",
        "content"   => "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse ad eius molestiae, magni quia ratione possimus exercitationem vero blanditiis in doloremque nesciunt enim nostrum voluptates facilis ea eligendi totam quae."
      ],
      [
        "avatar"    => "https://e7.pngegg.com/pngimages/340/946/png-clipart-avatar-user-computer-icons-software-developer-avatar-child-face-thumbnail.png",
        "title"     => "Luqni Maulana II",
        "subtitle"  => "Web Developer",
        "content"   => "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse ad eius molestiae, magni quia ratione possimus exercitationem vero blanditiis in doloremque nesciunt enim nostrum voluptates facilis ea eligendi totam quae."
      ],
      [
        "avatar"    => "https://e7.pngegg.com/pngimages/340/946/png-clipart-avatar-user-computer-icons-software-developer-avatar-child-face-thumbnail.png",
        "title"     => "Bondan Dwi Nugroho II",
        "subtitle"  => "Web Developer",
        "content"   => "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse ad eius molestiae, magni quia ratione possimus exercitationem vero blanditiis in doloremque nesciunt enim nostrum voluptates facilis ea eligendi totam quae."
      ],
      [
        "avatar"    => "https://e7.pngegg.com/pngimages/340/946/png-clipart-avatar-user-computer-icons-software-developer-avatar-child-face-thumbnail.png",
        "title"     => "Aldino Kemal Adi Gumawang II",
        "subtitle"  => "Web Developer",
        "content"   => "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse ad eius molestiae, magni quia ratione possimus exercitationem vero blanditiis in doloremque nesciunt enim nostrum voluptates facilis ea eligendi totam quae."
      ],
    ];
    
    return view("$this->view.index", [
      "partners"      => $partners,
      "testimonials"  => $testimonials
    ]);
  }
}
