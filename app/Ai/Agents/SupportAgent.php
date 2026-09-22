<?php

namespace App\Ai\Agents;

use App\Ai\Middleware\ChooseModelForTicket;
use App\Models\Ticket;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasMiddleware;
use Laravel\Ai\Promptable;
use Stringable;

class SupportAgent implements Agent, HasMiddleware
{
    use Promptable;

    public function __construct(protected Ticket $ticket) {}

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<<TEXT
        You are a member of the ground crew at Orbit & Co., a space tourism company.
        Draft a short, friendly reply to the customer's support ticket below.
        Sign off as "Your Orbit & Co. ground crew".

        Customer: {$this->ticket->name}
        Subject: {$this->ticket->subject}
        Message: {$this->ticket->body}
        TEXT;
    }

    /**
     * Get the middleware that wraps every generation step.
     */
    public function middleware(): array
    {
        return [new ChooseModelForTicket($this->ticket)];
    }
}
