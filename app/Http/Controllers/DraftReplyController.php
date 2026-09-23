<?php

namespace App\Http\Controllers;

use App\Ai\Agents\SupportAgent;
use App\Http\Controllers\Concerns\RespondsWithDraft;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;

class DraftReplyController extends Controller
{
    use RespondsWithDraft;

    public function __invoke(Ticket $ticket): RedirectResponse
    {
        $response = (new SupportAgent($ticket))
            ->forUser($ticket)
            ->prompt('Draft a reply to this ticket.');

        return $this->respondWithDraft($ticket, $response);
    }
}
