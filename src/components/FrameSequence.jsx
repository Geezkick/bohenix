import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 210;
const PAD = (n) => n.toString().padStart(3, '0');
const SRC = (i) => `/ezgif-frame-${PAD(i)}.jpg`;

const FrameSequence = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const images = useRef([]);
    const [loadedCount, setLoadedCount] = useState(0);

    // Detect Tier (simplified)
    const tier = useMemo(() => {
        const isMob = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        return isMob ? 'low' : 'high';
    }, []);

    const lodStep = tier === 'low' ? 3 : 1;
    const frameCount = Math.ceil(TOTAL_FRAMES / lodStep);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

        // Load frames
        const loadFrames = () => {
            for (let i = 1; i <= TOTAL_FRAMES; i++) {
                if (i % lodStep === 1 || lodStep === 1) {
                    const img = new Image();
                    img.src = SRC(i);
                    img.onload = () => {
                        images.current[i] = img;
                        setLoadedCount(prev => prev + 1);
                    };
                }
            }
        };

        const drawFrame = (frame) => {
            const realIdx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frame * lodStep)));
            const img = images.current[realIdx] || images.current[1]; // Fallback if not loaded
            if (!img || !img.complete) return;

            const { width, height } = canvas;
            const r = Math.max(width / img.naturalWidth, height / img.naturalHeight);
            const iw = img.naturalWidth * r;
            const ih = img.naturalHeight * r;
            const ix = (width - iw) / 2;
            const iy = (height - ih) / 2;

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, ix, iy, iw, ih);
        };

        const resize = () => {
            canvas.width = window.innerWidth * (tier === 'low' ? 1 : window.devicePixelRatio);
            canvas.height = window.innerHeight * (tier === 'low' ? 1 : window.devicePixelRatio);
            drawFrame(1);
        };

        window.addEventListener('resize', resize);
        resize();
        loadFrames();

        // GSAP ScrollTrigger for scrubbing
        const tl = gsap.to({}, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                onUpdate: (self) => {
                    const frame = Math.floor(self.progress * (frameCount - 1)) + 1;
                    drawFrame(frame);
                }
            }
        });

        return () => {
            window.removeEventListener('resize', resize);
            tl.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [tier, lodStep, frameCount]);

    return (
        <div ref={containerRef} className="frame-sequence-container">
            <div className="canvas-sticky">
                <canvas ref={canvasRef} className="sequence-canvas-react" />
            </div>
        </div>
    );
};

export default FrameSequence;
