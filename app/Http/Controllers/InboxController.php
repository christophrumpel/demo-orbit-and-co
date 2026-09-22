<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\TicketCategory;
use Inertia\Inertia;
use Inertia\Response;

class InboxController extends Controller
{
    public function index(?Ticket $ticket = null): Response
    {
        $tickets = Ticket::latest()->get();

        return Inertia::render('inbox/index', [
            'lanes' => collect(TicketCategory::cases())->map(fn (TicketCategory $category) => [
                'key' => $category->value,
                'label' => $category->label(),
                'tickets' => $tickets
                    ->where('category', $category)
                    ->map(fn (Ticket $ticket) => $this->summary($ticket))
                    ->values(),
            ]),
            'selected' => $ticket ? [
                ...$this->summary($ticket),
                'body' => $ticket->body,
                'email' => $ticket->email,
                'reply' => $ticket->reply,
            ] : null,
            'draft' => session('draft'),
        ]);
    }

    protected function summary(Ticket $ticket): array
    {
        return [
            'id' => $ticket->id,
            'name' => $ticket->name,
            'subject' => $ticket->subject,
            'category' => $ticket->category->value,
            'confidence' => $ticket->confidence,
            'urgent' => $ticket->urgent,
            'pending_approval' => $ticket->pending_approval,
            'refunded' => $ticket->refunded_at !== null,
            'replied' => $ticket->replied_at !== null,
            'created_at' => $ticket->created_at->diffForHumans(short: true),
        ];
    }
}
