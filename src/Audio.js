// src/Audio.js
export function initAudio() {
    let ctx;
    let ready = false;

    function ensure() {
        if (ready) return;
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return;
        ctx = new C();
        ready = true;
    }

    function beep(freq, type, dur, vol = 0.06) {
        if (!ready || !ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + dur);
    }

    document.addEventListener('click', ensure, { once: true });
    document.addEventListener('keydown', ensure, { once: true });

    document.addEventListener('click', (e) => {
        if (e.target.matches('button, a')) {
            beep(600, 'sine', 0.08);
            beep(900, 'triangle', 0.04);
        }
    });

    document.addEventListener('mouseenter', (e) => {
        if (e.target.matches('button')) beep(1000, 'sine', 0.04, 0.03);
    }, true);
}
