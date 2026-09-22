<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Laravel\Ai\Responses\AgentResponse;

trait RespondsWithDraft
{
    /**
     * Store a pending approval on the ticket, or flash the finished draft.
     */
    protected function respondWithDraft(Ticket $ticket, AgentResponse $response): RedirectResponse
    {
        if ($response->hasPendingApprovals()) {
            $ticket->update([
                'conversation_id' => $response->conversationId,
                'pending_approval' => $response->pendingApprovals->first()->toArray(),
            ]);

            return back();
        }

        $ticket->update(['pending_approval' => null]);

        return back()->with('draft', [
            'text' => $response->text,
            'model' => $response->meta->model,
        ]);
    }
}
