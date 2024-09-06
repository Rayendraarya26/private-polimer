<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;
use Faker\Factory;

enum HomepageKey: string
{
    use EnumConcern;

    case SLIDER = 'SLIDER';
    case ABOUT = 'ABOUT';
    case PARTNERS = 'PARTNERS';
    case SERVICES = 'SERVICES';
	
	public function getValue(): string
    {
		$faker = Factory::create();
		
        return match ($this) {
            self::SLIDER => json_encode(['data' => null]),
            self::ABOUT => $faker->sentence,
            self::PARTNERS => json_encode(['data' => null]),
            self::SERVICES => json_encode(['data' => null]),
        };
    }
	
}
