<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;
use Faker\Factory;

enum HomepageKey: string
{
    use EnumConcern;

    case ABOUT = 'ABOUT';
    case SLIDER = 'SLIDER';
    case PARTNERS = 'PARTNERS';
    case SERVICES = 'SERVICES';
	
	public function getValue(): string
    {
		$faker = Factory::create();
		
        return match ($this) {
            self::ABOUT => json_encode(['data' => $faker->sentence]),
            self::SLIDER => json_encode([
				'data' => [
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
						]
				]),
            self::PARTNERS => json_encode(['data' => null]),
            self::SERVICES => json_encode(['data' => null]),
        };
    }
	
}
