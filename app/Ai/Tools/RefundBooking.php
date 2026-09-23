<?php

namespace App\Ai\Tools;

use App\Models\Ticket;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Concerns\InteractsWithApprovals;
use Laravel\Ai\Contracts\Approvable;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class RefundBooking implements Approvable, Tool
{
    use InteractsWithApprovals;

    public function __construct(protected Ticket $ticket) {}

    /**
     * Get the description of the tool's purpose.
     */
    public function description(): Stringable|string
    {
        return 'Refund the customer for their booking. Use it when the customer asks for money back.';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Stringable|string
    {
        $this->ticket->update(['refunded_at' => now()]);

        return "Refunded € {$request['amount']} to {$this->ticket->email}.";
    }

    /**
     * Get the tool's schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'amount' => $schema->number()->description('The amount to refund in euros.')->required(),
            'reason' => $schema->string()->description('Why the customer gets a refund.')->required(),
        ];
    }
}
