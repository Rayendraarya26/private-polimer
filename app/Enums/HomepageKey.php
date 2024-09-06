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
            self::SLIDER => json_encode(['data' => null]),
            self::PARTNERS => json_encode(['data' => null]),
            self::SERVICES => json_encode(['data' => null]),
        };
    }
	
}
