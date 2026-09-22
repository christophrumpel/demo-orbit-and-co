import { Head } from '@inertiajs/react';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { StatusDot } from '@/components/ui';
import { AppLayout, Container } from '@/layouts/app-layout';

const demos = [{ title: 'Classification' }, { title: 'Middleware' }, { title: 'Approval' }];

const key = 'orbit.demos';

function load(): boolean[] {
    try {
        return JSON.parse(localStorage.getItem(key) ?? '') ?? demos.map(() => false);
    } catch {
        return demos.map(() => false);
    }
}

export default function Demos() {
    const [done, setDone] = useState<boolean[]>(() => demos.map(() => false));

    useEffect(() => setDone(load()), []);

    const update = (next: boolean[]) => {
        setDone(next);
        try {
            localStorage.setItem(key, JSON.stringify(next));
        } catch {
            // Not important, it's just for the video.
        }
    };

    const toggle = (index: number) => update(done.map((value, i) => (i === index ? !value : value)));

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const index = Number(e.key) - 1;
            if (index >= 0 && index < demos.length) toggle(index);
            if (e.key === 'r') update(demos.map(() => false));
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    const next = done.indexOf(false);

    return (
        <AppLayout wide ships={2}>
            <Head title="Demos" />

            <Container wide className="pt-14 pb-28">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <span className="eyebrow">MISSION PLAN</span>
                        <h1 className="display-gradient mt-5 font-display text-[clamp(48px,6vw,88px)] leading-[1.1] font-semibold tracking-[-0.03em] pb-[0.08em]">Today's flight</h1>
                    </div>
                    <span className="font-mono text-sm tracking-[0.08em] text-ink-weak uppercase">
                        <span className="text-ink">{done.filter(Boolean).length}</span> / {demos.length} complete
                    </span>
                </div>

                <div className="mt-14 grid gap-6 lg:grid-cols-3">
                    {demos.map((demo, index) => {
                        const checked = done[index];
                        const current = index === next;

                        return (
                            <button
                                key={demo.title}
                                type="button"
                                onClick={() => toggle(index)}
                                className={clsx(
                                    'group relative flex min-h-[420px] flex-col rounded-2xl p-10 text-left transition-[box-shadow,background,opacity] duration-300',
                                    checked
                                        ? 'bg-green/[0.07] shadow-[0_0_0_1px_rgb(41_163_131/0.45)]'
                                        : current
                                          ? 'bg-panel-2 shadow-[0_0_0_1px_rgb(140_187_255/0.7),0_0_60px_rgb(0_106_255/0.3)]'
                                          : 'bg-panel ring-line-soft opacity-70 hover:opacity-100',
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={clsx('font-mono text-[15px] tracking-[0.26em]', checked ? 'text-green' : 'text-amber')}>
                                        STEP {String(index + 1).padStart(2, '0')}
                                    </span>
                                    {current && (
                                        <span className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-blue-soft uppercase">
                                            <StatusDot color="blue" pulse /> Next up
                                        </span>
                                    )}
                                </div>

                                <div className="mt-auto">
                                    <Check checked={checked} />
                                    <h2
                                        className={clsx(
                                            'mt-8 font-display text-[clamp(40px,3.6vw,60px)] leading-[1.02] font-semibold tracking-[-0.03em] transition-colors duration-300',
                                            checked ? 'text-ink-weak' : 'text-ink',
                                        )}
                                    >
                                        {demo.title}
                                    </h2>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Container>
        </AppLayout>
    );
}

function Check({ checked }: { checked: boolean }) {
    return (
        <span
            className={clsx(
                'flex size-16 items-center justify-center rounded-full transition-all duration-300',
                checked ? 'bg-green text-bg shadow-[0_0_30px_rgb(41_163_131/0.6)]' : 'text-transparent ring-line',
            )}
        >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className={clsx('transition-transform duration-300', checked ? 'scale-100' : 'scale-50')}>
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    );
}
