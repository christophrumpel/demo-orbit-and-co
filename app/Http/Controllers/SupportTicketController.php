<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketRequest;
use App\Models\Ticket;
use App\TicketCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Ai\Classification;
use Laravel\Ai\Classification\Boolean;
use Laravel\Ai\Classification\Choice;

class SupportTicketController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('support/create');
    }

    public function store(StoreTicketRequest $request): RedirectResponse
    {
        $answers = Classification::of($request->only('subject', 'body'))
            ->questions([
                'department' => new Choice('Which team should handle this ticket?', [
                    'billing' => 'Payments, invoices, refunds, double charges',
                    'technical' => 'Bugs, errors, login problems, things not working',
                    'general' => 'Everything else: questions, feedback, small talk',
                ]),
                'urgent' => new Boolean('Does the customer need help right now?'),
            ])
            ->classify();

        Ticket::create([
            ...$request->validated(),
            'category' => TicketCategory::from($answers->answer('department')->choice),
            'confidence' => $answers->answer('department')->confidence,
            'urgent' => $answers->answer('urgent')->isTrue(),
        ]);

        return back()->with('status', 'Ticket sent. Our crew will get back to you shortly.');
    }
}
