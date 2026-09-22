![Orbit & Co.](art/banner.png)

# Orbit & Co.

A small space-tourism support app that shows off three features of the [Laravel AI SDK](https://laravel.com/docs/13.x/ai-sdk) 1.0. It's the demo app from my [YouTube video on the Laravel AI SDK 1.0](https://youtu.be/IzcpPZqz2Nw), and every feature lives in its own commit so you can follow along step by step.

## What's inside

Customers file tickets at `/support` and the ground crew answers them at `/inbox`. The commits on `main` add AI one step at a time:

1. **Classify tickets with Jev.** Every new ticket is sorted into Billing, Technical or General with a confidence score, and flagged when it's urgent.
2. **Draft replies with an agent, pick the model per step.** "Draft with AI" asks a support agent for a reply, and a step middleware switches to the smartest model for urgent tickets and the cheapest one for everything else.
3. **Ask a human before refunding.** The agent can refund a booking, but the tool needs approval. The run pauses, you approve or reject in the inbox, and the agent finishes the reply.

The first commit is the app before any AI code. Check it out if you want to build the steps yourself.

## Setup

You need PHP 8.3+, Composer and Node.

```bash
git clone https://github.com/christophrumpel/demo-orbit-and-co.git && cd demo-orbit-and-co
composer setup
php artisan db:seed
```

Then add your API keys to `.env`:

```dotenv
TYPESAFE_API_KEY=   # classification (Jev)
OPENAI_API_KEY=     # the support agent
```

Start the app with `composer run dev` and open `/support`. The small buttons below the form fill in example tickets.

## Useful links

- [The video on YouTube](https://youtu.be/IzcpPZqz2Nw)
- [Laravel AI SDK docs](https://laravel.com/docs/13.x/ai-sdk)
- [Laravel AI SDK on GitHub](https://github.com/laravel/ai)
