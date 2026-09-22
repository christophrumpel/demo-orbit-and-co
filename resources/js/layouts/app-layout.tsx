import { Link, usePage } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { Starfield } from '@/components/starfield';
import { PlanetMark } from '@/components/ui';

const nav = [
    { href: '/', label: 'Trips', match: (url: string) => url === '/' || url.startsWith('/#') },
    { href: '/support', label: 'Support', match: (url: string) => url.startsWith('/support') },
    { href: '/inbox', label: 'Inbox', match: (url: string) => url.startsWith('/inbox') },
    { href: '/demos', label: 'Demos', match: (url: string) => url.startsWith('/demos') },
];

export function AppLayout({ children, wide = false, ships = 3 }: { children: ReactNode; wide?: boolean; ships?: number }) {
    const { url } = usePage();
    const container = wide ? 'max-w-[1600px]' : 'max-w-[1240px]';

    return (
        <div className="relative min-h-screen overflow-x-clip">
            <Starfield shipCount={ships} shootingRate={5} />

            <div className="relative z-[1] flex min-h-screen flex-col">
                <nav className={clsx('mx-auto flex w-full items-center justify-between gap-6 px-8 py-[22px]', container)}>
                    <Link href="/" className="flex items-center gap-2.5">
                        <PlanetMark size={26} />
                        <span className="font-display text-lg font-semibold tracking-[0.16em] uppercase">Orbit &amp; Co.</span>
                    </Link>

                    <div className="flex items-center gap-[26px] text-[13px] font-medium tracking-[0.08em] uppercase">
                        {nav.map((item) => (
                            <Link key={item.href} href={item.href} className={clsx('transition-colors hover:text-blue-soft', item.match(url) ? 'text-ink' : 'text-ink-weak')}>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <Link
                        href="/#board"
                        className="inline-flex h-8 items-center rounded-md bg-[rgb(236,238,240)] px-4 text-sm font-medium whitespace-nowrap text-[rgb(17,24,28)] transition-colors hover:bg-[rgb(226,229,232)]"
                    >
                        Book a seat
                    </Link>
                </nav>

                <main className="flex-1">{children}</main>

                <footer className="border-t border-line-soft bg-bg/80">
                    <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-8 py-[26px]">
                        <div className="flex items-center gap-2 font-display text-sm font-semibold tracking-[0.16em] uppercase">
                            <PlanetMark size={16} />
                            Orbit &amp; Co.
                        </div>
                        <div className="flex gap-6 text-[13px] text-ink-weak">
                            <a href="#" className="hover:text-blue-soft">
                                Safety
                            </a>
                            <a href="#" className="hover:text-blue-soft">
                                Careers
                            </a>
                            <Link href="/support" className="hover:text-blue-soft">
                                Support
                            </Link>
                        </div>
                        <span className="text-xs text-ink-weaker">© Orbit &amp; Co.</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export function Container({ children, className, wide = false }: { children: ReactNode; className?: string; wide?: boolean }) {
    return <div className={clsx('mx-auto w-full px-8', wide ? 'max-w-[1600px]' : 'max-w-[1240px]', className)}>{children}</div>;
}
