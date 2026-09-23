<?php

use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\DraftReplyController;
use App\Http\Controllers\InboxController;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\SupportTicketController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'home')->name('home');
Route::inertia('/demos', 'demos')->name('demos');

Route::get('/support', [SupportTicketController::class, 'create'])->name('support');
Route::post('/support', [SupportTicketController::class, 'store'])->name('support.store');

Route::get('/inbox/{ticket?}', [InboxController::class, 'index'])->name('inbox');
Route::post('/inbox/{ticket}/reply', ReplyController::class)->name('inbox.reply');
Route::post('/inbox/{ticket}/draft', DraftReplyController::class)->name('inbox.draft');
Route::post('/inbox/{ticket}/approvals/{approval}', ApprovalController::class)->name('inbox.approve');
