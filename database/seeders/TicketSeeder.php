<?php

namespace Database\Seeders;

use App\Models\Ticket;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $tickets = [
            ['Nova Reyes', 'nova@example.com', 'Can I bring my cat to orbit?', "Hi! I'm booked on the Aurora Loop next month and my cat Pixel is basically family. Is there any way she can come along? She's very calm and has her own tiny helmet."],
            ['Milo Andersen', 'milo@example.com', 'Window seat on the lunar flyby', "Booked the Lunar Flyby for two. Is it possible to request window seats? My partner has never seen Earth from space and I want the first look to be a good one."],
            ['Priya Natarajan', 'priya@example.com', 'How long is the pre-flight training?', "I'm considering the Orbit Weekend package. How many days of training do I need beforehand, and can it be done remotely?"],
            ['Jonas Weber', 'jonas@example.com', 'Meal options during the flight', "Do you offer vegetarian meals on the Aurora Loop? Also curious what zero-g coffee is like."],
        ];

        foreach ($tickets as [$name, $email, $subject, $body]) {
            Ticket::create([
                'name' => $name,
                'email' => $email,
                'subject' => $subject,
                'body' => $body,
            ]);
        }
    }
}
