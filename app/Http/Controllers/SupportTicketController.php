<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketRequest;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SupportTicketController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('support/create');
    }

    public function store(StoreTicketRequest $request): RedirectResponse
    {
        Ticket::create($request->validated());

        return back()->with('status', 'Ticket sent. Our crew will get back to you shortly.');
    }
}
