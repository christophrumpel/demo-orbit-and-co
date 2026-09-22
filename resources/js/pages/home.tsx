import { Head } from '@inertiajs/react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { ChevronDownIcon, CtaButton, SectionHeading, StatusDot } from '@/components/ui';
import { FLEET, ROUTES, STATIONS, type Station } from '@/data/landing';
import { AppLayout, Container } from '@/layouts/app-layout';

export default function Home() {
    return (
        <AppLayout>
            <Head title="Leave the planet" />
            <Hero />
            <BoardingPass />
            <DepartureBoard />
            <SystemMap />
            <Fleet />
            <ClosingCta />
        </AppLayout>
    );
}

function Hero() {
    return (
        <header className="relative flex min-h-[66vh] flex-col items-center justify-center px-8 pt-24 text-center">
            <div className="relative z-[1] flex flex-col items-center">
                <h1 className="display-gradient max-w-[1100px] font-display text-[clamp(56px,9.5vw,128px)] leading-[0.98] font-semibold tracking-[-0.035em] [text-wrap:balance]">
                    Leave the planet. We handle the rest.
                </h1>
                <p className="mt-7 max-w-[460px] text-[17px] leading-[26px] text-ink-weak [text-wrap:pretty]">Pick two planets. See the next departure.</p>
            </div>

            {/* Planet horizon arc */}
            <div
                className="animate-rim pointer-events-none absolute bottom-[-104vw] left-1/2 -z-[1] aspect-square w-[160vw] max-w-[2400px] -translate-x-1/2 rounded-full"
                style={{
                    background: 'radial-gradient(circle at 50% 6%, rgb(24,36,60) 0%, rgb(10,14,26) 22%, rgb(5,7,13) 45%)',
                    boxShadow: '0 -3px 26px rgba(140,190,255,0.55), 0 -22px 90px rgba(0,106,255,0.4), 0 -80px 220px rgba(0,106,255,0.22), inset 0 60px 140px rgba(0,106,255,0.18)',
                }}
            />
        </header>
    );
}

function PlanetField({ label, station, onClick }: { label: string; station: Station; onClick: () => void }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="label-caps">{label}</span>
            <button type="button" onClick={onClick} className="field cursor-pointer text-left hover:field-hover">
                <span className="size-[34px] shrink-0 rounded-full" style={{ background: station.swatch, boxShadow: `0 0 10px ${station.glow}` }} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="font-display text-[19px] font-semibold text-ink">{station.planet}</span>
                    <span className="truncate text-xs text-ink-weaker">{station.station}</span>
                </span>
                <span className="inline-flex text-ink-weaker">
                    <ChevronDownIcon />
                </span>
            </button>
        </div>
    );
}

function BoardingPass() {
    const [fromIdx, setFromIdx] = useState(0);
    const [toIdx, setToIdx] = useState(1);
    const [date, setDate] = useState('2027-03-14');
    const n = STATIONS.length;

    return (
        <div className="relative mt-3 flex justify-center px-8 pb-24">
            <div className="w-full max-w-[960px] -rotate-[1.2deg] drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)] [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.55))_drop-shadow(0_0_50px_rgba(0,106,255,0.22))]">
                <div className="ring-line overflow-hidden rounded-2xl bg-panel-2">
                    <div className="flex items-center justify-between gap-4 border-b border-line-soft px-7 py-4">
                        <span className="font-mono text-[13px] tracking-[0.26em] text-amber">BOARDING PASS</span>
                        <span className="font-mono text-xs text-ink-weaker">ORB // interplanetary</span>
                    </div>
                    <div className="grid gap-[18px] px-7 pt-[26px] pb-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                        <PlanetField label="From" station={STATIONS[fromIdx]} onClick={() => setFromIdx((fromIdx + 1) % n)} />
                        <PlanetField label="To" station={STATIONS[toIdx]} onClick={() => setToIdx((toIdx + 1) % n)} />
                        <div className="flex flex-col gap-2">
                            <span className="label-caps">Departure</span>
                            <div className="field">
                                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <input
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full border-none bg-transparent p-0 font-display text-[19px] font-semibold text-ink outline-none"
                                    />
                                    <span className="text-xs text-ink-weaker">Mars transfer window</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end px-7 pb-[26px]">
                        <CtaButton href="#board" external>
                            Search departures
                        </CtaButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

const COLS = '[grid-template-columns:90px_110px_minmax(200px,1fr)_140px_130px]';

function DepartureBoard() {
    return (
        <Container className="py-24" >
            <section id="board">
                <SectionHeading index="01 / DEPARTURES" title="Next boardings" />
                <div className="overflow-hidden rounded-xl bg-panel shadow-[0_0_0_1px_rgb(226_240_253/0.08),0_0_60px_rgba(0,106,255,0.08)]">
                    <div className={clsx('grid gap-4 border-b border-line-soft bg-[rgb(214_251_252/0.04)] px-6 py-3 font-mono text-[11px] tracking-[0.18em] text-ink-weaker uppercase', COLS)}>
                        <span>Time</span>
                        <span>Flight</span>
                        <span>Route</span>
                        <span>Status</span>
                        <span className="text-right">From</span>
                    </div>
                    {ROUTES.map((r) => (
                        <div key={r.code} className={clsx('grid items-center gap-4 border-b border-[rgb(226_240_253/0.05)] px-6 py-[18px] text-sm', COLS)}>
                            <span className="font-mono text-[13px] text-amber">{r.time}</span>
                            <span className="font-mono text-[13px] text-ink-weak">{r.code}</span>
                            <div className="flex flex-col gap-0.5">
                                <span className="font-display text-[17px] font-semibold">{r.route}</span>
                                <span className="text-xs text-ink-weaker">{r.meta}</span>
                            </div>
                            <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-ink-weak uppercase">
                                <StatusDot color={r.dot} pulse={r.pulse} />
                                {r.status}
                            </span>
                            <span className="text-right font-display text-base font-semibold">{r.price}</span>
                        </div>
                    ))}
                </div>
            </section>
        </Container>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="font-display text-[30px] font-semibold">{value}</span>
            <span className="text-xs tracking-[0.08em] text-ink-weaker uppercase">{label}</span>
        </div>
    );
}

function SystemMap() {
    return (
        <Container className="pt-6 pb-[110px]">
            <section id="system" className="grid items-center gap-16 lg:[grid-template-columns:minmax(280px,1fr)_minmax(320px,1.1fr)]">
                <div className="flex flex-col items-start gap-5">
                    <span className="eyebrow">02 / SYSTEM MAP</span>
                    <h2 className="font-display text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.02em] [text-wrap:balance]">Nine worlds on one timetable.</h2>
                    <p className="max-w-[420px] text-[15px] leading-6 text-ink-weak [text-wrap:pretty]">
                        Every route is flown on rails — fixed transfer windows, computed years ahead. If a window shifts, your seat moves with it automatically.
                    </p>
                    <div className="mt-2 flex gap-9">
                        <Stat value="340" label="departures / yr" />
                        <Stat value="99.98%" label="on-time arrival" />
                        <Stat value="26" label="orbital stations" />
                    </div>
                </div>

                <div className="relative mx-auto aspect-square w-full max-w-[560px]">
                    <span className="absolute top-1/2 left-1/2 size-[34px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_38%_32%,rgb(255,220,150),rgb(238,157,43)_55%,rgb(160,90,10))] shadow-[0_0_30px_rgba(238,157,43,0.8),0_0_90px_rgba(238,157,43,0.35)]" />
                    <span className="absolute inset-[33%] rounded-full border border-line" />
                    <span className="absolute inset-[20%] rounded-full border border-line-soft" />
                    <span className="absolute inset-[7%] rounded-full border border-dashed border-line-soft" />

                    <div className="animate-orbit absolute inset-[33%] [--orbit-duration:40s]">
                        <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(160,200,255),rgb(0,106,255)_65%)] shadow-[0_0_12px_rgba(0,106,255,0.9)]" />
                    </div>
                    <div className="animate-orbit absolute inset-[20%] [--orbit-duration:70s]">
                        <span className="absolute bottom-[12%] left-[12%] size-2.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(255,190,160),rgb(200,80,40)_65%)] shadow-[0_0_12px_rgba(229,110,70,0.8)]" />
                    </div>
                    <div className="animate-orbit absolute inset-[7%] [--orbit-duration:120s]">
                        <span className="absolute top-[22%] right-[8%] size-[9px] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(230,240,255),rgb(150,165,190)_65%)] shadow-[0_0_10px_rgba(200,220,255,0.6)]" />
                    </div>

                    <span className="absolute top-[26.5%] left-1/2 translate-x-6 font-mono text-[11px] tracking-[0.14em] text-ink-weaker">EARTH ORBIT</span>
                    <span className="absolute bottom-[25%] left-[13%] font-mono text-[11px] tracking-[0.14em] text-ink-weaker">MARS</span>
                    <span className="absolute top-[15%] right-[4%] font-mono text-[11px] tracking-[0.14em] text-ink-weaker">BELT / OUTER</span>
                </div>
            </section>
        </Container>
    );
}

function SpecRow({ k, v }: { k: string; v: string }) {
    return (
        <div className="flex justify-between border-t border-[rgb(223_243_253/0.11)] py-2">
            <span className="text-ink-weaker">{k}</span>
            <span>{v}</span>
        </div>
    );
}

function Fleet() {
    return (
        <Container className="pb-[110px]">
            <section id="fleet">
                <SectionHeading index="03 / FLEET" title="Three ships. Every distance." />
                <div className="ring-line-soft grid gap-px overflow-hidden rounded-xl bg-line-soft [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                    {FLEET.map((s) => (
                        <div key={s.num} className="flex flex-col gap-3.5 bg-panel p-7">
                            <span className="font-display text-[54px] leading-none font-semibold text-transparent [-webkit-text-stroke:1px_rgba(140,187,255,0.55)]">{s.num}</span>
                            <span className="font-mono text-xs tracking-[0.2em] text-amber">{s.cls}</span>
                            <div className="font-display text-2xl font-semibold">{s.name}</div>
                            <p className="text-sm leading-[21px] text-ink-weak [text-wrap:pretty]">{s.desc}</p>
                            <div className="mt-1.5 flex flex-col font-mono text-xs">
                                <SpecRow k="SEATS" v={s.seats} />
                                <SpecRow k="RANGE" v={s.range} />
                                <SpecRow k="GRAVITY" v={s.grav} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </Container>
    );
}

function ClosingCta() {
    return (
        <section className="relative flex flex-col items-center gap-[26px] overflow-hidden px-8 pt-10 pb-[150px] text-center">
            <h2 className="display-gradient font-display text-[clamp(36px,6vw,72px)] font-semibold tracking-[-0.03em] [text-wrap:balance]">Your seat to another world.</h2>
            <p className="max-w-[440px] text-[15px] text-ink-weak">Seats on the 2027 Mars window are 60% booked. Reserve now, decide later.</p>
            <CtaButton href="/support">Talk to ground crew</CtaButton>

            {/* Amber planet-rise arc */}
            <div
                className="pointer-events-none absolute bottom-[-80vw] left-1/2 -z-[1] aspect-square w-[120vw] max-w-[1800px] -translate-x-1/2 rounded-full"
                style={{
                    background: 'radial-gradient(circle at 50% 8%, rgb(30,22,12) 0%, rgb(12,10,8) 22%, rgb(5,7,13) 48%)',
                    boxShadow: '0 -3px 22px rgba(255,200,120,0.5), 0 -20px 80px rgba(238,157,43,0.32), 0 -70px 200px rgba(238,157,43,0.14)',
                }}
            />
        </section>
    );
}
