/**
 * HeroAnimation.js — Circuit Energy "BOHENIX" Letter Animation
 *
 * - Canvas overlay on top of the hero text
 * - Particle streams that crawl across letter paths (signed-distance-based)
 * - Cursor-proximity reactivity: particles accelerate & glow near cursor
 * - Neon blue (#00c3ff) + electric orange (#FF6B1A) dual pulse
 * - Runs at 60fps via rAF with dirty-flag
 */

/* ── CONFIG ─────────────────────────────────────────── */
const CONFIG = {
    particleCount: 180,
    baseSpeed: 0.4,
    boostSpeed: 3.2,
    influenceR: 160,      // cursor proximity radius (px)
    glowColor1: '#00c3ff', // neon blue
    glowColor2: '#FF6B1A', // electric orange
    trailLength: 14,
    lineWidth: 1.8,
    fontSize: null,     // computed
};

/* ── state ─────────────────────────────────────────── */
const S = {
    canvas: null,
    ctx: null,
    W: 0, H: 0,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    cx: -1000, cy: -1000,     // cursor (logical px)
    particles: [],
    textData: null,
    rafId: null,
    paused: false,
};

/* ── Sample pixels from text drawn to offscreen canvas ── */
function buildTextPixels() {
    const txt = 'BOHENIX';
    const oc = document.createElement('canvas');
    const octx = oc.getContext('2d');
    const W = S.W, H = S.H;

    // Font size: 80% of width / 7 chars, clamped
    const fs = Math.min(H * 0.38, (W * 0.82) / txt.length * 1.6);
    CONFIG.fontSize = fs;

    oc.width = W;
    oc.height = H;
    octx.fillStyle = '#fff';
    octx.font = `900 ${fs}px 'Barlow Condensed', sans-serif`;
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText(txt, W / 2, H / 2);

    const imgData = octx.getImageData(0, 0, W, H).data;
    // Collect lit pixels (alpha > 128) — sample every 2 px for performance
    const pts = [];
    for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x += 2) {
            const idx = (y * W + x) * 4;
            if (imgData[idx + 3] > 128) pts.push({ x, y });
        }
    }
    return pts;
}

/* ── Spawn a particle on a random letter pixel ────────── */
function spawnParticle(pts) {
    const seed = pts[Math.floor(Math.random() * pts.length)];
    const angle = Math.random() * Math.PI * 2;
    return {
        x: seed.x, y: seed.y,
        ox: seed.x, oy: seed.y,      // "home" pixel
        vx: Math.cos(angle) * CONFIG.baseSpeed,
        vy: Math.sin(angle) * CONFIG.baseSpeed,
        life: Math.random(),          // 0..1 lifecycle
        speed: CONFIG.baseSpeed * (0.6 + Math.random() * 0.8),
        color: Math.random() < 0.6 ? CONFIG.glowColor1 : CONFIG.glowColor2,
        trail: [],
        size: 0.8 + Math.random() * 1.5,
    };
}

/* ── Initialize all particles ─────────────────────── */
function initParticles() {
    if (!S.textData || S.textData.length === 0) return;
    S.particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const p = spawnParticle(S.textData);
        p.life = Math.random(); // stagger start
        S.particles.push(p);
    }
}

/* ── Resize handler ────────────────────────────────── */
function resize() {
    const container = document.querySelector('.hero-title-wrap');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    S.W = rect.width;
    S.H = rect.height;
    S.canvas.style.width = S.W + 'px';
    S.canvas.style.height = S.H + 'px';
    S.canvas.width = S.W * S.dpr;
    S.canvas.height = S.H * S.dpr;
    S.ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
    S.textData = buildTextPixels();
    initParticles();
}

/* ── Draw one frame ────────────────────────────────── */
function draw() {
    const { ctx, W, H, cx, cy, particles, textData } = S;
    if (!textData || textData.length === 0) return;

    // Semi-transparent clear for trail fade effect
    ctx.fillStyle = 'rgba(13,13,13,0.18)';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cursor proximity influence
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const infl = dist < CONFIG.influenceR ? 1 - dist / CONFIG.influenceR : 0;

        // Boost speed near cursor; add slight attraction
        const spd = p.speed + infl * (CONFIG.boostSpeed - p.speed);
        if (infl > 0.02) {
            p.vx += dx / dist * infl * 0.12;
            p.vy += dy / dist * infl * 0.12;
        }

        // Drift back toward a letter pixel (home attraction)
        const homeIdx = Math.floor(p.life * textData.length) % textData.length;
        const home = textData[homeIdx];
        p.vx += (home.x - p.x) * 0.006;
        p.vy += (home.y - p.y) * 0.006;

        // Normalize velocity to target speed
        const mag = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
        p.vx = (p.vx / mag) * spd;
        p.vy = (p.vy / mag) * spd;

        // Step
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > CONFIG.trailLength) p.trail.shift();
        p.x += p.vx;
        p.y += p.vy;
        p.life = (p.life + 0.003) % 1;

        // Out-of-bounds: respawn
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
            Object.assign(p, spawnParticle(textData));
            continue;
        }

        // Draw trail
        const alpha = 0.5 + infl * 0.5;
        if (p.trail.length > 2) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let t = 1; t < p.trail.length; t++) {
                ctx.lineTo(p.trail[t].x, p.trail[t].y);
            }
            ctx.lineTo(p.x, p.y);
            const grad = ctx.createLinearGradient(
                p.trail[0].x, p.trail[0].y, p.x, p.y
            );
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(1, p.color);
            ctx.strokeStyle = grad;
            ctx.lineWidth = p.size * (1 + infl * 1.2);
            ctx.globalAlpha = alpha * 0.85;
            ctx.shadowBlur = infl > 0.1 ? 8 + infl * 16 : 0;
            ctx.shadowColor = p.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Draw head dot glow
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + infl * 2), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6 + infl * 18;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

/* ── rAF loop ──────────────────────────────────────── */
function loop() {
    S.rafId = requestAnimationFrame(loop);
    if (!S.paused) draw();
}

/* ── Public init ───────────────────────────────────── */
export function initHeroAnimation() {
    // Create canvas overlay inside .hero-title-wrap
    const wrap = document.querySelector('.hero-title-wrap');
    if (!wrap) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'hero-canvas';
    canvas.style.cssText = `
    position:absolute; top:0; left:0;
    pointer-events:none; z-index:2;
    border-radius:0;
  `;
    wrap.appendChild(canvas);

    S.canvas = canvas;
    S.ctx = canvas.getContext('2d');

    // Cursor tracking relative to the container
    wrapper_cursor_bind(wrap);

    // Resize & init
    resize();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
        S.paused = document.hidden;
    });

    loop();
}

function wrapper_cursor_bind(wrap) {
    // Track mouse globally, convert to local coords
    window.addEventListener('mousemove', e => {
        const rect = wrap.getBoundingClientRect();
        S.cx = e.clientX - rect.left;
        S.cy = e.clientY - rect.top;
    }, { passive: true });

    // On touch
    window.addEventListener('touchmove', e => {
        const rect = wrap.getBoundingClientRect();
        const t = e.touches[0];
        S.cx = t.clientX - rect.left;
        S.cy = t.clientY - rect.top;
    }, { passive: true });
}
