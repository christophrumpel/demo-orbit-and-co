<?php

namespace App\Ai\Middleware;

use App\Models\Ticket;
use Closure;
use Laravel\Ai\Ai;
use Laravel\Ai\PendingStep;

class ChooseModelForTicket
{
    public function __construct(protected Ticket $ticket) {}

    /**
     * Handle the pending generation step.
     */
    public function handle(PendingStep $step, Closure $next)
    {
        $provider = Ai::textProvider($step->provider);

        $model = $this->ticket->urgent
            ? $provider->smartestTextModel()
            : $provider->cheapestTextModel();

        return $next($step->withModel($model));
    }
}
