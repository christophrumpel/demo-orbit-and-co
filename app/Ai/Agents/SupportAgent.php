<?php

namespace App\Ai\Agents;

use App\Ai\Middleware\ChooseModelForTicket;
use App\Ai\Tools\RefundBooking;
use App\Models\Ticket;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasMiddleware;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Promptable;
use Stringable;

class SupportAgent implements Agent, Conversational, HasMiddleware, HasTools
{
    use Promptable;
    use RemembersConversations;

    public function __construct(protected Ticket $ticket) {}

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<<TEXT
        You are a member of the ground crew at Orbit & Co., a space tourism company.
        Draft a short, friendly reply to the customer's support ticket below.
        If the customer asks for their money back, refund them before replying.
        Sign off as "Your Orbit & Co. ground crew".

        Customer: {$this->ticket->name}
        Subject: {$this->ticket->subject}
        Message: {$this->ticket->body}
        TEXT;
    }

    /**
     * Get the tools available to the agent.
     */
    public function tools(): iterable
    {
        return [new RefundBooking($this->ticket)];
    }

    /**
     * Get the middleware that wraps every generation step.
     */
    public function middleware(): array
    {
        return [new ChooseModelForTicket($this->ticket)];
    }
}
