import { Head, useForm, usePage } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { CtaButton, StatusDot } from '@/components/ui';
import { AppLayout, Container } from '@/layouts/app-layout';

type Flash = { status?: string };

const presets = [
    {
        label: 'Refund',
        dot: 'bg-lane-billing',
        tickets: [
            ['Refund for my Mars window seat', 'I was charged twice for booking ORB-4471, the Mars window seat. Please refund the extra €48,000.'],
            ['Cancel my Aurora Loop, money back please', 'I broke my leg skiing and my doctor says no launch this year. Please cancel booking ORB-5120 and refund the €32,500 I paid.'],
            ['Moon weekend was cancelled, where is my refund?', 'You cancelled my Moon weekend (ORB-3398) because of a solar storm. I would like my €18,900 back, not a voucher.'],
            ['Refund the zero-g dinner upgrade', 'I paid €2,400 for the zero-g dinner upgrade on ORB-6012, but it was not served on my flight. Please refund it.'],
        ],
    },
    {
        label: 'Urgent billing',
        dot: 'bg-red',
        tickets: [
            ['Payments failing', 'Payments failing since this morning. Fix this NOW. I can not pay for my launch on Friday.'],
            ['Card declined, launch window closes tonight', 'My card keeps getting declined at checkout and the launch window closes at midnight. I need this sorted immediately!'],
            ['Charged but no booking confirmation', 'I was charged €41,000 an hour ago but I have no confirmation and my seat is gone from the app. Please call me right away.'],
            ['Final payment link expired', 'The link for my final payment expired and my booking gets released in 30 minutes. Help, this is urgent!'],
        ],
    },
    {
        label: 'Technical',
        dot: 'bg-lane-technical',
        tickets: [
            ["Boarding pass QR won't scan", 'The QR code on my boarding pass will not scan at the gate kiosk. It shows the error INVALID_TOKEN (code 0x42).'],
            ['App crashes when I open my itinerary', 'Every time I tap "My itinerary" in the iOS app it crashes. I am on version 4.2.1, iPhone 16.'],
            ['Seat map is empty', 'When I try to pick my seat for the Lunar Flyby the seat map loads but shows no seats at all. Tried Chrome and Safari.'],
            ['Password reset email never arrives', 'I requested a password reset three times today but the email never shows up. Not in spam either.'],
        ],
    },
    {
        label: 'Urgent login',
        dot: 'bg-red',
        tickets: [
            ["Can't log in, launch in 2 hours", 'Every time I log in I get "Session expired". My launch is in 2 hours and I need my boarding pass right now!'],
            ['Locked out at the spaceport', 'I am at the spaceport and the app says my account is locked. Boarding starts in 40 minutes. Please unlock it now!'],
            ['2FA code never arrives, boarding soon', 'The two-factor code is not arriving and I cannot open my boarding pass. We board in one hour, please help fast.'],
            ['Account shows someone else', 'I logged in and see another person\'s bookings instead of mine. My flight is tomorrow morning, this needs fixing today.'],
        ],
    },
    {
        label: 'General',
        dot: 'bg-lane-general',
        tickets: [
            ['Do I need a passport for the Moon?', 'Quick question before my Moon weekend: do I need a passport or any other documents, or is my Orbit & Co. ID enough?'],
            ['Can I take photos during the flight?', 'Am I allowed to bring my own camera on the Aurora Loop, or do I have to use the onboard cameras?'],
            ['Gift card for my dad', 'Do you sell gift cards? My dad turns 70 and has always wanted to see Earth from above.'],
            ['Is there an age limit?', 'My daughter is 15. Is she old enough to join us on the Lunar Flyby?'],
        ],
    },
];

// Lives outside the component so it survives the remount after each submit.
const round: Record<string, number> = {};

export default function Create() {
    const { flash } = usePage<{ flash: Flash }>().props;
    const form = useForm({ name: 'Luna Park', email: 'luna@example.com', subject: '', body: '' });

    return (
        <AppLayout ships={2}>
            <Head title="Support" />

            <Container className="pt-16 pb-28">
                <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.2fr]">
                    <div className="pt-4">
                        <span className="eyebrow">GROUND CREW</span>
                        <h1 className="display-gradient mt-5 font-display text-[clamp(44px,5.5vw,72px)] leading-[1] font-semibold tracking-[-0.03em] [text-wrap:balance]">
                            Need a hand, astronaut?
                        </h1>
                        <p className="mt-7 max-w-[440px] text-[17px] leading-[26px] text-ink-weak [text-wrap:pretty]">
                            Tell us what's going on. Our ground crew reads every message and gets back to you before your next launch window.
                        </p>
                        <div className="mt-10 flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-ink-weak uppercase">
                            <StatusDot color="green" pulse />
                            Crew online · avg. reply 2h
                        </div>
                    </div>

                    <div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.post('/support', { onSuccess: () => form.reset('subject', 'body') });
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    e.preventDefault();
                                    e.currentTarget.requestSubmit();
                                }
                            }}
                            className="ring-line overflow-hidden rounded-2xl bg-panel-2 [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.55))_drop-shadow(0_0_50px_rgba(0,106,255,0.15))]"
                        >
                            <div className="flex items-center justify-between gap-4 border-b border-line-soft px-7 py-4">
                                <span className="font-mono text-[13px] tracking-[0.26em] text-amber">SUPPORT TICKET</span>
                                <span className="font-mono text-xs text-ink-weaker">ORB // ground crew</span>
                            </div>

                            <div className="px-7 pt-6 pb-7">
                                {flash.status && (
                                    <div className="mb-6 flex items-center gap-3 rounded-lg bg-green/10 px-4 py-3 text-sm font-medium text-green shadow-[0_0_0_1px_rgb(41_163_131/0.4)]">
                                        <StatusDot color="green" pulse />
                                        {flash.status}
                                    </div>
                                )}

                                <div className="grid gap-[18px] sm:grid-cols-2">
                                    <Field label="Name" error={form.errors.name}>
                                        <input className={input} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Nova Reyes" />
                                    </Field>
                                    <Field label="Email" error={form.errors.email}>
                                        <input className={input} type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} placeholder="nova@example.com" />
                                    </Field>
                                </div>

                                <Field label="Subject" error={form.errors.subject} className="mt-[18px]">
                                    <input className={input} value={form.data.subject} onChange={(e) => form.setData('subject', e.target.value)} placeholder="What's this about?" />
                                </Field>

                                <Field label="Message" error={form.errors.body} className="mt-[18px]">
                                    <textarea
                                        className={clsx(input, 'min-h-40 resize-none py-4 leading-6')}
                                        value={form.data.body}
                                        onChange={(e) => form.setData('body', e.target.value)}
                                        placeholder="Tell us everything…"
                                    />
                                </Field>

                                <div className="mt-7 flex justify-end">
                                    <CtaButton type="submit" disabled={form.processing}>
                                        {form.processing ? 'Sending…' : 'Send to ground crew'}
                                        <kbd className="ml-1 font-mono text-xs opacity-50">⌘↵</kbd>
                                    </CtaButton>
                                </div>
                            </div>
                        </form>

                        <div className="mt-4 flex flex-wrap justify-end gap-1.5">
                            {presets.map((preset) => (
                                <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => {
                                        const index = round[preset.label] ?? 0;
                                        const [subject, body] = preset.tickets[index % preset.tickets.length];
                                        form.setData({ ...form.data, subject, body });
                                        round[preset.label] = index + 1;
                                    }}
                                    className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 font-mono text-[11px] tracking-[0.06em] text-ink-weaker uppercase ring-line-soft transition-[box-shadow,color] duration-150 hover:text-ink hover:ring-line"
                                >
                                    <span className={clsx('size-1.5 rounded-full', preset.dot)} />
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </AppLayout>
    );
}

const input =
    'w-full rounded-lg bg-[rgb(214_251_252/0.05)] px-4 py-3.5 font-display text-[17px] font-medium text-ink ring-line outline-none transition-[box-shadow,background] duration-150 placeholder:font-sans placeholder:text-[15px] placeholder:font-normal placeholder:text-ink-weaker focus:field-hover';

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: ReactNode }) {
    return (
        <label className={clsx('flex flex-col gap-2', className)}>
            <span className="label-caps">{label}</span>
            {children}
            {error && <span className="text-xs text-red">{error}</span>}
        </label>
    );
}
