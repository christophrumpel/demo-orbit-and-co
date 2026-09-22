import { useEffect, useRef } from 'react';

type Props = { shipCount?: number; shootingRate?: number; animate?: boolean };

/**
 * Fixed full-viewport canvas: twinkling stars, shooting stars, drifting ships.
 * Ported from the Astral design handoff.
 */
export function Starfield({ shipCount = 3, shootingRate = 5, animate = true }: Props) {
    const ref = useRef<HTMLCanvasElement>(null);
    const props = useRef({ shipCount, shootingRate, animate });
    props.current = { shipCount, shootingRate, animate };

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        let W = 0;
        let H = 0;
        let raf = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        window.addEventListener('resize', resize);

        const rnd = (a: number, b: number) => a + Math.random() * (b - a);

        type Star = { x: number; y: number; r: number; tw: number; ph: number; bright: boolean };
        type Shot = { x: number; y: number; vx: number; vy: number; life: number };
        type Ship = { x: number; y: number; vx: number; bob: number; scale: number };

        const stars: Star[] = [];
        const shots: Shot[] = [];
        const ships: Ship[] = [];

        const makeStars = () => {
            stars.length = 0;
            const n = Math.round((W * H) / 2800);
            for (let i = 0; i < n; i++) {
                stars.push({ x: Math.random() * W, y: Math.random() * H, r: rnd(0.4, 1.5), tw: rnd(0.5, 2.2), ph: rnd(0, 6.28), bright: Math.random() < 0.07 });
            }
        };
        makeStars();

        const newShip = (): Ship => {
            const dir = Math.random() < 0.5 ? 1 : -1;
            return { x: dir === 1 ? -80 : W + 80, y: rnd(H * 0.06, H * 0.75), vx: dir * rnd(22, 55), bob: rnd(0, 6.28), scale: rnd(0.6, 1.15) };
        };

        const drawShip = (x: number, y: number, dir: number, s: number, t: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(dir * s, s);
            const flick = 0.8 + 0.2 * Math.sin(t * 24);
            const trail = ctx.createLinearGradient(-14, 0, -58, 0);
            trail.addColorStop(0, `rgba(120,180,255,${0.75 * flick})`);
            trail.addColorStop(0.4, 'rgba(0,106,255,0.28)');
            trail.addColorStop(1, 'rgba(0,106,255,0)');
            ctx.strokeStyle = trail;
            ctx.lineWidth = 2.4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-14, 0);
            ctx.lineTo(-58, 0);
            ctx.stroke();
            ctx.fillStyle = `rgba(140,190,255,${0.5 * flick})`;
            ctx.beginPath();
            ctx.arc(-13, 0, 3, 0, 6.28);
            ctx.fill();
            ctx.fillStyle = 'rgb(198,210,228)';
            ctx.beginPath();
            ctx.moveTo(16, 0);
            ctx.quadraticCurveTo(4, -4.5, -12, -3);
            ctx.lineTo(-12, 3);
            ctx.quadraticCurveTo(4, 4.5, 16, 0);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgb(150,165,190)';
            ctx.beginPath();
            ctx.moveTo(-6, -2.5);
            ctx.lineTo(-13, -8);
            ctx.lineTo(-12, -2);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-6, 2.5);
            ctx.lineTo(-13, 8);
            ctx.lineTo(-12, 2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgb(0,145,255)';
            ctx.beginPath();
            ctx.ellipse(7, -0.8, 3, 1.4, 0, 0, 6.28);
            ctx.fill();
            ctx.restore();
        };

        let last = performance.now();

        const draw = (now: number) => {
            if (W !== window.innerWidth || H !== window.innerHeight) {
                const wasEmpty = W === 0 || H === 0 || stars.length === 0;
                resize();
                if (wasEmpty) makeStars();
            }

            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            const t = now / 1000;
            ctx.clearRect(0, 0, W, H);

            const { animate: live, shipCount: wantShips, shootingRate: rate } = props.current;

            for (const s of stars) {
                const a = live ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.tw + s.ph)) : 0.7;
                ctx.globalAlpha = a * (s.bright ? 1 : 0.8);
                ctx.fillStyle = s.bright ? 'rgb(190,215,255)' : 'rgb(214,226,247)';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, 6.28);
                ctx.fill();
                if (s.bright) {
                    ctx.globalAlpha = a * 0.5;
                    ctx.strokeStyle = 'rgba(160,200,255,0.9)';
                    ctx.lineWidth = 0.7;
                    const g = s.r * 6;
                    ctx.beginPath();
                    ctx.moveTo(s.x - g, s.y);
                    ctx.lineTo(s.x + g, s.y);
                    ctx.moveTo(s.x, s.y - g);
                    ctx.lineTo(s.x, s.y + g);
                    ctx.stroke();
                }
            }
            ctx.globalAlpha = 1;

            if (live) {
                if (Math.random() < (rate / 10) * dt) {
                    shots.push({ x: rnd(W * 0.1, W * 0.95), y: rnd(0, H * 0.4), vx: -rnd(400, 700), vy: rnd(140, 260), life: 1 });
                }
                for (let i = shots.length - 1; i >= 0; i--) {
                    const sh = shots[i];
                    sh.x += sh.vx * dt;
                    sh.y += sh.vy * dt;
                    sh.life -= dt * 1.1;
                    if (sh.life <= 0) {
                        shots.splice(i, 1);
                        continue;
                    }
                    const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 0.14, sh.y - sh.vy * 0.14);
                    grad.addColorStop(0, `rgba(230,240,255,${0.95 * sh.life})`);
                    grad.addColorStop(1, 'rgba(230,240,255,0)');
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1.6;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(sh.x, sh.y);
                    ctx.lineTo(sh.x - sh.vx * 0.14 * sh.life, sh.y - sh.vy * 0.14 * sh.life);
                    ctx.stroke();
                    ctx.fillStyle = `rgba(255,255,255,${sh.life})`;
                    ctx.beginPath();
                    ctx.arc(sh.x, sh.y, 1.6, 0, 6.28);
                    ctx.fill();
                }

                const want = Math.max(0, Math.min(6, wantShips));
                while (ships.length < want) ships.push(newShip());
                if (ships.length > want) ships.length = want;
                for (let i = 0; i < ships.length; i++) {
                    const p = ships[i];
                    p.x += p.vx * dt;
                    if ((p.vx > 0 && p.x > W + 100) || (p.vx < 0 && p.x < -100)) ships[i] = newShip();
                    drawShip(p.x, p.y + Math.sin(t * 0.7 + p.bob) * 6, p.vx > 0 ? 1 : -1, p.scale, t);
                }
            }

            raf = requestAnimationFrame(draw);
        };

        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0 h-screen w-screen" aria-hidden />;
}
