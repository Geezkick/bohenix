import React, { useRef } from 'react';
import gsap from 'gsap';
import { useAudio } from '../hooks/useAudio';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const btnRef = useRef();
    const { playClick, playHover } = useAudio();

    const handleMouseMove = (e) => {
        const btn = btnRef.current;
        if (className.includes('magnetic')) {
            const rect = btn.getBoundingClientRect();
            const bx = rect.left + rect.width / 2;
            const by = rect.top + rect.height / 2;
            const dist = Math.sqrt(Math.pow(e.clientX - bx, 2) + Math.pow(e.clientY - by, 2));

            if (dist < 100) {
                const x = (e.clientX - bx) * 0.3;
                const y = (e.clientY - by) * 0.3;
                gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
            } else {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
            }
        }
    };

    const handleMouseEnter = () => {
        playHover();
    };

    const handleClick = (e) => {
        playClick();
        const btn = btnRef.current;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple-circle';
        const size = Math.max(rect.width, rect.height) * 1.5;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);

        gsap.fromTo(btn, { scale: 0.96 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' });

        if (props.onClick) props.onClick(e);
    };

    return (
        <button
            ref={btnRef}
            className={`btn-react btn-${variant} ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            {...props}
        >
            <span className="btn-inner">{children}</span>
        </button>
    );
};

export default Button;
