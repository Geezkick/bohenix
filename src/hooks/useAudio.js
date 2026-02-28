import { useRef } from 'react';

export const useAudio = () => {
    const ctx = useRef(null);
    const ready = useRef(false);

    const ensure = () => {
        if (ready.current) return;
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return;
        ctx.current = new C();
        ready.current = true;
    };

    const beep = (freq, type, dur, vol = 0.06) => {
        if (!ready.current || !ctx.current) return;
        if (ctx.current.state === 'suspended') ctx.current.resume();
        const osc = ctx.current.createOscillator();
        const gain = ctx.current.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, ctx.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.current.currentTime + dur);
        osc.connect(gain);
        gain.connect(ctx.current.destination);
        osc.start();
        osc.stop(ctx.current.currentTime + dur);
    };

    const playClick = () => {
        ensure();
        beep(600, 'sine', 0.08);
        beep(900, 'triangle', 0.04);
    };

    const playHover = () => {
        ensure();
        beep(1000, 'sine', 0.04, 0.03);
    };

    return { playClick, playHover };
};
