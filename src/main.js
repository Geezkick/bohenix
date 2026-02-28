// src/main.js
import './style.css';
import './premium.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { initFrameSequence } from './FrameSequence.js';
import { initHeroAnimation } from './HeroAnimation.js';
import { initUI } from './UI.js';
import { initAudio } from './Audio.js';
import { ParticleBackground } from './Particles.js';

gsap.registerPlugin(ScrollTrigger);

/* ── Smooth scrolling (UI only — frames read raw scrollY) ── */
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1.1,
    touchMultiplier: 2,
    infinite: false,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

/* ── Boot ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const frameCtrl = initFrameSequence();
    // Hero animation initialises after a small delay so fonts are loaded
    if (document.fonts) {
        document.fonts.ready.then(() => initHeroAnimation());
    } else {
        setTimeout(() => initHeroAnimation(), 400);
    }
    initUI(lenis, frameCtrl);
    initAudio();
    new ParticleBackground();
});
