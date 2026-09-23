<?php

use App\Ai\Agents\SupportAgent;
use App\Models\Ticket;
use Laravel\Ai\Approvals\PendingApproval;
use Laravel\Ai\Responses\AgentResponse;

test('a refund pauses for approval and resumes once approved', function () {
    $ticket = Ticket::factory()->create(['category' => 'billing']);

    SupportAgent::fake(fn (string $prompt) => match (true) {
        str_contains($prompt, 'Draft a reply') => AgentResponse::fakeWithPendingApprovals([
            new PendingApproval('call_1', 'RefundBooking', ['amount' => 48000, 'reason' => 'Charged twice']),
        ]),
        str_contains($prompt, 'title') => 'Refund request',
        default => 'Hi! We refunded the duplicate charge.',
    });

    $this->post("/inbox/{$ticket->id}/draft")->assertRedirect();

    $ticket->refresh();

    expect($ticket->pending_approval['tool'])->toBe('RefundBooking')
        ->and($ticket->conversation_id)->not->toBeNull();

    $this->post("/inbox/{$ticket->id}/approvals/call_1", ['approve' => true])->assertRedirect();

    expect($ticket->refresh()->pending_approval)->toBeNull()
        ->and(session('draft.text'))->toBe('Hi! We refunded the duplicate charge.');
});
