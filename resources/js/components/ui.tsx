import { Link, router } from '@inertiajs/react';
import { clsx } from 'clsx';
import { type ComponentProps, type ReactNode, useState } from 'react';

/* Primitives from the Astral design handoff, adapted to Tailwind. */

export function Button({ variant = 'primary', className, children, ...rest }: ComponentProps<'button'> & { variant?: 'primary' | 'secondary' }) {
    return (
        <button
            type="button"
            className={clsx(
                'inline-flex h-8 items-center gap-1.5 rounded-md px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150',
                variant === 'secondary'
                    ? 'bg-[rgb(236,238,240)] text-[rgb(17,24,28)] hover:bg-[rgb(226,229,232)]'
                    : 'bg-blue text-white shadow-[0_0_0_1px_rgb(0,92,236)] hover:bg-[rgb(0,87,255)]',
                className,
            )}
            {...rest}
        >
            {children}
        </button>
    );
}

type CtaProps = {
    variant?: 'dark' | 'solid';
    href?: string;
    external?: boolean;
    className?: string;
    children: ReactNode;
    type?: 'button' | 'submit';
    disabled?: boolean;
    onClick?: () => void;
};

export function CtaButton({ variant = 'dark', href, external, className, children, type = 'button', disabled, onClick }: CtaProps) {
    const classes = clsx(
        'group inline-flex h-11 items-center gap-2 rounded-lg px-5 font-display text-[15px] font-semibold transition-colors duration-150 disabled:opacity-60',
        variant === 'dark' ? 'bg-white text-[rgb(17,24,28)] hover:bg-white/92' : 'bg-blue text-white hover:bg-[rgb(0,87,255)]',
        className,
    );

    const inner = (
        <>
            {children}
            <span className="inline-flex transition-transform duration-150 group-hover:translate-x-[3px]">
                <ArrowRightIcon />
            </span>
        </>
    );

    if (href && external) {
        return (
            <a href={href} className={classes}>
                {inner}
            </a>
        );
    }

    if (href) {
        return (
            <Link href={href} className={classes}>
                {inner}
            </Link>
        );
    }

    return (
        <button type={type} disabled={disabled} onClick={onClick} className={classes}>
            {inner}
        </button>
    );
}

export function StatusDot({ color = 'green', pulse = false, className }: { color?: 'green' | 'amber' | 'red' | 'blue'; pulse?: boolean; className?: string }) {
    const bg = { green: 'bg-green', amber: 'bg-amber', red: 'bg-red', blue: 'bg-blue-soft' }[color];

    return (
        <span className={clsx('relative inline-flex size-2 shrink-0', className)}>
            {pulse && <span className={clsx('animate-dot-pulse absolute inset-0 rounded-full opacity-35', bg)} />}
            <span className={clsx('size-2 rounded-full', bg)} />
        </span>
    );
}

export function PlanetMark({ size = 26 }: { size?: number }) {
    return (
        <span
            className="inline-flex rounded-full bg-[radial-gradient(circle_at_32%_30%,rgb(122,177,255),rgb(0,87,255)_60%,rgb(0,40,120))] shadow-[0_0_18px_rgba(0,106,255,0.7)]"
            style={{ width: size, height: size }}
        />
    );
}

export function ArrowRightIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="block shrink-0">
            <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ChevronDownIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="block shrink-0">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function SectionHeading({ index, title, children }: { index: string; title: string; children?: ReactNode }) {
    return (
        <div className="mb-7 flex flex-wrap items-baseline gap-x-[18px] gap-y-2">
            <span className="eyebrow">{index}</span>
            <h2 className="font-display text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.02em]">{title}</h2>
            {children}
        </div>
    );
}

export function Eyebrow({ children }: { children: ReactNode }) {
    return <span className="eyebrow">{children}</span>;
}

export function Spinner({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={clsx('size-4 animate-spin', className)} aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" className="opacity-25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

type ActionProps = {
    href: string;
    data?: Record<string, boolean | string | number>;
    variant?: 'dark' | 'outline';
    size?: 'sm' | 'md';
    busyLabel?: string;
    className?: string;
    children: ReactNode;
};

/**
 * A POST action button with a built-in busy state.
 */
export function ActionButton({ href, data, variant = 'outline', size = 'md', busyLabel, className, children }: ActionProps) {
    const [busy, setBusy] = useState(false);

    const run = () =>
        router.post(href, data, {
            preserveScroll: true,
            onStart: () => setBusy(true),
            onFinish: () => setBusy(false),
        });

    return (
        <button
            type="button"
            onClick={run}
            disabled={busy}
            className={clsx(
                'inline-flex items-center gap-2 rounded-lg font-display font-semibold transition-[box-shadow,background,opacity] duration-150 disabled:opacity-70',
                size === 'md' ? 'h-11 px-5 text-[15px]' : 'h-9 rounded-md px-4 text-sm',
                variant === 'dark' ? 'bg-white text-[rgb(17,24,28)] hover:bg-white/92' : 'text-ink ring-line hover:field-hover',
                className,
            )}
        >
            {busy && <Spinner />}
            {busy && busyLabel ? busyLabel : children}
        </button>
    );
}
