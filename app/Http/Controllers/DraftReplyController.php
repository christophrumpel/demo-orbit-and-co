<?php

namespace App\Http\Controllers;

use App\Ai\Agents\SupportAgent;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;

class DraftReplyController extends Controller
{
    public function __invoke(Ticket $ticket): RedirectResponse
    {
        $response = new SupportAgent($ticket)->prompt('Draft a reply to this ticket.');

        return back()->with('draft', [
            'text' => $response->text,
            'model' => $response->meta->model,
        ]);
    }
}
