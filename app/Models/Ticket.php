<?php

namespace App\Models;

use App\TicketCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    /** @use HasFactory<\Database\Factories\TicketFactory> */
    use HasFactory;

    protected $fillable = ['name', 'email', 'subject', 'body', 'category', 'confidence', 'urgent', 'conversation_id', 'pending_approval', 'refunded_at', 'reply', 'replied_at'];

    protected function casts(): array
    {
        return [
            'category' => TicketCategory::class,
            'urgent' => 'boolean',
            'pending_approval' => 'array',
            'refunded_at' => 'datetime',
            'replied_at' => 'datetime',
        ];
    }
}
