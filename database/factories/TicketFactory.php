<?php

namespace Database\Factories;

use App\TicketCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'subject' => fake()->sentence(4),
            'body' => fake()->paragraph(),
            'category' => TicketCategory::General,
        ];
    }
}
