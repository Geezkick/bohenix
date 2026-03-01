import React, { useEffect, useRef } from 'react';
import FrameSequence from './FrameSequence';

const Hero = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrame;
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < 150; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 4,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: `rgba(255, 107, 53, ${Math.random() * 0.2})`
                });
            }
        };

        const animate = () => {
            if (!ctx) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            });

            // Draw connections
            ctx.strokeStyle = 'rgba(255, 107, 53, 0.05)';
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrame = requestAnimationFrame(animate);
        };

        resize();
        createParticles();
        animate();

        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, []);

    return (
        <section id="home" className="hero">
            {/* Frame Sequence as background */}
            <div className="hero-background">
                <FrameSequence />
            </div>
            
            {/* Particle overlay */}
            <canvas ref={canvasRef} className="hero-canvas" />
            <div className="hero-overlay"></div>
            
            <div className="hero-content container">
                <div className="hero-badge">WELCOME TO THE FUTURE</div>
                <h1 className="hero-title">
                    <span className="hero-title-line">BOHENIX</span>
                </h1>
                <p className="hero-slogan">
                    THE ART OF INTELLIGENT ENGINEERING
                </p>
                <div className="hero-actions">
                    <a href="#products" className="btn btn-primary btn-large">
                        EXPLORE PRODUCTS
                    </a>
                    <a href="#membership" className="btn btn-outline btn-large">
                        VIEW MEMBERSHIP
                    </a>
                </div>
                <div className="hero-stats">
                    <div className="hero-stat">
                        <span className="hero-stat-value">15+</span>
                        <span className="hero-stat-label">YEARS EXCELLENCE</span>
                    </div>
                    <div className="hero-stat">
                        <span className="hero-stat-value">500+</span>
                        <span className="hero-stat-label">PROJECTS DELIVERED</span>
                    </div>
                    <div className="hero-stat">
                        <span className="hero-stat-value">99.9%</span>
                        <span className="hero-stat-label">SUCCESS RATE</span>
                    </div>
                </div>
            </div>
            <div className="scroll-indicator">
                <span></span>
                <span></span>
                <span></span>
                <span className="scroll-text">SCROLL</span>
            </div>
        </section>
    );
};

export default Hero;
