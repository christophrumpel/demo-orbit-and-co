export type Station = { planet: string; station: string; swatch: string; glow: string };

export const STATIONS: Station[] = [
    { planet: 'Earth', station: 'Lagrange Station', swatch: 'radial-gradient(circle at 35% 30%, rgb(122,177,255), rgb(0,87,255) 55%, rgb(0,40,120))', glow: 'rgba(0,106,255,0.55)' },
    { planet: 'Mars', station: 'Phobos Gateway', swatch: 'radial-gradient(circle at 35% 30%, rgb(255,176,140), rgb(200,80,40) 55%, rgb(107,36,16))', glow: 'rgba(229,110,70,0.55)' },
    { planet: 'Luna', station: 'Tranquility Port', swatch: 'radial-gradient(circle at 35% 30%, rgb(240,242,246), rgb(150,165,190) 55%, rgb(76,81,85))', glow: 'rgba(200,215,235,0.5)' },
    { planet: 'Europa', station: 'Clipper Dock', swatch: 'radial-gradient(circle at 35% 30%, rgb(232,244,255), rgb(157,184,216) 55%, rgb(90,112,140))', glow: 'rgba(180,210,245,0.5)' },
    { planet: 'Titan', station: 'Kraken Terminal', swatch: 'radial-gradient(circle at 35% 30%, rgb(255,217,160), rgb(238,157,43) 55%, rgb(138,84,16))', glow: 'rgba(238,157,43,0.55)' },
    { planet: 'Ceres', station: 'Belt Hub One', swatch: 'radial-gradient(circle at 35% 30%, rgb(216,210,200), rgb(138,130,118) 55%, rgb(69,64,57))', glow: 'rgba(200,190,175,0.45)' },
];

export type Route = { time: string; code: string; route: string; meta: string; status: string; dot: 'green' | 'amber' | 'red'; pulse: boolean; price: string };

export const ROUTES: Route[] = [
    { time: '06:40', code: 'ORB-021', route: 'Earth → Luna', meta: '2 days · 384,000 km', status: 'Boarding', dot: 'green', pulse: true, price: '€ 42,000' },
    { time: '09:15', code: 'ORB-114', route: 'Earth → Mars', meta: '94 days · window Mar 2027', status: 'Boarding', dot: 'green', pulse: true, price: '€ 184,000' },
    { time: '11:02', code: 'ORB-333', route: 'Ceres → Earth', meta: '160 days · via Mars flyby', status: 'On time', dot: 'green', pulse: false, price: '€ 210,000' },
    { time: '14:30', code: 'ORB-542', route: 'Mars → Europa', meta: '1.1 years · gravity assist', status: 'Scheduled', dot: 'amber', pulse: false, price: '€ 455,000' },
    { time: '18:55', code: 'ORB-880', route: 'Luna → Titan', meta: '2.4 years · spin-gravity cabins', status: 'Scheduled', dot: 'amber', pulse: false, price: '€ 610,000' },
    { time: '21:10', code: 'ORB-207', route: 'Earth → Venus orbital', meta: '71 days · cloud-deck observatory', status: 'Sold out', dot: 'red', pulse: false, price: '€ 150,000' },
];

export type Ship = { num: string; cls: string; name: string; desc: string; seats: string; range: string; grav: string };

export const FLEET: Ship[] = [
    { num: '01', cls: 'SPARROW-CLASS', name: 'Shuttle', desc: 'Short-hop workhorse for the Earth–Luna corridor. Boards in minutes, docks itself.', seats: '40', range: '0.003 AU', grav: '0 g' },
    { num: '02', cls: 'MERIDIAN-CLASS', name: 'Liner', desc: 'Our inner-system standard. Private cabins, observation deck, 1g under thrust.', seats: '220', range: '3 AU', grav: '1 g thrust' },
    { num: '03', cls: 'AURORA-CLASS', name: 'Cruiser', desc: 'Long-haul flagship for the outer planets. Spin-gravity ring, hydroponic gardens.', seats: '96', range: '12 AU', grav: '0.4 g spin' },
];
