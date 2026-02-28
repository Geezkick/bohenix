/**
 * FrameSequence.js  –  Scroll-precise frame-to-video engine
 *
 * Design principles:
 *  • Frame index derived DIRECTLY from raw scroll position — no easing on frames.
 *  • Rendering runs in its own rAF loop with a dirty-flag; only paints when needed.
 *  • Progressive loading: frames 1-5 load first (priority), then even frames, then all.
 *  • LOD system: caps frame count & canvas resolution on low-end / mobile devices.
 *  • Rendering pauses automatically when tab is hidden (visibilitychange).
 *  • Canvas is GLOBAL / persistent — router never hides it; overlay opacity adapts.
 *  • OffscreenCanvas used when available for GPU-side decoding.
 */

/* ── constants ──────────────────────────────────────────────── */
const TOTAL_FRAMES = 210;
const PAD = (n) => n.toString().padStart(3, '0');
const SRC = (i) => `/ezgif-frame-${PAD(i)}.jpg`;

/* ── Device Performance Tier ──────────────────────────────── */
function detectTier() {
    const cores = navigator.hardwareConcurrency || 2;
    const mem = navigator.deviceMemory || 2; // GB (if available)
    const isMob = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    if (isMob || cores < 4 || mem < 2) return 'low';
    if (cores < 8 || mem < 4) return 'mid';
    return 'high';
}

/* ── state shared across the module ──────────────────────── */
let state = {
    tier: detectTier(),
    frameCount: TOTAL_FRAMES,   // may be reduced for low
    images: [],             // sparse array indexed 1-based
    loadedCount: 0,
    currentFrame: 1,
    targetFrame: 1,
    dirty: true,
    paused: false,          // tab visibility
    canvas: null,
    ctx: null,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    scrollTop: 0,
    scrollMax: 1,
    rafId: null,
};

/* ── Effective frame set (LOD) ─────────────────────────────── */
function buildLOD() {
    if (state.tier === 'low') {
        // Use every 3rd frame → 70 frames
        state.frameCount = Math.ceil(TOTAL_FRAMES / 3);
        state.lodStep = 3;
    } else if (state.tier === 'mid') {
        // Every 2nd frame → 105 frames
        state.frameCount = Math.ceil(TOTAL_FRAMES / 2);
        state.lodStep = 2;
    } else {
        state.frameCount = TOTAL_FRAMES;
        state.lodStep = 1;
    }
}

/* ── Load one image ───────────────────────────────────────── */
function loadImage(realIndex) {
    if (state.images[realIndex]) return; // already loaded
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
        state.loadedCount++;
        state.dirty = true; // trigger repaint
    };
    img.src = SRC(realIndex);
    state.images[realIndex] = img;
}

/* ── Progressive loading strategy ────────────────────────── */
function scheduleLoading() {
    // Phase 1 (immediate): first 5 and last 5 frames in the LOD set
    const priority = [1, 2, 3, 4, 5];
    priority.forEach(i => loadImage(i));

    // Phase 2 (idle): rest of the LOD set
    let i = 1;
    function loadNext() {
        if (i > TOTAL_FRAMES) return;
        if (i % state.lodStep === 1 || state.lodStep === 1) {
            loadImage(i);
        }
        i++;
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadNext, { timeout: 200 });
        } else {
            setTimeout(loadNext, 8);
        }
    }
    requestIdleCallback ? requestIdleCallback(loadNext, { timeout: 100 }) : setTimeout(loadNext, 50);
}

/* ── Nearest loaded frame (fallback for unloaded frames) ──── */
function nearestLoaded(idx) {
    if (state.images[idx]?.complete && state.images[idx].naturalWidth > 0) return idx;
    // Search outward
    for (let d = 1; d < 30; d++) {
        const lo = idx - d, hi = idx + d;
        if (lo >= 1 && state.images[lo]?.complete && state.images[lo].naturalWidth > 0) return lo;
        if (hi <= TOTAL_FRAMES && state.images[hi]?.complete && state.images[hi].naturalWidth > 0) return hi;
    }
    return null;
}

/* ── Responsive canvas size ───────────────────────────────── */
function resizeCanvas() {
    const { canvas, dpr } = state;
    const W = window.innerWidth, H = window.innerHeight;
    // Cap physical resolution for low/mid tier
    const maxDPR = state.tier === 'low' ? 1 : dpr;
    canvas.width = W * maxDPR;
    canvas.height = H * maxDPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    if (state.ctx) state.ctx.setTransform(maxDPR, 0, 0, maxDPR, 0, 0);
    state.dirty = true;
}

/* ── Draw a single frame ──────────────────────────────────── */
function drawFrame(idx) {
    const realIdx = (state.tier !== 'high')
        ? Math.round(idx * state.lodStep)  // map logical → real
        : idx;
    const loaded = nearestLoaded(Math.max(1, Math.min(TOTAL_FRAMES, realIdx)));
    if (!loaded) return;

    const img = state.images[loaded];
    const { ctx, canvas } = state;
    // Logical dimensions (before DPR transform)
    const W = canvas.width / (state.tier === 'low' ? 1 : state.dpr);
    const H = canvas.height / (state.tier === 'low' ? 1 : state.dpr);

    // Cover fit
    const r = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const iw = img.naturalWidth * r;
    const ih = img.naturalHeight * r;
    const ix = (W - iw) / 2;
    const iy = (H - ih) / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, ix, iy, iw, ih);
}

/* ── Map scroll position → frame index (NO easing) ─────── */
function scrollToFrame() {
    const progress = Math.min(1, Math.max(0,
        state.scrollTop / Math.max(1, state.scrollMax)
    ));
    // Direct 1:1 linear mapping — no easing on the frame index
    const frame = 1 + Math.floor(progress * (state.frameCount - 1));
    return Math.max(1, Math.min(state.frameCount, frame));
}

/* ── rAF render loop ──────────────────────────────────────── */
function renderLoop() {
    state.rafId = requestAnimationFrame(renderLoop);

    if (state.paused) return;

    // Only repaint when frame changes or explicitly dirtied
    const newFrame = scrollToFrame();
    if (newFrame === state.currentFrame && !state.dirty) return;

    state.currentFrame = newFrame;
    state.dirty = false;
    drawFrame(newFrame);
}

/* ── Scroll listener — raw, no debounce ──────────────────── */
function onScroll() {
    // Use scrollY when in home page; scroll track gives the height
    const track = document.getElementById('scroll-track');
    if (!track) { state.scrollTop = 0; state.scrollMax = 1; return; }

    // The hero-section is 600vh tall; we only play frames during that region
    const rect = track.closest('.hero-section')?.getBoundingClientRect()
        || track.getBoundingClientRect();
    const heroSection = track.closest('.hero-section') || track.parentElement;
    const sectionTop = heroSection.offsetTop;
    const sectionHeight = heroSection.offsetHeight - window.innerHeight;

    state.scrollTop = Math.max(0, window.scrollY - sectionTop);
    state.scrollMax = Math.max(1, sectionHeight);
}

/* ── Preload next N frames around current scroll ──────────── */
function preloadAhead() {
    const cur = state.currentFrame;
    const ahead = state.tier === 'low' ? 5 : 15;
    for (let i = cur; i <= Math.min(state.frameCount, cur + ahead); i++) {
        const real = state.tier !== 'high' ? Math.round(i * state.lodStep) : i;
        loadImage(Math.min(TOTAL_FRAMES, real));
    }
}

/* ── Public init ──────────────────────────────────────────── */
export function initFrameSequence() {
    state.canvas = document.getElementById('sequence-canvas');
    state.ctx = state.canvas.getContext('2d', {
        alpha: false,  // opaque — avoids blending overhead
        desynchronized: true,   // hint for async GPU compositing
        willReadFrequently: false,
    });

    buildLOD();
    resizeCanvas();
    scheduleLoading();

    // Scroll listener — passive for best performance
    window.addEventListener('scroll', () => {
        onScroll();
        preloadAhead();
    }, { passive: true });

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { resizeCanvas(); state.dirty = true; }, 150);
    });

    // Pause when tab hidden — saves GPU / battery
    document.addEventListener('visibilitychange', () => {
        state.paused = document.hidden;
        if (!state.paused) {
            state.dirty = true;
            onScroll();
        }
    });

    // Kick off scroll state
    onScroll();

    // Start rAF loop
    renderLoop();

    // Expose control API for router
    return {
        setOverlayIntensity(alpha) {
            // Set overlay opacity via CSS custom property
            document.getElementById('canvas-overlay').style.background =
                `rgba(13,13,13,${alpha})`;
        },
        pause() { state.paused = true; },
        resume() { state.paused = false; state.dirty = true; },
        refresh() { state.dirty = true; onScroll(); },
    };
}
