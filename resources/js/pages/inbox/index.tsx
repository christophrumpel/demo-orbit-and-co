import { Head, Link, router } from '@inertiajs/react';
import { clsx } from 'clsx';
import { Fragment, useState } from 'react';
import { ActionButton, CtaButton, SectionHeading, StatusDot } from '@/components/ui';
import { AppLayout, Container } from '@/layouts/app-layout';

type Summary = {
    id: number;
    name: string;
    subject: string;
    category: string;
    confidence: number | null;
    urgent: boolean;
    pending_approval: PendingApproval | null;
    refunded: boolean;
    replied: boolean;
    created_at: string;
};

type PendingApproval = { id: string; tool: string; arguments: Record<string, string | number>; reason: string | null };

type Draft = { text: string; model: string } | null;

type Lane = { key: string; label: string; tickets: Summary[] };

type Selected = Summary & { body: string; email: string; reply: string | null };

const laneStyles: Record<string, { dot: string; ring: string; text: string }> = {
    general: { dot: 'bg-lane-general', ring: 'shadow-[0_0_0_1px_rgb(41_163_131/0.7),0_0_22px_rgb(41_163_131/0.25)]', text: 'text-lane-general' },
    billing: { dot: 'bg-lane-billing', ring: 'shadow-[0_0_0_1px_rgb(238_157_43/0.7),0_0_22px_rgb(238_157_43/0.25)]', text: 'text-lane-billing' },
    technical: { dot: 'bg-lane-technical', ring: 'shadow-[0_0_0_1px_rgb(140_187_255/0.7),0_0_22px_rgb(0_106_255/0.3)]', text: 'text-lane-technical' },
};

export default function Index({ lanes, selected, draft }: { lanes: Lane[]; selected: Selected | null; draft: Draft }) {
    const total = lanes.reduce((sum, lane) => sum + lane.tickets.length, 0);

    return (
        <AppLayout wide ships={1}>
            <Head title="Inbox" />

            <Container wide className="pt-10 pb-24">
                <SectionHeading index="GROUND CREW" title="Inbox">
                    <span className="ml-auto font-mono text-xs tracking-[0.08em] text-ink-weak uppercase">
                        <span className="text-ink">{total}</span> open tickets
                    </span>
                </SectionHeading>

                <div className={clsx('grid gap-5 xl:gap-6', selected && 'lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_440px]')}>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] content-start gap-5 xl:gap-6">
                        {lanes.map((lane) => (
                            <LaneColumn key={lane.key} lane={lane} selectedId={selected?.id} />
                        ))}
                    </div>

                    {selected && <TicketPanel ticket={selected} draft={draft} />}
                </div>
            </Container>
        </AppLayout>
    );
}

function LaneColumn({ lane, selectedId }: { lane: Lane; selectedId?: number }) {
    const style = laneStyles[lane.key];

    return (
        <section className="ring-line-soft overflow-hidden rounded-xl bg-panel">
            <header className="flex items-center justify-between border-b border-line-soft bg-[rgb(214_251_252/0.04)] px-5 py-3">
                <h2 className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-ink-weak uppercase">
                    <span className={clsx('size-2 rounded-full', style.dot)} />
                    {lane.label}
                </h2>
                <span className="font-mono text-xs text-ink-weaker">{String(lane.tickets.length).padStart(2, '0')}</span>
            </header>

            <div className="space-y-2.5 p-3">
                {lane.tickets.length === 0 && (
                    <div className="px-4 py-12 text-center font-mono text-xs tracking-[0.08em] text-ink-weaker uppercase">No tickets</div>
                )}

                {lane.tickets.map((ticket) => (
                    <Link
                        key={ticket.id}
                        href={`/inbox/${ticket.id}`}
                        preserveScroll
                        className={clsx(
                            'block rounded-lg bg-[rgb(214_251_252/0.05)] p-4 ring-line transition-[box-shadow,background] duration-150 hover:field-hover',
                            ticket.id === selectedId && style.ring,
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="line-clamp-2 font-display text-[17px] leading-snug font-semibold text-ink">{ticket.subject}</p>
                            {ticket.confidence !== null && (
                                <span className={clsx('mt-0.5 shrink-0 font-mono text-xs', style.text)}>{Math.round(ticket.confidence * 100)}%</span>
                            )}
                        </div>
                        {(ticket.urgent || ticket.pending_approval || ticket.refunded || ticket.replied) && (
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                {ticket.urgent && <Tag color="red" pulse label="Urgent" />}
                                {ticket.pending_approval && <Tag color="amber" pulse label="Approval" />}
                                {ticket.refunded && <Tag color="green" label="Refunded" />}
                                {ticket.replied && <Tag color="blue" label="Replied" />}
                            </div>
                        )}
                        <p className="mt-2.5 flex items-center justify-between gap-3 text-xs text-ink-weaker">
                            <span className="truncate">{ticket.name}</span>
                            <span className="shrink-0 font-mono">{ticket.created_at}</span>
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function TicketPanel({ ticket, draft }: { ticket: Selected; draft: Draft }) {
    const style = laneStyles[ticket.category];

    return (
        <aside className="ring-line self-start overflow-hidden rounded-2xl bg-panel-2 [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.55))_drop-shadow(0_0_50px_rgba(0,106,255,0.15))]">
            <div className="flex items-center justify-between gap-4 border-b border-line-soft px-7 py-4">
                <span className={clsx('flex items-center gap-2 font-mono text-[13px] tracking-[0.26em] uppercase', style.text)}>
                    <span className={clsx('size-2 rounded-full', style.dot)} />
                    {ticket.category}
                    {ticket.confidence !== null && <span className="text-ink-weaker">· {Math.round(ticket.confidence * 100)}%</span>}
                    {ticket.urgent && (
                        <span className="ml-2 inline-flex items-center gap-1.5 text-red">
                            <StatusDot color="red" pulse /> URGENT
                        </span>
                    )}
                </span>
                <Link href="/inbox" preserveScroll className="font-mono text-xs text-ink-weaker hover:text-blue-soft">
                    CLOSE
                </Link>
            </div>

            <div className="px-7 py-6">
                <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{ticket.subject}</h2>

                <div className="mt-5 flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_30%,rgb(122,177,255),rgb(0,87,255)_60%,rgb(0,40,120))] font-display text-sm font-semibold text-white shadow-[0_0_14px_rgba(0,106,255,0.6)]">
                        {ticket.name.charAt(0)}
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-ink">{ticket.name}</p>
                        <p className="font-mono text-xs text-ink-weaker">
                            {ticket.email} · {ticket.created_at}
                        </p>
                    </div>
                </div>

                <p className="mt-6 leading-relaxed whitespace-pre-line text-ink-weak">{ticket.body}</p>

                {ticket.refunded && (
                    <div className="mt-6 flex items-center gap-2 rounded-lg bg-green/10 px-4 py-3 font-mono text-xs tracking-[0.08em] text-green uppercase shadow-[0_0_0_1px_rgb(41_163_131/0.4)]">
                        <StatusDot color="green" /> Refund issued
                    </div>
                )}

                {ticket.pending_approval && <ApprovalBox ticket={ticket} approval={ticket.pending_approval} />}

                <ReplyBox key={draft?.text ?? ticket.id} ticket={ticket} draft={draft} />
            </div>
        </aside>
    );
}

function ApprovalBox({ ticket, approval }: { ticket: Selected; approval: PendingApproval }) {
    const href = `/inbox/${ticket.id}/approvals/${approval.id}`;

    return (
        <div className="mt-6 overflow-hidden rounded-lg bg-amber/10 shadow-[0_0_0_1px_rgb(238_157_43/0.45)]">
            <div className="flex items-center gap-2 border-b border-amber/20 px-4 py-2.5 font-mono text-[11px] tracking-[0.18em] text-amber uppercase">
                <StatusDot color="amber" pulse /> Agent wants to run {approval.tool}
            </div>
            <div className="px-4 py-3">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs">
                    {Object.entries(approval.arguments).map(([key, value]) => (
                        <Fragment key={key}>
                            <dt className="text-ink-weaker uppercase">{key}</dt>
                            <dd className="text-ink">{String(value)}</dd>
                        </Fragment>
                    ))}
                </dl>
                {approval.reason && <p className="mt-3 text-sm text-ink-weak">{approval.reason}</p>}
                <div className="mt-4 flex gap-2">
                    <ActionButton href={href} data={{ approve: true }} variant="dark" size="sm" busyLabel="Approving…">
                        Approve
                    </ActionButton>
                    <ActionButton href={href} data={{ approve: false }} size="sm" busyLabel="Rejecting…">
                        Reject
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}

function Tag({ color, label, pulse = false }: { color: 'red' | 'amber' | 'green' | 'blue'; label: string; pulse?: boolean }) {
    const text = { red: 'text-red', amber: 'text-amber', green: 'text-green', blue: 'text-blue-soft' }[color];

    return (
        <span className={clsx('inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase', text)}>
            <StatusDot color={color} pulse={pulse} />
            {label}
        </span>
    );
}

function ReplyBox({ ticket, draft }: { ticket: Selected; draft: Draft }) {
    const [reply, setReply] = useState(draft?.text ?? '');
    const [sending, setSending] = useState(false);

    if (ticket.replied) {
        return (
            <div className="mt-8 flex flex-col gap-2 border-t border-line-soft pt-6">
                <div className="flex items-center justify-between">
                    <span className="label-caps">Your reply</span>
                    <Tag color="blue" label="Sent" />
                </div>
                <p className="rounded-lg bg-[rgb(214_251_252/0.05)] px-4 py-3.5 leading-6 whitespace-pre-line text-ink-weak ring-line">{ticket.reply}</p>
            </div>
        );
    }

    const send = () =>
        router.post(
            `/inbox/${ticket.id}/reply`,
            { reply },
            { preserveScroll: true, onStart: () => setSending(true), onFinish: () => setSending(false) },
        );

    return (
        <div className="mt-8 flex flex-col gap-2 border-t border-line-soft pt-6">
            <div className="flex items-center justify-between">
                <span className="label-caps">Reply</span>
                {draft && <span className="font-mono text-[11px] tracking-[0.08em] text-amber uppercase">drafted by {draft.model}</span>}
            </div>
            <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="min-h-40 w-full resize-none rounded-lg bg-[rgb(214_251_252/0.05)] px-4 py-3.5 leading-6 text-ink ring-line outline-none transition-[box-shadow,background] duration-150 placeholder:text-ink-weaker focus:field-hover"
                placeholder="Write a reply…"
            />
            <div className="mt-2 flex items-center justify-end gap-3">
                <ActionButton href={`/inbox/${ticket.id}/draft`} busyLabel="Drafting…">
                    Draft with AI
                </ActionButton>
                <CtaButton onClick={send} disabled={sending || reply.trim() === ''}>
                    {sending ? 'Sending…' : 'Send reply'}
                </CtaButton>
            </div>
        </div>
    );
}
