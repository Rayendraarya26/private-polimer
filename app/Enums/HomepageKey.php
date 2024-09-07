<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;
use Faker\Factory;

enum HomepageKey: string
{
    use EnumConcern;

    case SLIDER = 'SLIDER';
    case SERVICES = 'SERVICES';
    case PARTNERS = 'PARTNERS';
    case ABOUT = 'ABOUT';
	
	public function getValue(): string
    {
		$faker = Factory::create();
		
        return match ($this) {
            self::ABOUT => json_encode(['html' => $faker->sentence]),
            self::SLIDER => json_encode([
							[
								"id" => "9cf1c971-806b-4c25-93b6-eb5f224a4d36"
								, "order" => 1
								, "description" => "keenthemes"
								, "image_path"=> "slider/VknktKqRmua6VByWwrF6hTt7hZ8qlAmtzoh3QCE5.png"
							],
							[
								"id" => "9cf1c971-806b-4c25-93b6-eb5f224a4c69"
								, "order" => 2
								, "description" => "keenthemes ke 2"
								, "image_path"=> "slider/VknktKqRmua6VByWwrF6hTt7hZ8qlAmtzoh3QCE5.png"
							]
					]),
            self::PARTNERS => json_encode([]),
            self::SERVICES => json_encode([]),
        };
    }
	
}
