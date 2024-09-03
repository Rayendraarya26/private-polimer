<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
  private string $view = 'eksternal::home';

  public function index()
  {
    $banners = [
      [
        "image_url"   => "https://ca.shop.runningroom.com/media/catalog/category/Brand-page_banners-NB-Fall2022.jpeg",
        "title"       => "Lorem Ipsum Dolor Sit Amet.",
        "description" => "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum officia, doloremque dignissimos, ratione, commodi quam eum aliquam rem omnis a natus deserunt reiciendis? Accusamus, eius atque quaerat repellendus porro repellat!",
      ],
      [
        "image_url"   => "https://i.pinimg.com/736x/ff/f4/7f/fff47fe34d15dcbeab5961463a755d2a.jpg",
        "title"       => "Lorem Ipsum.",
        "description" => "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum officia, doloremque dignissimos, ratione, commodi quam eum aliquam rem omnis a natus deserunt reiciendis? Accusamus, eius atque quaerat repellendus porro repellat!",
      ],
      [
        "image_url"   => "https://www.bloommaterials.com/wp-content/uploads/2020/03/BLOOM-BRAND-copy_Adidas.png",
        "title"       => "Dolor Sit Amet.",
        "description" => "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum officia, doloremque dignissimos, ratione, commodi quam eum aliquam rem omnis a natus deserunt reiciendis? Accusamus, eius atque quaerat repellendus porro repellat!",
      ]
    ];

    $services = [
      [
        "image_url" => "/assets/media/logos/logo-only.png",
        "name"      => "Service Name"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png",
        "name"      => "Service Name"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png",
        "name"      => "Service Name"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png",
        "name"      => "Service Name"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png",
        "name"      => "Service Name"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png",
        "name"      => "Service Name"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png",
        "name"      => "Service Name"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png",
        "name"      => "Service Name"
      ],
      [
        "image_url" => "/assets/media/logos/logo-only.png",
        "name"      => "Service Name"
      ]
    ];

    $partners = [
      [
        "image_url" => "https://static.vecteezy.com/system/resources/previews/012/560/876/original/nike-logo-on-transparent-background-free-vector.jpg"
      ],
      [
        "image_url" => "https://i.pinimg.com/736x/6d/57/f6/6d57f6d7de64f61911cae8a6b48671ee.jpg"
      ],
      [
        "image_url" => "https://w7.pngwing.com/pngs/340/831/png-transparent-new-balance-sneakers-shoe-adidas-logo-new-balance-text-converse-store-thumbnail.png"
      ],
      [
        "image_url" => "https://blog.pengajartekno.co.id/wp-content/uploads/2022/11/logo-ortuseight-2.webp"
      ],
      [
        "image_url" => "https://w7.pngwing.com/pngs/670/927/png-transparent-puma-logo-puma-logo-adidas-swoosh-brand-adidas-text-carnivoran-sneakers-thumbnail.png"
      ],
      [
        "image_url" => "https://static.vecteezy.com/system/resources/previews/012/560/876/original/nike-logo-on-transparent-background-free-vector.jpg"
      ],
      [
        "image_url" => "https://i.pinimg.com/736x/6d/57/f6/6d57f6d7de64f61911cae8a6b48671ee.jpg"
      ],
      [
        "image_url" => "https://w7.pngwing.com/pngs/340/831/png-transparent-new-balance-sneakers-shoe-adidas-logo-new-balance-text-converse-store-thumbnail.png"
      ],
      [
        "image_url" => "https://blog.pengajartekno.co.id/wp-content/uploads/2022/11/logo-ortuseight-2.webp"
      ],
      [
        "image_url" => "https://w7.pngwing.com/pngs/670/927/png-transparent-puma-logo-puma-logo-adidas-swoosh-brand-adidas-text-carnivoran-sneakers-thumbnail.png"
      ],
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
      "banners"       => $banners,
      "services"      => $services,
      "partners"      => $partners,
      "testimonials"  => $testimonials
    ]);
  }
}
