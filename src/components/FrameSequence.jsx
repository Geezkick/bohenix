import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@studio-freight/react-lenis';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 210;
const PAD = (n) => n.toString().padStart(3, '0');
const SRC = (i) => `/ezgif-frame-${PAD(i)}.jpg`;

const FrameSequence = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const images = useRef([]);
    const frame = useRef(1);
    const targetFrame = useRef(1);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

        // Preload logic
        const loadFrames = () => {
            for (let i = 1; i <= TOTAL_FRAMES; i++) {
                const img = new Image();
                img.src = SRC(i);
                img.onload = () => {
                    images.current[i] = img;
                    if (i === 1) render(); // Initial render
                };
            }
        };

        const drawFrame = (f) => {
            const img = images.current[Math.round(f)];
            if (!img || !img.complete) return;

            const { width, height } = canvas;
            const r = Math.max(width / img.naturalWidth, height / img.naturalHeight);
            const iw = img.naturalWidth * r;
            const ih = img.naturalHeight * r;
            const ix = (width - iw) / 2;
            const iy = (height - ih) / 2;

            ctx.drawImage(img, ix, iy, iw, ih);
        };

        let raf;
        const render = () => {
            // Smooth interpolation
            frame.current += (targetFrame.current - frame.current) * 0.15;
            drawFrame(frame.current);
            raf = requestAnimationFrame(render);
        };

        const resize = () => {
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = window.innerHeight * window.devicePixelRatio;
            drawFrame(frame.current);
        };

        window.addEventListener('resize', resize);
        resize();
        loadFrames();
        raf = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(raf);
        };
    }, []);

    useLenis(({ progress }) => {
        // Map 0-1 progress to frame count
        // Only scrub during the first part of the scroll (Hero sequence)
        const transitionEnd = 0.5; // End sequence at 50% scroll
        const scrubProgress = Math.min(1, progress / transitionEnd);
        targetFrame.current = 1 + scrubProgress * (TOTAL_FRAMES - 1);
    });

    return (
        <div ref={containerRef} className="frame-sequence-container">
            <div className="canvas-sticky">
                <canvas ref={canvasRef} className="sequence-canvas-react" />
            </div>
            {/* Overlay to dim the sequence for narrative sections */}
            <div className="sequence-overlay" />
        </div>
    );
};

export default FrameSequence;
