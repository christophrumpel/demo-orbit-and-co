<?php

namespace App;

enum TicketCategory: string
{
    case General = 'general';
    case Billing = 'billing';
    case Technical = 'technical';

    public function label(): string
    {
        return match ($this) {
            self::General => 'General',
            self::Billing => 'Billing',
            self::Technical => 'Technical',
        };
    }
}
