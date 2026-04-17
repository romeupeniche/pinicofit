import { motion } from "framer-motion";

type FlameLevel = "low" | "streak" | "max";
interface Props { level: FlameLevel; size?: number; }

const LAYERS = {
    low: {
        glow: "rgba(148,163,184,0.35)",
        glowSpeed: 2.8,
        layers: [
            {
                frameA: "M50 122 C32 120 18 108 16 92 C14 76 22 64 28 54 C34 44 36 36 32 26 C38 32 38 40 40 46 C42 36 44 24 50 10 C56 24 58 36 60 46 C62 40 62 32 68 26 C64 36 66 44 72 54 C78 64 86 76 84 92 C82 108 68 120 50 122Z",
                frameB: "M50 122 C32 120 17 107 15 91 C13 75 21 63 27 53 C33 43 35 35 31 25 C37 31 37 39 39 46 C41 36 43 23 50 9 C57 23 59 36 61 46 C63 39 63 31 69 25 C65 35 67 43 73 53 C79 63 87 75 85 91 C83 107 68 120 50 122Z",
                gradient: ["#1e293b", "#64748b", "#cbd5e1"],
                stops: [0, 50, 100],
                dur: 3.0,
                opacity: 1,
            },
            {
                frameA: "M50 112 C40 108 34 98 35 88 C36 78 42 70 50 60 C58 70 64 78 65 88 C66 98 60 108 50 112Z",
                frameB: "M50 112 C38 107 32 97 33 87 C34 77 41 69 50 59 C59 69 66 77 67 87 C68 97 62 107 50 112Z",
                gradient: ["#334155", "#f1f5f9"],
                stops: [0, 100],
                dur: 2.4,
                opacity: 0.75,
            },
        ],
        particles: [
            { x: 42, y: 18, r: 2, color: "#94a3b8", delay: 0.4, anim: "sa", dur: 2.6 },
            { x: 57, y: 14, r: 1.5, color: "#cbd5e1", delay: 1.2, anim: "sb", dur: 3.0 },
            { x: 50, y: 10, r: 1.8, color: "#94a3b8", delay: 0.8, anim: "sc", dur: 2.8 },
        ],
    },
    streak: {
        glow: "rgba(249,115,22,0.5)",
        glowSpeed: 1.7,
        layers: [
            {
                frameA: "M50 122 C28 121 12 110 10 94 C8 78 16 64 22 52 C26 44 26 36 20 24 C28 30 30 40 32 48 C34 38 36 26 38 16 C40 26 40 36 42 44 C44 32 46 18 50 4 C54 18 56 32 58 44 C60 36 60 26 62 16 C64 26 66 38 68 48 C70 40 72 30 80 24 C74 36 74 44 78 52 C84 64 92 78 90 94 C88 110 72 121 50 122Z",
                frameB: "M50 122 C27 121 11 109 9 93 C7 77 15 63 21 51 C25 43 25 35 19 23 C27 29 29 39 31 47 C33 37 35 25 37 15 C39 25 39 35 41 43 C43 31 45 17 50 3 C55 17 57 31 59 43 C61 35 61 25 63 15 C65 25 67 37 69 47 C71 39 73 29 81 23 C75 35 75 43 79 51 C85 63 93 77 91 93 C89 109 73 121 50 122Z",
                gradient: ["#b91c1c", "#ea580c", "#f97316", "#fed7aa"],
                stops: [0, 35, 70, 100],
                dur: 1.8,
                opacity: 1,
            },
            {
                frameA: "M50 118 C34 116 22 106 22 92 C22 78 28 66 32 56 C36 46 36 38 32 30 C38 36 38 44 40 52 C42 42 44 30 50 16 C56 30 58 42 60 52 C62 44 62 36 68 30 C64 38 64 46 68 56 C72 66 78 78 78 92 C78 106 66 116 50 118Z",
                frameB: "M50 118 C33 115 21 105 21 91 C21 77 27 65 31 55 C35 45 35 37 31 29 C37 35 37 43 39 51 C41 41 43 29 50 15 C57 29 59 41 61 51 C63 43 63 35 69 29 C65 37 65 45 69 55 C73 65 79 77 79 91 C79 105 67 115 50 118Z",
                gradient: ["#c2410c", "#fb923c", "#fde68a"],
                stops: [0, 55, 100],
                dur: 1.5,
                opacity: 0.9,
            },
            {
                frameA: "M50 114 C40 110 34 100 35 90 C36 80 42 70 50 58 C58 70 64 80 65 90 C66 100 60 110 50 114Z",
                frameB: "M50 114 C38 109 32 99 33 89 C34 79 41 69 50 57 C59 69 66 79 67 89 C68 99 62 109 50 114Z",
                gradient: ["#f59e0b", "#fefce8"],
                stops: [0, 100],
                dur: 1.2,
                opacity: 0.85,
            },
        ],
        particles: [
            { x: 38, y: 22, r: 2.2, color: "#fbbf24", delay: 0.2, anim: "sa", dur: 1.6 },
            { x: 50, y: 10, r: 2.5, color: "#fde68a", delay: 0.7, anim: "sb", dur: 1.9 },
            { x: 61, y: 18, r: 2.0, color: "#fb923c", delay: 1.1, anim: "sc", dur: 1.7 },
            { x: 44, y: 6, r: 1.6, color: "#fde68a", delay: 0.4, anim: "sd", dur: 2.1 },
            { x: 56, y: 4, r: 1.8, color: "#fbbf24", delay: 0.9, anim: "se", dur: 1.8 },
        ],
    },
    max: {
        glow: "rgba(14,165,233,0.6)",
        glowSpeed: 1.2,
        layers: [
            {
                frameA: "M50 122 C24 121 6 108 4 90 C2 72 12 56 18 44 C22 36 20 26 14 14 C22 20 26 32 28 42 C30 30 32 16 36 4 C38 16 38 30 40 40 C42 28 44 14 50 0 C56 14 58 28 60 40 C62 30 62 16 64 4 C68 16 70 30 72 42 C74 32 78 20 86 14 C80 26 78 36 82 44 C88 56 98 72 96 90 C94 108 76 121 50 122Z",
                frameB: "M50 122 C23 121 5 107 3 89 C1 71 11 55 17 43 C21 35 19 25 13 13 C21 19 25 31 27 41 C29 29 31 15 35 3 C37 15 37 29 39 39 C41 27 43 13 50 -1 C57 13 59 27 61 39 C63 29 63 15 65 3 C69 15 71 29 73 41 C75 31 79 19 87 13 C81 25 79 35 83 43 C89 55 99 71 97 89 C95 107 77 121 50 122Z",
                gradient: ["#1e1b4b", "#4338ca", "#0ea5e9", "#bae6fd"],
                stops: [0, 40, 75, 100],
                dur: 1.3,
                opacity: 1,
            },
            {
                frameA: "M50 119 C30 118 16 108 16 92 C16 76 24 62 28 50 C32 40 32 30 26 20 C32 26 34 36 36 46 C38 34 40 20 44 8 C46 20 46 34 48 44 C48 32 48 18 50 6 C52 18 52 32 52 44 C54 34 54 20 56 8 C60 20 62 34 64 46 C66 36 68 26 74 20 C68 30 68 40 72 50 C76 62 84 76 84 92 C84 108 70 118 50 119Z",
                frameB: "M50 119 C29 117 15 107 15 91 C15 75 23 61 27 49 C31 39 31 29 25 19 C31 25 33 35 35 45 C37 33 39 19 43 7 C45 19 45 33 47 43 C47 31 47 17 50 5 C53 17 53 31 53 43 C55 33 55 19 57 7 C61 19 63 33 65 45 C67 35 69 25 75 19 C69 29 69 39 73 49 C77 61 85 75 85 91 C85 107 71 117 50 119Z",
                gradient: ["#312e81", "#6366f1", "#67e8f9"],
                stops: [0, 50, 100],
                dur: 1.1,
                opacity: 0.92,
            },
            {
                frameA: "M50 116 C36 114 26 104 26 90 C26 76 34 64 38 54 C42 44 42 34 38 26 C44 32 44 42 46 52 C47 40 48 26 50 14 C52 26 53 40 54 52 C56 42 56 32 62 26 C58 34 58 44 62 54 C66 64 74 76 74 90 C74 104 64 114 50 116Z",
                frameB: "M50 116 C35 113 25 103 25 89 C25 75 33 63 37 53 C41 43 41 33 37 25 C43 31 43 41 45 51 C46 39 47 25 50 13 C53 25 54 39 55 51 C57 41 57 31 63 25 C59 33 59 43 63 53 C67 63 75 75 75 89 C75 103 65 113 50 116Z",
                gradient: ["#4f46e5", "#a5f3fc"],
                stops: [0, 100],
                dur: 0.95,
                opacity: 0.88,
            },
            {
                frameA: "M50 112 C40 108 34 98 35 88 C36 78 42 68 50 56 C58 68 64 78 65 88 C66 98 60 108 50 112Z",
                frameB: "M50 112 C38 107 32 97 33 87 C34 77 41 67 50 55 C59 67 66 77 67 87 C68 97 62 107 50 112Z",
                gradient: ["#7c3aed", "#e0f2fe"],
                stops: [0, 100],
                dur: 0.8,
                opacity: 0.82,
            },
        ],
        particles: [
            { x: 36, y: 12, r: 2.5, color: "#67e8f9", delay: 0.15, anim: "sa", dur: 1.2 },
            { x: 50, y: 4, r: 3.0, color: "#a5f3fc", delay: 0.55, anim: "sb", dur: 1.4 },
            { x: 63, y: 10, r: 2.2, color: "#818cf8", delay: 0.90, anim: "sc", dur: 1.3 },
            { x: 42, y: 2, r: 2.0, color: "#c7d2fe", delay: 0.30, anim: "sd", dur: 1.6 },
            { x: 57, y: 0, r: 2.4, color: "#22d3ee", delay: 0.70, anim: "se", dur: 1.5 },
            { x: 44, y: -6, r: 1.8, color: "#bae6fd", delay: 1.00, anim: "sf", dur: 1.4 },
            { x: 56, y: -4, r: 2.0, color: "#818cf8", delay: 0.20, anim: "sg", dur: 1.7 },
            { x: 50, y: -8, r: 2.2, color: "#67e8f9", delay: 0.60, anim: "sh", dur: 1.3 },
        ],
    },
} as const;

const SPARK_OFFSETS: Record<string, [number, number]> = {
    sa: [-6, -42], sb: [5, -50], sc: [-3, -58], sd: [8, -46],
    se: [-9, -62], sf: [4, -70], sg: [-5, -78], sh: [10, -74],
};

export const AnimatedFlame = ({ level, size = 100 }: Props) => {
    const cfg = LAYERS[level];
    const uid = `fl-${level}`;

    const frames = (a: string, b: string) => `${a};${b};${a}`;
    const spline = ".45 0 .55 1;.45 0 .55 1";

    return (
        <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 100 130" width={size} height={size} style={{ overflow: "visible" }}>
                <defs>
                    <radialGradient id={`${uid}-glow`} cx="50%" cy="90%" r="65%">
                        <stop offset="0%" stopColor={cfg.glow} />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    {cfg.layers.map((layer, li) => (
                        <linearGradient key={li} id={`${uid}-l${li}`} x1="50%" y1="100%" x2="50%" y2="0%">
                            {layer.gradient.map((color, si) => (
                                <stop key={si} offset={`${layer.stops[si]}%`} stopColor={color} />
                            ))}
                        </linearGradient>
                    ))}
                </defs>

                <motion.ellipse
                    cx="50" cy="122" rx="32" ry="7"
                    fill={`url(#${uid}-glow)`}
                    animate={{ opacity: [0.5, 1, 0.5], scaleX: [1, 1.1, 1] }}
                    transition={{ duration: cfg.glowSpeed, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "50px 122px" }}
                />

                {cfg.layers.map((layer, li) => (
                    <path key={li} fill={`url(#${uid}-l${li})`} fillOpacity={layer.opacity}>
                        <animate
                            attributeName="d"
                            dur={`${layer.dur}s`}
                            repeatCount="indefinite"
                            calcMode="spline"
                            keySplines={spline}
                            values={frames(layer.frameA, layer.frameB)}
                        />
                    </path>
                ))}

                {cfg.particles.map((p, i) => {
                    const [dx, dy] = SPARK_OFFSETS[p.anim];
                    return (
                        <motion.circle
                            key={i}
                            r={p.r}
                            fill={p.color}
                            initial={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
                            animate={{
                                x: [p.x, p.x + dx * 0.5, p.x + dx],
                                y: [p.y, p.y + dy * 0.5, p.y + dy],
                                opacity: [0, 0.9, 0],
                                scale: [0, 1.3, 0],
                            }}
                            transition={{
                                duration: p.dur,
                                repeat: Infinity,
                                delay: p.delay,
                                ease: "easeOut",
                            }}
                        />
                    );
                })}
            </svg>
        </div>
    );
};