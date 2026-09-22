<?php

use App\Models\Ticket;
use App\TicketCategory;
use Laravel\Ai\Classification;
use Laravel\Ai\Responses\Data\BooleanAnswer;
use Laravel\Ai\Responses\Data\ChoiceAnswer;

test('a submitted ticket is classified into a department', function () {
    Classification::fake([
        [
            'department' => new ChoiceAnswer('billing', ['billing' => 0.94, 'technical' => 0.04, 'general' => 0.02], 0.94),
            'urgent' => new BooleanAnswer(0.91),
        ],
    ]);

    $this->post('/support', [
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.com',
        'subject' => 'Charged twice for my Mars window seat',
        'body' => 'I see two charges on my card for the same booking.',
    ])->assertRedirect();

    $ticket = Ticket::sole();

    expect($ticket->category)->toBe(TicketCategory::Billing)
        ->and($ticket->confidence)->toBe(0.94)
        ->and($ticket->urgent)->toBeTrue();

    Classification::assertClassified(fn ($classification) => str_contains(json_encode($classification->state), 'Charged twice'));
});
