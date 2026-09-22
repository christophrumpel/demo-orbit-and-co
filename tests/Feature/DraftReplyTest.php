<?php

use App\Ai\Agents\SupportAgent;
use App\Models\Ticket;

test('an urgent ticket is drafted with the smartest model', function () {
    SupportAgent::fake(['Hi Ada, so sorry about the double charge!']);

    $ticket = Ticket::factory()->create(['urgent' => true]);

    $this->post("/inbox/{$ticket->id}/draft")->assertRedirect();

    expect(session('draft.text'))->toBe('Hi Ada, so sorry about the double charge!');

    SupportAgent::assertPrompted(fn ($prompt) => str_contains($prompt->prompt, 'Draft a reply'));
});
