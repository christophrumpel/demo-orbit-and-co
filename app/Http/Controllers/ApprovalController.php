<?php

namespace App\Http\Controllers;

use App\Ai\Agents\SupportAgent;
use App\Http\Controllers\Concerns\RespondsWithDraft;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Ai\Approvals\Decision;
use Laravel\Ai\Approvals\Decisions;

class ApprovalController extends Controller
{
    use RespondsWithDraft;

    public function __invoke(Request $request, Ticket $ticket, string $approval): RedirectResponse
    {
        $decision = $request->boolean('approve')
            ? Decision::approve()
            : Decision::reject('The ground crew declined the refund.');

        $response = (new SupportAgent($ticket))
            ->continue($ticket->conversation_id, as: $ticket)
            ->prompt(Decisions::from([$approval => $decision]));

        return $this->respondWithDraft($ticket, $response);
    }
}
