<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReplyController extends Controller
{
    public function __invoke(Request $request, Ticket $ticket): RedirectResponse
    {
        $ticket->update([
            'reply' => $request->string('reply')->trim()->toString(),
            'replied_at' => now(),
        ]);

        return back();
    }
}
